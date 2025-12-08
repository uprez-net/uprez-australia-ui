import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


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
                        { success: false, error: "Valuation record not found" },
                        { status: 404 }
                  );
            }

            // 2️⃣ UPDATE using the unique id
            const updated = await prisma.iPOValuation.update({
                  where: { id: existing.id }, // must use primary key
                  data: {
                        inputJson: Json_Output,
                  },
            });

            return NextResponse.json({
                  success: true,
                  message: "Valuation record created successfully",
                  data: updated,
            });
      } catch (error) {
            console.error("POST /api/valuation error:", error);
            return NextResponse.json(
                  { success: false, error: "Failed to create valuation" },
                  { status: 500 }
            );
      }
}
