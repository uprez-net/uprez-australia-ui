"use client";
import { ClientDashboard } from "@/components/client-dashboard";
import { DocumentChecklistSection } from "@/components/document-checklist-section";
import { useMemo } from "react";
// import { format } from "date-fns";
import { getDocumentUploadProgress } from "@/utils/calculateFileProgress";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ClientDashboardSkeleton from "@/components/ClientDashboardSkeleton";

export default function ClientDashboardPage() {
  const {
    clientData,
    documents,
    ipoValuations,
    error: reduxError,
  } = useSelector((state: RootState) => state.client);

  const documentProgress = useMemo(() => {
    return getDocumentUploadProgress(documents);
  }, [documents]);

  const overallProgress = useMemo(() => {
    return documentProgress.find((p) => p.category === "Overall") || null;
  }, [documentProgress]);

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

  console.log("Client Data:", overallProgress, documentProgress);

  if (!clientData && !reduxError) {
    return (
      <ClientDashboardSkeleton />
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
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="relative mb-5">
            {/* Icon */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            {/* Input */}
            <Input
              type="text"
              placeholder="Search for documents, clients, or actions..."
              className="
          pl-10
          text-sm
          rounded-lg
          focus-visible:ring-2
          focus-visible:ring-emerald-700/20
          focus-visible:ring-offset-0
          focus-visible:border-emerald-700
        "
            />
          </div>
          <ClientDashboard
            clientId={clientData!.id}
            overallDocumentProgress={overallProgress!}
          />

          {/* Document Checklist Section */}
          <DocumentChecklistSection documentProgress={documentProgress} />
        </div>
      </div>
    </main>
  );
}
