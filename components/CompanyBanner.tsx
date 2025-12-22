import {
  Building2,
  Clock,
  FileText,
  DollarSign,
  Calendar,
  Factory,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ComplianceStatus, EligibilityStatus } from "@prisma/client";
import { CompanyLogo } from "./company-logo";
import {
  australianStates,
  companyTypes,
  industrySectors,
} from "./business-details-form";
import { cn } from "@/lib/utils";

const getEligibilityStatusConfig = (status: EligibilityStatus) => {
  switch (status) {
    case "Mainboard_Eligible":
      return {
        label: "Mainboard Eligible",
        className: "bg-yellow-100 text-yellow-800",
      };
    case "SME_Eligible":
      return { label: "SME Eligible", className: "bg-blue-100 text-blue-800" };
    case "Pending":
      return { label: "Pending", className: "bg-yellow-100 text-yellow-800" };
    case "Failed":
    case "Not_Eligible":
      return { label: "Not Eligible", className: "bg-red-100 text-red-700" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-700" };
  }
};

const getComplianceStatusConfig = (status: ComplianceStatus) => {
  switch (status) {
    case "high":
      return {
        label: "High Compliance",
        className: "bg-green-100 text-green-700",
      };
    case "medium":
      return {
        label: "Medium Compliance",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "low":
      return {
        label: "Low Compliance",
        className: "bg-orange-100 text-orange-700",
      };
    case "pending":
      return {
        label: "Pending Review",
        className: "bg-blue-100 text-blue-700",
      };
    case "failed":
      return { label: "Failed", className: "bg-red-100 text-red-700" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-700" };
  }
};

const eligibilityStyles: Record<EligibilityStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Failed: "bg-red-100 text-red-800",
  Not_Eligible: "bg-red-100 text-red-800",
  SME_Eligible: "bg-emerald-100 text-emerald-800",
  Mainboard_Eligible: "bg-blue-100 text-blue-800",
};

const complianceStyles: Record<ComplianceStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  low: "bg-yellow-100 text-yellow-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
};

const formatCurrency = (amount?: number) =>
  amount
    ? new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        maximumFractionDigits: 0,
      }).format(amount)
    : "N/A";

interface CompanyBannerProps {
  data: {
    companyName: string;
    companyLogoPath?: string;
    acn?: string;
    abn?: string;
    paygWithholding?: boolean;
    gstRegistered?: boolean;
    gstEffectiveDate?: string;
    asicRegistration?: string;
    austracRegistered?: boolean;
    chessHin?: string;
    paidUpCapital?: number;
    turnover?: number;
    netWorth?: number;
    yearsOperational?: number;
    last3YearsRevenue?: { year: number; revenue: number }[];
    industrySector?: string;
    companyType?: string;
    stateOfRegistration?: string;
    incorporationDate?: string;
    eligibilityStatus: EligibilityStatus;
    complianceStatus: ComplianceStatus;
    lastUpdatedAt: string;
    overallProgress: number;
  };
}

