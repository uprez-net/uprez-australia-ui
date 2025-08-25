import JSZip from "jszip";
import { saveAs } from "file-saver";
import { marked } from "marked";
// import html2pdf from "html2pdf.js";
import { getReports } from "@/lib/data/reportPageAction";
import { Document } from "@prisma/client";

// You need a function like this (update your existing one if needed)
async function convertMarkdownToPDFBlob(markdown: string): Promise<Blob | null> {
  // Convert Markdown to HTML
  if (typeof window === "undefined") return null; // prevent SSR execution

  const html2pdf = (await import("html2pdf.js")).default;
  const htmlContent = await marked.parse(markdown);

  // Create a temporary container for HTML content
  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  container.style.padding = "20px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.fontSize = "14px";
  container.style.color = "#000";

  // Append to DOM to allow html2pdf to render it properly
  document.body.appendChild(container);

  // Convert the container to PDF and get the Blob
  const pdfBlob: Blob = await html2pdf()
    .set({
      margin: 0.5,
      filename: "report.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    })
    .from(container)
    .output("blob");

  // Clean up
  document.body.removeChild(container);

  return pdfBlob;
}

function stripMarkdownCodeBlock(report: string): string {
  return report.replace(/^```markdown\s*/, "").replace(/```$/, "").trim();
}

export async function downloadReports(
  sessionToken: string,
  documents: Document[],
  clientName: string,
) {

  // Convert All these MD strings to PDF and push them to zip and download them
  const zip = new JSZip();
  const reports = await getReports(documents, sessionToken);

  await Promise.all(
    reports.map(async (report, index) => {
      const pdfBlob = await convertMarkdownToPDFBlob(stripMarkdownCodeBlock(report));
      zip.file(`report-${index + 1}.pdf`, pdfBlob as Blob);
    })
  );

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `reports-${clientName}.zip`);
}
