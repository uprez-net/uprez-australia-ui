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


interface CreateIpoValuationArgs {
    clientId: string;

    // Original fields
    npat?: number | string | null;
    story?: string | null;
    riskDescription?: string | null;
    competitors?: string | null;
    capitalRaise?: number | string | null;
    percentageSold?: number | string | null;

    // New fields from API endpoint
    companyName?: string | null;
    ticker?: string | null;
    sector?: string | null;
    subSector?: string | null;
    shares?: number | string | null;
    friction?: string | null;
    solution?: string | null;
    mission?: string | null;
    market?: string | null;
    growth?: string | null;
    landscape?: string | null;
    moat?: string | null;
    team?: string | null;
}

export async function createIpoValuationAction({
    clientId,
    npat,
    story,
    riskDescription,
    competitors,
    capitalRaise,
    percentageSold,
    companyName,
    ticker,
    sector,
    subSector,
    shares,
    friction,
    solution,
    mission,
    market,
    growth,
    landscape,
    moat,
    team,
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

        // Safe numeric parsing helpers
        const parseNumberOrNull = (value?: number | string | null) => {
            if (typeof value === "number") return value;
            if (typeof value === "string") {
                const parsed = parseFloat(value);
                return Number.isNaN(parsed) ? null : parsed;
            }
            return null;
        };

        const create = await prisma.iPOValuation.create({
            data: {
                generation_id: Find_Generation.generationId,
                clientAccountId: clientId,

                // New fields from the API endpoint
                companyName: companyName ?? null,
                ProposedTicker: ticker ?? null,
                Sector: sector ?? null,
                ReportProcessing: true,
                SubSector: subSector ?? null,
                CurrentSharePrice: parseNumberOrNull(shares),
                the_problem: friction ?? null,
                the_solution: solution ?? null,
                the_mission: mission ?? null,
                the_market: market ?? null,
                growth_engine: growth ?? null,
                the_landscape: landscape ?? null,
                the_moat: moat ?? null,
                team_edge: team ?? null,

                // Original valuation fields
                projectedNetProfit:
                    typeof npat === "string"
                        ? npat
                        : typeof npat === "number"
                            ? npat.toString()
                            : null,
                companyNarrativeAndGrowthStrategy: story ?? null,
                keyBusinessRisks: riskDescription ?? null,
                competitors: competitors ?? null,
                capitalRaiseAmount: parseNumberOrNull(capitalRaise),
                percentageSold: parseNumberOrNull(percentageSold),
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