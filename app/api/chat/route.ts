import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { queryPineconeAndGenerateResponse } from "@/utils/rag"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Get the latest user message
    const latestUserMessage = messages.filter((msg: any) => msg.role === "user").pop()

    if (!latestUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    console.log("📝 API: Processing query:", latestUserMessage.content)

    // Check if we should skip RAG (for testing or if Pinecone is having issues)
    const skipRag = process.env.SKIP_RAG === "true"

    if (!skipRag) {
      try {
        console.log("📝 API: Attempting to use RAG...")
        // Try to use RAG first
        const ragResult = await queryPineconeAndGenerateResponse(latestUserMessage.content)

        console.log(`📝 API: RAG successful, used context: ${ragResult.usedRag}, matches: ${ragResult.matchCount}`)

        return NextResponse.json({
          response: ragResult.text,
          usedRag: ragResult.usedRag,
          matchCount: ragResult.matchCount,
        })
      } catch (ragError) {
        console.error("📝 API: RAG failed, falling back to direct OpenAI:", ragError)

        // Continue to fallback
      }
    } else {
      console.log("📝 API: Skipping RAG as configured")
    }

    // Fallback to direct OpenAI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: latestUserMessage.content,
      system: `You are a helpful AI assistant for the Roblox game "War Tycoon". 
      Answer the user's questions about the game. If you don't know specific details,
      provide general information about similar war strategy games or Roblox games.
      
      Note: I'm currently unable to access the War Tycoon database, so I'm providing general information.`,
    })

    console.log("📝 API: Fallback response generated successfully")

    return NextResponse.json({
      response: text,
      usedRag: false,
      error: skipRag ? "RAG skipped by configuration" : "RAG unavailable",
    })
  } catch (error) {
    console.error("📝 API: Error processing chat request:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
