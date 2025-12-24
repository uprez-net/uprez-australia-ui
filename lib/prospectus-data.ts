export interface ProspectusSection {
  id: SectionCategoryTypes
  title: string
  icon: string
  subsections: ProspectusSubsection[]
}

export interface ProspectusSubsection {
  id: ProspectusSectionTypes
  title: string
  content: string
  contentType: "text" | "table" | "chart" | "list"
}

export interface CompanyInfo {
  name: string
  acn: string
  industry: string
  employees: string
  markets: string
  founded: string
  headquarters: string
  businessAddress: string
  lodgeDate: string
}

export interface OfferDetails {
  offerPrice: string
  sharesOnOffer: string
  totalFundsRaised: string
  marketCap: string
  openDate: string
  closeDate: string
  allotmentDate: string
  tradingStartDate: string
}

export interface FinancialData {
  revenue: { fy2025: string; fy2024: string; fy2023: string; growth: string }
  ebitda: { fy2025: string; fy2024: string; fy2023: string; growth: string }
  netProfit: { fy2025: string; fy2024: string; fy2023: string; growth: string }
  totalAssets: { fy2025: string; fy2024: string; fy2023: string; growth: string }
}

export const companyInfo: CompanyInfo = {
  name: "TechCorp Industries Ltd",
  acn: "123 456 789",
  industry: "Enterprise Software",
  employees: "850+ Professionals",
  markets: "ANZ, APAC",
  founded: "2018",
  headquarters: "Sydney, Australia",
  businessAddress: "Level 15, 456 George Street, Sydney NSW 2000",
  lodgeDate: "October 24, 2025",
}

export const offerDetails: OfferDetails = {
  offerPrice: "$2.50",
  sharesOnOffer: "20.0M",
  totalFundsRaised: "$50.0M",
  marketCap: "$125M",
  openDate: "October 1, 2025",
  closeDate: "October 15, 2025",
  allotmentDate: "October 20, 2025",
  tradingStartDate: "October 22, 2025",
}

export const financialData: FinancialData = {
  revenue: { fy2025: "28,450", fy2024: "21,320", fy2023: "15,680", growth: "+33%" },
  ebitda: { fy2025: "8,535", fy2024: "5,330", fy2023: "2,350", growth: "+60%" },
  netProfit: { fy2025: "4,270", fy2024: "2,130", fy2023: "940", growth: "+100%" },
  totalAssets: { fy2025: "45,600", fy2024: "32,100", fy2023: "18,900", growth: "+42%" },
}

