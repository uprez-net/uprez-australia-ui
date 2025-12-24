import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getReports } from "@/lib/data/reportPageAction";
import { Document } from "@prisma/client";
import { generatePDF } from "./convertMarkdownToPDF";
import { getPublicUrl } from "@/lib/data/bucketAction";

function stripMarkdownCodeBlock(report: string): string {
  return report.replace(/^```markdown\s*/, "").replace(/```$/, "").trim();
}

export async function downloadReports(
  sessionToken: string,
  documents: Document[],
  smeCompanyId: string,
  generationId: string,
  clientName: string,
  iconUrl?: string
) {

  // Convert All these MD strings to PDF and push them to zip and download them
  const zip = new JSZip();
  const reports = await getReports(documents, smeCompanyId, generationId, sessionToken);
  console.log(`Icon URL in downloadReports: ${iconUrl}`);

  await Promise.all(
    reports.map(async (report, index) => {
      const pdfBase64 = await generatePDF({
        markdown: stripMarkdownCodeBlock(report.report),
        title: clientName,
        iconUrl: iconUrl,
      });
      const pdfBuffer = Buffer.from(pdfBase64, "base64");
      zip.file(`${report.title}.pdf`, pdfBuffer);
    })
  );

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `reports-${clientName}.zip`);
}
