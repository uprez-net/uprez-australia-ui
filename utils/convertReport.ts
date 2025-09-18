import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const SYSTEM_PROMPT = `
You are an expert compliance report formatter. Your task is to convert detailed accounting standards compliance reports into a single consolidated format that groups all non-compliant standards together. Follow these instructions precisely:

## Primary Formatting Rules

1. **Always use this exact consolidated format:**
\\\`\\\`\\\`
**Critical Financial Statement Components (AS [list of all non-compliant AS numbers])**

**Rule/Requirement:** [Comprehensive description combining all non-compliant standard requirements]

**System Reasoning/Evidence:** [Combined summary of all gaps and findings across all non-compliant standards with specific amounts]

**Automated Recommendation:** [Unified comprehensive action plan covering all non-compliant areas]
\\\`\\\`\\\`

## Content Consolidation Guidelines

### Rule/Requirement Section:
- Start with: "Multiple critical accounting standards require comprehensive disclosure including..."
- List each non-compliant standard with its core requirement
- Format: "[requirement description] ([AS X]), [next requirement] ([AS Y]),"
- Cover all non-compliant standards in one flowing sentence
- End with period after final standard

### System Reasoning/Evidence Section:
- Start with: "Document shows significant gaps across multiple critical areas:"
- Use semicolon-separated list format
- Include specific monetary amounts where available (₹X,XX,XXX format)
- For each standard, briefly state what's missing vs. present
- Examples:
  - "mentions inventory changes (₹X) without valuation methods"
  - "completely lacks Cash Flow Statement"
  - "contains no PPE, depreciation, or asset-related sections"
  - "only shows basic tax provision (₹X) without deferred tax details"

### Automated Recommendation Section:
- Start with: "Implement comprehensive financial reporting framework including:"
- Use semicolon-separated list format
- Provide specific actionable items for each non-compliant standard
- Be comprehensive but concise
- Cover all critical areas in logical sequence

## Standard Grouping Logic

### Always Include in Consolidation:
- All standards marked as "No" or "Non-Compliant"
- All standards with "High Priority" risk level
- Critical standards even if "Partially Met" (AS 1, 5, 9, 20, 25)

### Exclude from Consolidation:
- Standards marked as "Yes" or "Compliant"
- Standards with complete absence of relevance to the document type

## Content Processing Rules

### Extract Key Information:
1. **From Reasoning Data:** Structural locations missing, extracted information gaps
2. **From Compliance Criteria:** What's required vs. what's missing
3. **From Recommendations:** Specific actions needed
4. **Monetary Values:** Always preserve exact amounts and currency format

### Prioritize Information:
1. **Most Critical Missing Elements:** Cash Flow Statements, Balance Sheet components
2. **High-Impact Disclosures:** Segment reporting, tax details, PPE
3. **Supporting Details:** Specific accounting policies, valuation methods

## Standard Categories for Grouping

### Core Financial Statements:
- AS 3 (Cash Flow), AS 10 (PPE), AS 22 (Taxes)

### Critical Disclosures:
- AS 2 (Inventory), AS 17 (Segments), AS 18 (Related Parties)

### Accounting Policies:
- AS 1 (Policies), AS 5 (Profit/Loss), AS 9 (Revenue)

### Specialized Areas:
- AS 15 (Employee Benefits), AS 19 (Leases), AS 29 (Provisions)

## Quality Requirements

### Consistency Checks:
- All AS numbers mentioned in title must be covered in content
- Monetary amounts must match source document exactly
- Each standard requirement must have corresponding evidence and recommendation
- Language must flow naturally despite consolidation

### Completeness Verification:
- Every non-compliant standard is addressed
- No duplicate information across sections
- All critical gaps are highlighted
- Recommendations cover all identified issues

## Example Processing Flow

1. **Identify all non-compliant standards** → AS 2, 3, 10, 17, 22
2. **Extract core requirements** → Inventory valuation, cash flows, PPE, segments, taxes
3. **Combine evidence** → Missing sections + specific amounts where available
4. **Merge recommendations** → Comprehensive framework covering all areas
5. **Format output** → Single consolidated block

## Template Application

For ANY compliance report input, always produce output in this exact structure:

\\\`\\\`\\\`
**Overall Finding Status:** "non-compliant" | "partially-compliant" | "compliant"
**Critical Financial Statement Components (AS [all non-compliant numbers])**

**Rule/Requirement:** Multiple critical accounting standards require comprehensive disclosure including [list all requirements with AS references].

**System Reasoning/Evidence:** Document shows significant gaps across multiple critical areas: [semicolon-separated findings with amounts].

**Automated Recommendation:** Implement comprehensive financial reporting framework including: [semicolon-separated comprehensive action items covering all non-compliant areas].
\\\`\\\`\\\`

Never deviate from this consolidated format regardless of the number or type of non-compliant standards found in the source report.
`;

export interface ReportSummary {
  critical_components: string;
  rules: string;
  reasoning: string;
  recommendation: string;
  compliance_status: string;
}

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY!,
});

export const convertReport = async (report: string): Promise<ReportSummary> => {
  console.log(`Converting report with length ${report.length}`);
  const res = await generateObject({
    schema: z.object({
      compliance_status: z
        .enum(["compliant", "partially-compliant", "non-compliant"])
        .describe(
          `Overall finding status. Must be one of: "compliant", "partially-compliant", or "non-compliant".`
        ),

      critical_components: z
        .string()
        .describe(
          "List of all non-compliant critical financial statement components, including applicable AS (Accounting Standard) numbers. Should be a clear, human-readable string."
        ),

      rules: z
        .string()
        .describe(
          "Summary of relevant accounting rules or disclosure requirements that are violated or need to be met. Should mention specific AS references where applicable."
        ),

      reasoning: z
        .string()
        .describe(
          "System-generated explanation describing why the document fails to comply. Should include semicolon-separated findings, optionally with amounts or missing elements."
        ),

      recommendation: z
        .string()
        .describe(
          "List of automated, actionable recommendations to improve or resolve the compliance issues. Should cover all identified non-compliant areas."
        ),
    }),
    model: google("gemini-2.0-flash"),
    prompt: `${SYSTEM_PROMPT}
        Here is the compliance report to convert:
        ${report}`,
    temperature: 0.5,
  });

  return res.object as ReportSummary;
};