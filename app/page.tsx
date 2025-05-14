"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import FireEffectAlt from "@/components/fire-effect-alt"
import Title from "@/components/title"
import PineconeStatus from "@/components/pinecone-status"
import { ArrowUp, Database } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  usedRag?: boolean
  matchCount?: number
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!input.trim() || isLoading) return

    // Clear any previous errors
    setError(null)

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API error:", errorData)
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()

      // Add AI response to chat with RAG info
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          usedRag: data.usedRag,
          matchCount: data.matchCount,
        },
      ])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        },
      ])
    } finally {
      setIsLoading(false)
      // Focus the input field after response
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <Title />

      {/* Diagnostics toggle */}
      <button
        onClick={() => setShowDiagnostics(!showDiagnostics)}
        className="absolute top-4 right-4 text-orange-500/50 hover:text-orange-500 transition-colors"
        title="Toggle diagnostics"
      >
        <Database size={20} />
      </button>

      {showDiagnostics && <PineconeStatus />}

      <div className="flex-1 w-full max-w-4xl px-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 py-4">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg max-w-[85%]",
                    message.role === "user" ? "bg-orange-900/30 ml-auto" : "bg-gray-800/50",
                  )}
                >
                  {message.content}

                  {/* Show RAG status for assistant messages */}
                  {message.role === "assistant" && showDiagnostics && (
                    <div className="mt-2 pt-2 border-t border-gray-700/50 text-xs text-gray-500 flex items-center gap-1">
                      <Database size={12} />
                      {message.usedRag
                        ? `Used database: ${message.matchCount} matches found`
                        : "Used general knowledge (no database matches)"}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : null}
          {isLoading && (
            <div className="bg-gray-800/50 p-4 rounded-lg max-w-[85%]">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-900/30 p-4 rounded-lg max-w-[85%] mt-4">
              <p className="text-red-400">Error: {error}</p>
              <p className="text-sm mt-2">Please try again or refresh the page.</p>
            </div>
          )}
        </div>

        <div className="relative mb-8">
          {/* The input container with fire effect */}
          <div className="relative">
            <FireEffectAlt />
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What would you like to know about War Tycoon?"
                className="w-full bg-black border-2 border-orange-900/50 rounded-lg py-4 px-6 pr-14 text-orange-500 placeholder-orange-500/50 focus:outline-none focus:border-orange-500/70"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-3 bottom-3 bg-black/80 border border-orange-900/50 p-2 rounded-md hover:bg-orange-900/30 transition-colors disabled:opacity-50"
                disabled={isLoading || !input.trim()}
              >
                <ArrowUp className="h-5 w-5 text-orange-500" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
