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
  'disclaimer': `You are drafting the ASIC Disclaimer section for an Australian prospectus.

REQUIREMENTS:
- Must comply with Corporations Act 2001 requirements
- State that ASIC takes no responsibility for prospectus contents
- Clearly indicate ASIC does not verify compliance
- Use formal, legally precise language
- Keep concise (2-3 sentences)

CLIENT CONTEXT:
{clientData}

Generate the ASIC disclaimer text ensuring regulatory compliance.`,

  'expiry-date': `You are drafting the Prospectus Expiry section.

REQUIREMENTS:
- Calculate expiry as 13 months from lodgment date
- Clearly state no securities will be issued after expiry
- Include specific expiry date
- Reference lodgment with ASIC
- Use clear, unambiguous language

CLIENT CONTEXT:
{clientData}

Extract the lodgment date and generate the expiry notice.`,

  'general-advice': `You are drafting the General Advice Warning for the prospectus.

REQUIREMENTS:
- State information is general in nature
- Warn it doesn't consider personal circumstances
- Advise readers to consider their own situation
- Recommend seeking professional advice if needed
- Use accessible language while remaining formal
- Length: 3-4 sentences

CLIENT CONTEXT:
{clientData}

Generate a comprehensive general advice warning.`,

  // ==================== INVESTMENT OVERVIEW ====================
  'the-issuer': `You are drafting "The Issuer" section providing core company identification.

REQUIREMENTS:
- Full legal company name with ACN
- Incorporation date and jurisdiction
- Registered office location
- Business classification/sector
- Brief one-line description of core business
- Formal, factual tone
- Length: 2-3 sentences

CLIENT CONTEXT:
{clientData}

Extract company registration details and provide a concise issuer identification.`,

  'purpose-offer': `You are drafting the "Purpose of the Offer" section.

REQUIREMENTS:
- Clear statement of how funds will be used
- Breakdown by category with percentages
- Specific initiatives for each category
- Align with business strategy
- Show value proposition to investors
- Include: product development, market expansion, acquisitions, working capital
- Length: 3-4 sentences with percentage breakdown

CLIENT CONTEXT:
{clientData}

Analyze the client's strategic plans and funding requirements to generate the use of proceeds breakdown.`,

  'key-dates': `You are drafting the "Key Dates" section as a structured table.

REQUIREMENTS:
- Prospectus lodgment date
- Offer opening date
- Offer closing date
- Expected allotment date
- Expected dispatch of holding statements
- Expected ASX quotation date
- Format as markdown table with dates
- Include timezone (AEDT/AEST)
- Note dates are indicative and subject to change

CLIENT CONTEXT:
{clientData}

Extract timeline information and generate a comprehensive key dates table.`,

  'offer-statistics': `You are drafting the "Offer Statistics" section as a structured table.

REQUIREMENTS:
- Offer price per share
- Number of shares offered
- Total funds to be raised (before costs)
- Estimated offer costs
- Net proceeds
- Shares on issue post-offer
- Estimated market capitalization
- Format as markdown table
- All amounts in AUD with proper formatting

CLIENT CONTEXT:
{clientData}

Extract financial offer details and generate the offer statistics table.`,

  'business-highlights': `You are drafting the "Business & Financial Highlights" section.

REQUIREMENTS:
- 5-8 bullet points highlighting key achievements
- Include revenue growth metrics
- Customer base and retention statistics
- Product/technology milestones
- Market position indicators
- Award recognitions or certifications
- Strategic partnerships
- Employee growth or key hires
- Each point should be specific and quantified where possible

CLIENT CONTEXT:
{clientData}

Analyze client achievements and generate compelling business highlights.`,

  // ==================== OFFER DETAILS ====================
  'terms-conditions': `You are drafting the "Terms and Conditions" section.

REQUIREMENTS:
- Clearly state offer terms (shares, price, total amount)
- Eligibility criteria for applicants
- Minimum and maximum application amounts
- Payment methods accepted
- Binding nature of applications
- Company's rights regarding acceptance
- Reference to Application Form
- Formal legal tone
- Length: 3-5 paragraphs

CLIENT CONTEXT:
{clientData}

Generate comprehensive terms and conditions for the share offer.`,

  'application-process': `You are drafting the "Application Process" section.

REQUIREMENTS:
- Step-by-step application instructions
- How to complete Application Form
- Where to submit applications (online/mail)
- Payment requirements and methods
- Share Registry contact details
- Processing timeline expectations
- What happens after submission
- Clear, instructional tone
- Length: 3-4 paragraphs

CLIENT CONTEXT:
{clientData}

Create clear application process instructions for potential investors.`,

  'allocation-policy': `You are drafting the "Allocation Policy" section.

REQUIREMENTS:
- Explain allocation methodology
- Priority allocation rules if applicable
- Company's discretion parameters
- Oversubscription procedures
- Scale-back provisions
- Notification process for applicants
- Refund procedures for unsuccessful applications
- Fair and transparent approach
- Length: 2-3 paragraphs

CLIENT CONTEXT:
{clientData}

Generate the share allocation policy ensuring fairness and clarity.`,

  'asx-listing': `You are drafting the "ASX Listing" section.

REQUIREMENTS:
- Application timeline to ASX (within 7 days)
- Listing conditions and requirements
- Expected quotation commencement
- Trading conditions
- ASX ticker code if determined
- Reference to ASX Listing Rules compliance
- Consequences if listing not achieved
- Length: 2-3 paragraphs

CLIENT CONTEXT:
{clientData}

Generate ASX listing information and conditions.`,

  'underwriting': `You are drafting the "Underwriting Agreements" section.

REQUIREMENTS:
- Underwriter identification
- Underwriting amount and percentage
- Key terms of underwriting agreement
- Fees and commissions
- Termination events
- Sub-underwriting arrangements if applicable
- Provide certainty message to investors
- Length: 3-4 paragraphs

CLIENT CONTEXT:
{clientData}

Extract underwriting details and generate comprehensive disclosure.`,

  // ==================== COMPANY OVERVIEW ====================
  'company-history': `You are drafting the "Company History & Business Model" section.

REQUIREMENTS:
- Founding story and year
- Key milestones in company development
- Evolution of business model
- Current business model explanation (SaaS, licensing, etc.)
- Geographic presence
- Customer segments served
- Value proposition
- Competitive positioning
- Engaging narrative style while remaining factual
- Length: 4-6 paragraphs

CLIENT CONTEXT:
{clientData}

Create a compelling company history and business model description.`,

  'industry-context': `You are drafting the "Industry Context" section.

REQUIREMENTS:
- Industry definition and scope
- Market size and growth projections
- Key industry trends and drivers
- Technological developments
- Regulatory environment
- Competitive landscape overview
- Where company fits in industry
- Future outlook
- Data-driven with credible sources
- Length: 4-5 paragraphs

CLIENT CONTEXT:
{clientData}

Analyze industry positioning and generate comprehensive industry context.`,

  'products-services': `You are drafting the "Products and Services" section.

REQUIREMENTS:
- Detailed description of each product/service offering
- Target customers for each offering
- Key features and benefits
- Pricing model overview
- Differentiation from competitors
- Integration capabilities
- Customer success examples
- Product roadmap hints if relevant
- Technical depth appropriate for investors
- Length: 5-7 paragraphs (or structured by product)

CLIENT CONTEXT:
{clientData}

Generate comprehensive product and services descriptions.`,

  // ==================== FINANCIAL INFORMATION ====================
  'historical-financials': `You are drafting the "Audited Historical Statements" section.

REQUIREMENTS:
- 3-year financial performance tables
- Revenue by year with growth rates
- EBITDA and net profit metrics
- Gross margin percentages
- Cash flow summaries
- Balance sheet highlights
- Key financial ratios
- Format as markdown tables
- Include year-over-year percentage changes
- Note audit status
- Professional financial reporting tone

CLIENT CONTEXT:
{clientData}

Extract historical financial data and create comprehensive financial tables.`,

  'pro-forma': `You are drafting the "Pro-forma Financials" section.

REQUIREMENTS:
- Pro-forma balance sheet post-IPO
- Impact of offer proceeds on cash position
- Impact on equity structure
- Adjustments for transaction costs
- Debt levels post-transaction
- Working capital position
- Format as markdown table
- Include assumptions and notes
- Show before/after comparison

CLIENT CONTEXT:
{clientData}

Generate pro-forma financial statements showing IPO impact.`,

  'management-analysis': `You are drafting the "Management Discussion & Analysis" section.

REQUIREMENTS:
- Revenue drivers and trends
- Cost structure evolution
- Margin analysis and trends
- Cash flow generation capability
- Key performance indicators (KPIs)
- Seasonality factors if applicable
- Capital allocation priorities
- Future growth outlook
- Risks to financial performance
- Management's strategic initiatives
- Conversational yet professional tone
- Length: 5-8 paragraphs

CLIENT CONTEXT:
{clientData}

Create insightful management discussion and analysis of financial performance.`,

  // ==================== KEY RISKS ====================
  'company-risks': `You are drafting the "Company-Specific Risks" section.

REQUIREMENTS:
- 8-12 specific risks unique to the company
- Key person dependencies
- Technology and IP risks
- Customer concentration risks
- Operational risks
- Cybersecurity and data risks
- Product development risks
- Each risk should have:
  * Clear heading
  * Description of risk (2-3 sentences)
  * Potential impact
- Honest and transparent disclosure
- Regulatory-compliant tone
- Format as structured list with headings

CLIENT CONTEXT:
{clientData}

Identify and describe company-specific risks comprehensively.`,

  'industry-risks': `You are drafting the "Industry-Related Risks" section.

REQUIREMENTS:
- 6-10 industry-level risks
- Competitive intensity risks
- Technological disruption risks
- Market adoption risks
- Regulatory change risks
- Supplier/partner risks
- Industry consolidation risks
- Each risk with clear description
- How risks could impact company
- Industry context provided
- Format as structured list

CLIENT CONTEXT:
{clientData}

Analyze industry dynamics and generate comprehensive risk disclosures.`,

  'market-risks': `You are drafting the "General Market Risks" section.

REQUIREMENTS:
- Economic downturn risks
- Share price volatility
- Liquidity of shares
- Dividend policy risks
- Dilution risks
- Force majeure events
- Currency/interest rate risks if applicable
- Standard investment risks
- Each clearly explained for retail investors
- 6-8 key market risks
- Format as structured list

CLIENT CONTEXT:
{clientData}

Generate comprehensive general market and investment risk disclosures.`,

  'climate-risks': `You are drafting the "Climate-Related Risks" section.

REQUIREMENTS:
- Physical climate risks (extreme weather, etc.)
- Transition risks (policy, technology, market)
- Reputation risks related to climate
- Supply chain climate impacts
- Energy cost and availability risks
- Regulatory compliance with climate disclosure
- Company's climate strategy context
- Materiality assessment
- Forward-looking statements
- Length: 3-4 paragraphs

CLIENT CONTEXT:
{clientData}

Assess climate-related risks in accordance with TCFD framework.`,

  // ==================== DIRECTORS & MANAGEMENT ====================
  'biographical-info': `You are drafting the "Biographical Information" section.

REQUIREMENTS:
- For each director and executive:
  * Full name and title
  * Age (optional)
  * Professional qualifications
  * Career history (key roles chronologically)
  * Relevant industry experience
  * Board committee memberships
  * Other current directorships
  * Skills and expertise
  * Why qualified for role
- Professional biographical style
- 4-6 sentences per person
- Highlight diversity of skills

CLIENT CONTEXT:
{clientData}

Extract leadership information and create professional biographies.`,

  'interests-benefits': `You are drafting the "Interests and Benefits" section.

REQUIREMENTS:
- Current shareholdings table (pre and post-IPO)
- Options and rights held
- Remuneration summary table
- Indemnity and insurance arrangements
- Related party transactions
- Service agreements summary
- Interests in contracts
- Format as markdown tables where appropriate
- Transparent disclosure
- Regulatory compliance focus

CLIENT CONTEXT:
{clientData}

Generate comprehensive disclosure of directors' interests and benefits.`,

  'corporate-governance': `You are drafting the "Corporate Governance Statement" section.

REQUIREMENTS:
- Commitment to ASX Corporate Governance Principles
- Board composition and independence
- Board committees (Audit, Remuneration, Nomination)
- Risk management framework
- Diversity policy
- Trading policy
- Continuous disclosure policy
- Shareholder communication policy
- Where practices differ from recommendations
- How governance supports company
- Length: 4-6 paragraphs

CLIENT CONTEXT:
{clientData}

Create comprehensive corporate governance statement.`,

  // ==================== ADDITIONAL INFORMATION ====================
  'material-contracts': `You are drafting the "Material Contracts" section.

REQUIREMENTS:
- For each material contract:
  * Contract type and parties
  * Key commercial terms
  * Duration and termination rights
  * Material obligations
  * Financial implications
  * Why material to business
- Customer contracts
- Supplier agreements
- Partnership agreements
- IP licenses
- Facility leases
- Banking facilities
- Confidentiality balanced with disclosure
- Length: 4-6 paragraphs or structured by contract

CLIENT CONTEXT:
{clientData}

Identify and describe material contracts affecting the business.`,

  'legal-proceedings': `You are drafting the "Legal Proceedings" section.

REQUIREMENTS:
- Current litigation summary
- Historical material litigation
- Regulatory investigations
- Financial exposure and provisions
- Management's assessment
- Insurance coverage
- Impact on business operations
- If none: clear statement of no material proceedings
- Transparent disclosure
- Legal precision
- Length: 2-4 paragraphs

CLIENT CONTEXT:
{clientData}

Disclose any material legal proceedings or state their absence.`,

  'consents': `You are drafting the "Consents" section.

REQUIREMENTS:
- List each adviser (auditors, lawyers, underwriters, etc.)
- State consent to inclusion of statements
- Consent to prospectus distribution form
- Note advisers not involved in offer promotion
- Confirmation of consent not withdrawn
- Format as structured list
- Formal regulatory compliance tone

CLIENT CONTEXT:
{clientData}

Generate comprehensive adviser consent statements.`,

  // ==================== GLOSSARY ====================
  'key-terms': `You are drafting the "Key Terms" section.

REQUIREMENTS:
- Alphabetical list of defined terms
- Clear, concise definitions
- Include: ASIC, ACN, ASX, EBITDA, Prospectus, Offer, Shares, etc.
- Company-specific terms
- Legal and regulatory terms
- Financial terms
- Format as markdown list or table
- Each definition 1-2 sentences
- Plain English where possible

CLIENT CONTEXT:
{clientData}

Generate comprehensive glossary of key terms used in prospectus.`,

  'technical-definitions': `You are drafting the "Technical Definitions" section.

REQUIREMENTS:
- Industry-specific technical terms
- Technology terminology
- Product-related terms
- Business model terms
- More detailed than key terms glossary
- Accessible explanations for investors
- Examples where helpful
- 2-3 sentences per term
- Organized by category if extensive

CLIENT CONTEXT:
{clientData}

Create detailed technical definitions relevant to the business.`,

  // ==================== CORPORATE DIRECTORY ====================
  'company-contacts': `You are drafting the "Company Contacts" section.

REQUIREMENTS:
- Registered office address
- Principal place of business
- Postal address
- Phone number
- Email address
- Website
- Share registry details
- Investor relations contact
- Format clearly with labels
- Accurate and current

CLIENT CONTEXT:
{clientData}

Extract and format company contact information.`,

  'advisers': `You are drafting the "Professional Advisers" section.

REQUIREMENTS:
- Legal advisers (Australian and international)
- Auditors
- Lead manager/underwriter
- Share registry
- Tax advisers
- Any other material advisers
- For each: Firm name, contact person, address, phone
- Format as structured list or table
- Professional presentation

CLIENT CONTEXT:
{clientData}

List all professional advisers with complete contact details.`,
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