"use server";

import { convertReport, ReportSummary } from "@/utils/convertReport";
import { Document } from "@prisma/client";
import pLimit from "p-limit";
import  prisma from "@/lib/prisma";

const limit = pLimit(7); // Limit to 7 concurrent requests (tweak this as needed)

interface DocumentReport {
  id: string;
  report: string;
  summary: ReportSummary;
  status: string;
}

export const getReportsFromBackend = async (
  documents: Document[],
  sessionToken: string,
) => {
  const fetchPromises = documents.map((document) =>
    limit(async () => {
      let genId = document.generationId;
      if(!document.generationId) {
        const client = await prisma.sMECompany.findUnique({
          where: { id: document.smeCompanyId },
          select: { generationId: true },
        })
        genId = client!.generationId as string;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/report/${genId}/${document.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error fetching document report:", errorData);
        // throw new Error("Failed to fetch document report");
        return null; // Instead of throwing
      }
      const data: {
        report: string;
      } = await res.json();

      console.log(`Fetched report for document ID ${document.id}:`, data.report);
      const summary = await convertReport(data.report);

      return {
        id: document.id,
        report: data.report,
        summary,
        status: summary.compliance_status,
      };
    })
  );

  const reports: DocumentReport[] = (await Promise.all(fetchPromises)).filter(
    (report): report is DocumentReport => report !== null
  );

  return reports;
};

export const getReports = async (
  documents: Document[],
  sessionToken: string
) => {
  const fetchPromises = documents.map(async (doc) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/report/${doc.generationId}/${doc.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );
    if (!res.ok) {
      // const errorData = await res.json();
      console.error("Error fetching document report:");
      // throw new Error("Failed to fetch document report");
      return null; // Instead of throwing
    }
    const data: {
      report: string;
    } = await res.json();

    return data.report;
  });

  const reports: string[] = (await Promise.all(fetchPromises)).filter(
    (report): report is string => report !== null
  );

  return reports;
};
