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
import { Upload } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { UploadDropZoneComponent } from "@/components/upload-component";
import { Document, DocumentType } from "@prisma/client";

export default function WithProspectusPage() {
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
        {/* Step 1: Upload Prospectus */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Upload Your Prospectus</CardTitle>
            <CardDescription>
              Please upload your most recent draft or final Prospectus. Our AI
              will automatically analyze it to extract your company narrative,
              growth strategy, risk factors, and capital structure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadDropZoneComponent
              setUploadedFiles={(file: Document) => {
                console.log("Files uploaded:", file);
                return;
                // setSelectedFile((p) => [...p, file])
              }}
              smeCompanyId={clientId}
              documentType={DocumentType.WorkingCapitalStatement}
              year={2025}
              heading="Click to upload"
              subtext="PDF document up to 30MB"
            />
          </CardContent>
        </Card>

        {/* Step 2: Define Peer Group */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Identify Your Competitors</CardTitle>
            <CardDescription>
              List the ASX ticker codes of 5-10 publicly listed competitors.
              This is crucial for benchmarking your valuation against the
              market.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="peer-group" className="sr-only">
                Competitor Tickers
              </Label>
              <Input
                id="peer-group"
                placeholder="e.g., XRO, NXT, PME"
                className="text-lg p-4"
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
