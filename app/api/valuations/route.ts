import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Server-side URL for the valuation calculation backend.
// Prefer a server-only env var so we don't couple/accidentally expose internal URLs via NEXT_PUBLIC_*.
const CALCULATION_BACKEND_URL =
  process.env.VALUATION_CALCULATION_BACKEND_URL ||
  process.env.NEXT_PUBLIC_VALUATION_BACKEND_URL ||
  "http://localhost:5000";

const CALCULATION_BACKEND_TIMEOUT_MS = (() => {
  const raw = process.env.VALUATION_CALCULATION_BACKEND_TIMEOUT_MS;
  if (!raw) return 10 * 60 * 1000; // 10 minutes default (valuation can be slow)
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 10 * 60 * 1000;
})();

// ----------------------
// POST /api/valuations
// ----------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received POST /api/valuations with body:", body);
    const { generation_id, client_account_id, Json_Output, status } = body;

    if (status !== "Completed") {
      console.error("Valuation status is not 'Completed':", status);
      return NextResponse.json(
        {
          success: false,
          error: "Valuation status must be 'Completed' to create a record",
        },
        { status: 400 }
      );
    }

    // Required validation
    if (!generation_id) {
      console.error("Missing required field: generation_id");
      return NextResponse.json(
        { success: false, error: "generation_id is required" },
        { status: 400 }
      );
    }

    if (!client_account_id) {
      console.error("Missing required field: client_account_id");
      return NextResponse.json(
        { success: false, error: "client_account_id is required" },
        { status: 400 }
      );
    }

    if (!Json_Output || typeof Json_Output !== "object") {
      console.error("Missing or invalid required field: Json_Output");
      return NextResponse.json(
        { success: false, error: "Json_Output is required" },
        { status: 400 }
      );
    }

    // 1️⃣ FIND the record using generation_id + clientAccountId
    const existing = await prisma.iPOValuation.findFirst({
      where: {
        generation_id: generation_id,
        clientAccountId: client_account_id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No existing valuation record found for this generation/client. Create the IPO valuation record first before posting Completed output.",
        },
        { status: 404 }
      );
    }

    // Fill missing user inputs from our stored metadata so downstream calc has consistent fields.
    // NOTE: backend expects `industry` (lowercase). Previously we were incorrectly writing `Industry`.
    Json_Output.user_inputs.company_name = existing.companyName;
    Json_Output.user_inputs.proposed_ticker = existing.ProposedTicker;
    Json_Output.user_inputs.sector = existing.Sector;
    Json_Output.user_inputs.industry = existing.SubSector;

    Json_Output.dcf_input.company_name = existing.companyName;
    Json_Output.dcf_input.sector = existing.Sector;
    Json_Output.dcf_input.industry = existing.SubSector;

    Json_Output.financial_analytics_input.company_name = existing.companyName;

    Json_Output.sentiment_analysis_input.problem =
      existing.the_problem ?? Json_Output.sentiment_analysis_input.problem;
    Json_Output.sentiment_analysis_input.solution =
      existing.the_solution ?? Json_Output.sentiment_analysis_input.solution;
    Json_Output.sentiment_analysis_input.mission =
      existing.the_mission ?? Json_Output.sentiment_analysis_input.mission;
    Json_Output.sentiment_analysis_input.market_opportunity =
      existing.the_market ??
      Json_Output.sentiment_analysis_input.market_opportunity;
    Json_Output.sentiment_analysis_input.growth_strategy =
      existing.growth_engine ??
      Json_Output.sentiment_analysis_input.growth_strategy;
    Json_Output.sentiment_analysis_input.competitors =
      existing.the_landscape ??
      Json_Output.sentiment_analysis_input.competitors;
    Json_Output.sentiment_analysis_input.competitive_advantage =
      existing.the_moat ??
      Json_Output.sentiment_analysis_input.competitive_advantage;
    Json_Output.sentiment_analysis_input.management_edge =
      existing.team_edge ??
      Json_Output.sentiment_analysis_input.management_edge;

    const payload = {
      ...Json_Output,
      client_id: client_account_id,
      generation_id: generation_id,
    };

    console.log("Prepared JSON for calculation backend:\n", payload);

    // data: updated,

    const reportUrl = `${CALCULATION_BACKEND_URL}/Ipo/valuation`;
    const abortController = new AbortController();
    const timeout = setTimeout(
      () => abortController.abort(),
      CALCULATION_BACKEND_TIMEOUT_MS
    );

    const reportResponse = await fetch(reportUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: abortController.signal,
    }).finally(() => clearTimeout(timeout));

    if (!reportResponse.ok) {
      const errorText = await reportResponse.text();
      console.error("Failed to send data to calculation backend:", {
        url: reportUrl,
        status: reportResponse.status,
        statusText: reportResponse.statusText,
        body: errorText,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Calculation backend request failed",
          backend: {
            url: reportUrl,
            status: reportResponse.status,
            statusText: reportResponse.statusText,
            body: errorText,
          },
        },
        { status: 500 }
      );
    }
    const reportData: {
      success: boolean;
      path: string;
      output: object;
    } = await reportResponse.json();
    console.log("Calculation backend response:", reportData);

    // 2️⃣ UPDATE using the unique id
    const updated = await prisma.iPOValuation.update({
      where: { id: existing.id }, // must use primary key
      data: {
        ReportProcessing: false,
        inputJson: Json_Output,
        outputJson: reportData.success ? reportData.output : "",
        ipoValuationPdfUrl: reportData.success ? reportData.path : null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Valuation record created successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // If the calculation backend takes too long, we abort; return a clear timeout error.
    if (error?.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          error: `Calculation backend timed out after ${CALCULATION_BACKEND_TIMEOUT_MS}ms`,
          backend: {
            url: `${CALCULATION_BACKEND_URL}/Ipo/valuation`,
            timeoutMs: CALCULATION_BACKEND_TIMEOUT_MS,
          },
        },
        { status: 504 }
      );
    }
    console.error("POST /api/valuations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create valuation",
        details: error?.message ?? String(error),
      },
      { status: 502 }
    );
  }
}
