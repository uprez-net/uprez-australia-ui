"use server";
import { createEmbedding } from "./createEmbeddings";
import pinecone from "../pinecone";

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
