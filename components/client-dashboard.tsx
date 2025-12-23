"use client";

import { useRouter } from "next/navigation";
import {
  FileUp,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  CircleCheck,
  XCircle,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import CompanyBanner from "./CompanyBanner";
import { cn } from "@/lib/utils";
import { CategoryProgress } from "@/utils/calculateFileProgress";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { clearReportData, fetchReportData } from "@/app/redux/reportSlice";
import { calculateComplianceScore } from "@/utils/calculateComplianceScore";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";
import { getPublicUrl } from "@/lib/data/bucketAction";
import { downloadReports } from "@/utils/downloadReports";

interface ClientDashboardProps {
  clientId: string;
  overallDocumentProgress: CategoryProgress;
}

// Import TimelineStatus and TimelineItem types from the timeline component
import {
  type TimelineStatus,
  type TimelineItem,
  HorizontalTimeline,
} from "./Client-Timeline";

const timelineItems: TimelineItem[] = [
  {
    id: "1",
    date: "Nov 15, 2025",
    title: "Initial Assessment",
    description: "Company eligibility assessment completed",
    status: "completed" as TimelineStatus,
  },
  {
    id: "2",
    date: "Dec 1, 2025",
    title: "Document Collection",
    description: "Required documents uploaded and verified",
    status: "completed" as TimelineStatus,
  },
  {
    id: "3",
    date: "Dec 20, 2025",
    title: "Compliance Review",
    description: "Regulatory compliance review in progress",
    status: "active" as TimelineStatus,
  },
  {
    id: "4",
    date: "Jan 10, 2026",
    title: "Valuation Report",
    description: "Company valuation and IPO pricing strategy",
    status: "upcoming" as TimelineStatus,
  },
  {
    id: "5",
    date: "Feb 5, 2026",
    title: "Prospectus Generation",
    description: "Draft IPO prospectus preparation",
    status: "upcoming" as TimelineStatus,
  },
];

export function ClientDashboard({
  clientId,
  overallDocumentProgress,
}: ClientDashboardProps) {
  const router = useRouter();
  const {
    clientData,
    ipoValuations,
    sessionToken,
    documents,
    error: clientError,
  } = useSelector((state: RootState) => state.client);
  const { docReport } = useSelector((state: RootState) => state.report);
  const { memberships, invitations, isLoaded } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
    invitations: {
      infinite: true,
      keepPreviousData: true,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const invokationRef = useRef(0);
  const dispatch = useAppDispatch();

  console.log(`Memberships:`, memberships);
  console.log(`Invitations:`, invitations);

  const calculateOverallProgress = () => {
    let progress = 0;

    if (!clientData) return 0;

    /* ---------------------------------
     1. Client Creation (10%)
  ----------------------------------*/
    progress += 10;

    /* ---------------------------------
     2. Document Upload (up to 30%)
     Total doc phase = 40% (10 + 30)
  ----------------------------------*/
    if (overallDocumentProgress?.requiredCount > 0) {
      const docProgress = (overallDocumentProgress.percentage / 100) * 30;
      progress += docProgress;
    }

    /* ---------------------------------
     3. Compliance Status (up to 20%)
     Total so far = 60%
  ----------------------------------*/
    switch (clientData.complianceStatus) {
      case "high":
        progress += 20;
        break;
      case "medium":
        progress += 10;
        break;
      case "low":
        progress += 5;
        break;
      default:
        // PENDING / FAILED → 0
        break;
    }

    // 4. IPO Valuation (20%)
    if (ipoValuations.length > 0 && ipoValuations.some((v) => v.outputJson)) {
      progress += 20;
    }

    /* ---------------------------------
     Clamp & round
  ----------------------------------*/
    return Math.min(Math.round(progress), 100);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      invokationRef.current += 1;
      console.log(`Fetch invocation #${invokationRef.current}`);
      if (mounted && sessionToken) {
        try {
          setIsLoading(true);
          setError(null);
          const res = await dispatch(
            fetchReportData({
              documents: documents.filter(
                (doc) => doc.basicCheckStatus === "Passed"
              ),
              sessionToken,
            })
          );

          console.log("Fetch report data result:", res);
          console.log("Page is still mounted:", mounted);

          if (fetchReportData.rejected.match(res)) {
            throw new Error(res.payload as string);
          }

          if (mounted) {
            console.log("Report data fetched successfully");
            setIsLoading(false);
            setError(null);
          }
        } catch (error) {
          if (mounted) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : typeof error === "string"
                ? error
                : "Unknown error";
            setError("Error fetching compliance report: " + errorMessage);
            setIsLoading(false);
          }
        }
      } else {
        if (mounted && clientError) {
          setIsLoading(false);
          setError(clientError);
        }
      }
    };

    if (documents.length > 0 && sessionToken && invokationRef.current === 0)
      fetchData();

    return () => {
      // mounted = false;
      dispatch(clearReportData());
    };
  }, [documents, sessionToken, clientError]);

  const overallProgress = useMemo(() => {
    return calculateOverallProgress();
  }, [clientData, overallDocumentProgress, ipoValuations]);

  const { overallScore, categoryScores } = useMemo(
    () => calculateComplianceScore(docReport, documents),
    [docReport, documents]
  );

  const valuationStatus = useMemo(() => {
    const latestValuation = ipoValuations?.at(-1);

    const valuationStatus = !latestValuation
      ? "Pending"
      : latestValuation.ipoValuationPdfUrl
      ? "Completed"
      : "Processing";

    return valuationStatus;
  }, [ipoValuations]);

  const complianceStatus = useMemo(() => {
    if (!clientData) return "Pending";
    const reportStatus =
      clientData?.eligibilityStatus === "Failed"
        ? "Failed"
        : clientData?.eligibilityStatus === "Pending"
        ? clientData?.generationId
          ? "Processing"
          : "Pending"
        : "Completed";
    return reportStatus;
  }, [clientData]);

  if (!clientData) return null;

  return (
    <div className="space-y-10">
      {/* ---------------- Stats Cards ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={
            clientData.turnover
              ? `$${clientData.turnover.toLocaleString()}`
              : "N/A"
          }
          icon={<DollarSign className="h-5 w-5" />}
          trend="+6.5%"
        />
        <StatCard
          title="Compliance Score"
          value={
            clientData.complianceStatus !== "pending"
              ? isLoading
                ? "Loading..."
                : `${overallScore}%`
              : "Pending"
          }
          icon={<ShieldCheck className="h-5 w-5" />}
          trend={
            clientData.complianceStatus === "high"
              ? "Excellent"
              : clientData.complianceStatus === "medium"
              ? "Good"
              : clientData.complianceStatus === "low"
              ? "Needs Improvement"
              : "—"
          }
          negative={clientData.complianceStatus === "low"}
        />
        <StatCard
          title="Documents Uploaded"
          value={`${overallDocumentProgress.uploadedCount} / ${overallDocumentProgress.requiredCount}`}
          icon={<FileText className="h-5 w-5" />}
          negative={overallDocumentProgress.percentage < 70}
          trend={`${overallDocumentProgress.percentage}% Complete`}
        />
        <StatCard
          title="Team Members"
          value={isLoaded ? `${memberships!.count ?? 1}` : "Loading..."}
          icon={<Users className="h-5 w-5" />}
          trend={
            isLoaded
              ? invitations?.count
                ? `${invitations!.count ?? 0} pending`
                : "No pending invitations"
              : "Loading..."
          }
          negative={isLoaded && (invitations!.count ?? 0) > 0}
        />
      </div>

      {/* ---------------- Header / Company Banner ---------------- */}
      <CompanyBanner
        data={{
          companyName: clientData.companyName,
          companyLogoPath: clientData.companyLogo ?? undefined,
          eligibilityStatus: clientData.eligibilityStatus,
          complianceStatus: clientData.complianceStatus,
          paygWithholding: clientData.paygWithholding ?? undefined,
          gstRegistered: clientData.gstRegistered ?? undefined,
          abn: clientData.abn ?? undefined,
          incorporationDate:
            clientData.incorporationDate?.toISOString() ?? undefined,
          asicRegistration: clientData.asicRegistration ?? undefined,
          austracRegistered: clientData.austracRegistered ?? undefined,
          chessHin: clientData.chessHin ?? undefined,
          last3YearsRevenue:
            (clientData!.last3YearsRevenue as Array<{
              year: number;
              revenue: number;
            }>) ?? undefined,
          paidUpCapital: clientData.paidUpCapital ?? undefined,
          turnover: clientData.turnover ?? undefined,
          netWorth: clientData.netWorth ?? undefined,
          yearsOperational: clientData.yearsOperational ?? undefined,
          industrySector: clientData.industrySector ?? undefined,
          acn: clientData.acn ?? undefined,
          companyType: clientData.companyType ?? undefined,
          stateOfRegistration: clientData.stateOfRegistration ?? undefined,
          gstEffectiveDate:
            clientData.gstEffectiveDate?.toISOString() ?? undefined,
          lastUpdatedAt: new Date(clientData.updatedAt).toLocaleDateString(),
          overallProgress: overallProgress,
        }}
      />

      {/* ---------------- KPI Dashboard ---------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            title="IPO Readiness"
            value={
              clientData.complianceStatus !== "pending"
                ? isLoading
                  ? "Loading..."
                  : overallScore
                : "Pending"
            }
            target={75}
          />
          <KpiCard
            title="Document Completeness"
            value={overallDocumentProgress.percentage}
            target={90}
          />
          <KpiCard
            title="Financial Health"
            value={
              clientData.complianceStatus !== "pending"
                ? isLoading
                  ? "Loading..."
                  : categoryScores.find(
                      (score) => score.name === "Financial Reporting & Analysis"
                    )!.score
                : "Pending"
            }
            target={80}
          />
        </CardContent>
      </Card>

      {/* ---------------- Timeline ---------------- */}
      <HorizontalTimeline
        title="IPO Journey Timeline"
        completedSteps={2}
        totalSteps={5}
        items={timelineItems}
      />

      {/* ---------------- Workflow Actions ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WorkflowCard
          title="Latest Report"
          description="Compliance status"
          icon={<CheckCircle />}
          action="Download Report"
          disabled={
            complianceStatus === "Processing" ||
            complianceStatus === "Failed" ||
            complianceStatus === "Pending"
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
                icon: <CircleCheck className="notification-icon" />,
              });
            } catch (error) {
              console.error("Error downloading reports:", error);
              toast.error("Failed to download reports", {
                id: toastId,
                icon: <XCircle className="notification-icon" />,
              });
            }
          }}
        />
        <WorkflowCard
          title="Valuation"
          description="IPO pricing tools"
          icon={<DollarSign />}
          action="Check Valuation"
          onClick={() =>
            router.push(
              `/dashboard/client/${encodeURIComponent(clientId!)}/valuation`
            )
          }
          disabled={["pending", "failed"].includes(
            clientData!.complianceStatus
          )}
        />
        <WorkflowCard
          title="Prospectus"
          description="Document generation"
          icon={<FileText />}
          action="Generate Prospectus"
          onClick={() =>
            router.push(
              `/dashboard/client/${encodeURIComponent(clientId!)}/prospectus`
            )
          }
          disabled={
            ["pending", "failed"].includes(valuationStatus.toLowerCase()) ||
            ["pending", "failed"].includes(clientData!.complianceStatus)
          }
        />
      </div>

      {/* ---------------- Activity Feed ---------------- */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">
              View all <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <ActivityItem
            icon={<FileUp />}
            title="New document uploaded"
            desc="Financial Report Q4 uploaded"
            time="2 hours ago"
          />
          <ActivityItem
            icon={<ShieldCheck />}
            title="Compliance review started"
            desc="Regulatory review initiated"
            time="1 day ago"
          />
        </CardContent>
      </Card>

      {/* ---------------- Quick Actions ---------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <QuickAction
            icon={<FileUp />}
            label="Upload Documents"
            onClick={() => router.push(`/dashboard/client/${clientId}/upload`)}
          />
          <QuickAction
            icon={<FileText />}
            label="View Report"
            onClick={() => router.push(`/dashboard/client/${clientId}/report`)}
          />
          <QuickAction
            icon={<Users />}
            label="Manage Team"
            onClick={() => router.push("/organisation/invite")}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Small Components ---------------- */
function StatCard({
  title,
  value,
  icon,
  trend,
  negative = false,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string | React.ReactNode;
  negative?: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        "transition-all duration-300 ease-in-out",
        "hover:-translate-y-1 hover:shadow-xl",
        "shadow-md rounded-xl bg-white"
      )}
    >
      {/* Left accent bar */}
      <span className="absolute left-0 top-0 h-full w-1 bg-green-600" />

      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>

          {/* Icon container */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
            {icon}
          </div>
        </div>

        {/* Value */}
        <p className="text-2xl font-bold mb-2">{value}</p>

        {/* Trend */}
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            negative ? "text-red-500" : "text-green-600"
          )}
        >
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function KpiCard({
  title,
  value,
  target,
}: {
  title: string;
  value: number | string;
  target: number;
}) {
  const percent = !isNaN(Number(value)) ? Number(value) : 0;
  const calcoffTarget = (percent / target) * 100;

  return (
    <Card
      className={cn("rounded-lg", "bg-gradient-to-r from-green-50 to-white")}
    >
      <CardContent className="p-4 space-y-2">
        {/* KPI Title */}
        <p className="text-xs font-medium text-muted-foreground">{title}</p>

        {/* KPI Value */}
        <p className="text-xl font-bold text-foreground">
          {isNaN(Number(value)) ? `${value}` : `${Number(value)}%`}
        </p>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-green-600 transition-all"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Target: {target}%</span>
          {!isNaN(Number(value)) && (
            <span
              className={cn(
                calcoffTarget >= 100 ? "text-green-600" : "text-red-500"
              )}
            >
              {calcoffTarget >= 100
                ? `+${(calcoffTarget - 100).toFixed(2)}% Above Target`
                : `${(100 - calcoffTarget).toFixed(2)}% Below Target`}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WorkflowCard({
  title,
  description,
  icon,
  action,
  disabled,
  onClick,
  active,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  disabled?: boolean;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Card
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "relative overflow-hidden cursor-pointer",
        "rounded-lg shadow-md",
        "bg-gradient-to-r from-emerald-50 to-emerald-100",
        "transition-all duration-300 ease-in-out",
        "hover:-translate-y-1 hover:shadow-xl",
        active && "bg-gradient-to-r from-emerald-200 to-emerald-100",
        disabled && "cursor-not-allowed opacity-80"
      )}
    >
      {/* Corner ribbon */}
      <span
        className="
          absolute top-0 right-0
          w-0 h-0
          border-t-0 border-l-[20px] border-b-[20px] border-r-0
          border-l-transparent border-b-emerald-100
        "
      />

      <CardContent className="p-6 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center text-base font-semibold">
          <p>{title}</p>
          <span className="text-emerald-600">{icon}</span>
        </div>

        {/* Description */}
        <span className="block text-xs text-muted-foreground mb-3">
          {description}
        </span>

        {/* Action Button */}
        <Button
          disabled={disabled}
          className={cn(
            "w-full text-xs font-semibold rounded-md",
            "bg-gradient-to-r from-green-300 to-green-500 text-white",
            "shadow-sm transition-all",
            "hover:-translate-y-0.5 hover:shadow-md",
            disabled && "bg-gradient-to-r from-gray-300 to-gray-400 opacity-70"
          )}
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
}

function ActivityItem({
  icon,
  title,
  desc,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
}) {
  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-b-0">
      {/* Icon */}
      <div className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center bg-muted">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-[13px] font-semibold mb-1">{title}</p>
        <p className="text-xs text-muted-foreground mb-1">{desc}</p>
        <p className="text-[11px] text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="
        h-auto
        p-4
        flex flex-col items-center gap-2
        rounded-lg
        transition-colors
        hover:bg-green-50
      "
    >
      {/* Icon */}
      <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-50 text-green-600">
        {icon}
      </div>

      {/* Label */}
      <span className="text-xs font-semibold text-center">{label}</span>
    </Button>
  );
}