export const prospectusData: ProspectusSection[] = [
  {
    id: "important-notices",
    title: "Important Notices",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
    subsections: [
      {
        id: "disclaimer",
        title: "ASIC Disclaimer",
        contentType: "text",
        content:
          "This document is a prospectus that has been lodged with the Australian Securities and Investments Commission (ASIC) under the Corporations Act 2001. ASIC takes no responsibility for the contents of this prospectus and does not represent that this prospectus complies with the Corporations Act 2001.",
      },
      {
        id: "expiry-date",
        title: "Prospectus Expiry",
        contentType: "text",
        content:
          "This prospectus expires on October 24, 2026, being 13 months after the date of lodgment with ASIC. No securities will be allotted or issued on the basis of this prospectus after the expiry date.",
      },
      {
        id: "general-advice",
        title: "General Advice Warning",
        contentType: "text",
        content:
          "The information contained in this prospectus is general in nature and does not take into account your personal financial situation, investment objectives, or particular needs. Before making an investment decision, you should consider whether this investment is appropriate for you having regard to your investment objectives, financial situation, and particular needs.",
      },
    ],
  },
  {
    id: "investment-overview",
    title: "Investment Overview",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    subsections: [
      {
        id: "the-issuer",
        title: "The Issuer",
        contentType: "text",
        content:
          "TechCorp Industries Ltd (ACN 123 456 789) is an Australian public company incorporated on March 15, 2018. The Company is headquartered in Sydney, Australia, and is a leading provider of innovative enterprise software solutions.",
      },
      {
        id: "purpose-offer",
        title: "Purpose of the Offer",
        contentType: "text",
        content:
          "The proceeds from the Offer will be used to accelerate product development (40%), expand into international markets (30%), pursue strategic acquisitions (20%), and provide general working capital (10%).",
      },
      {
        id: "key-dates",
        title: "Key Dates",
        contentType: "table",
        content:
          "Key dates for the IPO process including offer opening, closing, allotment and trading commencement dates.",
      },
      {
        id: "offer-statistics",
        title: "Offer Statistics",
        contentType: "table",
        content:
          "Summary of key offer metrics including price per share, number of shares, total funds raised and estimated market capitalization.",
      },
      {
        id: "business-highlights",
        title: "Business & Financial Highlights",
        contentType: "list",
        content:
          "Key business achievements and financial performance highlights demonstrating the company's growth trajectory and market position.",
      },
    ],
  },
  {
    id: "offer-details",
    title: "Details of the Offer",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    subsections: [
      {
        id: "terms-conditions",
        title: "Terms and Conditions",
        contentType: "text",
        content:
          "The Offer is made on the terms and conditions set out in this Prospectus. The Offer is for 20,000,000 Shares at an Offer Price of $2.50 per Share to raise $50,000,000 (before costs).",
      },
      {
        id: "application-process",
        title: "Application Process",
        contentType: "text",
        content:
          "Applications for Shares can only be made by completing the Application Form accompanying this Prospectus. Completed Application Forms and Application Monies may be lodged online or mailed to the Share Registry.",
      },
      {
        id: "allocation-policy",
        title: "Allocation Policy",
        contentType: "text",
        content:
          "The Company reserves the right to allocate Shares at its absolute discretion, subject to the terms and conditions of the Offer and applicable law.",
      },
      {
        id: "asx-listing",
        title: "ASX Listing",
        contentType: "text",
        content:
          "The Company will apply for admission to the official list of ASX and quotation of Shares on ASX within 7 days after the date of this Prospectus.",
      },
      {
        id: "underwriting",
        title: "Underwriting Agreements",
        contentType: "text",
        content:
          "The Offer is fully underwritten by leading investment banks, providing certainty of funding for the Company's growth plans.",
      },
    ],
  },
  {
    id: "company-overview",
    title: "Company Overview",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    subsections: [
      {
        id: "company-history",
        title: "Company History & Business Model",
        contentType: "text",
        content:
          "Founded in 2018, TechCorp Industries Ltd has rapidly grown to become a leader in the enterprise software sector in the APAC region. Our business model is centered on a Software-as-a-Service (SaaS) subscription model.",
      },
      {
        id: "industry-context",
        title: "Industry Context",
        contentType: "text",
        content:
          "The global enterprise software market is experiencing significant growth, driven by the increasing adoption of cloud computing, big data analytics, and artificial intelligence.",
      },
      {
        id: "products-services",
        title: "Products and Services",
        contentType: "text",
        content:
          "TechCorp offers a comprehensive suite of enterprise software solutions including customer relationship management, enterprise resource planning, and business intelligence platforms.",
      },
    ],
  },
  {
    id: "financial-information",
    title: "Financial Information",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
    subsections: [
      {
        id: "historical-financials",
        title: "Audited Historical Statements",
        contentType: "table",
        content:
          "Three-year historical financial performance showing strong revenue growth and improving profitability.",
      },
      {
        id: "pro-forma",
        title: "Pro-forma Financials",
        contentType: "table",
        content: "Pro-forma financial position showing the impact of the IPO proceeds on the company's balance sheet.",
      },
      {
        id: "management-analysis",
        title: "Management Discussion & Analysis",
        contentType: "text",
        content:
          "Management's analysis of financial performance, key drivers of growth, and outlook for future periods.",
      },
    ],
  },
  {
    id: "key-risks",
    title: "Key Risks",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
    subsections: [
      {
        id: "company-risks",
        title: "Company-Specific Risks",
        contentType: "list",
        content:
          "Risks specific to TechCorp including key personnel dependency, technology obsolescence, and cybersecurity threats.",
      },
      {
        id: "industry-risks",
        title: "Industry-Related Risks",
        contentType: "list",
        content:
          "Risks related to the enterprise software industry including competitive pressures and technological disruption.",
      },
      {
        id: "market-risks",
        title: "General Market Risks",
        contentType: "list",
        content: "General investment risks including economic conditions, share price volatility, and liquidity risks.",
      },
      {
        id: "climate-risks",
        title: "Climate-Related Risks",
        contentType: "text",
        content:
          "Risks related to climate change and environmental regulations that may impact the company's operations.",
      },
    ],
  },
  {
    id: "directors-management",
    title: "Directors & Management",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    subsections: [
      {
        id: "biographical-info",
        title: "Biographical Information",
        contentType: "text",
        content:
          "Detailed biographies of the Board of Directors and senior management team, including their qualifications and experience.",
      },
      {
        id: "interests-benefits",
        title: "Interests and Benefits",
        contentType: "table",
        content: "Summary of directors' shareholdings, options, and remuneration arrangements.",
      },
      {
        id: "corporate-governance",
        title: "Corporate Governance Statement",
        contentType: "text",
        content:
          "The Company's commitment to high standards of corporate governance in accordance with ASX Corporate Governance Principles.",
      },
    ],
  },
  {
    id: "additional-information",
    title: "Additional Information",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    subsections: [
      {
        id: "material-contracts",
        title: "Material Contracts",
        contentType: "text",
        content:
          "Summary of material contracts that are significant to the Company's business operations and financial performance.",
      },
      {
        id: "legal-proceedings",
        title: "Legal Proceedings",
        contentType: "text",
        content: "Details of any material legal proceedings involving the Company or its subsidiaries.",
      },
      {
        id: "consents",
        title: "Consents",
        contentType: "list",
        content:
          "Consents obtained from professional advisers for the inclusion of their reports and statements in this prospectus.",
      },
    ],
  },
  {
    id: "glossary",
    title: "Glossary & Definitions",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    subsections: [
      {
        id: "key-terms",
        title: "Key Terms",
        contentType: "list",
        content: "Definitions of key terms and abbreviations used throughout the prospectus.",
      },
      {
        id: "technical-definitions",
        title: "Technical Definitions",
        contentType: "text",
        content: "Detailed explanations of technical terms related to the Company's business and industry.",
      },
    ],
  },
  {
    id: "corporate-directory",
    title: "Corporate Directory",
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    subsections: [
      {
        id: "company-contacts",
        title: "Company Contacts",
        contentType: "text",
        content: "Contact information for the Company's registered office and principal place of business.",
      },
      {
        id: "advisers",
        title: "Professional Advisers",
        contentType: "text",
        content:
          "Contact details for the Company's professional advisers including legal counsel, auditors, and financial advisers.",
      },
    ],
  },
]

