"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ComplianceFindingItem } from "@/components/compliance-finding-item";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { getDocumentUploadProgress } from "@/utils/calculateFileProgress";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DocumentVerificationDialog } from "./document-verification-dialog";
import { documentCategories } from "@/app/interface/interface";
import { splitCamelCase } from "./document-upload-dialog";
import { toast } from "sonner";
import { downloadReports } from "@/utils/downloadReports";
import Link from "next/link";

interface ComplianceReportViewerProps {
  reportGeneration?: number;
  generationDate?: string;
  overallScore?: number;
  categories?: {
    name: string;
    score: number;
    findings: number;
  }[];
}

export function ComplianceReportViewer() {
  const { documents, clientData, sessionToken } = useSelector(
    (state: RootState) => state.client
  );
  const { docReport } = useSelector((state: RootState) => state.report);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const documentProgress = useMemo(() => {
    return getDocumentUploadProgress(documents);
  }, [documents]);
  const reportGeneration = clientData?.generationNumber || 1;
  const generationDate = clientData?.updatedAt
    ? format(new Date(clientData.updatedAt), "PPp")
    : "";
  const overallScore =
    documentProgress.find((cat) => cat.category === "Overall")?.percentage || 0;
  const categories = [
    {
      name: "Corporate Governance & Formation",
      score:
        documentProgress.find(
          (cat) => cat.category === "Corporate Governance & Formation"
        )?.percentage || 0,
      findings:
        documentProgress.find(
          (cat) => cat.category === "Corporate Governance & Formation"
        )?.uploadedCount || 0,
    },
    {
      name: "Financial Reporting & Analysis",
      score:
        documentProgress.find(
          (cat) => cat.category === "Financial Reporting & Analysis"
        )?.percentage || 0,
      findings:
        documentProgress.find(
          (cat) => cat.category === "Financial Reporting & Analysis"
        )?.uploadedCount || 0,
    },
    {
      name: "Shareholders & Related Parties Information",
      score:
        documentProgress.find(
          (cat) => cat.category === "Shareholders & Related Parties Information"
        )?.percentage || 0,
      findings:
        documentProgress.find(
          (cat) => cat.category === "Shareholders & Related Parties Information"
        )?.uploadedCount || 0,
    },
    {
      name: "Directors & Officers Compliance",
      score:
        documentProgress.find(
          (cat) => cat.category === "Directors & Officers Compliance"
        )?.percentage || 0,
      findings:
        documentProgress.find(
          (cat) => cat.category === "Directors & Officers Compliance"
        )?.uploadedCount || 0,
    },
  ];

  // Helper function to determine status color based on score
  const getStatusColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 60) return "amber";
    return "red";
  };

  // Helper function to get status icon based on score
  const getStatusIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 60)
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  // Helper function to get status text based on score
  const getStatusText = (score: number) => {
    if (score >= 80) return "Compliant";
    if (score >= 60) return "Needs Attention";
    return "Non-Compliant";
  };

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };

  const findingsDataFromDocs = useMemo(() => {
    const findings: Record<string, any[]> = {};

    const priorities = {
      compliant: "low",
      "partially-compliant": "medium",
      "non-compliant": "high",
    };
    docReport.forEach((doc) => {
      console.log("Processing docReport item:", doc);
      const document = documents.find((d) => d.id === doc.id)!;
      const category = documentCategories.find(
        (cat) => cat.required.includes(splitCamelCase(document.documentType))
        // || cat.optional.includes(splitCamelCase(document.documentType))
      );

      if (category) {
        const categoryName = category.name;

        if (!findings[categoryName]) {
          findings[categoryName] = [];
        }

        findings[categoryName].push({
          id: doc.id,
          title: `${document.fileName} - ${splitCamelCase(
            document.documentType
          )}`,
          description: doc.summary.critical_components,
          status: doc.status,
          rule: doc.summary.rules,
          reasoning: doc.summary.reasoning,
          recommendation: doc.summary.recommendation,
          category: category.name,
          priority: priorities[doc.status as keyof typeof priorities],
          report: doc.report, // Complete report data
        });
      }
    });

    return findings;
  }, [docReport]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Compliance Report - Generation #{reportGeneration}
          </h1>
          <p className="text-muted-foreground">Generated on {generationDate}</p>
        </div>
        <Badge
          className={`px-3 py-1 text-sm ${
            getStatusColor(overallScore) === "green"
              ? "bg-green-100 text-green-800 border-green-300"
              : getStatusColor(overallScore) === "amber"
              ? "bg-amber-100 text-amber-800 border-amber-300"
              : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          {getStatusText(overallScore)}
        </Badge>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Summary</CardTitle>
          <CardDescription>
            Overview of your compliance status across key areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <svg className="w-40 h-40">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="62"
                    cx="80"
                    cy="80"
                  />
                  <circle
                    className={`stroke-current ${
                      getStatusColor(overallScore) === "green"
                        ? "text-green-500"
                        : getStatusColor(overallScore) === "amber"
                        ? "text-amber-500"
                        : "text-red-500"
                    }`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="62"
                    cx="80"
                    cy="80"
                    strokeDasharray={`${(overallScore / 100) * 390} 390`}
                    strokeDashoffset="0"
                    transform="rotate(-90 80 80)"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold">{overallScore}%</span>
                  <span className="text-sm text-muted-foreground">
                    Overall Score
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {overallScore >= 80
                    ? "Your company is largely compliant with IPO requirements."
                    : overallScore >= 60
                    ? "Some areas need attention before IPO readiness."
                    : "Significant compliance issues need to be addressed."}
                </p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h3 className="text-lg font-medium">Category Breakdown</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(category.score)}
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {category.score}%
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            category.findings > 0
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {category.findings}{" "}
                          {category.findings === 1 ? "finding" : "findings"}
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={category.score}
                      className={`h-2 ${
                        // getStatusColor(category.score) === "green"
                        //   ? "bg-green-500"
                        //   : getStatusColor(category.score) === "amber"
                        //     ? "bg-amber-500"
                        //     : "bg-red-500"
                        "bg-slate-200"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Findings Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Detailed Findings</h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.name}>
              <CardHeader
                className={cn(
                  "py-4 cursor-pointer",
                  category.findings === 0 && "cursor-auto"
                )}
                onClick={() => {
                  if (category.findings === 0) return; // Don't toggle if no findings
                  toggleCategory(category.name);
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(category.score)}
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        category.findings > 0
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {category.findings}{" "}
                      {category.findings === 1 ? "finding" : "findings"}
                    </Badge>
                    {expandedCategory === category.name ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground",
                          category.findings === 0 && "invisible"
                        )}
                      />
                    )}
                  </div>
                </div>
              </CardHeader>
              {expandedCategory === category.name && (
                <>
                  <Separator />
                  <CardContent className="py-4">
                    <div className="space-y-4">
                      {/* Display findings for this category */}
                      {findingsDataFromDocs[
                        category.name as keyof typeof findingsDataFromDocs
                      ]?.map((finding) => (
                        <ComplianceFindingItem
                          key={finding.id}
                          id={finding.id}
                          title={finding.title}
                          description={finding.description}
                          status={finding.status}
                          rule={finding.rule}
                          reasoning={finding.reasoning}
                          recommendation={finding.recommendation}
                          category={finding.category}
                          priority={finding.priority}
                          report={finding.report}
                          generationId={
                            documents.find((doc) => doc.id === finding.id)
                              ?.generationId!
                          }
                        />
                      ))}

                      {/* If no findings */}
                      {!findingsDataFromDocs[
                        category.name as keyof typeof findingsDataFromDocs
                      ] && (
                        <div className="p-4 border rounded-md bg-green-50 border-green-200">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-green-800">
                                No issues found
                              </h4>
                              <p className="text-sm text-green-700 mt-1">
                                All compliance requirements for this category
                                have been met.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={async () => {
            const toastId = toast.loading("Downloading reports...");
            try {
              await downloadReports(
                sessionToken!,
                documents!.filter((doc) => doc.basicCheckStatus === "Passed"),
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
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
        <Button
          className="bg-[#027055] hover:bg-[#025a44] flex items-center gap-2"
          asChild
        >
          <Link href={`/dashboard/client/${clientData?.id}/upload`}>
            <RefreshCw className="h-4 w-4" />
            Regenerate Report
          </Link>
        </Button>
      </div>
      {/* Verification Dialog */}
      <DocumentVerificationDialog
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
        // verificationResults={verificationResults}
        overallScore={
          documentProgress.find((p) => p.category === "Overall")?.percentage ||
          0
        }
      />
    </div>
  );
}
