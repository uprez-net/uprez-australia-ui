import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { da } from "@faker-js/faker";

export async function POST(req: Request) {

      try {
            const body = await req.json();
            const {clientId, companyName, ticker, sector, subSector, shares, friction, solution, mission, market, growth, landscape, moat, team} = body;

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
                        companyName: companyName,
                        ProposedTicker: ticker,
                        Sector: sector,
                        ReportProcessing: true,
                        // IndustrySelection:
                        SubSector: subSector,
                        CurrentSharePrice: parseFloat(shares),
                        the_problem: friction,
                        the_solution: solution,
                        the_mission: mission,
                        the_market: market,
                        growth_engine: growth,
                        the_landscape: landscape,
                        the_moat: moat,
                        team_edge: team,
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