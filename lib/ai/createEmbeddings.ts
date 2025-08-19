import { embed, embedMany } from "ai";
import { google } from "../gemini";

export async function createEmbedding(text: string) {
    const model = google.textEmbeddingModel("gemini-embedding-001", {
        outputDimensionality: 1536, // Set to match your embedding model size
        taskType: "RETRIEVAL_DOCUMENT"
    })

    const { embedding, usage } = await embed({
        model,
        value: text
    })

    return embedding
}

export async function createEmbeddings(text: string[]) {
    const model = google.textEmbeddingModel("gemini-embedding-001", {
        outputDimensionality: 1536, // Set to match your embedding model size
        taskType: "RETRIEVAL_DOCUMENT"
    })

    const embeddings = await embedMany({
        model,
        values: text
    })

    return embeddings.embeddings
}