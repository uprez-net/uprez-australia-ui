'use server';
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../prisma";
import { CommentsExtended, Prospectus, ProspectusSection } from "@/app/interface/interface";
import { prospectusData } from "../prospectus-data";



export async function fetchOrCreateClientProspectus(clientId: string, offset?: number): Promise<Prospectus[]> {
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
            const prospectusContent: ProspectusSection[] = prospectusData;
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

            return [{
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
                })) : [],
            }]
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
            take: 10,
        });

        return existingProspectus.map(prospectus => ({
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
            })) : [],
        }));

    } catch (error) {
        console.error("Error fetching or creating prospectus:", error);
        throw new Error(
            `Failed to fetch or create prospectus: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

export async function addCommentToProspectus(prospectusId: string, content: string): Promise<CommentsExtended> {
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
            })) : [],
        }
    } catch (error) {
        console.error("Error creating new prospectus version:", error);
        throw new Error(
            `Failed to create new prospectus version: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}