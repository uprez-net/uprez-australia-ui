import { marked } from "marked";

export const convertMarkdownToPDFDownload = async (markdownString: string, fileName = "report.pdf") => {
  // Convert Markdown to HTML
  if (typeof window === "undefined") return; // prevent SSR execution

  const html2pdf = (await import("html2pdf.js")).default;
  const htmlContent = await marked.parse(markdownString);

  // Create a temporary container for HTML content
  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  container.style.padding = "20px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.fontSize = "14px";
  container.style.color = "#000";

  // Append to DOM to allow html2pdf to render it properly
  document.body.appendChild(container);

  // Generate PDF
  html2pdf()
    .set({
      margin: 0.5,
      filename: fileName,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    })
    .from(container)
    .save()
    .finally(() => {
      document.body.removeChild(container); // Clean up
    });
};
