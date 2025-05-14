"use client"

import { useState, useEffect } from "react"

export default function PineconeStatus() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "warning">("loading")
  const [message, setMessage] = useState("Checking Pinecone connection...")
  const [details, setDetails] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function checkPinecone() {
      try {
        const response = await fetch("/api/pinecone-test")
        const data = await response.json()

        setStatus(data.status)
        setMessage(data.message)
        setDetails(data)
      } catch (error) {
        setStatus("error")
        setMessage("Failed to check Pinecone status")
        setDetails({ error: error instanceof Error ? error.message : String(error) })
      }
    }

    checkPinecone()
  }, [])

  const statusColors = {
    loading: "bg-blue-900/30 border-blue-700/50 text-blue-400",
    success: "bg-green-900/30 border-green-700/50 text-green-400",
    warning: "bg-yellow-900/30 border-yellow-700/50 text-yellow-400",
    error: "bg-red-900/30 border-red-700/50 text-red-400",
  }

  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-lg border ${statusColors[status]} text-sm max-w-xs z-50`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              status === "loading"
                ? "bg-blue-400 animate-pulse"
                : status === "success"
                  ? "bg-green-400"
                  : status === "warning"
                    ? "bg-yellow-400"
                    : "bg-red-400"
            }`}
          ></div>
          <span>{message}</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="ml-2 text-xs opacity-70 hover:opacity-100">
          {isOpen ? "Hide" : "Details"}
        </button>
      </div>

      {isOpen && details && (
        <div className="mt-2 text-xs border-t border-current pt-2 opacity-80">
          <pre className="whitespace-pre-wrap overflow-auto max-h-40">{JSON.stringify(details, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
