"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Building2, TrendingUp, ShieldCheck, Target, Users, Globe, Lightbulb, Rocket, AlertCircle } from "lucide-react";

// --- Mock ShadCN Components (In your project, import these from @/components/ui/...) ---
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import IPOValuationReport from "@/components/ipo-valuation-report";
import { DocumentVerificationTimer } from "@/components/DocumentVerificationTimer";
// ----------------------------------------------------------------------------------------

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

export default function WithoutProspectussecPage() {

  const { clientData, documents, isLoading } = useSelector((state: RootState) => state.client);
  const clientId = clientData?.id;

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

  const [loadingValuationCheck, setLoadingValuationCheck] = useState<boolean>(true);
  const [showIpoValuation, setShowIpoValuation] = useState<boolean>(false);
  const [valuationData, setValuationData] = useState<any>(null);
  const [reportLink, setReportLink] = useState<string | null>(null);
  const [valuationprocessing, setValuationProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!clientId) {
      console.warn("No clientId available for valuation check", clientData);
      return
    };

    const checkValuation = async () => {
      try {
        setLoadingValuationCheck(true);

        const response = await fetch("/api/valuations/checking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clientId }),
        });

        const data = await response.json();
        console.log("Valuation check response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong while checking valuation");
        }

        if (response.ok && data.success && data.msg == "Valuation report already generated") {
          setShowIpoValuation(true);
          setValuationData(data.data);
          setReportLink(data.publicUrl);
          setLoadingValuationCheck(false);
        }
        else if (data.msg === "Report processing Happening") {
          setValuationProcessing(true);
          setLoadingValuationCheck(false);
          setValuationData(data.data);
          //setUpdateAt(data.data?.updatedAt ? new Date(data.data.updatedAt) : null);
        }
        else if( data.status == 201 && data.msg === "No valuation record found for the provided clientId") {
          setShowIpoValuation(false);
          setLoadingValuationCheck(false);
        }
        setLoadingValuationCheck(false);
      } catch (err) {
        console.error("Error checking valuation:", err);
        setShowIpoValuation(false);
        setLoadingValuationCheck(false);
      } 
      // finally {

      // }
    };

    if (clientId) {
      console.log("Checking valuation for clientId:", clientId);
      checkValuation();
    }
  }, [clientId]);

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
      clientId: clientData?.id // Example of adding extra data
    };

    console.log("Submitting Valuation Report Generation with payload:", payload);

    try {
      const response = await fetch("/api/valuations/initials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setValuationData(data.value);
      setValuationProcessing(true);

      if (response.ok) {
        const url = `http://127.0.0.1:8000/api/v1/get-structured-data?generation_id=${data.value.generation_id}&client_account_id=${data.value.clientAccountId}`;

        console.log("Calling GET endpoint:", url);

        const secondResponse = await fetch(url, {
          method: "GET",
        });

        const secondData = await secondResponse.json();

        console.log("Structured Data Response:", secondData);
      }
    }
    catch (error) {
      console.error("Error generating valuation report:", error);
    }

  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-blue-600 font-medium">Loading client data...</p>
      </div>
    );
  }


  if (loadingValuationCheck ) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-blue-600 font-medium">Checking status...</p>
      </div>
    );
  }

  if (valuationprocessing) {
    return (
      <DocumentVerificationTimer updatedAt={valuationData?.updatedAt ?? new Date()} description="Report is being processing, please wait..." />
    )
  }


  if (showIpoValuation) {
   const OutputJson= {
      ...valuationData.outputJson,
      ticker: valuationData.ProposedTicker,
      sector: valuationData.Sector,
   }

    return <IPOValuationReport data={OutputJson} pdfUrl={reportLink ?? ""} />;
  }


  // if (!showIpoValuation && !valuationprocessing && !loadingValuationCheck) {
    console.log("Checking rendering valuation form...3");
    console.log("showIpoValuation:", showIpoValuation, "valuationprocessing:", valuationprocessing, "loadingValuationCheck:", loadingValuationCheck);
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 font-sans text-slate-900">

        {/* Header / Progress Indicator */}
        <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Intelligent Intake</h1>
            <p className="text-slate-500 text-sm">Smart Data Room • Stage {step} of {totalSteps}</p>
          </div>
          <div className="flex gap-2">
            <div className={`h-2 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <div className={`h-2 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
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
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="w-full absolute top-0"
              >
                <StageOneCard
                  data={stageOneData}
                  updateData={updateStageOneData}
                  onNext={() => paginate(1)}
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
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
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
// }


// --- STAGE 1 COMPONENT ---
interface StageOneProps {
  onNext: () => void;
  data: StageOneData;
  updateData: (field: string, value: string) => void;
}

function StageOneCard({ onNext, data, updateData }: StageOneProps) {

  // Local state only for errors, as data is now props
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (field: string, value: string) => {
    updateData(field, value); // Update parent state
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleContinue = () => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    if (!data.companyName.trim()) { newErrors.companyName = true; isValid = false; }
    if (!data.ticker.trim()) { newErrors.ticker = true; isValid = false; }
    if (!data.sector) { newErrors.sector = true; isValid = false; }
    if (!data.subSector) { newErrors.subSector = true; isValid = false; }
    if (!data.shares) { newErrors.shares = true; isValid = false; }

    setErrors(newErrors);

    if (isValid) {
      onNext();
    }
  };

  return (
    <Card className="shadow-xl border-slate-200 bg-white mb-4">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Building2 size={24} />
          </div>
          <CardTitle className="text-xl">Identity & Sector</CardTitle>
        </div>
        <CardDescription>
          Establish the peer set for Comparative Company Analysis (CCA).
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Identity */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className={errors.companyName ? "text-red-500" : ""}>Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g. Acme Corp"
                value={data.companyName} // Controlled by Parent
                onChange={(e) => handleChange("companyName", e.target.value)}
                className={errors.companyName ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.companyName && <span className="text-xs text-red-500">Required</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticker" className={errors.shares ? "text-red-500" : ""}>Proposed Ticker</Label>
              {/* <div className="relative"> */}
              {/* <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">$</span> */}
              <Input
                id="ticker"
                className={`uppercase ${errors.ticker ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                placeholder="ACME"
                maxLength={5}
                value={data.ticker} // Controlled by Parent
                onChange={(e) => handleChange("ticker", e.target.value)}
              />
              {/* </div> */}
            </div>
          </div>

          {/* Sector Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className={errors.sector ? "text-red-500" : ""}>Sector Selection</Label>
              <Select onValueChange={(val) => handleChange("sector", val)} value={data.sector}>
                <SelectTrigger className={errors.sector ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="mining">Mining</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="consumer">Consumer Goods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={errors.subSector ? "text-red-500" : ""}>Industry Sub-sector</Label>
              <Select onValueChange={(val) => handleChange("subSector", val)} value={data.subSector}>
                <SelectTrigger className={errors.subSector ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Sub-sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="biotech">Biotech</SelectItem>
                  <SelectItem value="fintech">Fintech</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="shares" className={errors.shares ? "text-red-500" : ""}>Current Capital Structure</Label>
            <div className="relative">
              <Input
                id="shares"
                type="number"
                placeholder="Total Shares on Issue (pre-IPO)"
                value={data.shares} // Controlled by Parent
                onChange={(e) => handleChange("shares", e.target.value)}
                className={errors.shares ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs">Shares</span>
            </div>
            <p className={`text-[0.8rem] ${errors.shares ? "text-red-500" : "text-slate-500"}`}>
              {errors.shares ? "Please enter share count" : "Total authorized shares currently held by shareholders."}
            </p>
          </div>
        </div>

      </CardContent>
      <CardFooter className="flex justify-end pt-6 pb-6">
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            Please fill all fields
          </div>
        )}
        <div className="ml-auto"> {/* Pushes button to right */}
          <Button onClick={handleContinue} className="w-full md:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
            Continue to Narrative <ArrowRight size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// --- STAGE 2 COMPONENT ---
interface StageTwoProps {
  onBack: () => void;
  onSubmit: () => void;
  data: StageTwoData;
  updateData: (field: string, value: string) => void;
  isSubmitting: boolean;
}

function StageTwoCard({ onBack, onSubmit, data, updateData, isSubmitting }: StageTwoProps) {
  // Data structure for the narrative fields to keep code clean
  const narrativeFields = [
    { id: "friction", label: "The Friction", icon: <Target className="w-4 h-4 text-rose-500" />, placeholder: "What is the single most painful problem your customers face?" },
    { id: "solution", label: "The Solution", icon: <Lightbulb className="w-4 h-4 text-amber-500" />, placeholder: "How does your product solve this uniquely?" },
    { id: "mission", label: "The Mission", icon: <Globe className="w-4 h-4 text-blue-500" />, placeholder: "What is the 10-year vision?" },
    { id: "market", label: "The Market", icon: <TrendingUp className="w-4 h-4 text-green-500" />, placeholder: "What is the TAM size and CAGR?" },
    { id: "growth", label: "Growth Engine", icon: <Rocket className="w-4 h-4 text-purple-500" />, placeholder: "Top 3 strategies to double revenue?" },
    { id: "landscape", label: "The Landscape", icon: <Users className="w-4 h-4 text-slate-500" />, placeholder: "Who are your top 3 competitors?" },
    { id: "moat", label: "The Moat", icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />, placeholder: "Defensible competitive advantage (IP, Network Effects)?" },
    { id: "team", label: "Team Edge", icon: <Users className="w-4 h-4 text-cyan-500" />, placeholder: "Why is this management team qualified to win?" },
  ];

  return (
    <Card className="shadow-xl border-slate-200 bg-white min-h-screen mb-4">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Rocket size={24} />
          </div>
          <CardTitle className="text-xl">The Narrative Interview</CardTitle>
        </div>
        <CardDescription>
          Engine inputs to calculate your "Narrative Premium." Be specific.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {narrativeFields.map((field) => (
            <div key={field.id} className="space-y-3 p-4 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors bg-slate-50/30">
              <Label htmlFor={field.id} className="flex items-center gap-2 font-semibold text-slate-700">
                {field.icon}
                {field.label}
              </Label>
              <Textarea
                id={field.id}
                placeholder={field.placeholder}
                className="min-h-[100px] resize-none focus-visible:ring-indigo-500 bg-white"
                // Bind value to parent state
                value={data[field.id as keyof StageTwoData] || ""}
                // Update parent state on change
                onChange={(e) => updateData(field.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-6 pb-6 bg-white border-t border-slate-100">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting} className="gap-2">
          <ArrowLeft size={16} /> Back
        </Button>
        <Button
          className="gap-2 bg-green-600 hover:bg-green-700"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          Report Generate For IPO Valuation <ShieldCheck size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}