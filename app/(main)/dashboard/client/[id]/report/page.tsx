"use client";
import { clearReportData, fetchReportData } from "@/app/redux/reportSlice";
import { RootState } from "@/app/redux/store";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { ComplianceReportViewer } from "@/components/compliance-report-viewer";
import { ComplianceReportViewerSkeleton } from "@/components/compliance-report-viewer-skeleton";
import { useEffect, useRef, useState } from "react";
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
  const invokationRef = useRef(0);
  const dispatch = useAppDispatch();

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

  if (isLoading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <ComplianceReportViewerSkeleton />;
      </main>
    );
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
