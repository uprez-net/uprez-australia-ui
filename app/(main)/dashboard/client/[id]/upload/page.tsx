"use client";
import { useEffect, useMemo, useState } from "react";
import { DocumentCategoryUpload } from "@/components/document-category-upload";
import { DocumentVerificationDialog } from "@/components/document-verification-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, CircleX, Info } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { getDocumentUploadProgress } from "@/utils/calculateFileProgress";
import { documentCategories } from "@/app/interface/interface";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { clearReportData, fetchReportData } from "@/app/redux/reportSlice";
import { toast } from "sonner";
import { Overlay } from "@/components/overlay";
import { useSubscription } from "@/hooks/useSubscription";

export default function UploadDocumentsPage() {
  const {
    clientData,
    documents,
    sessionToken,
    error: reduxError,
  } = useSelector((state: RootState) => state.client);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const documentProgress = useMemo(() => {
    return getDocumentUploadProgress(documents);
  }, [documents]);
  const [showOverlay, setShowOverlay] = useState(
    clientData?.generationNumber
      ? clientData.generationNumber > 0 &&
          clientData.eligibilityStatus !== "Pending"
      : false
  );
  const { attemptGeneration } = useSubscription();

  const handleCancel = () => {
    // console.log("Action cancelled");
    // setShowOverlay(false);
    router.push(`/dashboard/client/${clientData!.id}/report`);
  };

  const handleDismiss = () => {
    const isValid = attemptGeneration();
    if (!isValid) {
      toast.error("You can't create a new generation at this time.", {
        icon: <CircleX className="notification-icon" />,
      });
      // return;
    }
    // toast.info(
    //   <div className="flex items-start gap-3">
    //     <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
    //       <Info className="h-5 w-5" />
    //     </div>
    //     <div className="flex flex-col">
    //       <span className="text-sm font-semibold text-gray-900 dark:text-white">
    //         Starting a New Generation
    //       </span>
    //       <p className="text-sm text-muted-foreground mt-1">
    //         This will discard the previous result and generate a new version of
    //         the document.
    //       </p>
    //     </div>
    //   </div>
    // );
    toast.info("Starting a new generation will discard the previous result.", {
      icon: <Info className="notification-icon" />,
      description: "This will discard the previous result and generate a new version of the document.",
    });
    setShowOverlay(false);
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!clientData || !documents.length || !sessionToken) {
        return;
      }
      try {
        const res = await dispatch(
          fetchReportData({
            documents: documents.filter(
              (doc) => doc.basicCheckStatus === "Passed"
            ),
            sessionToken,
          })
        );
        if (fetchReportData.rejected.match(res)) {
          throw new Error(res.payload as string);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
        // Handle error appropriately, e.g., show a notification
      }
    };

    fetchReport();

    return () => {
      // Cleanup function to clear report data when component unmounts
      dispatch(clearReportData());
    };
  }, []);

  const handleVerificationComplete = () => {
    setVerificationDialogOpen(false);
    // router.push(`/dashboard/client/${clientData!.id}/report`);
    // Navigate to next step or show success message
    // alert("Document verification completed! Proceeding to next step...");
  };

  if (!clientData && !reduxError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  if (reduxError && !clientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600">
            Error loading client data: {reduxError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4  bg-slate-50">
      <Overlay
        isVisible={showOverlay}
        onCancel={handleCancel}
        onDismiss={handleDismiss}
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Upload Documents</h1>
            <p className="text-muted-foreground">
              Upload required documents for {clientData!.companyName}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/client/${clientData!.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Client Dashboard
            </Link>
          </Button>
        </div>

        {/* Breadcrumb */}
        {/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Dashboard</span>
          <span>›</span>
          <span>Clients</span>
          <span>›</span>
          <span>{clientData!.companyName}</span>
          <span>›</span>
          <span className="font-medium text-foreground">Upload Documents</span>
        </div> */}

        {/* Document Categories */}
        <div className="space-y-8">
          {documentCategories.map((category) =>
            category.isIPO ? null : (
              <DocumentCategoryUpload
                key={category.name}
                categoryName={category.name}
                requiredDocuments={category.required}
                optionalDocuments={category.optional || []}
                documentProgress={
                  documentProgress.find(
                    (progress) => progress.category === category.name
                  )!
                }
              />
            )
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-8">
          <Button
            onClick={() => setVerificationDialogOpen(true)}
            className="bg-[#027055] hover:bg-[#025a44] px-8 py-3 text-lg"
            size="lg"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            {clientData?.eligibilityStatus === "Pending" ||
            clientData?.eligibilityStatus !== "Failed"
              ? "Check Documents & Verify Compliance"
              : "Re-Verify Documents"}
          </Button>
        </div>

        {/* Verification Dialog */}
        <DocumentVerificationDialog
          open={verificationDialogOpen}
          onOpenChange={setVerificationDialogOpen}
          // verificationResults={verificationResults}
          overallScore={
            documentProgress.find((p) => p.category === "Overall")
              ?.percentage || 0
          }
          onComplete={
            clientData?.eligibilityStatus === "Failed"
              ? undefined
              : handleVerificationComplete
          }
        />
      </div>
    </main>
  );
}
