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

                  const create = await prisma.iPOValuation.create({
                        data: {
                              generation_id: generation_id,
                              clientAccountId: client_account_id,
                              inputJson: Json_Output,
                        },
                  });

                  return NextResponse.json(
                        { success: true, msg: "Table Created Done.." },
                        { status: 200 }
                  );
            }

            const Json = { ...Json_Output, client_id: client_account_id, generation_id: generation_id }

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
