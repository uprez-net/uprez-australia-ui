import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
    try {
        await prisma.sMECompany.updateMany({
            where: {
                complianceStatus: "pending",
                eligibilityStatus: "Pending",
                updatedAt: {
                    lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
                }
            },
            data: {
                complianceStatus: "failed",
                eligibilityStatus: "Failed",
            }
        });

        return new NextResponse("Cron job executed successfully", { status: 200 });
    } catch (error) {
        console.error("Error in cron job:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}