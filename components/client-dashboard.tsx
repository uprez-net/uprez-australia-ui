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

interface ClientDashboardProps {
  clientId: string;
  overallDocumentProgress: CategoryProgress;
}

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
            value={isLoading ? "Loading..." : overallScore}
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
              isLoading
                ? "Loading..."
                : categoryScores.find(
                    (score) => score.name === "Financial Reporting & Analysis"
                  )!.score
            }
            target={80}
          />
        </CardContent>
      </Card>

      {/* ---------------- Timeline ---------------- */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>IPO Journey</CardTitle>
            <span className="text-sm text-muted-foreground">
              2 of 5 steps completed
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <Progress value={40} />
          <div className="mt-6 grid grid-cols-5 text-xs text-center">
            {[
              "Assessment",
              "Documents",
              "Compliance",
              "Valuation",
              "Prospectus",
            ].map((step, i) => (
              <div key={step} className="space-y-1">
                <div
                  className={cn(
                    "mx-auto h-3 w-3 rounded-full",
                    i < 2
                      ? "bg-green-600"
                      : i === 2
                      ? "bg-green-400"
                      : "bg-gray-300"
                  )}
                />
                <p>{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ---------------- Workflow Actions ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WorkflowCard
          title="Latest Report"
          description="Compliance status"
          icon={<CheckCircle />}
          action="Download Report"
        />
        <WorkflowCard
          title="Valuation"
          description="IPO pricing tools"
          icon={<DollarSign />}
          action="Check Valuation"
          disabled
        />
        <WorkflowCard
          title="Prospectus"
          description="Document generation"
          icon={<FileText />}
          action="Generate Prospectus"
          disabled
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

function StatCard({ title, value, icon, trend, negative = false }: any) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-muted-foreground">{title}</p>
          {icon}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p
          className={cn(
            "text-xs mt-1",
            negative ? "text-red-500" : "text-green-600"
          )}
        >
          {trend}
        </p>
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
  const calcoffTarget = (Number(value) / target) * 100;
  return (
    <Card className="bg-muted/40">
      <CardContent className="pt-6 space-y-2">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">{value}%</p>
        <Progress value={!isNaN(Number(value)) ? Number(value) : 0} />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">Target: {target}%</p>
          <p
            className={cn(
              calcoffTarget >= 100 ? "text-green-600" : "text-red-500",
              "text-xs"
            )}
          >
            {calcoffTarget >= 100
              ? `+${(calcoffTarget - 100).toFixed(2)}% Above Target`
              : `${(100 - calcoffTarget).toFixed(2)}% Below Target`}
          </p>
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
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  disabled?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex justify-between items-center">
          <p className="font-semibold">{title}</p>
          {icon}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Button disabled={disabled} className="w-full">
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
    <div className="flex gap-3 items-start">
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
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
      variant="outline"
      className="flex flex-col gap-2 h-auto py-4"
      onClick={onClick}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}
