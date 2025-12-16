"use client";

import { useRouter } from "next/navigation";
import {
  FileUp,
  FileText,
  Users,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  Bot,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CategoryProgress } from "@/utils/calculateFileProgress";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import CompanyBanner from "./CompanyBanner";
import { downloadReports } from "@/utils/downloadReports";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { get } from "http";
import { getPublicUrl } from "@/lib/data/bucketAction";

interface ClientDashboardProps {
  clientId: string;
  clientName: string;
  complianceScore: number;
  documentProgress: CategoryProgress;
  reportStatus: "Completed" | "Processing" | "Failed" | "Pending";
  valuationStatus: "Completed" | "Processing" | "Failed" | "Pending";
  reportGeneration: number;
  lastUpdated: string;
}

const getStageBorder = (state: "completed" | "current" | "pending") => {
  return "border-l border-r border-[#dfe7e2]";
};

const getBackgroundColor = (state: "completed" | "current" | "pending") => {
  if (state === "completed")
    return "bg-[linear-gradient(135deg,#c6f2d3,#aeeac2,#d0efe0)]";
  if (state === "current")
    return "bg-[linear-gradient(135deg,#e7f7eb,#dfeee3,#ebf2ef)]";
  return "bg-[linear-gradient(135deg,#f4f7f4,#ecefec,#e5e8e5)]";
};

