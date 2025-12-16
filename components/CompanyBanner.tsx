import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceStatus, EligibilityStatus } from "@prisma/client";
import {
  Building2,
  FileText,
  DollarSign,
  Calendar,
  Factory,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  australianStates,
  companyTypes,
  industrySectors,
} from "./business-details-form";
import { Suspense, useEffect, useMemo, useState } from "react";
import { getPublicUrl } from "@/lib/data/bucketAction";
import Image from "next/image";

const getEligibilityStatusConfig = (status: EligibilityStatus) => {
  switch (status) {
    case "Mainboard_Eligible":
      return {
        color: "bg-green-500",
        text: "Mainboard Eligible",
        icon: CheckCircle,
      };
    case "SME_Eligible":
      return { color: "bg-blue-500", text: "SME Eligible", icon: CheckCircle };
    case "Pending":
      return { color: "bg-yellow-500", text: "Pending", icon: Clock };
    case "Failed":
      return { color: "bg-red-500", text: "Failed", icon: XCircle };
    case "Not_Eligible":
      return { color: "bg-gray-500", text: "Not Eligible", icon: XCircle };
    default:
      return { color: "bg-gray-500", text: status, icon: AlertCircle };
  }
};

const getComplianceStatusConfig = (status: ComplianceStatus) => {
  switch (status) {
    case "high":
      return { color: "bg-green-500", text: "High Compliance" };
    case "medium":
      return { color: "bg-yellow-500", text: "Medium Compliance" };
    case "low":
      return { color: "bg-orange-500", text: "Low Compliance" };
    case "pending":
      return { color: "bg-blue-500", text: "Pending Review" };
    case "failed":
      return { color: "bg-red-500", text: "Failed Compliance" };
    default:
      return { color: "bg-gray-500", text: status };
  }
};

const formatCurrency = (amount?: number) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface CompanyData {
  companyName: string;
  companyLogoPath?: string;

  // AU company identifiers
  acn?: string;
  abn?: string;

  paygWithholding?: boolean;
  gstRegistered?: boolean;
  gstEffectiveDate?: string;

  // Registrations
  asicRegistration?: string;
  austracRegistered?: boolean;
  chessHin?: string;

  // Financials
  paidUpCapital?: number;
  turnover?: number;
  netWorth?: number;
  yearsOperational?: number;
  last3YearsRevenue?: {
    year: number;
    revenue: number;
  }[];

  // Business Info
  industrySector?: string;
  companyType?: string;
  stateOfRegistration?: string;
  incorporationDate?: string;

  // Status tracking
  eligibilityStatus: EligibilityStatus;
  complianceStatus: ComplianceStatus;
  lastUpdatedAt: string;
}

interface CompanyBannerProps {
  data: CompanyData;
}

function CompanyLogo({ filePath }: { filePath: string }) {
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublicUrl() {
      try {
        const url = await getPublicUrl(filePath);
        setPublicUrl(url);
      } catch (error) {
        console.error("Error fetching public URL:", error);
        setError("Failed to load company logo.");
      }
    }
    fetchPublicUrl();
  }, [filePath]);

  if (!publicUrl && !error) {
    return <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />;
  }

  if (error && !publicUrl) {
    return (
      <div className="p-2 bg-blue-100 rounded-lg">
        <Building2 className="h-6 w-6 text-blue-600" />
      </div>
    );
  }

  return (
      <Image src={publicUrl!} alt="Company Logo" width={30} height={30} />
  );
}

