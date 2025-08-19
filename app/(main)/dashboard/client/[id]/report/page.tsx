"use client";
import { clearReportData, fetchReportData } from "@/app/redux/reportSlice";
import { RootState } from "@/app/redux/store";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { ComplianceReportViewer } from "@/components/compliance-report-viewer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ComplianceReportPage() {
  const {
    documents,
    sessionToken,
    clientData,
    error: clientError,
  } = useSelector((state: RootState) => state.client);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted && sessionToken && clientData?.generationId) {
        try {
          setIsLoading(true);
          setError(null);
          const res = await dispatch(
            fetchReportData({
              documents: documents.filter(doc => doc.basicCheckStatus === "Passed"),
              sessionToken,
            })
          );
          if (fetchReportData.rejected.match(res)) {
            throw new Error(res.payload as string);
          }

          if (mounted) {
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
        if (mounted) {
          if (clientError) {
            setIsLoading(false);
            setError(clientError);
          }
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
      dispatch(clearReportData());
    };
  }, [clientData, documents, sessionToken, clientError]);

  if (isLoading) {
    return <div className="text-center">Loading compliance report...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <ComplianceReportViewer />
    </main>
  );
}
