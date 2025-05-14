import { getPineconeClient } from "@/lib/pinecone"
import { openai } from "@ai-sdk/openai"
import { embed, generateText } from "ai"

export async function queryPineconeAndGenerateResponse(query: string) {
  console.log("🔍 RAG: Starting query process for:", query)

  try {
    console.log("🔍 RAG: Generating embedding...")
    // Generate embedding for the query
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
    })
    console.log("🔍 RAG: Embedding generated successfully")

    // Query Pinecone
    console.log("🔍 RAG: Connecting to Pinecone...")
    const pinecone = getPineconeClient()
    console.log("🔍 RAG: Pinecone client initialized")

    const indexName = process.env.PINECONE_INDEX
    if (!indexName) {
      throw new Error("PINECONE_INDEX environment variable is not set")
    }
    console.log(`🔍 RAG: Using index: ${indexName}`)

    const index = pinecone.index(indexName)
    console.log("🔍 RAG: Index accessed successfully")

    console.log("🔍 RAG: Querying Pinecone...")
    const queryResponse = await index.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    })
    
    // Add debug logging for the response
    console.log("🔍 RAG: Raw Pinecone response:", JSON.stringify(queryResponse, null, 2))
    
    if (!queryResponse || typeof queryResponse !== 'object') {
      throw new Error(`Invalid Pinecone response: ${JSON.stringify(queryResponse)}`)
    }

    console.log(`🔍 RAG: Pinecone query complete, received ${queryResponse.matches?.length || 0} matches`)

    // Extract relevant context from Pinecone results
    const matches = queryResponse.matches || []
    if (!Array.isArray(matches)) {
      throw new Error(`Invalid matches format: ${JSON.stringify(matches)}`)
    }
    const relevantMatches = matches.filter((match) => match.score && match.score > 0.7)
    console.log(`🔍 RAG: Found ${relevantMatches.length} relevant matches with score > 0.7`)

    const context = relevantMatches
      .map((match, i) => {
        console.log(`🔍 RAG: Match ${i + 1} score: ${match.score}, metadata: ${JSON.stringify(match.metadata)}`)
        return match.metadata?.text || ""
      })
      .join("\n\n")

    console.log(`🔍 RAG: Context length: ${context.length} characters`)
    if (context.length > 0) {
      console.log("🔍 RAG: Context preview:", context.substring(0, 200) + "...")
    } else {
      console.log("🔍 RAG: No relevant context found")
    }

    // Generate response using GPT-4o with context
    console.log("🔍 RAG: Generating response with OpenAI...")
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: query,
      system: `You are a helpful AI assistant for the Roblox game "War Tycoon". 
      Answer the user's questions based on the following context. 
      If the context doesn't contain relevant information, use your general knowledge about Roblox games, 
      but make it clear when you're not using specific War Tycoon information.
      
      Context:
      ${context || "No relevant context found in the database."}`,
    })
    console.log("🔍 RAG: Response generated successfully")

    return {
      text,
      usedRag: context.length > 0,
      matchCount: relevantMatches.length,
    }
  } catch (error) {
    console.error("🔍 RAG Error:", error)
    throw error
  }
}
