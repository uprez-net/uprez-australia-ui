"use server";

import prisma from "@/lib/prisma";
import { getPublicUrl } from "@/lib/data/bucketAction";

// ---------- 1) Check existing IPO valuation & pdf url ----------

interface CheckIpoValuationArgs {
    clientId: string;
}

export async function checkIpoValuationAction({
    clientId,
}: CheckIpoValuationArgs) {
    try {
        if (!clientId) {
            console.error("Missing required field: clientId");
            return {
                success: false as const,
                error: "clientId is required",
                status: 400,
            };
        }

        const Find_Generation = await prisma.sMECompany.findFirst({
            where: {
                id: clientId,
            },
        });

        if (!Find_Generation || !Find_Generation.generationId) {
            console.error("No generationId found for clientId:", clientId);
            return {
                success: false as const,
                error: "No generationId found for the provided clientId",
                status: 400,
            };
        }

        const find_in_IpoValuation = await prisma.iPOValuation.findFirst({
            where: {
                clientAccountId: clientId,
                generation_id: Find_Generation.generationId,
            },
        });

        if (!find_in_IpoValuation) {
            return {
                success: false as const,
                msg: "No valuation record found for the provided clientId",
                status: 404,
            };
        }

        // If report is already generated
        if (
            find_in_IpoValuation.inputJson !== "" &&
            find_in_IpoValuation.outputJson !== "" &&
            find_in_IpoValuation.ipoValuationPdfUrl
        ) {
            const Url = find_in_IpoValuation.ipoValuationPdfUrl;
            const publicUrl = await getPublicUrl(Url);

            return {
                success: true as const,
                data: find_in_IpoValuation,
                publicUrl,
                message: "Valuation report already generated",
                status: 200,
            };
        }

        // Report still generating
        return {
            success: false as const,
            data: find_in_IpoValuation,
            msg: "Report Generating",
            status: 404,
        };
    } catch (error) {
        console.error("Error processing valuation initials:", error);
        return {
            success: false as const,
            error: "Internal server error",
            status: 500,
        };
    }
}

// ---------- 2) Create IPO valuation record ----------

interface CreateIpoValuationArgs {
    clientId: string;
    npat?: number | string;
    story?: string;
    riskDescription?: string;
    competitors?: string;
    capitalRaise?: number | string;
    percentageSold?: number | string;
}

export async function createIpoValuationAction({
    clientId,
    npat,
    story,
    riskDescription,
    competitors,
    capitalRaise,
    percentageSold,
}: CreateIpoValuationArgs) {
    try {
        if (!clientId) {
            console.error("Missing required field: clientId");
            return {
                success: false as const,
                error: "clientId is required",
                status: 400,
            };
        }

        const Find_Generation = await prisma.sMECompany.findFirst({
            where: {
                id: clientId,
            },
        });

        if (!Find_Generation || !Find_Generation.generationId) {
            console.error("No generationId found for clientId:", clientId);
            return {
                success: false as const,
                error: "No generationId found for the provided clientId",
                status: 400,
            };
        }

        const create = await prisma.iPOValuation.create({
            data: {
                generation_id: Find_Generation.generationId,
                clientAccountId: clientId,
                projectedNetProfit:
                    typeof npat === "string"
                        ? npat
                        : typeof npat === "number"
                            ? npat.toString()
                            : null,
                companyNarrativeAndGrowthStrategy: story,
                keyBusinessRisks: riskDescription,
                competitors: competitors,
                capitalRaiseAmount:
                    typeof capitalRaise === "string"
                        ? parseFloat(capitalRaise)
                        : (capitalRaise as number | null),
                percentageSold:
                    typeof percentageSold === "string"
                        ? parseFloat(percentageSold)
                        : (percentageSold as number | null),
            },
        });

        return {
            success: true as const,
            value: create,
            message: "Valuation initials record created successfully",
            status: 200,
        };
    } catch (error) {
        console.error("Error processing valuation initials:", error);
        return {
            success: false as const,
            error: "Internal server error",
            status: 500,
        };
    }
}