export type ProspectusSectionTypes =
  // Important Notices
  | 'disclaimer'
  | 'expiry-date'
  | 'general-advice'
  // Investment Overview
  | 'the-issuer'
  | 'purpose-offer'
  | 'key-dates'
  | 'offer-statistics'
  | 'business-highlights'
  // Offer Details
  | 'terms-conditions'
  | 'application-process'
  | 'allocation-policy'
  | 'asx-listing'
  | 'underwriting'
  // Company Overview
  | 'company-history'
  | 'industry-context'
  | 'products-services'
  // Financial Information
  | 'historical-financials'
  | 'pro-forma'
  | 'management-analysis'
  // Key Risks
  | 'company-risks'
  | 'industry-risks'
  | 'market-risks'
  | 'climate-risks'
  // Directors & Management
  | 'biographical-info'
  | 'interests-benefits'
  | 'corporate-governance'
  // Additional Information
  | 'material-contracts'
  | 'legal-proceedings'
  | 'consents'
  // Glossary
  | 'key-terms'
  | 'technical-definitions'
  // Corporate Directory
  | 'company-contacts'
  | 'advisers';

export type SectionCategoryTypes =
  | 'important-notices'
  | 'investment-overview'
  | 'offer-details'
  | 'company-overview'
  | 'financial-information'
  | 'key-risks'
  | 'directors-management'
  | 'additional-information'
  | 'glossary'
  | 'corporate-directory';

