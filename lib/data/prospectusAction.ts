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



export async function fetchOrCreateClientProspectus(clientId: string, offset?: number): Promise<{ data: Prospectus[]; hasMore: boolean }> {
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
            const prospectusContent: ProspectusSection[] = await generateProspectusBatch(clientId, 3);
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

export async function generateNewProspectusVersion(clientId: string): Promise<Prospectus> {
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
        const prospectusContent: ProspectusSection[] = await generateProspectusBatch(clientId, 3);
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
        query: z.string().describe(
            "Natural language description of the client information to retrieve. " +
            "This query is embedded and matched against client data using semantic similarity. " +
            "Be specific about attributes, time periods, or criteria needed. " +
            "Example: 'active clients in New York who purchased in Q4 2024'"
        )
    }),
    execute: async ({ clientId, query }) => {
        const report = await getClientData(clientId, 7, query);
        return report?.length
            ? report
            : ["No relevant client data was found for this query."];
    },
});

// Alternative version with batch processing for better performance
async function generateProspectusBatch(
    clientId: string,
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
                        model: google("gemini-2.0-flash"),
                        prompt: `${promptTemplate} \n\n CLIENT ID: ${clientId}`,
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
