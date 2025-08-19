import prisma from "@/lib/prisma";
import {
  BasicCheckStatus,
  ComplianceStatus,
  EligibilityStatus,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { generation_id, status } = await req.json();
  console.log("Received webhook:", { generation_id, status });

  try {
    // Update the document's generationId and basicCheckStatus
    await prisma.document.updateMany({
      where: {
        generationId: generation_id,
      },
      data: {
          basicCheckStatus:
            status === "Completed"
              ? BasicCheckStatus.Passed
              : status === "Processing"
              ? BasicCheckStatus.Pending
              : BasicCheckStatus.Failed,

      },
    });
    const smeId = await prisma.document.findFirst({
      where: {
        generationId: generation_id,
      },
      select: {
        smeCompanyId: true,
      },
    });
    if (!smeId) {
      return new NextResponse("SME not found", { status: 404 });
    }
    // Update the SME's compliance status
    await prisma.sMECompany.update({
      where: {
        id: smeId.smeCompanyId,
      },
      data: {
        complianceStatus:
          status === "Completed"
            ? ComplianceStatus.high
            : status === "Processing"
            ? ComplianceStatus.pending
            : ComplianceStatus.failed,
        eligibilityStatus:
          status === "Completed"
            ? EligibilityStatus.SME_Eligible
            : status === "Processing"
            ? EligibilityStatus.Pending
            : EligibilityStatus.Failed,
        updatedAt: new Date(),
      },
    });

    return new NextResponse("Document updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating document:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
