"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Upload, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { UploadDropZoneComponent } from "@/components/upload-component";
import { Document, DocumentType } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { DocumentUploadDialog, splitCamelCase } from "@/components/document-upload-dialog";
import { ca, se } from "date-fns/locale";
import { createDocumentClient } from "@/app/redux/clientSlice";
import { DocumentVerificationTimer } from "@/components/DocumentVerificationTimer";
import { getPublicUrl } from "@/lib/data/bucketAction";

export default function WithoutProspectusPage() {
  const [capitalRaise, setCapitalRaise] = useState(20000000);
  const [percentageSold, setPercentageSold] = useState(25);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<"Company Narrative & Growth Strategy" | "Risk Management & Due Diligence">("Company Narrative & Growth Strategy");

  const [valuationExists, setValuationExists] = useState<boolean | null>(null);
  const [valuationprocessing, setValuationProcessing] = useState<boolean>(false);
  const [loadingValuationCheck, setLoadingValuationCheck] = useState(true);
  const [ValuationData, setValuationData] = useState<any>(null);
  const [updateAt, setUpdateAt] = useState<Date | null>(null);
  const [reportLink, setReportLink] = useState<string | null>(null);

  const [npat, setNpat] = useState("");
  const [story, setStory] = useState("");
  const [riskDescription, setRiskDescription] = useState("");
  const [competitors, setCompetitors] = useState("");

  const { clientData, documents } = useSelector((state: RootState) => state.client);
  const clientId = clientData?.id ?? crypto.randomUUID();

  function round(value: number, decimals: number): number {
    return Number(value.toFixed(decimals));
  }

  const { riskDocuments, narrativeDocuments, allAuditedFinancials } = useMemo(() => {
    const riskTypes = new Set<DocumentType>([
      DocumentType.InternalRiskRegister,
      DocumentType.DueDiligenceQuestionnaire,
      DocumentType.BoardMeetingMinutes,
    ]);
    const narrativeTypes = new Set<DocumentType>([
      DocumentType.InvestorPresentationPitchDeck,
      DocumentType.FormalBusinessPlan,
      DocumentType.InformationMemorandum,
    ]);

    return documents.reduce(
      (acc, doc) => {
        if (riskTypes.has(doc.documentType)) {
          acc.riskDocuments.push(doc);
        }
        if (narrativeTypes.has(doc.documentType)) {
          acc.narrativeDocuments.push(doc);
        }
        if (doc.documentType === DocumentType.AuditedFinancialStatements) {
          acc.allAuditedFinancials.push(doc);
        }
        return acc;
      },
      {
        riskDocuments: [] as Document[],
        narrativeDocuments: [] as Document[],
        allAuditedFinancials: [] as Document[],
      }
    );
  }, [documents]);

  //Here Run the UseEffect to call the Api Route /api/valuations/checking if User Already generated
  useEffect(() => {
    if (!clientId) return;

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

        if (response.ok && data.success) {
          setValuationExists(true);
          setValuationData(data.data);
          setReportLink(data.publicUrl);
        }
        else if (data.msg === "Report Generating") {
          setValuationProcessing(true);
          setUpdateAt(data.data?.updatedAt ? new Date(data.data.updatedAt) : null);
        }
        else {
          setValuationExists(false);
        }
      } catch (err) {
        console.error("Error checking valuation:", err);
        setValuationExists(false);
      } finally {
        setLoadingValuationCheck(false);
      }
    };

    checkValuation();
  }, [clientId]);


  const handleValuationReportGeneration = async () => {
    try {
      // Clean NPAT formatting
      const cleaned = npat.replace(/[^0-9.-]/g, "");
      const numericNpat = Number(cleaned);

      // Build payload
      const payload = {
        clientId,
        npat: numericNpat,
        story,
        riskDescription,
        competitors,
        capitalRaise,
        percentageSold,
      };

      console.log("Sending payload:", payload);

      // ⬇️ Call your API route
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

      //Now Run the Endpoint /get-structured-data?generation_id=${data.generation_id}&client_account_id=${data.clientAccountId}

      setValuationData(data.value);
      setValuationProcessing(true);
      setUpdateAt(data.value?.updatedAt ? new Date(data.value.updatedAt) : null);

      if (response.ok) {
        // Prepare URL
        const url = `http://localhost:8000/api/v1/get-structured-data?generation_id=${data.generation_id}&client_account_id=${data.clientAccountId}`;

        console.log("Calling GET endpoint:", url);

        const secondResponse = await fetch(url, {
          method: "GET",
        });

        const secondData = await secondResponse.json();

        console.log("Structured Data Response:", secondData);

        // if (!secondResponse.ok) {
        //   throw new Error(secondData.error || "Structured data fetch failed");
        // }
      }

    } catch (error) {
      console.error("Error generating valuation report:", error);
    }
  };


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
      <DocumentVerificationTimer updatedAt={updateAt ?? new Date()} description="Report is being processing, please wait..." />
    )
  }

  if (valuationExists) {
    const out = ValuationData?.outputJson;
    const formattedUpdateAt = updateAt
      ? updateAt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
      : "Not available";


    const BaseValuation = (out.base_case_valuation * 0.50) + (out.base_intrinsic_value * 0.50)

    const Health = (out.overall_financial_health_score - 50) / 50
    const Narrative = (out.overall_narative_sentiment_score - 50) / 50
    const Risk = (50 - out.overall_risk_score) / 50

    const Health_Weight = 0.4
    const Narrative_Weight = 0.3
    const Risk_Weight = 0.3

    const Calculation = (Health * Health_Weight) + (Narrative * Narrative_Weight) + (Risk * Risk_Weight)

    const cap = 0.30

    let Qualitative_Adjustment = 0
    if (Calculation >= cap) {
      Qualitative_Adjustment = cap
    } else {
      Qualitative_Adjustment = -cap
    }

    const Final_Calculation = BaseValuation * (1 + Qualitative_Adjustment)

    const BaseValuation_R = round(BaseValuation, 4)
    const Final_Calculation_R = round(Final_Calculation, 4)
    const Raw_Adjustment_R = round(Calculation * 100, 2)
    const Qualitative_Adjustment_R = round(Qualitative_Adjustment * 100, 2)

    return (
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-lg rounded-xl">

        {/* Read & Download Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-extrabold text-gray-900">
              FINAL REPORT: Indicative Pre-IPO Valuation Summary
            </h1>
            <p className="text-gray-600 mt-1">Read or download your valuation report below.</p>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href={reportLink ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
            >
              Read Report
            </a>

            <a
              href={reportLink ?? undefined}
              download
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md transition"
            >
              Download PDF
            </a>
          </div>
        </div>

        {/* PDF Spinner + Icon */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25V6A2.25 2.25 0 0017.25 3.75H6.75A2.25 2.25 0 004.5 6v12A2.25 2.25 0 006.75 20.25h6.75"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6-3h6m-3 9h6l-3 3m3-3l-3-3"
                />
              </svg>
            </div>
          </div>

          <p className="text-gray-600 mt-4 text-sm">
            Opening your valuation report…
          </p>
        </div>

        <div className="mt-4 text-gray-700 space-y-1">
          <p><span className="font-semibold">For:</span> {out.company_name}</p>
          <p><span className="font-semibold">Date:</span> {formattedUpdateAt}</p>
        </div>
        {/* </div> */}

        {/* Section 1 — Executive Summary */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            1. Executive Summary (The Final Answer)
          </h2>

          <ul className="list-disc pl-6 text-gray-800 space-y-2">
            <li>
              <span className="font-semibold">Final Indicative Valuation:</span>
              <span className="font-bold text-green-700">${BaseValuation} per share</span>
            </li>
            <li>
              <span className="font-semibold">Recommended IPO Range:</span>
              <span className="font-bold"> ${round(Final_Calculation_R*0.85,2)} to ${round(Final_Calculation_R*1.15,2)} per share</span>
            </li>
            <li>
              <span className="font-semibold">Key Takeaway:</span>
              This valuation is driven by strong intrinsic value and excellent financial health,
              adjusted downward for documented market risks including major customer concentration.
            </li>
          </ul>
        </div>

        {/* Section 2 — Valuation Synthesis Breakdown */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            2. Valuation Synthesis Breakdown (How We Got Here)
          </h2>

          <p className="text-gray-700 mb-4">
            This section provides full transparency into the final calculation.
          </p>

          <table className="w-full border-collapse text-gray-800">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Component</th>
                <th className="border px-4 py-2 text-left">Value / Score</th>
                <th className="border px-4 py-2 text-left">Weighting</th>
                <th className="border px-4 py-2 text-left">Result</th>
              </tr>
            </thead>
            <tbody>
              {/* A. Base Valuation */}
              <tr className="bg-blue-50 font-semibold">
                <td className="border px-4 py-2">A. Base Valuation</td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">${BaseValuation}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">DCF Intrinsic Value</td>
                <td className="border px-4 py-2">${round(out.base_intrinsic_value,4)}</td>
                <td className="border px-4 py-2">50%</td>
                <td className="border px-4 py-2">${round(out.base_intrinsic_value * 0.5,4)}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">CCA Market Value</td>
                <td className="border px-4 py-2">${round(out.base_case_valuation,4)}</td>
                <td className="border px-4 py-2">50%</td>
                <td className="border px-4 py-2">${round(out.base_case_valuation * 0.5,4)}</td>
              </tr>

              {/* B. Qualitative Adjustment */}
              <tr className="bg-blue-50 font-semibold">
                <td className="border px-4 py-2">B. Qualitative Adjustment</td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">${Qualitative_Adjustment_R}%</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Financial Health Score</td>
                <td className="border px-4 py-2">{out.overall_financial_health_score}/100</td>
                <td className="border px-4 py-2">40%</td>
                <td className="border px-4 py-2 italic">Contributes premium</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Narrative Strength Score</td>
                <td className="border px-4 py-2">{out.overall_narative_sentiment_score}/100</td>
                <td className="border px-4 py-2">30%</td>
                <td className="border px-4 py-2 italic">Contributes premium</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Overall Risk Score</td>
                <td className="border px-4 py-2">{out.overall_risk_score}/100</td>
                <td className="border px-4 py-2">30%</td>
                <td className="border px-4 py-2 italic">Contributes discount</td>
              </tr>

              {/* C. Final Calculation */}
              <tr className="bg-blue-50 font-semibold">
                <td className="border px-4 py-2">C. Final Calculation</td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">${Final_Calculation_R}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Base Valuation × (1 + Adjustment)</td>
                <td className="border px-4 py-2">${BaseValuation_R} × {1+Qualitative_Adjustment}</td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">${Final_Calculation_R}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3 — Insights */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            3. Key Insights & Supporting Evidence
          </h2>

          <ul className="list-disc pl-6 space-y-4 text-gray-800">

            <li>
              <span className="font-semibold text-gray-900">From the DCF Analysis:</span>
              <ul className="pl-6 list-disc mt-2">
                <li>
                  Intrinsic value depends on a <strong>2.5% terminal growth rate</strong>
                  and <strong>WACC of 9.17%</strong>.
                </li>
              </ul>
            </li>

            <li>
              <span className="font-semibold text-gray-900">From Comparable Company Analysis (CCA):</span>
              <ul className="pl-6 list-disc mt-2">
                <li>
                  Peer tech companies trade at a <strong>median EV/Revenue of 2.68x</strong>.
                </li>
              </ul>
            </li>

            <li>
              <span className="font-semibold text-gray-900">From the Financial Health Scorecard:</span>
              <ul className="pl-6 list-disc mt-2">
                <li>
                  Financial health is <strong>excellent (94.3/100)</strong>, driven by 2-year Revenue
                  CAGR of <strong>22.47%</strong>.
                </li>
              </ul>
            </li>

            <li>
              <span className="font-semibold text-gray-900">From the Narrative Strength Report:</span>
              <ul className="pl-6 list-disc mt-2">
                <li>Narrative is strong but lacks specificity.</li>
                <li><strong>Quantify market size</strong> and <strong>name competitors</strong> to strengthen pitch documents.</li>
              </ul>
            </li>

            <li>
              <span className="font-semibold text-gray-900">From the Risk Heatmap:</span>
              <ul className="pl-6 list-disc mt-2">
                <li>
                  Primary risk is <strong>Market Risk (Score: 88/100)</strong> due to <strong>75% revenue
                    concentration</strong> from a single client.
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Section 4 — Methodology */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            4. Methodology & Disclaimer
          </h2>

          <p className="text-gray-700 leading-relaxed">
            This valuation is an indicative estimate for strategic planning and is not a formal fairness
            opinion. The final IPO price will depend on market conditions, investor demand, and Lead Manager negotiations.
            The valuation was created using a hybrid intrinsic (DCF) + market (CCA) model with qualitative adjustments
            derived from NLP analysis of your submitted documents.
          </p>
        </div>

      </div>

    )

  }


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">
          Valuation Insight Module
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Let's generate an indicative IPO valuation for your business.
        </p>
      </header>

      <div className="space-y-8">
        {/* Step 1: Core Financials */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Core Financials & Capital Structure</CardTitle>
            <CardDescription>
              Provide your foundational financial data. We've pre-filled what we
              can from your compliance documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pre-filled Data */}
            <div>
              <Label className="font-medium text-gray-700">
                Audited Financial Statements
              </Label>
              {allAuditedFinancials.length > 0 ? (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>
                    {allAuditedFinancials.map((doc, idx) => (
                      <span key={doc.id}>
                        {doc.fileName}
                        {idx < allAuditedFinancials.length - 1 ? ", " : ""}
                      </span>
                    ))}{" "}
                    (auto-detected from compliance module)
                  </span>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  No audited financial statements detected yet.
                </p>
              )}
            </div>

            {/* Cap Table Upload */}
            <div>
              <Label className="font-medium text-gray-700">
                Current Capitalisation Table
              </Label>
              <p className="text-sm text-gray-500">
                Please upload your current Cap Table (Excel/CSV).
              </p>
              <UploadDropZoneComponent
                // setUploadedFiles={(file: Document) => {
                //   console.log("Files uploaded:", file);
                //   return;
                //   // setSelectedFile((p) => [...p, file])
                // }}
                smeCompanyId={clientId}
                documentType={DocumentType.CapitalisationTable}
                year={new Date().getFullYear()}
                heading="Drag & drop or click to upload."
                subtext="Supported formats: Excel/CSV"
                className="mt-4 w-full"
                isIPO={true}
              />
            </div>

            {/* NPAT Input */}
            <div>
              <Label htmlFor="npat-input" className="font-medium text-gray-700">
                Projected Net Profit After Tax (NPAT) for next financial year
              </Label>
              <Input
                id="npat-input"
                placeholder="e.g., A$ 3,000,000"
                className="mt-2"
                value={npat}
                onChange={(e) => setNpat(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Company Narrative */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Tell Us Your Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label
                htmlFor="narrative-input"
                className="font-medium text-gray-700"
              >
                Company Narrative & Growth Strategy
              </Label>
              <p className="text-sm text-gray-500">
                Summarize your company's vision, the problem you solve, and your
                key strategies for growth.
              </p>
              <Textarea
                id="narrative-input"
                rows={6}
                className="mt-2"
                placeholder="e.g., We are a high-growth SaaS company disrupting the logistics industry by leveraging our proprietary AI engine to optimize last-mile delivery..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Label className="font-medium text-gray-700">
                Upload Supporting Documents
              </Label>
              <p className="text-sm text-gray-500">
                To support your summary, please upload at least one of the
                following. Our AI will use them to verify and enhance its
                analysis.
              </p>
              {/* Uploaded Document List */}
              {narrativeDocuments.length > 0 &&
                <div className="mt-4 space-y-2">
                  <ul className="space-y-2">
                    {narrativeDocuments.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                      >
                        <span className="font-medium">{doc.fileName}</span>
                        <span className="text-gray-500">{splitCamelCase(doc.documentType)}</span>
                      </li>
                    ))}
                  </ul>
                </div>}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      <li>Investor Presentation / Pitch Deck</li>
                      <li>Formal Business Plan</li>
                      <li>Information Memorandum (IM)</li>
                    </ul>
                    <p className="text-sm font-bold text-red-600 mt-2">
                      At least one document is required.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center bg-transparent"
                    onClick={() => {
                      setCategoryName("Company Narrative & Growth Strategy");
                      setUploadDialogOpen(true)
                    }}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Identify Key Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="risk-input" className="font-medium text-gray-700">
                Describe Key Business Risks
              </Label>
              <p className="text-sm text-gray-500">
                List the top 3-5 risks your business faces (e.g., market
                competition, key person dependency).
              </p>
              <Textarea
                id="risk-input"
                rows={4}
                className="mt-2"
                placeholder="e.g., 1. Customer concentration risk...&#10;2. Key person dependency on our CTO..."
                value={riskDescription}
                onChange={(e) => setRiskDescription(e.target.value)}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Label className="font-medium text-gray-700">
                Upload Supporting Risk Documents (Optional)
              </Label>
              <p className="text-sm text-gray-500">
                You can provide more context by uploading an internal risk
                register, board papers, or a SWOT analysis.
              </p>
              {/* Uploaded Document List */}
              {riskDocuments.length > 0 &&
                <div className="mt-4 space-y-2">
                  <ul className="space-y-2">
                    {riskDocuments.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                      >
                        <span className="font-medium">{doc.fileName}</span>
                        <span className="text-gray-500">{splitCamelCase(doc.documentType)}</span>
                      </li>
                    ))}
                  </ul>
                </div>}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>Internal Risk Register</li>
                    <li>Board Meeting Minutes discussing risks</li>
                    <li>Due Diligence Questionnaires (DDQs)</li>
                  </ul>
                  <Button
                    variant="outline"
                    className="flex items-center bg-transparent"
                    onClick={() => {
                      setCategoryName("Risk Management & Due Diligence");
                      setUploadDialogOpen(true)
                    }}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: IPO & Peers */}
        <Card>
          <CardHeader>
            <CardTitle>Step 4: The IPO Deal & Your Competitors</CardTitle>
            <CardDescription>
              Finally, provide some assumptions about the IPO and list your key
              ASX-listed competitors.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Capital Raise & Percentage State */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Label className="font-medium text-gray-700">
                  How much capital do you plan to raise?
                </Label>
                <Slider
                  value={[capitalRaise]}
                  onValueChange={([val]) => setCapitalRaise(val)}
                  max={50000000}
                  min={5000000}
                  step={1000000}
                  className="mt-2"
                />
                <div className="text-center font-semibold text-lg text-green-800 mt-2">
                  A$ {capitalRaise.toLocaleString()}
                </div>
              </div>
              <div>
                <Label className="font-medium text-gray-700">
                  What percentage of the company will be sold?
                </Label>
                <Slider
                  value={[percentageSold]}
                  onValueChange={([val]) => setPercentageSold(val)}
                  max={40}
                  min={15}
                  step={1}
                  className="mt-2"
                />
                <div className="text-center font-semibold text-lg text-green-800 mt-2">
                  {percentageSold}%
                </div>
              </div>
            </div>
            <div>
              <Label
                htmlFor="peer-group-input"
                className="font-medium text-gray-700"
              >
                Identify Your Competitors (ASX Tickers)
              </Label>
              <Input
                id="peer-group-input"
                placeholder="e.g., XRO, NXT, PME"
                className="mt-2"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Generate Report Button */}
        <div className="text-center pt-4">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-lg shadow-lg"
            onClick={handleValuationReportGeneration}
          >
            {/* <Link
              href={`/dashboard/client/${encodeURIComponent(
                clientId
              )}/valuation/valuation-report`}
            > */}
            Generate Valuation Report
            {/* </Link> */}
          </Button>
        </div>
      </div>

      {/* Upload Dialog */}
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        categoryName={categoryName}
        clientId={clientData!.id}
        // onUpload={handleUpload}
        isIPO={true}
        type={categoryName === "Company Narrative & Growth Strategy" ? DocumentType.InvestorPresentationPitchDeck : DocumentType.InternalRiskRegister}
      />
    </div>
  );
}


