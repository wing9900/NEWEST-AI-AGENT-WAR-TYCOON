import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateResponse(query: string) {
  try {
    // Generate response using GPT-4o
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: query,
      system: `You are a helpful AI assistant for the Roblox game "War Tycoon". 
      Answer the user's questions about the game. If you don't know specific details,
      provide general information about similar war strategy games or Roblox games.`,
    })

    return text
  } catch (error) {
    console.error("Error generating response:", error)
    throw error
  }
}