export function ClientDashboard({
  clientId,
  clientName = "Acme Technologies Ltd.",
  complianceScore = 78,
  documentProgress,
  reportStatus = "Completed",
  reportGeneration = 3,
  lastUpdated = "20 May 2023, 14:30",
  valuationStatus = "Pending",
}: Partial<ClientDashboardProps>) {
  const router = useRouter();
  const { clientData, sessionToken, documents } = useSelector(
    (state: RootState) => state.client
  );
  // Helper function to determine compliance status color
  const getComplianceStatusColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  // Helper function to determine report status badge
  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
        );
      case "Processing":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Processing</Badge>
        );
      case "Failed":
        return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>;
      case "Pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      {/* <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span>Clients</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{clientName}</span>
        </div>
      </div> */}

      <CompanyBanner
        data={{
          companyName: clientData!.companyName,
          companyLogoPath: clientData!.companyLogo ?? undefined,
          eligibilityStatus: clientData!.eligibilityStatus,
          complianceStatus: clientData!.complianceStatus,
          paygWithholding: clientData!.paygWithholding ?? undefined,
          gstRegistered: clientData!.gstRegistered ?? undefined,
          abn: clientData!.abn ?? undefined,
          incorporationDate:
            clientData!.incorporationDate?.toISOString() ?? undefined,
          asicRegistration: clientData!.asicRegistration ?? undefined,
          austracRegistered: clientData!.austracRegistered ?? undefined,
          chessHin: clientData!.chessHin ?? undefined,
          last3YearsRevenue:
            (clientData!.last3YearsRevenue as Array<{
              year: number;
              revenue: number;
            }>) ?? undefined,
          paidUpCapital: clientData!.paidUpCapital ?? undefined,
          turnover: clientData!.turnover ?? undefined,
          netWorth: clientData!.netWorth ?? undefined,
          yearsOperational: clientData!.yearsOperational ?? undefined,
          industrySector: clientData!.industrySector ?? undefined,
          acn: clientData!.acn ?? undefined,
          companyType: clientData!.companyType ?? undefined,
          stateOfRegistration: clientData!.stateOfRegistration ?? undefined,
          gstEffectiveDate:
            clientData!.gstEffectiveDate?.toISOString() ?? undefined,
          lastUpdatedAt: lastUpdated,
        }}
      />

      {/* Status Cards Section */}
      <div className="mt-10 w-full overflow-hidden">
        <div className="flex w-full">
          {/* ========= STAGE 1 ========= */}
          <div
            className={cn(
              "relative flex-1 bg-white px-6 py-6 pe-10 z-20", // removed inline border here
              getStageBorder(
                reportStatus === "Completed"
                  ? "completed"
                  : reportStatus === "Processing"
                  ? "current"
                  : "pending"
              ),
              getBackgroundColor(
                reportStatus === "Completed"
                  ? "completed"
                  : reportStatus === "Processing"
                  ? "current"
                  : "pending"
              )
            )}
            style={{
              clipPath: "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Latest Report
                </h3>
                <p className="text-xs text-gray-500">Compliance status</p>
              </div>

              <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center">
                {reportStatus === "Completed" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : reportStatus === "Processing" ? (
                  <Clock className="h-5 w-5 text-green-400" />
                ) : reportStatus === "Pending" ? (
                  <Clock className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-600">
              {reportStatus === "Completed"
                ? "Report ready for download"
                : reportStatus === "Processing"
                ? "Report being generated"
                : reportStatus === "Pending"
                ? "Report generation pending"
                : "Report generation failed"}
            </p>

            <div className="mt-4">
              <Button
                className="h-8 w-full bg-green-600 hover:bg-green-700 text-sm"
                disabled={
                  reportStatus === "Processing" ||
                  reportStatus === "Failed" ||
                  reportStatus === "Pending"
                }
                onClick={async () => {
                  const toastId = toast.loading("Preparing download...");
                  try {
                    const iconUrl = clientData!.companyLogo
                      ? await getPublicUrl(clientData!.companyLogo)
                      : undefined;
                    await downloadReports(
                      sessionToken!,
                      documents,
                      clientData!.companyName,
                      iconUrl
                    );
                    toast.success("Reports downloaded successfully", {
                      id: toastId,
                    });
                  } catch (error) {
                    console.error("Error downloading reports:", error);
                    toast.error("Failed to download reports", { id: toastId });
                  }
                }}
              >
                Download Report
              </Button>
            </div>
          </div>

          {/* ========= STAGE 2 ========= */}
          <div
            className={cn(
              "relative flex-1 -ml-6 bg-white px-12 py-5 z-30", // middle on top
              getStageBorder(
                valuationStatus === "Completed" ? "completed" : "current"
              ),
              getBackgroundColor(
                valuationStatus === "Completed" ? "completed" : "current"
              )
            )}
            style={{
              clipPath:
                "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 6% 50%)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">Valuation</h3>
                <p className="text-xs text-gray-500">IPO pricing tools</p>
              </div>

              <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold">
                $
              </div>
            </div>

            <p className="mt-3 text-xs">
              Automated valuation to determine optimal IPO pricing.
            </p>

            <div className="mt-4">
              <Button
                className="h-8 w-full bg-green-600 hover:bg-green-700 text-sm"
                onClick={() =>
                  router.push(
                    `/dashboard/client/${encodeURIComponent(
                      clientId!
                    )}/valuation`
                  )
                }
                disabled={["pending", "failed"].includes(
                  clientData!.complianceStatus
                )}
              >
                Check Valuation
              </Button>
            </div>
          </div>

          {/* ========= STAGE 3 ========= */}
          <div
            className={cn(
              "relative flex-1 -ml-6 bg-white px-12 py-5 pe-4 z-10",
              getStageBorder(
                valuationStatus === "Completed" ? "current" : "pending"
              ),
              getBackgroundColor(
                valuationStatus === "Completed" ? "current" : "pending"
              )
            )}
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 6% 50%)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Prospectus
                </h3>
                <p className="text-xs text-gray-500">Document generation</p>
              </div>

              <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-600">
              Automated IPO prospectus generation system.
            </p>

            <div className="mt-4">
              <Button
                className="h-8 w-full bg-green-600 hover:bg-green-700 text-sm"
                onClick={() =>
                  router.push(
                    `/dashboard/client/${encodeURIComponent(
                      clientId!
                    )}/prospectus`
                  )
                }
                disabled={
                  ["pending", "failed"].includes(
                    valuationStatus.toLowerCase()
                  ) ||
                  ["pending", "failed"].includes(clientData!.complianceStatus)
                }
              >
                Generate Prospectus
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Action Buttons Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            className="h-auto py-4 bg-[#027055] hover:bg-[#025a44]"
            onClick={() =>
              router.push(
                `/dashboard/client/${encodeURIComponent(clientId!)}/upload`
              )
            }
          >
            <div className="flex flex-col items-center text-center">
              <FileUp className="h-6 w-6 mb-2" />
              <span className="font-medium">Upload Documents</span>
              <span className="text-xs text-white/80 mt-1">
                Add or update required documents
              </span>
            </div>
          </Button>
          <Button
            className="h-auto py-4 bg-[#027055] hover:bg-[#025a44]"
            disabled={
              clientData?.eligibilityStatus === "Pending" ||
              clientData?.eligibilityStatus === "Failed"
            }
            onClick={() =>
              router.push(
                `/dashboard/client/${encodeURIComponent(clientId!)}/report`
              )
            }
          >
            <div className="flex flex-col items-center text-center">
              <FileText className="h-6 w-6 mb-2" />
              <span className="font-medium">View Compliance Report</span>
              <span className="text-xs text-white/80 mt-1">
                Check detailed compliance status
              </span>
            </div>
          </Button>
          <Button
            className="h-auto py-4 bg-[#027055] hover:bg-[#025a44]"
            onClick={() => router.push("/organisation/invite")}
          >
            <div className="flex flex-col items-center text-center">
              <Users className="h-6 w-6 mb-2" />
              <span className="font-medium">Manage Team</span>
              <span className="text-xs text-white/80 mt-1">
                Add or remove team members
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
