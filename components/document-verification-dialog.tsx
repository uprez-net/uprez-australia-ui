"use client";

import { use, useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDocumentUploadProgress } from "@/utils/calculateFileProgress";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useMemo } from "react";
import { splitCamelCase } from "./document-upload-dialog";
import { triggerGeneration } from "@/lib/data/clientPageAction";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { setGenerationId, setGenerationNumber } from "@/app/redux/clientSlice";
import { DocumentVerificationTimer } from "./DocumentVerificationTimer";
import { useSubscription } from "@/hooks/useSubscription";
import { documentCategories } from "@/app/interface/interface";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

// interface VerificationResult {
//   category: string;
//   uploaded: number;
//   required: number;
//   status: "complete" | "partial" | "missing";
//   missingDocuments: string[];
// }

interface DocumentVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // verificationResults: VerificationResult[]
  overallScore: number;
  onComplete?: () => void;
}

export function DocumentVerificationDialog({
  open,
  onOpenChange,
  // verificationResults,
  overallScore,
  onComplete,
}: DocumentVerificationDialogProps) {
  const { documents, sessionToken, clientData } = useSelector(
    (state: RootState) => state.client
  );
  const dispatch = useAppDispatch();
  const { isLoading, attemptGeneration } = useSubscription();
  const router = useRouter();

  const [isVerifying, setIsVerifying] = useState(
    clientData!.eligibilityStatus === "Pending" &&
      clientData!.generationId !== null
    // && true
  );
  const verificationComplete = useMemo(() => {
    return (
      clientData?.complianceStatus !== "pending" ||
      clientData?.eligibilityStatus !== "Pending"
    );
  }, [clientData?.complianceStatus, clientData?.eligibilityStatus]);

  const isFailed = useMemo(() => {
    return (
      clientData?.eligibilityStatus === "Failed" ||
      clientData?.complianceStatus === "failed"
    );
  }, [clientData?.eligibilityStatus, clientData?.complianceStatus]);

  const documentProgress = useMemo(() => {
    if (open) {
      return getDocumentUploadProgress(documents);
    }
    return [];
  }, [open, documents]);

  const verificationResults = useMemo(
    () =>
      documentCategories.map((category) => {
        if (category.isIPO) return;
        const progress = documentProgress.find(
          (p) => p.category === category.name
        );

        return {
          category: category.name,
          uploaded: progress?.uploadedCount || 0,
          required: progress?.requiredCount || 0,
          status:
            progress?.percentage === 100
              ? "complete"
              : progress?.percentage === 0
              ? "missing"
              : "partial",
          missingDocuments:
            documentCategories
              .find((cat) => cat.name === category.name)
              ?.required.filter(
                (doc) => !documents.some((d) => splitCamelCase(d.documentType) === doc)
              ) || [],
        };
      }).filter((res) => res !== undefined) as {
        category: string;
        uploaded: number;
        required: number;
        status: "complete" | "partial" | "missing";
        missingDocuments: string[];
      }[],
    [documentProgress, documents]
  );

  const handleVerification = async (redirect = true) => {
    if (isLoading) return;
    const isValid = attemptGeneration();
    if (!isValid) {
      setIsVerifying(false);
      onOpenChange(false);
      return;
    }
    // Simulate verification process
    const doc = documents.length > 0 ? documents[0] : null; // Assuming we have at least one document
    if (!doc || !sessionToken) {
      console.error("No documents available for verification");
      toast.error("No documents available for verification");
      setIsVerifying(false);
      return;
    }
    try {
      const res = await triggerGeneration(sessionToken, doc);
      console.log("Generation triggered successfully:", res);
      dispatch(setGenerationId(res.generationId));
      dispatch(setGenerationNumber(res.generationNumber)); //Add after migrating to new schema
      setIsVerifying(true);
      toast.success("Document verification started successfully");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (!redirect) return;
      toast.info("Redirecting to client dashboard...");
      router.push(`/dashboard/client/${clientData!.id}`);
    } catch (error) {
      console.error("Error triggering generation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to trigger document generation"
      );
      setIsVerifying(false);
      return;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "partial":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "missing":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Complete
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            Partial
          </Badge>
        );
      case "missing":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Missing
          </Badge>
        );
      default:
        return null;
    }
  };

  const getOverallStatus = () => {
    if (overallScore >= 90)
      return { text: "Excellent", color: "text-green-600" };
    if (overallScore >= 75) return { text: "Good", color: "text-green-600" };
    if (overallScore >= 60) return { text: "Fair", color: "text-amber-600" };
    return { text: "Needs Improvement", color: "text-red-600" };
  };

  const overallStatus = getOverallStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Document Verification & Compliance Check</DialogTitle>
          <DialogDescription>
            Verifying document completeness and generating compliance score
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!verificationComplete && !isVerifying && (
            <div className="text-center py-8">
              {!documentProgress.some((p) => p.percentage < 100) && (
                <>
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    Ready to Verify Documents
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Click the button below to start the verification process.
                    This will check document completeness and generate your
                    compliance score.
                  </p>
                </>
              )}
              {/* Category Breakdown */}
              {documentProgress.some((p) => p.percentage < 100) && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Missing Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {verificationResults.map((result, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(result.status)}
                              <span className="font-medium">
                                {result.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">
                                {result.uploaded}/{result.required} documents
                              </span>
                              {getStatusBadge(result.status)}
                            </div>
                          </div>

                          {result.missingDocuments.length > 0 && (
                            <div className="ml-7 text-sm text-red-600 text-start">
                              <p className="font-medium">Missing documents:</p>
                              <ul className="list-disc list-inside ml-2">
                                {result.missingDocuments.map(
                                  (doc, docIndex) => (
                                    <li key={docIndex}>{doc}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              <Button
                disabled={
                  // documentProgress.some((p) => p.percentage < 100) ||
                  isLoading
                }
                onClick={() => handleVerification(false)}
                className="bg-[#027055] hover:bg-[#025a44]"
                size="lg"
              >
                Start Verification
              </Button>
            </div>
          )}

          {isVerifying && !verificationComplete && !isFailed && (
            <DocumentVerificationTimer updatedAt={clientData!.updatedAt} />
          )}

          {isFailed && (
            <div className="space-y-6">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                  Document verification has failed. Please review the missing
                  documents below and ensure all required documents are uploaded
                  before trying again.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {verificationComplete && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Overall Completeness Score</span>
                    <span
                      className={`text-2xl font-bold ${overallStatus.color}`}
                    >
                      {overallScore}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={overallScore} className="h-3" />
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${overallStatus.color}`}>
                        {overallStatus.text}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Based on document uploaded accross all categories
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {verificationResults.map((result, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(result.status)}
                            <span className="font-medium">
                              {result.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {result.uploaded}/{result.required} documents
                            </span>
                            {getStatusBadge(result.status)}
                          </div>
                        </div>

                        {result.missingDocuments.length > 0 && (
                          <div className="ml-7 text-sm text-red-600">
                            <p className="font-medium">Missing documents:</p>
                            <ul className="list-disc list-inside ml-2">
                              {result.missingDocuments.map((doc, docIndex) => (
                                <li key={docIndex}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {overallScore >= 90 ? (
                      <p className="text-green-700">
                        Excellent! Your document portfolio is comprehensive and
                        meets all completeness requirements.
                      </p>
                    ) : overallScore >= 75 ? (
                      <p className="text-green-700">
                        Good progress! Address the missing documents to achieve
                        full completeness.
                      </p>
                    ) : (
                      <p className="text-amber-700">
                        Several documents are missing. Please upload the
                        required documents to improve your completeness score.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter>
          {verificationComplete ? (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  if (onComplete) {
                    handleVerification(false);
                    onComplete();
                  } else {
                    handleVerification();
                  }
                }}
                className="bg-[#027055] hover:bg-[#025a44]"
              >
                {onComplete ? "Continue to Next Step" : "Re-Verify Documents"}
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