export const SECTION_PROMPTS: Record<ProspectusSectionTypes, string> = {

  // ==================== IMPORTANT NOTICES ====================
  'disclaimer': `
You are drafting the ASIC Disclaimer section for an Australian prospectus.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY the disclaimer text
- No headings or explanations
- 2–3 sentences only

CONTENT REQUIREMENTS:
- ASIC takes no responsibility for the contents
- ASIC does not verify compliance or accuracy
- Corporations Act 2001 compliant language

CLIENT CONTEXT:
{clientData}
`,

  'expiry-date': `
You are drafting the Prospectus Expiry section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY the expiry notice text
- No headings or calculations shown

CONTENT REQUIREMENTS:
- Expiry is 13 months from ASIC lodgment date
- State that no securities will be issued after expiry
- Include exact expiry date
- Reference lodgment with ASIC

CLIENT CONTEXT:
{clientData}
`,

  'general-advice': `
You are drafting the General Advice Warning.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY the warning text
- 3–4 sentences only

CONTENT REQUIREMENTS:
- Information is general in nature
- Does not consider personal objectives, financial situation or needs
- Advise readers to consider their own circumstances
- Recommend professional advice

CLIENT CONTEXT:
{clientData}
`,

  // ==================== INVESTMENT OVERVIEW ====================
  'the-issuer': `
You are drafting the "The Issuer" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY paragraph text
- 2–3 sentences only

CONTENT REQUIREMENTS:
- Full legal name and ACN
- Incorporation date and jurisdiction
- Registered office location
- Business sector
- One-line business description

CLIENT CONTEXT:
{clientData}
`,

  'purpose-offer': `
You are drafting the "Purpose of the Offer" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY paragraph text
- Percentages must total 100%

CONTENT REQUIREMENTS:
- Use of funds with percentage breakdown
- Product development, expansion, acquisitions, working capital
- Strategic rationale
- 3–4 sentences

CLIENT CONTEXT:
{clientData}
`,

  'key-dates': `
You are drafting the "Key Dates" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY a markdown table
- No text outside the table

CONTENT REQUIREMENTS:
- Lodgment date
- Offer open/close dates
- Allotment date
- Holding statement dispatch
- ASX quotation date
- AEDT/AEST
- Indicative date disclaimer

CLIENT CONTEXT:
{clientData}
`,

  'offer-statistics': `
You are drafting the "Offer Statistics" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY a markdown table

CONTENT REQUIREMENTS:
- Offer price
- Shares offered
- Gross proceeds
- Offer costs
- Net proceeds
- Shares post-offer
- Market capitalisation
- AUD formatting

CLIENT CONTEXT:
{clientData}
`,

  'business-highlights': `
You are drafting the "Business & Financial Highlights" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY bullet points
- 5–8 bullets

CONTENT REQUIREMENTS:
- Revenue and growth metrics
- Customer and retention data
- Product or technology milestones
- Market position
- Partnerships or certifications
- Quantified where possible

CLIENT CONTEXT:
{clientData}
`,

  // ==================== OFFER DETAILS ====================
  'terms-conditions': `
You are drafting the "Terms and Conditions" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY section text
- No headings or lists

CONTENT REQUIREMENTS:
- Offer structure and pricing
- Eligibility criteria
- Min/max applications
- Payment methods
- Binding nature
- Company discretion
- Reference Application Form
- 3–5 paragraphs

CLIENT CONTEXT:
{clientData}
`,

  'application-process': `
You are drafting the "Application Process" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY instructional text

CONTENT REQUIREMENTS:
- Step-by-step application process
- Submission methods
- Payment requirements
- Share registry details
- Post-submission process
- 3–4 paragraphs

CLIENT CONTEXT:
{clientData}
`,

  'allocation-policy': `
You are drafting the "Allocation Policy" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY section text

CONTENT REQUIREMENTS:
- Allocation methodology
- Priority rules
- Oversubscription and scale-back
- Notification and refunds
- Fairness emphasis
- 2–3 paragraphs

CLIENT CONTEXT:
{clientData}
`,

  'asx-listing': `
You are drafting the "ASX Listing" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY section text

CONTENT REQUIREMENTS:
- ASX application timing
- Listing conditions
- Expected quotation
- Trading conditions
- Consequences of non-listing
- 2–3 paragraphs

CLIENT CONTEXT:
{clientData}
`,

  'underwriting': `
You are drafting the "Underwriting Agreements" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY section text

CONTENT REQUIREMENTS:
- Underwriter identity
- Underwritten amount
- Fees and commissions
- Termination rights
- Sub-underwriting if any
- Investor certainty message
- 3–4 paragraphs

CLIENT CONTEXT:
{clientData}
`,

  // ==================== COMPANY OVERVIEW ====================
  'company-history': `
You are drafting the "Company History & Business Model" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY narrative text

CONTENT REQUIREMENTS:
- Founding and milestones
- Business model evolution
- Revenue model
- Geographic presence
- Customer segments
- Value proposition
- Competitive position
- 4–6 paragraphs

CLIENT CONTEXT:
{clientData}
`,

  'industry-context': `
You are drafting the "Industry Context" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY narrative text

CONTENT REQUIREMENTS:
- Industry definition
- Market size and growth
- Trends and drivers
- Regulatory environment
- Competitive landscape
- Company positioning
- Outlook
- 4–5 paragraphs

CLIENT CONTEXT:
{clientData}
`,

  'products-services': `
You are drafting the "Products and Services" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY section text

CONTENT REQUIREMENTS:
- Detailed product/service descriptions
- Target customers
- Features and benefits
- Pricing models
- Differentiation
- Integration and roadmap
- 5–7 paragraphs or structured by product

CLIENT CONTEXT:
{clientData}
`,

  // ==================== FINANCIAL INFORMATION ====================
  'historical-financials': `
You are drafting the "Audited Historical Statements" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY markdown tables
- No narrative outside tables

CONTENT REQUIREMENTS:
- 3-year revenue, EBITDA, NPAT
- Growth rates
- Margins
- Cash flow summary
- Balance sheet highlights
- Audit status noted

CLIENT CONTEXT:
{clientData}
`,

  'pro-forma': `
You are drafting the "Pro-forma Financials" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY markdown tables and notes

CONTENT REQUIREMENTS:
- Pre/post IPO comparison
- Cash impact
- Equity changes
- Transaction costs
- Debt position
- Assumptions disclosed

CLIENT CONTEXT:
{clientData}
`,

  'management-analysis': `
You are drafting the "Management Discussion & Analysis" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY narrative text

CONTENT REQUIREMENTS:
- Revenue and cost drivers
- Margin trends
- Cash flow
- KPIs
- Capital allocation
- Risks and outlook
- 5–8 paragraphs

CLIENT CONTEXT:
{clientData}
`,

  // ==================== KEY RISKS ====================
  'company-risks': `
You are drafting the "Company-Specific Risks" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY structured risk entries in formatted markdown
- No extraneous text
- No JSON or lists

CONTENT REQUIREMENTS:
- 8–12 company-specific risks
- Each with heading and description
- Impact clearly stated
- Honest, compliant tone

CLIENT CONTEXT:
{clientData}
`,

  'industry-risks': `
You are drafting the "Industry-Related Risks" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY structured risk entries in formatted markdown
- No extraneous text
- No JSON or lists

CONTENT REQUIREMENTS:
- 6–10 industry risks
- Competitive, regulatory, technology risks
- Company impact explained

CLIENT CONTEXT:
{clientData}
`,

  'market-risks': `
You are drafting the "General Market Risks" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY structured risk entries in formatted markdown
- No extraneous text
- No JSON or lists

CONTENT REQUIREMENTS:
- Economic, liquidity, volatility risks
- Dilution and dividend risks
- Force majeure
- 6–8 risks

CLIENT CONTEXT:
{clientData}
`,

  'climate-risks': `
You are drafting the "Climate-Related Risks" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY narrative text

CONTENT REQUIREMENTS:
- Physical risks
- Transition risks
- Regulatory risks
- Supply chain impacts
- TCFD-aligned
- 3–4 paragraphs

CLIENT CONTEXT:
{clientData}
`,

  // ==================== DIRECTORS & MANAGEMENT ====================
  'biographical-info': `
You are drafting the "Biographical Information" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY biographies

CONTENT REQUIREMENTS:
- Role, qualifications, experience
- Career history
- Skills and relevance
- 4–6 sentences per person

CLIENT CONTEXT:
{clientData}
`,

  'interests-benefits': `
You are drafting the "Interests and Benefits" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY disclosure text and tables

CONTENT REQUIREMENTS:
- Shareholdings
- Options and rights
- Remuneration
- Indemnities and insurance
- Related party interests

CLIENT CONTEXT:
{clientData}
`,

  'corporate-governance': `
You are drafting the "Corporate Governance Statement" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY narrative text

CONTENT REQUIREMENTS:
- ASX CG Principles alignment
- Board structure
- Committees
- Risk management
- Diversity and disclosure
- 4–6 paragraphs

CLIENT CONTEXT:
{clientData}
`,

  // ==================== ADDITIONAL INFORMATION ====================
  'material-contracts': `
You are drafting the "Material Contracts" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY section text

CONTENT REQUIREMENTS:
- Contract parties
- Key terms
- Duration and termination
- Financial impact
- Materiality explanation

CLIENT CONTEXT:
{clientData}
`,

  'legal-proceedings': `
You are drafting the "Legal Proceedings" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY section text

CONTENT REQUIREMENTS:
- Current or past litigation
- Regulatory matters
- Financial exposure
- If none, explicit statement

CLIENT CONTEXT:
{clientData}
`,

  'consents': `
You are drafting the "Consents" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY structured consent statements

CONTENT REQUIREMENTS:
- Adviser names
- Consent confirmations
- Non-withdrawal confirmation

CLIENT CONTEXT:
{clientData}
`,

  // ==================== GLOSSARY ====================
  'key-terms': `
You are drafting the "Key Terms" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY glossary entries

CONTENT REQUIREMENTS:
- Alphabetical
- Plain English
- Legal and financial terms
- 1–2 sentences per term

CLIENT CONTEXT:
{clientData}
`,

  'technical-definitions': `
You are drafting the "Technical Definitions" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY definitions

CONTENT REQUIREMENTS:
- Industry and technical terms
- Investor-accessible explanations
- 2–3 sentences per term

CLIENT CONTEXT:
{clientData}
`,

  // ==================== CORPORATE DIRECTORY ====================
  'company-contacts': `
You are drafting the "Company Contacts" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY contact information

CONTENT REQUIREMENTS:
- Registered office
- Principal place of business
- Phone, email, website
- Share registry
- Investor relations

CLIENT CONTEXT:
{clientData}
`,

  'advisers': `
You are drafting the "Professional Advisers" section.

OUTPUT CONSTRAINT (STRICT):
- Output ONLY adviser listings

CONTENT REQUIREMENTS:
- Firm names
- Roles
- Contact details
- Structured format

CLIENT CONTEXT:
{clientData}
`,
};


export function isValidProspectusSection(value?: string): value is ProspectusSectionTypes {
  const validSections: ProspectusSectionTypes[] = [
    // Important Notices
    'disclaimer', 'expiry-date', 'general-advice',
    // Investment Overview
    'the-issuer', 'purpose-offer', 'key-dates', 'offer-statistics', 'business-highlights',
    // Offer Details
    'terms-conditions', 'application-process', 'allocation-policy', 'asx-listing', 'underwriting',
    // Company Overview
    'company-history', 'industry-context', 'products-services',
    // Financial Information
    'historical-financials', 'pro-forma', 'management-analysis',
    // Key Risks
    'company-risks', 'industry-risks', 'market-risks', 'climate-risks',
    // Directors & Management
    'biographical-info', 'interests-benefits', 'corporate-governance',
    // Additional Information
    'material-contracts', 'legal-proceedings', 'consents',
    // Glossary
    'key-terms', 'technical-definitions',
    // Corporate Directory
    'company-contacts', 'advisers'
  ];

  return typeof value === 'string' && validSections.includes(value as ProspectusSectionTypes);
}