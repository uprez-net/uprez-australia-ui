import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";


// ----------------------
// POST /api/valuation
// ----------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      generation_id,
      clientAccountId,
      inputJson,
      outputJson,
      projectedNetProfit,
      companyNarrativeAndGrowthStrategy,
      keyBusinessRisks,
      competitors,
      inputDocumentUrls,
      ipoValuationPdfUrl,
    } = body;

    // Required validation
    if (!generation_id) {
      return NextResponse.json(
        { success: false, error: "generation_id is required" },
        { status: 400 }
      );
    }

    if (!clientAccountId) {
      return NextResponse.json(
        { success: false, error: "clientAccountId is required" },
        { status: 400 }
      );
    }

    const newValuation = await prisma.iPOValuation.create({
      data: {
        generation_id,
        clientAccountId,
        inputJson,
        outputJson,
        projectedNetProfit,
        companyNarrativeAndGrowthStrategy,
        keyBusinessRisks,
        competitors,
        inputDocumentUrls,
        ipoValuationPdfUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Valuation record created successfully",
      data: newValuation,
    });
  } catch (error) {
    console.error("POST /api/valuation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create valuation" },
      { status: 500 }
    );
  }
}
