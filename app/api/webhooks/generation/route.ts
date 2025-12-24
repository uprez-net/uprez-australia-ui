import { UserBackendSession } from "@/app/interface/interface";
import { getReportsFromBackend } from "@/lib/data/reportPageAction";
import prisma from "@/lib/prisma";
import { calculateComplianceScore } from "@/utils/calculateComplianceScore";
import {
  BasicCheckStatus,
  ComplianceStatus,
  EligibilityStatus,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

type WebhookStatus = "Completed" | "Processing" | string;

/**
 * Map upstream webhook status -> DB enums
 */
function mapBasicCheckStatus(status: WebhookStatus): BasicCheckStatus {
  if (status === "Completed") return BasicCheckStatus.Passed;
  if (status === "Processing") return BasicCheckStatus.Pending;
  return BasicCheckStatus.Failed;
}

function mapIntermediateComplianceStatus(status: WebhookStatus): ComplianceStatus {
  if (status === "Completed") return ComplianceStatus.high;
  if (status === "Processing") return ComplianceStatus.pending;
  return ComplianceStatus.failed;
}

function mapIntermediateEligibility(status: WebhookStatus): EligibilityStatus {
  if (status === "Completed") return EligibilityStatus.SME_Eligible;
  if (status === "Processing") return EligibilityStatus.Pending;
  return EligibilityStatus.Failed;
}

/**
 * Final compliance bucket from numeric score
 */
function bucketComplianceFromScore(score: number): ComplianceStatus {
  if (score > 80) return ComplianceStatus.high;
  if (score > 60) return ComplianceStatus.medium;
  return ComplianceStatus.low;
}

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  if (!payload) {
    return new NextResponse("Invalid JSON payload", { status: 400 });
  }

  const { generation_id, status, document_ids } = payload as {
    generation_id?: string;
    status?: WebhookStatus;
    document_ids?: string[];
  };

  if (!generation_id || !status || !document_ids) {
    return new NextResponse("Missing generation_id, status, or document_ids", { status: 400 });
  }

  console.log("Received webhook:", { generation_id, status, document_ids });

  try {
    // Fetch a single document that matches generation_id and include SME + user info in one go.
    const smeCompany = await prisma.sMECompany.findFirst({
      where: {
        generationId: generation_id,
      },
      select: {
        id: true,
        SMEProfile: {
          select: {
            User: {
              select: {
                name: true,
                email: true,
                role: true,
              },
            },
          }
        }
      }
    });

    if (!smeCompany) {
      console.error("No SME found for generationId:", generation_id);
      return new NextResponse("Document/SME not found", { status: 200 });
    }

    const intermediateCompliance = mapIntermediateComplianceStatus(status);
    const intermediateEligibility = mapIntermediateEligibility(status);

    // Update documents matching generationId and also set intermediate statuses on SME company in a transaction.
    // This ensures both updates succeed or fail together.
    await prisma.$transaction([
      prisma.document.updateMany({
        where: { id: { in: document_ids } },
        data: { basicCheckStatus: "Passed", generationId: generation_id },
      }),
      prisma.document.updateMany({
        where: { smeCompanyId: smeCompany.id, generationId: generation_id, id: { notIn: document_ids } },
        data: { basicCheckStatus: "Failed" },
      }),
      prisma.sMECompany.update({
        where: { id: smeCompany.id },
        data: {
          complianceStatus: intermediateCompliance,
          eligibilityStatus: intermediateEligibility,
          updatedAt: new Date(),
        },
      }),
    ]);

    if (status !== "Completed") {
      // If not completed, no further processing needed
      return new NextResponse("Intermediate statuses updated", { status: 200 });
    }

    // Build login payload from fetched user info (we validated doc exists above)
    const user = smeCompany.SMEProfile?.User;
    if (!user) {
      console.error("SME user missing for smeCompanyId:", smeCompany.id);
      return new NextResponse("SME user not found", { status: 404 });
    }

    // Create backend session
    const loginResp = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.name,
        email: user.email,
        company_id: smeCompany.id,
        role: user.role,
      }),
    });

    if (!loginResp.ok) {
      const text = await loginResp.text().catch(() => "no body");
      console.error("Backend login failed:", loginResp.status, text);
      return new NextResponse("Failed to create client session", {
        status: 502,
      });
    }

    const sessionData = (await loginResp.json()) as UserBackendSession;

    // Fetch all documents for this SME (needed for scoring). Only select fields required by getReportsFromBackend if possible.
    const documents = await prisma.document.findMany({
      where: { generationId: generation_id },
      // select minimal fields if getReportsFromBackend doesn't need entire rows
    });

    // Call backend to get reports and compute compliance score
    const reportData = await getReportsFromBackend(documents, sessionData.access_token);
    const scores = calculateComplianceScore(reportData, documents);
    const finalCompliance = bucketComplianceFromScore(scores.overallScore);

    // Update SME company with final compliance score (only one more write)
    await prisma.sMECompany.update({
      where: { id: smeCompany.id },
      data: {
        complianceStatus: finalCompliance,
        updatedAt: new Date(),
      },
    });

    return new NextResponse("Document & SME updated successfully", { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
