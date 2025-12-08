import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { da } from "@faker-js/faker";

export async function POST(req: Request) {

      try {
            const body = await req.json();
            const {clientId, npat, story, riskDescription, competitors, capitalRaise, percentageSold} = body;

            if(!clientId){
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

            if(!Find_Generation || !Find_Generation.generationId){
                  console.error("No generationId found for clientId:", clientId);
                  return NextResponse.json(
                        { success: false, error: "No generationId found for the provided clientId" },
                        { status: 400 }
                  );
            }

            const create = await prisma.iPOValuation.create({
                  data:{
                        generation_id: Find_Generation.generationId,
                        clientAccountId: clientId,
                        projectedNetProfit: npat,
                        companyNarrativeAndGrowthStrategy: story,
                        keyBusinessRisks: riskDescription,
                        competitors: competitors,
                        capitalRaiseAmount: parseFloat(capitalRaise),
                        percentageSold: parseFloat(percentageSold),
                  }
            })

            return NextResponse.json(
                  { success: true, value: create, message: "Valuation initials record created successfully" },
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