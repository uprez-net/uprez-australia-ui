import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


const CALCULATION_BACKEND_URL = process.env.CALCULATION_BACKEND_URL || "http://localhost:5000";

// ----------------------
// POST /api/valuation
// ----------------------
export async function POST(req: Request) {
      try {
            const body = await req.json();
            console.log("Received POST /api/valuation with body:", body);
            const {
                  generation_id,
                  client_account_id,
                  Json_Output,
                  status
            } = body;

            if (status !== "Completed") {
                  console.error("Valuation status is not 'Completed':", status);
                  return NextResponse.json(
                        { success: false, error: "Valuation status must be 'Completed' to create a record" },
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

            // 1️⃣ FIND the record using generation_id + clientAccountId
            const existing = await prisma.iPOValuation.findFirst({
                  where: {
                        generation_id: generation_id,
                        clientAccountId: client_account_id,
                  },
            });

            if (!existing) {

                  // const create = await prisma.iPOValuation.create({
                  //       data: {
                  //             generation_id: generation_id,
                  //             clientAccountId: client_account_id,
                  //             inputJson: Json_Output,
                  //       },
                  // });

                  return NextResponse.json(
                        { success: false, msg: "Already Existed..." },
                        { status: 300 }
                  );
            }

            Json_Output.user_inputs.company_name = existing.companyName;
            Json_Output.user_inputs.proposed_ticker = existing.ProposedTicker;
            Json_Output.user_inputs.sector = existing.Sector;
            Json_Output.user_inputs.Industry = existing.SubSector;
            

            Json_Output.dcf_input.company_name = existing.companyName;
            Json_Output.dcf_input.sector = existing.Sector;
            Json_Output.dcf_input.industry = existing.SubSector;

            Json_Output.financial_analytics_input.company_name = existing.companyName;

            Json_Output.sentiment_analysis_input.problem = existing.the_problem ?? Json_Output.sentiment_analysis_input.problem;
            Json_Output.sentiment_analysis_input.solution = existing.the_solution ?? Json_Output.sentiment_analysis_input.solution;
            Json_Output.sentiment_analysis_input.mission = existing.the_mission ?? Json_Output.sentiment_analysis_input.mission;
            Json_Output.sentiment_analysis_input.market_opportunity = existing.the_market ?? Json_Output.sentiment_analysis_input.market_opportunity;
            Json_Output.sentiment_analysis_input.growth_strategy = existing.growth_engine ?? Json_Output.sentiment_analysis_input.growth_strategy;
            Json_Output.sentiment_analysis_input.competitors = existing.the_landscape ?? Json_Output.sentiment_analysis_input.competitors;
            Json_Output.sentiment_analysis_input.competitive_advantage = existing.the_moat ?? Json_Output.sentiment_analysis_input.competitive_advantage;
            Json_Output.sentiment_analysis_input.management_edge = existing.team_edge ?? Json_Output.sentiment_analysis_input.management_edge;

            const Json = { ...Json_Output, client_id: client_account_id, generation_id: generation_id }

            console.log("Prepared JSON for calculation backend:\n", Json);

            // data: updated,

            const reportResponse = await fetch(
                  `${CALCULATION_BACKEND_URL}/api/Ipo/valuation`,
                  {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json",
                        },
                        body: JSON.stringify(Json),
                  }
            );
            if (!reportResponse.ok) {
                  console.error("Failed to send data to calculation backend:", await reportResponse.text());
                  return NextResponse.json(
                        { success: false, error: "Failed to process valuation report" },
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

      } catch (error) {
            console.error("POST /api/valuation error:", error);
            return NextResponse.json(
                  { success: false, error: "Failed to create valuation" },
                  { status: 500 }
            );
      }
}
