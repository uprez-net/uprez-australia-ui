"use client";
import { ClientDashboard } from "@/components/client-dashboard";
import { DocumentChecklistSection } from "@/components/document-checklist-section";
import { useMemo } from "react";
import { format } from "date-fns";
import {
  getDocumentUploadProgress,
} from "@/utils/calculateFileProgress";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

export default function ClientDashboardPage() {
  const {
    clientData,
    documents,
    error: reduxError,
  } = useSelector((state: RootState) => state.client);

  const documentProgress = useMemo(() => {
    return getDocumentUploadProgress(documents);
  }, [documents]);

  const overallProgress = useMemo(() => {
    return documentProgress.find((p) => p.category === "Overall") || null;
  }, [documentProgress]);

  console.log("Client Data:", overallProgress, documentProgress);

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
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <ClientDashboard
            clientId={clientData!.id}
            clientName={clientData!.companyName}
            complianceScore={overallProgress?.percentage || 0}
            documentProgress={overallProgress!}
            reportStatus={
              clientData!.eligibilityStatus === "Pending"
                ? "Pending"
                : clientData!.eligibilityStatus === "Failed"
                ? "Failed"
                : "Completed"
            }
            reportGeneration={clientData?.generationNumber ?? 1}
            lastUpdated={format(new Date(clientData!.updatedAt), "PPp")}
          />

          {/* Document Checklist Section */}
          <DocumentChecklistSection documentProgress={documentProgress} />
        </div>
      </div>
    </main>
  );
}