export default function CompanyBanner({ data }: CompanyBannerProps) {
  const eligibility = getEligibilityStatusConfig(data.eligibilityStatus);
  const compliance = getComplianceStatusConfig(data.complianceStatus);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Company Identity */}
          <div className="flex items-center gap-4">
            {data.companyLogoPath ? (
              <CompanyLogo filePath={data.companyLogoPath} />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-700 flex items-center justify-center text-white shadow">
                <Building2 />
              </div>
            )}

            <div>
              <h1 className="text-xl font-bold">{data.companyName}</h1>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3.5 w-3.5" />
                Last updated: {data.lastUpdatedAt}
              </div>
            </div>
          </div>

          {/* Right: Status Badges */}
          <div className="flex gap-2">
            <Badge className={eligibility.className}>{eligibility.label}</Badge>
            <Badge className={compliance.className}>{compliance.label}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-sm">
          {/* Column 1 */}
          <InfoBlock
            title="Company Identifiers"
            icon={<FileText className="h-4 w-4" />}
            rows={[
              ["ACN", data.acn],
              ["ABN", data.abn],
              ["PAYG Withholding", data.paygWithholding ? "Yes" : "No"],
              [
                "GST Registered",
                data.gstRegistered
                  ? `Yes (since ${new Date(
                      data.gstEffectiveDate!
                    ).toLocaleDateString()})`
                  : "No",
              ],
              ["ASIC Registration", data.asicRegistration],
              ["AUSTRAC Registered", data.austracRegistered ? "Yes" : "No"],
              ["CHESS HIN", data.chessHin],
            ]}
          />

          {/* Column 2 */}
          <InfoBlock
            title="Financial Details"
            icon={<DollarSign className="h-4 w-4" />}
            highlight
            rows={[
              ["Paid-up Capital", formatCurrency(data.paidUpCapital)],
              ["Turnover", formatCurrency(data.turnover)],
              ["Net Worth", formatCurrency(data.netWorth)],
              [
                "Last 3 Years Revenue",
                data.last3YearsRevenue && data.last3YearsRevenue.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm">
                    {data.last3YearsRevenue.map((rev) => (
                      <li key={rev.year} className="flex items-baseline gap-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                        <span className="flex-1 font-medium text-foreground">
                          {rev.year}
                        </span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(rev.revenue)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                ),
              ],
            ]}
          />

          {/* Column 3 */}
          <InfoBlock
            title="Operations"
            icon={<Calendar className="h-4 w-4" />}
            rows={[
              [
                "Company Type",
                companyTypes.find((c) => c.value === data.companyType)?.label ??
                  data.companyType,
              ],
              [
                "State",
                australianStates.find(
                  (s) => s.value === data.stateOfRegistration
                )?.label ?? data.stateOfRegistration,
              ],
              [
                "Incorporation Date",
                data.incorporationDate &&
                  new Date(data.incorporationDate).toLocaleDateString(),
              ],
              [
                "Industry",
                industrySectors.find((i) => i.value === data.industrySector)
                  ?.label ?? data.industrySector,
              ],
              [
                "Years Operational",
                data.yearsOperational
                  ? `${data.yearsOperational} years`
                  : "N/A",
              ],
            ]}
          />

          {/* Column 4 */}
          <div>
            <div className="flex items-center gap-2 font-semibold mb-3">
              <Factory className="h-4 w-4" />
              Status Summary
            </div>

            <div className="space-y-4">
              {/* Compliance */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Compliance:
                </p>
                <span
                  className={cn(
                    "inline-block mt-1 px-2.5 py-1 rounded-full text-[11px] font-semibold",
                    complianceStyles[data.complianceStatus]
                  )}
                >
                  {data.complianceStatus.charAt(0).toUpperCase() +
                    data.complianceStatus.slice(1)}
                </span>
              </div>

              {/* Eligibility */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Eligibility:
                </p>
                <span
                  className={cn(
                    "inline-block mt-1 px-2.5 py-1 rounded-full text-[11px] font-semibold",
                    eligibilityStyles[data.eligibilityStatus]
                  )}
                >
                  {data.eligibilityStatus.replace("_", " ")}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Overall Progress</p>
                <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-600 transition-all"
                    style={{ width: `${Math.min(data.overallProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.overallProgress}% complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoBlock({
  title,
  icon,
  rows,
  highlight,
}: {
  title: string;
  icon: React.ReactNode;
  rows: [string, string | number | React.ReactNode | null | undefined][];
  highlight?: boolean;
}) {
  return (
    <div className="border-r border-gray-200 px-4">
      <div className="flex items-center gap-2 font-semibold mb-3">
        {icon}
        {title}
      </div>

      <div className="space-y-1 text-muted-foreground">
        {rows.map(([label, value]) => {
          const isEmpty = value === null || value === undefined;

          return (
            <p key={label}>
              <span className="font-medium text-foreground">{label}:</span>{" "}
              <span
                className={
                  highlight && !isEmpty ? "font-semibold text-foreground" : ""
                }
              >
                {isEmpty ? "N/A" : value}
              </span>
            </p>
          );
        })}
      </div>
    </div>
  );
}
