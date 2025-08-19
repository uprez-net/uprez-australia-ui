'use server';
import { ComplianceStatus } from "@prisma/client";
import prisma from "../prisma";
import { SWE } from "@/app/interface/interface";
import { currentUser } from "@clerk/nextjs/server";


export async function onBoardNewSme(sme: SWE) {
    try {
        const { id, userId, ...smeData } = sme;
        const user = await currentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }
        const { publicMetadata } = user;
        const organizationId = publicMetadata.organizationId as string;
        const orgType = publicMetadata.orgType as "intermediary" | "sme";
        if (!organizationId) {
            throw new Error("Organization ID is missing in user metadata");
        }
        const newSme = await prisma.sMECompany.create({
            data: {
                ...smeData,
                smeProfileId: orgType === "sme" ? organizationId : undefined,
                intermediaryId: orgType === "intermediary" ? organizationId : undefined,
                complianceStatus: ComplianceStatus.pending, // or another default/status as per your schema
                updatedAt: new Date(),
                createdAt: new Date(),
            },
        });

        return newSme;
    } catch (error) {
        console.error("Error onboarding new SME:", error);
        throw new Error(
            `Failed to onboard new SME: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

export async function updateSme(sme: SWE) {
    try {
        const { id, userId, ...smeData } = sme;
        const user = await currentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }
        const { publicMetadata } = user;
        const organizationId = publicMetadata.organizationId as string;
        const orgType = publicMetadata.orgType as "intermediary" | "sme";
        if (!organizationId) {
            throw new Error("Organization ID is missing in user metadata");
        }
        const updatedSme = await prisma.sMECompany.update({
            where: {
                id,
            },
            data: {
                ...smeData,
                smeProfileId: orgType === "sme" ? organizationId : undefined,
                intermediaryId: orgType === "intermediary" ? organizationId : undefined,
                updatedAt: new Date(),
            },
        });

        return updatedSme;
    } catch (error) {
        console.error("Error updating SME:", error);
        throw new Error(
            `Failed to update SME: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}