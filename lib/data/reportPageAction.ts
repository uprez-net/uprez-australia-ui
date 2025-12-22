"use server";

import { convertReport, ReportSummary } from "@/utils/convertReport";
import { Document, ReportUserNotes } from "@prisma/client";
import pLimit from "p-limit";
import prisma from "@/lib/prisma";
import { revalidateTag, unstable_cache, unstable_expireTag } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

const limit = pLimit(3); // Limit to 3 concurrent requests (tweak this as needed)

interface DocumentReport {
  id: string;
  report: string;
  summary: ReportSummary;
  status: string;
  userNotes: (ReportUserNotes & { userName: string })[];
}

export const getReportsFromBackend = async (
  documents: Document[],
  sessionToken: string,
) => {
  const lastDoc = documents?.at(-1);

  const cacheKey = [
    "compliance_report",
    lastDoc?.smeCompanyId ?? "no_company",
    lastDoc?.generationId ?? "no_gen",
  ].join("_");

  /**
   * -----------------------------
   * 1. CACHED SECTION
   * - Fetch report
   * - Generate summary
   * -----------------------------
   */
  const cachedReports = await unstable_cache(
    async () => {
      const fetchPromises = documents.map((document) =>
        limit(async () => {
          let genId = document.generationId;

          if (!genId) {
            const client = await prisma.sMECompany.findUnique({
              where: { id: document.smeCompanyId },
              select: { generationId: true },
            });
            genId = client?.generationId as string;
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
            return null;
          }

          const data: { report: string } = await res.json();

          const summary = await convertReport(data.report);

          // ❗ Cached data stops here
          return {
            id: document.id,
            generationId: genId!,
            report: data.report,
            summary,
            status: summary.compliance_status,
          };
        })
      );

      return (await Promise.all(fetchPromises)).filter(
        (r): r is {
          id: string;
          generationId: string;
          report: string;
          summary: any;
          status: string;
        } => r !== null
      );
    },
    [cacheKey],
    {
      revalidate: false,
      tags: [cacheKey],
    }
  )();

  /**
   * -----------------------------
   * 2. NON-CACHED SECTION
   * - Fetch notes fresh every time
   * -----------------------------
   */
  const reportsWithNotes: DocumentReport[] = await Promise.all(
    cachedReports.map(async (report) => {
      const notes = await fetchUserNotes(report.id, report.generationId);

      return {
        ...report,
        userNotes: notes,
      };
    })
  );

  return reportsWithNotes;
};


export const getReports = async (
  documents: Document[],
  sessionToken: string
) => {
  const lastDoc = documents?.at(-1);

  const cacheKey = [
    "compliance_reports_data",
    lastDoc?.smeCompanyId ?? "no_company",
    lastDoc?.generationId ?? "no_gen"
  ].join("_");
  const reports = await unstable_cache(async () => {
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

      return {
        report: data.report,
        title: `Report_${doc.fileName}`
      };
    });

    const reports: { report: string; title: string }[] = (await Promise.all(fetchPromises)).filter(
      (report): report is { report: string; title: string } => report !== null
    );

    return reports;
  }, [cacheKey], {
    revalidate: false,
    tags: [cacheKey]
  })()

  return reports;
};


export const fetchUserNotes = async (documentId: string, generationId: string) => {
  try {
    const notes = await prisma.reportUserNotes.findMany({
      where: {
        documentId,
        generationId,
      },
      include: {
        User: true,
      },
    });
    return notes.map(({ User, ...note }) => ({
      ...note,
      userName: User.name
    }));
  } catch (error) {
    console.error("Error fetching user notes:", error);
    throw error;
  }
}

export const saveUserNote = async (content: string, documentId: string, generationId: string, genNum: number, isVerified: boolean, smeCompanyId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const { User, ...newNote } = await prisma.reportUserNotes.create({
      data: {
        content,
        documentId,
        generationId,
        userId: user.id,
        generationNumber: genNum,
        expertVerified: isVerified,
      },
      include: {
        User: true,
      },
    });

    return {
      ...newNote,
      userName: User.name
    };
  } catch (error) {
    console.error("Error saving user note:", error);
    throw error;
  }
}