import { EligibilityStatus, IntermediaryType, UserRole } from "@prisma/client";

export interface Organisation {
  orgType: "sme" | "intermediary";
  organisationName: string;
  organisationImage: string;
}

export interface SWE {
  id: string;
  userId: string;
  companyName: string;
  acn: string;
  abn: string;
  paygWithholding: boolean;
  gstRegistered: boolean;
  gstEffectiveDate: Date;
  paidUpCapital: number;
  turnover: number;
  netWorth: number;
  last3YearsRevenue: {
    year: number;
    revenue: number;
  }[];
  companyType: string;
  stateOfRegistration: string;
  incorporationDate: Date;
  asicRegistration: string;
  austracRegistered: boolean;
  chessHin: string;
  yearsOperational: number;
  industrySector: string;
  eligibilityStatus: EligibilityStatus;
}

export interface Intermediary {
  id: string;
  userId: string;
  firmName: string;
  type: IntermediaryType;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserBackendSession {
  access_token: string;
  token_type: string;
}

export type Plan = "basic" | "growth" | "corporate";

export enum PlanToPriceId {
  basic = "price_1RnFsDSEouEcSyI0OwEFfHUg",
  growth = "price_1RnFsXSEouEcSyI0HhuBLnbh",
  corporate = "not_a_product", // Placeholder for free trial
}

export enum PriceToPlan {
  "price_1RnFsDSEouEcSyI0OwEFfHUg" = "basic",
  "price_1RnFsXSEouEcSyI0HhuBLnbh" = "growth",
  "not_a_product" = "corporate", // Placeholder for free trial
}

// Required documents for each category
export const documentCategories = [
  {
    name: "Corporate Structure",
    required: [
      "Company Constitution",
      "Corporate Structure Chart",
      "Board Resolution Constitution",
      "Board Resolution ASX Contact",
    ],
    optional: [],
  },
  {
    name: "Financial Documents",
    required: [
      "Audited Financial Statements",
      "Pro Forma Statement Of Financial Position",
      "Investigating Accountants Report",
      "Working Capital Statement",
    ],
    optional: [],
  },
  {
    name: "Market Integrity",
    required: [
      "Shareholder Spread Analysis Report",
      "Free Float Analysis",
      "Related Parties And Promoters List",
    ],
    optional: [],
  },
  {
    name: "Governance & Personnel",
    required: [
      "Director Consent Forms",
      "Director Questionnaires",
      "Police And Bankruptcy Checks",
      "ASX Listing Rule Course Certificate",
      "Securities Trading Policy",
      "Corporate Governance Statement",
      "Board And Committee Charters",
    ],
    optional: [],
  },
  {
    name: "Escrow & Restricted Securities",
    required: [
      "Executed Restriction Deeds",
    ],
    optional: [],
  },
  {
    name: "The Offer",
    required: [
      "Final Prospectus Document",
      "Due Diligence Committee Documents",
      "Expert Consent Letters",
    ],
    optional: [],
  },
  {
    name: "Capital Structure",
    required: [
      "Option And Performance Right Terms",
      "Company Option Security Register",
    ],
    optional: [],
  },
  {
    name: "Legal & Agreements",
    required: [
      "Legal Due Diligence Report",
      "Summary Of Material Contracts",
      "Related Party Agreements",
      "Advisor Mandates",
    ],
    optional: [],
  },
  {
    name: "Asset Ownership & Tax",
    required: [
      "Asset Title Documents",
      "IP Assignment Deeds",
      "Specialist Tax Due Diligence Report",
      "Company Tax Returns",
    ],
    optional: [],
  },
  // {
  //   name: "Sector-Specific",
  //   required: [
  //     "Independent Geologists Report",
  //     "Therapeutic Goods Administration Approvals",
  //     "Australian Financial Services Licence",
  //   ],
  //   optional: [],
  // },
  {
    name: "Legacy / Generic Documents",
    required: [
      "Certificate Of Incorporation",
      "Memorandum Of Association",
      "Articles Of Association",
    ],
    optional: [
      "Shareholder Agreements",
      "Intellectual Property Documents",
      "Tax Compliance Certificates",
      "Regulatory Approvals",
    ],
  },
];

