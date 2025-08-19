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
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface CompanyData {
  companyName: string;
  cin?: string;
  pan?: string;
  tan?: string;
  gstin?: string;
  paidUpCapital?: number;
  turnover?: number;
  netWorth?: number;
  yearsOperational?: number;
  industrySector?: string;
  eligibilityStatus: EligibilityStatus;
  complianceStatus: ComplianceStatus;
  lastUpdatedAt: string;
}

interface CompanyBannerProps {
  data: CompanyData;
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
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
          {/* Legal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Legal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs">
                <span className="font-medium">CIN:</span> {data.cin || "N/A"}
              </div>
              <div className="text-xs">
                <span className="font-medium">PAN:</span> {data.pan || "N/A"}
              </div>
              <div className="text-xs">
                <span className="font-medium">TAN:</span> {data.tan || "N/A"}
              </div>
              <div className="text-xs">
                <span className="font-medium">GSTIN:</span>{" "}
                {data.gstin || "N/A"}
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
            <CardContent className="space-y-2">
              <div className="text-xs">
                <span className="font-medium">Paid-up Capital:</span>
                <div className="font-semibold text-green-600">
                  {formatCurrency(data.paidUpCapital)}
                </div>
              </div>
              <div className="text-xs">
                <span className="font-medium">Turnover:</span>
                <div className="font-semibold text-blue-600">
                  {formatCurrency(data.turnover)}
                </div>
              </div>
              <div className="text-xs">
                <span className="font-medium">Net Worth:</span>
                <div className="font-semibold text-purple-600">
                  {formatCurrency(data.netWorth)}
                </div>
              </div>
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
            <CardContent className="space-y-2">
              <div className="text-xs">
                <span className="font-medium">Years Operational:</span>
                <div className="font-semibold text-orange-600">
                  {data.yearsOperational
                    ? `${data.yearsOperational} years`
                    : "N/A"}
                </div>
              </div>
              <div className="text-xs">
                <span className="font-medium">Industry Sector:</span>
                <div className="font-medium text-gray-700">
                  {data.industrySector
                    ? data.industrySector.charAt(0).toUpperCase() + data.industrySector.slice(1)
                    : "N/A"}
                </div>
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
