"use server";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import puppeteerDev from "puppeteer";

type GeneratePDFOptions = {
  markdown: string;
  title?: string;
  iconUrl?: string;
};
const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

export async function generatePDF({
  markdown,
  title,
  iconUrl,
}: GeneratePDFOptions): Promise<string> {
  // 1️⃣ Markdown → HTML (high fidelity)
  const htmlContent = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown)
  );

  // 2️⃣ Full HTML document
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Inter, Arial, sans-serif;
      font-size: 14px;
      padding: 40px;
      color: #111;
    }

    header {
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #eaeaea;
      margin-bottom: 32px;
      padding-bottom: 12px;
    }

    header img {
      height: 36px;
      width: 36px;
      object-fit: contain;
      border-radius: 6px;
    }

    h1, h2, h3 {
      page-break-after: avoid;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }

    table th, table td {
      border: 1px solid #ddd;
      padding: 8px;
    }

    pre {
      background: #f6f8fa;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  ${
    title || iconUrl
      ? `
    <header>
      ${iconUrl ? `<img src="${iconUrl}" />` : ""}
      ${title ? `<h1>${title}</h1>` : ""}
    </header>
  `
      : ""
  }

  <main>
    ${htmlContent}
  </main>
</body>
</html>
`;

  // 3️⃣ Launch Chromium (Vercel-safe)
  let browser;
  console.log(`Icon URL: ${iconUrl}`);
  console.log(`Title: ${title}`);
  if (process.env.NODE_ENV === "development") {
    browser = await puppeteerDev.launch({
      headless: true,
    });
  } else {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(remoteExecutablePath),
      headless: true,
    });
  }

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });
  // convert Buffer/Uint8Array to base64 string
  const pdfBase64 = Buffer.from(pdf).toString("base64");
  await browser.close();
  return pdfBase64;
}
