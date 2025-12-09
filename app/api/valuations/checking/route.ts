import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { da } from "@faker-js/faker";
import { getPublicUrl } from "@/lib/data/bucketAction";

export async function POST(req: Request) {
      try {
            const body = await req.json();
            const { clientId } = body;

            if (!clientId) {
                  console.error("Missing required field: clientId");
                  return NextResponse.json(
                        { success: false, error: "clientId is required" },
                        { status: 400 }
                  );
            }
            const Find_Generation = await prisma.sMECompany.findFirst({
                  where: {
                        id: clientId,
                  },
            });
            if (!Find_Generation || !Find_Generation.generationId) {
                  console.error("No generationId found for clientId:", clientId);
                  return NextResponse.json(
                        { success: false, error: "No generationId found for the provided clientId" },
                        { status: 400 }
                  );
            }
            const find_in_IpoValuation = await prisma.iPOValuation.findFirst({
                  where: {
                        clientAccountId: clientId,
                        generation_id: Find_Generation.generationId,
                  }
            });
            if (!find_in_IpoValuation) {
                  return NextResponse.json(
                        { success: false, msg: "No valuation record found for the provided clientId" },
                        { status: 201 }
                  );
            }

            else if( find_in_IpoValuation.inputJson !== "" && find_in_IpoValuation.outputJson !== "" && find_in_IpoValuation.ipoValuationPdfUrl ){
                  const Url = find_in_IpoValuation.ipoValuationPdfUrl;
                  if (!Url) {
                        return NextResponse.json(
                              { success: false, error: "Valuation report URL is missing" },
                              { status: 400 }
                        );
                  }
                  const publicUrl = await getPublicUrl(Url);
                  return NextResponse.json(
                        { success: true, data: find_in_IpoValuation, publicUrl, msg: "Valuation report already generated" },
                        { status: 200 }
                  );
            }else if (find_in_IpoValuation.ReportProcessing){
                  return NextResponse.json(
                        { success: false, data: find_in_IpoValuation, msg: "Report processing Happening" },
                        { status: 201 }
                  );
            }

            return NextResponse.json(
                  { success: true, data: find_in_IpoValuation },
                  { status: 200 }
            );

      }
      catch (error) {
            console.error("Error processing valuation initials:", error);
            return NextResponse.json(
                  { success: false, error: "Internal server error" },
                  { status: 500 }
            );
      }
}