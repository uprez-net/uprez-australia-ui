'use server';
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../prisma";
import { CommentsExtended, Prospectus, ProspectusSection, ProspectusSubsection } from "@/app/interface/interface";
import { prospectusData, ProspectusSectionTypes, SECTION_PROMPTS } from "../prospectus-data";
import { generateText, stepCountIs } from "ai";
import { z } from "zod";
import { tool } from "ai";
import { getClientData } from "../ai/findRelevantContent";
import { google } from "@ai-sdk/google";



export async function fetchOrCreateClientProspectus(clientId: string, generationId: string, offset?: number): Promise<{ data: Prospectus[]; hasMore: boolean }> {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User not found");
        }
        const prospectusCount = await prisma.clientProspectus.count({
            where: {
                smeCompanyId: clientId,
            },
        });
        if (prospectusCount === 0) {
            const prospectusContent: ProspectusSection[] = await generateProspectusBatch(clientId, generationId, 3);
            const newProspectus = await prisma.clientProspectus.create({
                data: {
                    smeCompanyId: clientId,
                    version: 1,
                    createdBy: user.fullName ?? user.username ?? user.emailAddresses[0].emailAddress,
                    createdById: user.id,
                    content: JSON.stringify(prospectusContent),
                },
                include: {
                    Comments: {
                        include: {
                            User: true,
                        }
                    },
                }
            });

            const data = [{
                id: newProspectus.id,
                version: newProspectus.version,
                sections: JSON.parse(newProspectus.content as string) as unknown as ProspectusSection[],
                createdAt: newProspectus.createdAt.toISOString(),
                createdBy: newProspectus.createdBy,
                comments: newProspectus.Comments.length > 0 ? newProspectus.Comments.map(comment => ({
                    id: comment.id,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                    userId: comment.userId,
                    prospectusId: comment.prospectusId,
                    name: comment.User.name ?? comment.User.email ?? "Unknown User",
                    role: comment.User.role,
                    parentId: comment.parentId,
                })) : [],
            }]

            return { data, hasMore: false };
        }

        const existingProspectus = await prisma.clientProspectus.findMany({
            where: {
                smeCompanyId: clientId,
            },
            include: {
                Comments: {
                    include: {
                        User: true,
                    }
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: offset ?? 0,
            take: 11,
        });

        const hasMore = existingProspectus.length > 10;
        const sliced = existingProspectus.slice(0, 10);

        const data = sliced.map(prospectus => ({
            id: prospectus.id,
            version: prospectus.version,
            sections: JSON.parse(prospectus.content as string) as unknown as ProspectusSection[],
            createdAt: prospectus.createdAt.toISOString(),
            createdBy: prospectus.createdBy,
            comments: prospectus.Comments.length > 0 ? prospectus.Comments.map(comment => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                userId: comment.userId,
                prospectusId: comment.prospectusId,
                name: comment.User.name ?? comment.User.email ?? "Unknown User",
                role: comment.User.role,
                parentId: comment.parentId,
            })) : [],
        }));

        return { data, hasMore };

    } catch (error) {
        console.error("Error fetching or creating prospectus:", error);
        throw new Error(
            `Failed to fetch or create prospectus: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

export async function addCommentToProspectus(prospectusId: string, content: string, parentId?: string): Promise<CommentsExtended> {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User not found");
        }
        const newComment = await prisma.comments.create({
            data: {
                content,
                userId: user.id,
                prospectusId,
                parentId,
            },
            include: {
                User: true,
            }
        });

        return {
            id: newComment.id,
            content: newComment.content,
            createdAt: newComment.createdAt,
            updatedAt: newComment.updatedAt,
            userId: newComment.userId,
            prospectusId: newComment.prospectusId,
            name: newComment.User.name ?? newComment.User.email ?? "Unknown User",
            role: newComment.User.role,
            parentId: newComment.parentId,
        }
    } catch (error) {
        console.error("Error adding comment to prospectus:", error);
        throw new Error(
            `Failed to add comment to prospectus: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

export async function createNewProspectusVersion(clientId: string, content: ProspectusSection[]): Promise<Prospectus> {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User not found");
        }
        const latestProspectus = await prisma.clientProspectus.findFirst({
            where: {
                smeCompanyId: clientId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!latestProspectus) {
            throw new Error("No existing prospectus found to base the new version on");
        }
        const newVersionNumber = latestProspectus.version + 1;
        const newProspectus = await prisma.clientProspectus.create({
            data: {
                smeCompanyId: clientId,
                version: newVersionNumber,
                createdBy: user.fullName ?? user.username ?? user.emailAddresses[0].emailAddress,
                createdById: user.id,
                content: JSON.stringify(content),
            },
            include: {
                Comments: {
                    include: {
                        User: true,
                    }
                },
            }
        });

        return {
            id: newProspectus.id,
            version: newProspectus.version,
            sections: JSON.parse(newProspectus.content as string) as unknown as ProspectusSection[],
            createdAt: newProspectus.createdAt.toISOString(),
            createdBy: newProspectus.createdBy,
            comments: newProspectus.Comments.length > 0 ? newProspectus.Comments.map(comment => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                userId: comment.userId,
                prospectusId: comment.prospectusId,
                name: comment.User.name ?? comment.User.email ?? "Unknown User",
                role: comment.User.role,
                parentId: comment.parentId,
            })) : [],
        }
    } catch (error) {
        console.error("Error creating new prospectus version:", error);
        throw new Error(
            `Failed to create new prospectus version: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

export async function generateNewProspectusVersion(clientId: string, generationId: string): Promise<Prospectus> {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User not found");
        }
        const latestProspectus = await prisma.clientProspectus.findFirst({
            where: {
                smeCompanyId: clientId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!latestProspectus) {
            throw new Error("No existing prospectus found to base the new version on");
        }
        const newVersionNumber = latestProspectus.version + 1;
        const prospectusContent: ProspectusSection[] = await generateProspectusBatch(clientId, generationId, 3);
        const newProspectus = await prisma.clientProspectus.create({
            data: {
                smeCompanyId: clientId,
                version: newVersionNumber,
                createdBy: user.fullName ?? user.username ?? user.emailAddresses[0].emailAddress,
                createdById: user.id,
                content: JSON.stringify(prospectusContent),
            },
            include: {
                Comments: {
                    include: {
                        User: true,
                    }
                },
            }
        });

        return {
            id: newProspectus.id,
            version: newProspectus.version,
            sections: JSON.parse(newProspectus.content as string) as unknown as ProspectusSection[],
            createdAt: newProspectus.createdAt.toISOString(),
            createdBy: newProspectus.createdBy,
            comments: newProspectus.Comments.length > 0 ? newProspectus.Comments.map(comment => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                userId: comment.userId,
                prospectusId: comment.prospectusId,
                name: comment.User.name ?? comment.User.email ?? "Unknown User",
                role: comment.User.role,
                parentId: comment.parentId,
            })) : [],
        }
    } catch (error) {
        console.error("Error generating new prospectus:", error);
        throw new Error(
            `Failed to generate new prospectus: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

const getClientRelatedData = tool({
    description: "Fetch data related to a specific client based on client ID",
    inputSchema: z.object({
        clientId: z.string().describe("The ID of the client to fetch related data for"),
        generationId: z.string().describe("Generation ID for fetching specific data version"),
        query: z.string().describe(
            "Natural language query used for hybrid search combining semantic similarity and structured filtering. " +
            "The query is embedded for vector-based semantic matching and also parsed for keywords, attributes, and constraints " +
            "(e.g., status, location, dates, numeric ranges). " +
            "Be explicit about entities, time periods, and conditions. " +
            "Example: 'active clients in New York with purchases over $10k between Oct–Dec 2024'"
        )
    }),
    execute: async ({ clientId, generationId, query }) => {
        const results = await getClientData(clientId, generationId, query, {
            batchSize: 3,
            subQueryTopK: 3,
            maxTotalResults: 12,
        });
        return results.length
            ? results.join("\n\n")
            : "No relevant client data was found for this query.";
    },
});

// Alternative version with batch processing for better performance
async function generateProspectusBatch(
    clientId: string,
    generationId: string,
    batchSize: number = 3
): Promise<ProspectusSection[]> {
    try {
        const generatedSections: ProspectusSection[] = [];

        for (const section of prospectusData) {
            const generatedSubsections: ProspectusSubsection[] = [];

            // Process subsections in batches
            for (let i = 0; i < section.subsections.length; i += batchSize) {
                const batch = section.subsections.slice(i, i + batchSize);

                const batchPromises = batch.map(async (subsection) => {
                    const promptTemplate = SECTION_PROMPTS[subsection.id as ProspectusSectionTypes];

                    if (!promptTemplate) {
                        return subsection;
                    }

                    const result = await generateText({
                        model: google("gemini-2.5-flash"),
                        prompt: `${promptTemplate} \n\n CLIENT ID: ${clientId} \n\n GENERATION ID: ${generationId}`,
                        temperature: 0.7,
                        tools: {
                            getClientRelatedData: getClientRelatedData,
                        },
                        stopWhen: stepCountIs(4),
                    });

                    return {
                        id: subsection.id,
                        title: subsection.title,
                        content: result.text.trim(),
                        contentType: subsection.contentType,
                    } as ProspectusSubsection;
                });

                const batchResults = await Promise.all(batchPromises);
                generatedSubsections.push(...batchResults);
                // Optional: Add a short delay between batches to manage rate limits
                await new Promise((resolve) => setTimeout(resolve, 12000));
            }

            generatedSections.push({
                id: section.id,
                title: section.title,
                icon: section.icon,
                subsections: generatedSubsections,
            });
        }

        return generatedSections;
    } catch (error) {
        console.error("Error generating prospectus:", error);
        throw new Error(
            `Failed to generate prospectus: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}
