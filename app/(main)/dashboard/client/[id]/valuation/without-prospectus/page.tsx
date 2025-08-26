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
import { useState } from "react";

export default function WithoutProspectusPage() {
  const [capitalRaise, setCapitalRaise] = useState(20000000);
  const [percentageSold, setPercentageSold] = useState(25);

  const { clientData } = useSelector((state: RootState) => state.client);
  const clientId = clientData?.id ?? crypto.randomUUID();

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
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>
                  Audited_FY23.pdf, Audited_FY22.pdf (auto-detected from
                  compliance module)
                </span>
              </div>
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
                setUploadedFiles={(file: Document) => {
                  console.log("Files uploaded:", file);
                  return;
                  // setSelectedFile((p) => [...p, file])
                }}
                smeCompanyId={clientId}
                documentType={DocumentType.WorkingCapitalStatement}
                year={2025}
                heading="Drag & drop or click to upload."
                subtext="Supported formats: Excel/CSV"
                className="mt-4 w-full"
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
          >
            <Link
              href={`/dashboard/client/${encodeURIComponent(
                clientId
              )}/valuation/valuation-report`}
            >
              Generate Valuation Report
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
