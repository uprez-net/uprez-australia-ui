import { EligibilityStatus, IntermediaryType, UserRole, Comments } from "@prisma/client";

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
    name: "Corporate Governance & Formation",
    required: [
      "Company Constitution",
      "Corporate Structure Chart",
      "Corporate Governance Statement",
      "Securities Trading Policy",
      "Board And Committee Charters",
    ],
    optional: [],
  },
  {
    name: "Financial Reporting & Analysis",
    required: [
      "Audited Financial Statements",
      "Pro Forma Statement Of Financial Position",
      "Investigating Accountants Report",
      "Working Capital Statement",
      "Regulatory Approvals",
    ],
    optional: [],
  },
  {
    name: "Shareholders & Related Parties Information",
    required: [
      "Shareholder Spread Analysis Report",
      "Related Parties And Promoters List",
      "Executed Restriction Deeds",
      "Escrow Agreements",
      "Share Register Analysis"
    ],
    optional: [],
  },
  {
    name: "Directors & Officers Compliance",
    required: [
      "Director Questionnaires",
      "Police And Bankruptcy Checks",
      "Bankruptcy Register Searches",
      "Board Resolution ASX Contact",
    ],
    optional: [],
  },
  {
    name: "Current Capitalisation Table",
    required: [
      "Capitalisation Table",
    ],
    optional: [],
    isIPO: true
  },
  {
    name: "Company Narative & Growth Strategy",
    required: [
      "Investor Presentation Pitch Deck",
      "Formal Business Plan",
      "Information Memorandum",
    ],
    optional: [],
    isIPO: true
  },
  {
    name: "Risk Management & Due Diligence",
    required: [
      "Internal Risk Register",
      "Due Diligence Questionnaire",
      "Board Meeting Minutes",
    ],
    optional: [],
    isIPO: true
  }
];

export interface ProspectusSection {
  id: string
  title: string
  icon: string
  subsections: ProspectusSubsection[]
}

export interface ProspectusSubsection {
  id: string
  title: string
  content: string
  contentType: "text" | "table" | "chart" | "list"
}

export interface Prospectus {
  id: string
  version: number
  sections: ProspectusSection[]
  comments: CommentsExtended[]
  createdBy: string
  createdAt: string
}

export interface CommentsExtended extends Comments {
  name: string
  role: UserRole
}

export interface CommentNode extends CommentsExtended {
  replies: CommentNode[]
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

export type IndustrySectorValue =
  | "agriculture"
  | "manufacturing"
  | "automotive"
  | "chemicals"
  | "construction"
  | "consumer_goods"
  | "education"
  | "electronics"
  | "energy"
  | "financial_services"
  | "food_processing"
  | "healthcare"
  | "hospitality"
  | "information_technology"
  | "logistics"
  | "media"
  | "mining"
  | "retail"
  | "telecommunications"
  | "textiles"
  | "other";

export const industrySubSectors: Record<IndustrySectorValue, string[]> = {
  agriculture: [
    "Crop Farming",
    "Dairy & Poultry",
    "Fisheries",
    "Agricultural Machinery",
    "Organic Farming",
  ],

  manufacturing: [
    "Light Engineering",
    "Heavy Machinery",
    "Plastic Products",
    "Metal Fabrication",
    "Packaging",
  ],

  automotive: [
    "Auto Components",
    "EV Components",
    "Two-Wheeler Manufacturing",
    "Commercial Vehicles",
  ],

  chemicals: [
    "Specialty Chemicals",
    "Agrochemicals",
    "Industrial Gases",
    "Paints & Coatings",
  ],

  construction: [
    "Residential Construction",
    "Commercial Construction",
    "Infrastructure",
    "Building Materials",
    "Interior & Fit-outs",
  ],

  consumer_goods: [
    "FMCG",
    "Home Essentials",
    "Personal Care",
    "Consumer Electronics",
  ],

  education: [
    "EdTech",
    "Coaching & Test Prep",
    "Skill Development",
    "Higher Education Services",
  ],

  electronics: [
    "Consumer Electronics",
    "PCB Manufacturing",
    "Semiconductor Design",
    "Embedded Systems",
  ],

  energy: [
    "Solar Power",
    "Wind Energy",
    "Thermal Power",
    "Energy Storage",
  ],

  financial_services: [
    "NBFC",
    "FinTech",
    "Insurance Services",
    "Wealth Management",
    "Microfinance",
  ],

  food_processing: [
    "Dairy Processing",
    "Frozen Foods",
    "Packaged Foods",
    "Beverages",
    "Spices & Condiments",
  ],

  healthcare: [
    "Pharmaceuticals",
    "Medical Devices",
    "Diagnostics",
    "Hospitals & Clinics",
    "HealthTech",
  ],

  hospitality: [
    "Hotels & Resorts",
    "Travel Agencies",
    "Restaurants & Cafes",
    "Event Management",
  ],

  information_technology: [
    "Software Development",
    "SaaS",
    "IT Consulting",
    "Cloud Services",
    "Cybersecurity",
  ],

  logistics: [
    "Warehousing",
    "Cold Chain Logistics",
    "Freight Forwarding",
    "Last-Mile Delivery",
  ],

  media: [
    "Digital Media",
    "Film & Television",
    "Advertising",
    "Content Creation",
  ],

  mining: [
    "Coal Mining",
    "Iron Ore",
    "Mineral Processing",
    "Stone & Aggregates",
  ],

  retail: [
    "Brick & Mortar Retail",
    "E-commerce",
    "Wholesale Trading",
    "D2C Brands",
  ],

  telecommunications: [
    "Internet Service Providers",
    "Network Infrastructure",
    "Mobile Services",
    "Satellite Communications",
  ],

  textiles: [
    "Apparel Manufacturing",
    "Technical Textiles",
    "Garment Export",
    "Yarn & Fabric",
  ],

  other: [
    "Miscellaneous Services",
    "Trading",
    "Consulting",
    "Uncategorized",
  ],
};
