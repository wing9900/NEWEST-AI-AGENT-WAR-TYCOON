import { NextResponse } from "next/server"
import { getPineconeClient } from "@/lib/pinecone"

export async function GET() {
  try {
    console.log("Testing Pinecone connection...")
    console.log("Environment variables:", {
      PINECONE_API_KEY: process.env.PINECONE_API_KEY ? "Set (hidden)" : "Not set",
      PINECONE_INDEX: process.env.PINECONE_INDEX,
      PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
    })

    // Get Pinecone client
    const pinecone = getPineconeClient()

    // List indexes to verify connection
    const indexes = await pinecone.listIndexes()
    console.log("Available indexes:", indexes)

    // Check if our index exists
    const indexName = process.env.PINECONE_INDEX || ""
    const indexExists = indexes.some((index) => index.name === indexName)

    if (!indexExists) {
      return NextResponse.json({
        status: "warning",
        message: `Connection successful but index '${indexName}' not found`,
        availableIndexes: indexes.map((index) => index.name),
      })
    }

    // Try to describe the index to get more details
    const index = pinecone.index(indexName)
    const indexStats = await index.describeIndexStats()

    return NextResponse.json({
      status: "success",
      message: "Pinecone connection successful",
      indexName,
      vectorCount: indexStats.totalVectorCount,
      namespaces: indexStats.namespaces ? Object.keys(indexStats.namespaces) : [],
    })
  } catch (error) {
    console.error("Pinecone test error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Pinecone",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
