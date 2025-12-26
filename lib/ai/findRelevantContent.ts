"use server";
import { createEmbedding } from "./createEmbeddings";
import pinecone from "../pinecone";
import { encodeBM25 } from "@/utils/getEncoding";
import { text } from "stream/consumers";

export async function getRelevantContent(query: string, topK: number = 5) {
  try {
    // All the rules and guidelines for compliance reporting
    const smeIndex = pinecone.Index("sme");
    const sebiIndex = pinecone.Index("sebi");
    const companyActIndex = pinecone.Index("companies-act-new");
    const embedding = await createEmbedding(query);

    // Query All the indexes for relevant content
    const smeResults = await smeIndex.query({
      vector: embedding,
      topK,
      includeValues: true,
      includeMetadata: true,
    });

    const sebiResults = await sebiIndex.query({
      vector: embedding,
      topK,
      includeValues: true,
      includeMetadata: true,
    });

    const companyActResults = await companyActIndex.query({
      vector: embedding,
      topK,
      includeValues: true,
      includeMetadata: true,
    });

    // Combine results from all indexes
    const combinedResults = [
      ...smeResults.matches,
      ...sebiResults.matches,
      ...companyActResults.matches,
    ];

    const sortedResults = combinedResults
      .sort((a, b) => b.score! - a.score!)
      .slice(0, 3);

    const allTexts = combinedResults
      .map((match) => {
        try {
          const nodeContentRaw = match.metadata!;
          if (!nodeContentRaw) return null;

          const nodeContent = JSON.parse(nodeContentRaw._node_content as string);
          return nodeContent.text as string;
        } catch (error) {
          console.error("Failed to parse _node_content:", error);
          return null;
        }
      })
      .filter(m => m !== null);

    console.log("Combined Results:", combinedResults.length, "matches found");

    return allTexts;
  } catch (error) {
    console.error("Error in getRelevantContent:", error);
    throw new Error("Failed to fetch relevant content");
  }
}

export async function getClientData(
  clientId: string,
  generationId: string,
  query: string,
  options?: {
    batchSize?: number;
    subQueryTopK?: number;
    maxTotalResults?: number;
  }
) {
  const {
    batchSize = 3,
    subQueryTopK = 3,
    maxTotalResults = 12,
  } = options ?? {};

  try {
    console.log(`Hybrid search for clientId=${clientId}, query="${query}"`);

    const clientIndex = pinecone.Index("hybrid-search-index");
    const namespace = clientIndex.namespace(`${clientId}:${generationId}`);

    // 1️⃣ Split query into sub-queries
    const subQueries = query
      .split(",")
      .map(q => q.trim())
      .filter(Boolean);

    if (subQueries.length === 0) return [];

    const collectedResults: string[] = [];
    const seen = new Set<string>();

    // 2️⃣ Process in batches
    for (let i = 0; i < subQueries.length; i += batchSize) {
      const batch = subQueries.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (subQuery) => {
          const embedding = await createEmbedding(subQuery);
          const sparseVector = encodeBM25(subQuery);

          const result = await namespace.query({
            vector: embedding,
            sparseVector,
            topK: subQueryTopK,
            includeMetadata: true,
          });

          return result.matches
            .map(m => m?.metadata?.context as string | undefined)
            .filter(text => text !== undefined) as string[];
        })
      );

      // 3️⃣ Combine + dedupe
      for (const results of batchResults) {
        for (const text of results) {
          if (!seen.has(text)) {
            seen.add(text);
            collectedResults.push(text);

            // 4️⃣ Hard stop to protect context window
            if (collectedResults.length >= maxTotalResults) {
              console.log("Reached maxTotalResults cap");
              return collectedResults;
            }
          }
        }
      }
    }

    console.log(`Retrieved ${collectedResults.length} unique contexts`);
    return collectedResults;
  } catch (error) {
    console.error("Hybrid search failed:", error);
    throw error;
  }
}
