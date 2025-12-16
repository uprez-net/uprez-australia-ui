import { Badge } from "@/components/ui/badge";
import { DocumentType } from "@prisma/client";
import { ProfessionPerDocumentType } from "@/app/interface/interface";
import {
  Scale,
  Briefcase,
  Calculator,
  ShieldCheck,
  Landmark,
  Users,
  FileText,
} from "lucide-react";

interface ProfessionBadgeProps {
  documentType: DocumentType;
}

// -----------------------------
// Profession → Icon + Color map
// -----------------------------
const PROFESSION_META: Record<
  string,
  { icon: React.ElementType; className: string }
> = {
  "Corporate Lawyer": {
    icon: Scale,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  "Company Secretary": {
    icon: Landmark,
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  "Chartered Accountant": {
    icon: Calculator,
    className: "bg-green-100 text-green-800 border-green-200",
  },
  "Registered Auditor": {
    icon: Calculator,
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  "Investigating Accountant (Audit Firm)": {
    icon: Calculator,
    className: "bg-lime-100 text-lime-800 border-lime-200",
  },
  "Financial Advisor": {
    icon: Briefcase,
    className: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  "Investment Banker": {
    icon: Briefcase,
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  "Corporate Advisor": {
    icon: Users,
    className: "bg-violet-100 text-violet-800 border-violet-200",
  },
  "Compliance Consultant": {
    icon: ShieldCheck,
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  "Legal Advisor": {
    icon: Scale,
    className: "bg-sky-100 text-sky-800 border-sky-200",
  },
  "Risk & Compliance Consultant": {
    icon: ShieldCheck,
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  "Governance Consultant": {
    icon: Landmark,
    className: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  },
  "Share Registry Consultant": {
    icon: Users,
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
  "Share Registry Provider": {
    icon: Users,
    className: "bg-pink-100 text-pink-800 border-pink-200",
  },
  "IP Lawyer": {
    icon: Scale,
    className: "bg-teal-100 text-teal-800 border-teal-200",
  },
  "Property Lawyer": {
    icon: Scale,
    className: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  "Tax Advisor": {
    icon: Calculator,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  "Tax Agent": {
    icon: Calculator,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  "Management Consultant": {
    icon: Briefcase,
    className: "bg-neutral-100 text-neutral-800 border-neutral-200",
  },
  "Strategy Advisor": {
    icon: Briefcase,
    className: "bg-neutral-100 text-neutral-800 border-neutral-200",
  },
  "Regulatory Consultant": {
    icon: ShieldCheck,
    className: "bg-stone-100 text-stone-800 border-stone-200",
  },
  "Regulatory Affairs Consultant": {
    icon: ShieldCheck,
    className: "bg-stone-100 text-stone-800 border-stone-200",
  },
  "AFSL Compliance Consultant": {
    icon: ShieldCheck,
    className: "bg-red-100 text-red-800 border-red-200",
  },
  "Financial Services Lawyer": {
    icon: Scale,
    className: "bg-red-100 text-red-800 border-red-200",
  },
  "Independent Geologist": {
    icon: FileText,
    className: "bg-brown-100 text-brown-800 border-brown-200",
  },
  "Mining Consultant": {
    icon: FileText,
    className: "bg-brown-100 text-brown-800 border-brown-200",
  },
  "ASX-Accredited Training Provider": {
    icon: FileText,
    className: "bg-slate-100 text-slate-800 border-slate-200",
  },
  "Equity Incentive Specialist": {
    icon: Briefcase,
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  "Technical Expert": {
    icon: FileText,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  "Lead Manager": {
    icon: Briefcase,
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  "Corporate Law Firm": {
    icon: Scale,
    className: "bg-blue-200 text-blue-900 border-blue-300",
  },
};

const DEFAULT_META = {
  icon: FileText,
  className: "bg-muted text-muted-foreground",
};

export function ProfessionBadge({ documentType }: ProfessionBadgeProps) {
  const professionString =
    ProfessionPerDocumentType[documentType] || "General Professional";

  // Split by '/' and clean values
  const professions = professionString
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2">
      {professions.map((profession) => {
        const meta = PROFESSION_META[profession] || DEFAULT_META;
        const Icon = meta.icon;

        return (
          <Badge
            key={profession}
            variant="outline"
            className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${meta.className}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {profession}
          </Badge>
        );
      })}
    </div>
  );
}