export default function CompanyBanner({ data }: CompanyBannerProps) {
  const eligibilityConfig = getEligibilityStatusConfig(data.eligibilityStatus);
  const complianceConfig = getComplianceStatusConfig(data.complianceStatus);
  const EligibilityIcon = eligibilityConfig.icon;

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 lg:mb-0">
            {data.companyLogoPath ? (
              <CompanyLogo filePath={data.companyLogoPath} />
            ) : (
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {data.companyName}
              </h1>
              {/* <p className="text-sm text-gray-600">Company Overview</p> */}
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                <span>Last updated: {data.lastUpdatedAt}</span>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Badge
              className={`${eligibilityConfig.color} text-white hover:${eligibilityConfig.color}/90`}
            >
              <EligibilityIcon className="w-4 h-4 mr-1" />
              {eligibilityConfig.text}
            </Badge>
            <Badge
              className={`${complianceConfig.color} text-white hover:${complianceConfig.color}/90`}
            >
              {complianceConfig.text}
            </Badge>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Identification & Registrations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Company Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <span className="font-medium">ACN:</span> {data.acn || "N/A"}
              </div>
              <div>
                <span className="font-medium">ABN:</span> {data.abn || "N/A"}
              </div>
              <div>
                <span className="font-medium">PAYG Withholding:</span>{" "}
                {data.paygWithholding ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">GST Registered:</span>{" "}
                {data.gstRegistered ? "Yes" : "No"}
                {data.gstEffectiveDate && (
                  <span className="ml-1 text-muted-foreground">
                    (since{" "}
                    {new Date(data.gstEffectiveDate).toLocaleDateString()})
                  </span>
                )}
              </div>
              <div>
                <span className="font-medium">ASIC Registration:</span>{" "}
                {data.asicRegistration || "N/A"}
              </div>
              <div>
                <span className="font-medium">AUSTRAC Registered:</span>{" "}
                {data.austracRegistered ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">CHESS HIN:</span>{" "}
                {data.chessHin || "N/A"}
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <span className="font-medium">Paid-up Capital:</span>
                <div className="font-semibold text-green-600">
                  {formatCurrency(data.paidUpCapital)}
                </div>
              </div>
              <div>
                <span className="font-medium">Turnover:</span>
                <div className="font-semibold text-blue-600">
                  {formatCurrency(data.turnover)}
                </div>
              </div>
              <div>
                <span className="font-medium">Net Worth:</span>
                <div className="font-semibold text-purple-600">
                  {formatCurrency(data.netWorth)}
                </div>
              </div>
              {data.last3YearsRevenue && (
                <div>
                  <span className="font-medium">Last 3 Years Revenue:</span>
                  <ul className="list-disc list-inside">
                    {data.last3YearsRevenue.map((r) => (
                      <li key={r.year}>
                        {r.year}: {formatCurrency(r.revenue)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Operational Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <span className="font-medium">Company Type:</span>{" "}
                {companyTypes.find((ct) => ct.value === data.companyType)
                  ?.label ||
                  data.companyType ||
                  "N/A"}
              </div>
              <div>
                <span className="font-medium">State of Registration:</span>{" "}
                {australianStates.find(
                  (as) => as.value === data.stateOfRegistration
                )?.label ||
                  data.stateOfRegistration ||
                  "N/A"}
              </div>
              <div>
                <span className="font-medium">Incorporation Date:</span>{" "}
                {data.incorporationDate
                  ? new Date(data.incorporationDate).toLocaleDateString()
                  : "N/A"}
              </div>
              <div>
                <span className="font-medium">Years Operational:</span>{" "}
                {data.yearsOperational
                  ? `${data.yearsOperational} years`
                  : "N/A"}
              </div>
              <div>
                <span className="font-medium">Industry Sector:</span>{" "}
                {industrySectors.find((is) => is.value === data.industrySector)
                  ?.label ||
                  data.industrySector ||
                  "N/A"}
              </div>
            </CardContent>
          </Card>

          {/* Status Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Factory className="h-4 w-4" />
                Status Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs">
                <span className="font-medium block mb-1">Eligibility:</span>
                <Badge variant="outline" className="text-xs">
                  {eligibilityConfig.text}
                </Badge>
              </div>
              <div className="text-xs">
                <span className="font-medium block mb-1">Compliance:</span>
                <Badge variant="outline" className="text-xs">
                  {complianceConfig.text}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
