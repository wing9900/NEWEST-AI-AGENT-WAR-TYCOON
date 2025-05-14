import { Pinecone } from "@pinecone-database/pinecone"

let pineconeClient: Pinecone | null = null

export function getPineconeClient() {
  if (!pineconeClient) {
    // The error indicates that 'environment' is not a valid property
    // Let's initialize Pinecone with the correct properties
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      // Use the environment as part of the controller URL if needed
      ...(process.env.PINECONE_ENVIRONMENT && {
        controllerHostUrl: `https://controller.${process.env.PINECONE_ENVIRONMENT}.pinecone.io`,
      }),
    })
  }

  return pineconeClient
}
