"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import IPOValuationReport from "@/components/ipo-valuation-report";
import { DocumentVerificationTimer } from "@/components/DocumentVerificationTimer";
import {
  checkIpoValuationAction,
  createIpoValuationAction,
} from "@/lib/data/valuationAction";
import { generateTicker } from "@/utils/generateTickerName";
import { StageOneCard } from "@/components/valuation-stage-one-form";
import { StageTwoCard } from "@/components/valuation-stage-two-form";
import { set } from "zod";

type StageOneData = {
  companyName: string;
  ticker: string;
  sector: string;
  subSector: string;
  shares: string;
};

type StageTwoData = {
  friction: string;
  solution: string;
  mission: string;
  market: string;
  growth: string;
  landscape: string;
  moat: string;
  team: string;
};

const VALUATION_BACKEND_URL =
  process.env.NEXT_PUBLIC_VALUATION_BACKEND_URL || "http://127.0.0.1:8000";

export default function WithoutProspectussecPage() {
  const { clientData, documents, isLoading } = useSelector(
    (state: RootState) => state.client
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stageOneData, setStageOneData] = useState<StageOneData>({
    companyName: "",
    ticker: "",
    sector: "",
    subSector: "",
    shares: "",
  });

  // Stage 2 State (Now persisted in parent)
  const [stageTwoData, setStageTwoData] = useState<StageTwoData>({
    friction: "",
    solution: "",
    mission: "",
    market: "",
    growth: "",
    landscape: "",
    moat: "",
    team: "",
  });

  const [loadingValuationCheck, setLoadingValuationCheck] =
    useState<boolean>(true);
  const [showIpoValuation, setShowIpoValuation] = useState<boolean>(false);
  const [valuationData, setValuationData] = useState<any>(null);
  const [reportLink, setReportLink] = useState<string | null>(null);
  const [valuationprocessing, setValuationProcessing] =
    useState<boolean>(false);

  useEffect(() => {
    const checkValuation = async () => {
      if (!clientData?.id) return;
      try {
        setLoadingValuationCheck(true);
        const valData = await checkIpoValuationAction({
          clientId: clientData.id,
        });

        if (valData.success) {
          setShowIpoValuation(true);
          setValuationData(valData.data);
          setReportLink(valData.publicUrl);
          setLoadingValuationCheck(false);
        } else if (valData.msg === "Report Generating") {
          setValuationProcessing(true);
          setLoadingValuationCheck(false);
          setValuationData(valData.data);
        } else if (
          valData.msg === "No valuation record found for the provided clientId"
        ) {
          setShowIpoValuation(false);
          setLoadingValuationCheck(false);
        }
        setLoadingValuationCheck(false);
      } catch (err) {
        console.error("Error checking valuation:", err);
        setShowIpoValuation(false);
        setLoadingValuationCheck(false);
      }
    };
    checkValuation();
  }, [clientData?.id]);

  useEffect(() => {
    if (!isLoading && clientData) {
      setStageOneData((prev) => ({
        ...prev,
        companyName: clientData.companyName ?? "",
        ticker: generateTicker(clientData.companyName ?? ""),
        sector: clientData.industrySector ?? "",
        // keep user-typed subSector/shares if they already changed them
        subSector: prev.subSector,
        shares: prev.shares,
      }));
    }
  }, [isLoading, clientData]);

  const [step, setStep] = useState(1);
  const totalSteps = 2;

  // Animation variants for the sliding effect
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const [[page, direction], setPage] = useState([1, 0]);

  const paginate = (newDirection: number) => {
    const nextStep = page + newDirection;
    if (nextStep < 1 || nextStep > totalSteps) return;
    setPage([nextStep, newDirection]);
    setStep(nextStep);
  };

  const updateStageOneData = (field: string, value: string) => {
    setStageOneData((prev) => ({ ...prev, [field]: value }));
  };

  const updateStageTwoData = (field: string, value: string) => {
    setStageTwoData((prev) => ({ ...prev, [field]: value }));
  };

  const handleValuationReportGeneration = async () => {
    setIsSubmitting(true);

    const payload = {
      ...stageOneData,
      ...stageTwoData,
      clientId: clientData!.id, // Example of adding extra data
    };

    try {
      const response = await createIpoValuationAction(payload);
      if (!response.success) {
        throw new Error(response.error || "Something went wrong");
      }

      setValuationData(response.value);
      setValuationProcessing(true);

      if (response.success) {
        const url = `${VALUATION_BACKEND_URL}/api/v1/get-structured-data?generation_id=${response.value.generation_id}&client_account_id=${response.value.clientAccountId}`;

        const secondResponse = await fetch(url, {
          method: "GET",
        });

        const secondData = await secondResponse.json();

        console.log("Structured Data Response:", secondData);
      }
    } catch (error) {
      console.error("Error generating valuation report:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-blue-600 font-medium">Loading client data...</p>
      </div>
    );
  }

  if (!clientData && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="mt-4 text-red-600 font-medium">
          Error Fetching Client Data
        </p>
      </div>
    );
  }

  if (loadingValuationCheck) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-blue-600 font-medium">Checking status...</p>
      </div>
    );
  }

  if (valuationprocessing) {
    return (
      <DocumentVerificationTimer
        updatedAt={valuationData.updatedAt ?? new Date()}
        description="Report is being processing, please wait..."
      />
    );
  }

  if (showIpoValuation) {
    const OutputJson = {
      ...valuationData.outputJson,
      ticker: valuationData.ProposedTicker,
      sector: valuationData.Sector,
    };

    return <IPOValuationReport data={OutputJson} pdfUrl={reportLink ?? ""} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 font-sans text-slate-900">
      {/* Header / Progress Indicator */}
      <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Intelligent Intake
          </h1>
          <p className="text-slate-500 text-sm">
            {clientData!.companyName} • Stage {step} of {totalSteps}
          </p>
        </div>
        <div className="flex gap-2">
          <div
            className={`h-2 w-12 rounded-full transition-colors ${
              step >= 1 ? "bg-green-600" : "bg-slate-200"
            }`}
          />
          <div
            className={`h-2 w-12 rounded-full transition-colors ${
              step >= 2 ? "bg-green-600" : "bg-slate-200"
            }`}
          />
        </div>
      </div>

      {/* Main Sliding Container */}
      <div className="relative w-full max-w-4xl min-h-screen">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full absolute top-0"
            >
              <StageOneCard
                data={stageOneData}
                updateData={updateStageOneData}
                onNext={() => paginate(1)}
                isLoading={isLoading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full absolute top-0"
            >
              <StageTwoCard
                data={stageTwoData}
                updateData={updateStageTwoData}
                onBack={() => paginate(-1)}
                onSubmit={handleValuationReportGeneration}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}