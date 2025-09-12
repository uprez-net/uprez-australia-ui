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

interface ClientDashboardProps {
  clientId: string;
  clientName: string;
  complianceScore: number;
  documentProgress: CategoryProgress;
  reportStatus: "Completed" | "Processing" | "Failed" | "Pending";
  reportGeneration: number;
  lastUpdated: string;
}

export function ClientDashboard({
  clientId,
  clientName = "Acme Technologies Ltd.",
  complianceScore = 78,
  documentProgress,
  reportStatus = "Completed",
  reportGeneration = 3,
  lastUpdated = "20 May 2023, 14:30",
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
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span>Clients</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{clientName}</span>
        </div>
      </div>

      <CompanyBanner
        data={{
          companyName: clientData!.companyName,
          eligibilityStatus: clientData!.eligibilityStatus,
          complianceStatus: clientData!.complianceStatus,
          paygWithholding: clientData!.paygWithholding ?? undefined,
          gstRegistered: clientData!.gstRegistered ?? undefined,
          abn: clientData!.abn ?? undefined,
          incorporationDate: clientData!.incorporationDate?.toISOString() ?? undefined,
          asicRegistration: clientData!.asicRegistration ?? undefined,
          austracRegistered: clientData!.austracRegistered ?? undefined,
          chessHin: clientData!.chessHin ?? undefined,
          last3YearsRevenue: clientData!.last3YearsRevenue as Array<{ year: number; revenue: number }> ?? undefined,
          paidUpCapital: clientData!.paidUpCapital ?? undefined,
          turnover: clientData!.turnover ?? undefined,
          netWorth: clientData!.netWorth ?? undefined,
          yearsOperational: clientData!.yearsOperational ?? undefined,
          industrySector: clientData!.industrySector ?? undefined,
          acn: clientData!.acn ?? undefined,
          companyType: clientData!.companyType ?? undefined,
          stateOfRegistration: clientData!.stateOfRegistration ?? undefined,
          gstEffectiveDate: clientData!.gstEffectiveDate?.toISOString() ?? undefined,
          lastUpdatedAt: lastUpdated,
        }}
      />

      {/* Status Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Compliance Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Compliance Status</CardTitle>
            <CardDescription>Based on regulatory requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              {clientData!.complianceStatus !== "pending" ? (
                <div className="relative flex items-center justify-center">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className={`${getComplianceStatusColor(
                        complianceScore
                      )} stroke-current`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                      strokeDasharray={`${(complianceScore / 100) * 365} 365`}
                      strokeDashoffset="0"
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold">
                      {complianceScore}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Compliant
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32">
                  <Clock className="h-12 w-12 text-amber-500 mb-2" />
                  <span className="text-lg font-semibold">Pending</span>
                  <span className="text-sm text-muted-foreground">
                    Compliance status is being calculated
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="outline"
              className="w-full"
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
              View Details
            </Button>
          </CardFooter>
        </Card>

        {/* Document Upload Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Document Upload Progress</CardTitle>
            <CardDescription>
              Required documents for DRHP filing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">
                    {documentProgress!.percentage.toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={documentProgress!.percentage}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-medium">
                      {documentProgress!.uploadedCount}
                    </div>
                    <div className="text-muted-foreground">Uploaded</div>
                  </div>
                  <div>
                    <div className="font-medium">
                      {documentProgress!.requiredCount -
                        documentProgress!.uploadedCount}
                    </div>
                    <div className="text-muted-foreground">Pending</div>
                  </div>
                  <div>
                    <div className="font-medium">0</div>
                    <div className="text-muted-foreground">Rejected</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full" asChild>
              <Link
                href={`/dashboard/client/${encodeURIComponent(
                  clientId!
                )}/upload`}
              >
                View Documents
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Latest Report Generation Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latest Report Generation</CardTitle>
            <CardDescription>Compliance report status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted">
                {reportStatus === "Completed" ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : reportStatus === "Processing" ? (
                  <Clock className="h-8 w-8 text-blue-500" />
                ) : reportStatus === "Pending" ? (
                  <Clock className="h-8 w-8 text-amber-500" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                )}
              </div>
              <div className="text-center">
                {reportStatus === "Completed" && (
                  <div className="flex items-center justify-center space-x-2">
                    {getReportStatusBadge(reportStatus)}
                    <span className="text-sm font-medium">
                      Gen #{reportGeneration}
                    </span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {reportStatus === "Completed"
                    ? "Report ready for download"
                    : reportStatus === "Processing"
                    ? "Report being generated"
                    : reportStatus === "Pending"
                    ? "Report generation pending"
                    : "Report generation failed"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                const toastId = toast.loading("Downloading reports...");
                try {
                  await downloadReports(
                    sessionToken!,
                    documents!.filter(
                      (doc) => doc.basicCheckStatus === "Passed"
                    ),
                    clientData!.companyName!
                  );
                  toast.success("Reports downloaded successfully", {
                    id: toastId,
                  });
                } catch (error) {
                  console.error("Failed to download reports:", error);
                  toast.error("Failed to download reports", { id: toastId });
                } finally {
                  toast.dismiss(toastId);
                }
              }}
              disabled={
                reportStatus === "Processing" ||
                reportStatus === "Failed" ||
                reportStatus === "Pending"
              }
            >
              Download Report
            </Button>
          </CardFooter>
        </Card>

        {/* Valuation Card (Coming Soon) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Valuation</CardTitle>
            <CardDescription>Automated IPO valuation tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4 space-y-2 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold">$</span>
              </div>
              {/* <Badge variant="outline" className="border-dashed">
                Coming Soon
              </Badge> */}
              <p className="text-sm text-muted-foreground">
                Automated valuation tools to help determine optimal IPO pricing
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full" onClick={() => router.push(`/dashboard/client/${encodeURIComponent(clientId!)}/valuation`)}>
              Check Valuation
            </Button>
          </CardFooter>
        </Card>
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
