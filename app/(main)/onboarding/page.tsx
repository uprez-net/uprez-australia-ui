"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MultiStepForm } from "@/components/multi-step-form";
import {
  CompanyIdentificationForm,
  CompanyIdentificationFormHandle,
} from "@/components/company-identification-form";
import {
  BusinessDetailsForm,
  BusinessDetailsFormHandle,
} from "@/components/business-details-form";
import {
  FinancialInformationForm,
  FinancialInformationFormHandle,
} from "@/components/financial-information-form";
import { IPOEligibilityResult } from "@/components/ipo-eligibility-result";
import { EligibilityStatus, SMECompany } from "@prisma/client";
import { SWE } from "@/app/interface/interface";
import { useClerkUser } from "@/hooks/use-clerk-user";
import { toast } from "sonner";
import { onBoardNewSme, updateSme } from "@/lib/data/onboardingAction";
import { set } from "date-fns";
import { fetchClientData } from "@/lib/data/clientPageAction";

// Example form content components for other steps
function ComplianceDocumentsForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Identification Documents</h2>
      <p className="text-muted-foreground">
        Upload the required identification documents.
      </p>
      <div className="grid gap-4 py-4">
        <div className="flex h-32 w-full items-center justify-center rounded-md border border-dashed border-input bg-muted/50">
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-upload"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <span>Click to upload or drag and drop</span>
            <span className="text-xs">PDF (max. 10MB)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewInformationForm({
  smeData,
}: {
  smeData: {
    industrySector: string;
    businessDescription: string;
    legalName: string;
    cin: string;
    pan: string;
    tan: string;
    gstin: string;
    paidUpCapital: number;
    turnover: number;
    netWorth: number;
    yearsOperational: number;
  };
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Review Information</h2>
      <p className="text-muted-foreground">
        Please review all the information before submitting.
      </p>
      <div className="rounded-md border p-4 mt-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Company Details
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Legal Name:</span>
                {smeData.legalName}
              </p>
              <p className="text-sm">
                <span className="font-medium">CIN:</span> {smeData.cin}
              </p>
              <p className="text-sm">
                <span className="font-medium">PAN:</span> {smeData.pan}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Business Information
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Industry:</span>{" "}
                {smeData.industrySector}
              </p>
              <p className="text-sm">
                <span className="font-medium">Years Operational:</span>{" "}
                {smeData.yearsOperational} year
                {smeData.yearsOperational > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Financial Information
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Paid-up Capital:</span>{" "}
                {smeData.paidUpCapital.toLocaleString("en-AU", {
                  style: "currency",
                  currency: "AUD",
                })}
              </p>
              <p className="text-sm">
                <span className="font-medium">Annual Turnover:</span>{" "}
                {smeData.turnover.toLocaleString("en-AU", {
                  style: "currency",
                  currency: "AUD",
                })}
              </p>
              <p className="text-sm">
                <span className="font-medium">Net Worth:</span>{" "}
                {smeData.netWorth.toLocaleString("en-AU", {
                  style: "currency",
                  currency: "AUD",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [smeDetails, setSmeDetails] = useState({
    industrySector: "",
    businessDescription: "",
    legalName: "",
    cin: "",
    pan: "",
    tan: "",
    gstin: "",
    paidUpCapital: NaN,
    turnover: NaN,
    netWorth: NaN,
    yearsOperational: NaN,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const businessDetailsRef = useRef<BusinessDetailsFormHandle>(null);
  const companyIdentificationRef =
    useRef<CompanyIdentificationFormHandle>(null);
  const financialFormRef = useRef<FinancialInformationFormHandle>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    } else {
      const fetchSMEDetails = async () => {
        try {
          setIsLoading(true);
          const res = await fetchClientData(id);
          if (!res) {
            throw new Error("SME details not found");
          }
          setSmeDetails({
            industrySector: res.industrySector || "",
            businessDescription: "",
            legalName: res.companyName || "",
            cin: res.cin || "",
            pan: res.pan || "",
            tan: res.tan || "",
            gstin: res.gstin || "",
            paidUpCapital: res.paidUpCapital || NaN,
            turnover: res.turnover || NaN,
            netWorth: res.netWorth || NaN,
            yearsOperational: res.yearsOperational || NaN,
          });
        } catch (error) {
          console.error("Error fetching SME details:", error);
          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch SME details"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchSMEDetails();
    }
  }, [id]);

  const stepsData = [
    {
      title: "Company Identification",
      content: (
        <CompanyIdentificationForm
          data={{
            legalName: smeDetails.legalName,
            cin: smeDetails.cin,
            pan: smeDetails.pan,
            tan: smeDetails.tan,
            gstin: smeDetails.gstin,
          }}
          ref={companyIdentificationRef}
          onSubmitData={(data: {
            legalName: string;
            cin: string;
            pan: string;
            tan: string;
            gstin: string;
          }) => {
            setSmeDetails((prev) => ({
              ...prev,
              legalName: data.legalName,
              cin: data.cin,
              pan: data.pan,
              tan: data.tan,
              gstin: data.gstin,
            }));
          }}
        />
      ),
    },
    {
      title: "Business Information",
      content: (
        <BusinessDetailsForm
          data={{
            industrySector: smeDetails.industrySector,
            businessDescription: smeDetails.businessDescription,
          }}
          ref={businessDetailsRef}
          onSubmitData={(data: {
            industrySector: string;
            businessDescription?: string;
          }) => {
            setSmeDetails((prev) => ({
              ...prev,
              industrySector: data.industrySector,
              businessDescription: data.businessDescription!,
            }));
          }}
        />
      ),
    },
    {
      title: "Financial Information",
      content: (
        <FinancialInformationForm
          data={{
            paidUpCapital: smeDetails.paidUpCapital,
            turnover: smeDetails.turnover,
            netWorth: smeDetails.netWorth,
            yearsOperational: smeDetails.yearsOperational,
          }}
          ref={financialFormRef}
          onSubmitData={(data: {
            paidUpCapital: number;
            turnover: number;
            netWorth: number;
            yearsOperational: number;
          }) => {
            console.log("Financial data submitted:", data);
            setSmeDetails((prev) => ({
              ...prev,
              paidUpCapital: Number(data.paidUpCapital),
              turnover: Number(data.turnover),
              netWorth: Number(data.netWorth),
              yearsOperational: Number(data.yearsOperational),
            }));
          }}
        />
      ),
    },
    {
      title: "Review",
      content: <ReviewInformationForm smeData={smeDetails} />,
    },
  ];

  const handleOnboardingComplete = async () => {
    // Determine eligibility based on SME criteria
    let scenario: EligibilityStatus = EligibilityStatus.Pending;

    if (
      smeDetails.paidUpCapital >= 1 &&
      smeDetails.paidUpCapital <= 25 &&
      smeDetails.yearsOperational >= 3 &&
      smeDetails.netWorth >= 3
      // && !smeDetails.hasRegulatoryIssues
    ) {
      scenario = EligibilityStatus.SME_Eligible;
    } else if (smeDetails.paidUpCapital > 25) {
      scenario = EligibilityStatus.Mainboard_Eligible;
    }

    try {
      // Prepare data for submission
      setIsSubmitting(true);
      const smeData: SWE = {
        userId: "",
        id: id ?? "",
        companyName: smeDetails.legalName,
        eligibilityStatus: "Pending",
        cin: smeDetails.cin,
        pan: smeDetails.pan,
        tan: smeDetails.tan,
        gstin: smeDetails.gstin,
        paidUpCapital: smeDetails.paidUpCapital,
        turnover: smeDetails.turnover,
        netWorth: smeDetails.netWorth,
        yearsOperational: smeDetails.yearsOperational,
        industrySector: smeDetails.industrySector,
      };

      if (!id) {
        const newSme = await onBoardNewSme(smeData);
        router.push(
          `/onboarding/eligibility?scenario=${scenario}&companyName=${encodeURIComponent(
            smeDetails.legalName
          )}&clientId=${newSme.id}`
        );
      } else {
        await updateSme(smeData);
        // Navigate to eligibility page with form data
        router.push(
          `/onboarding/eligibility?scenario=${scenario}&companyName=${encodeURIComponent(
            smeDetails.legalName
          )}&clientId=${id}`
        );
      }

      setIsSubmitting(false);
      toast.success("Onboarding completed successfully!");
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error during onboarding completion:", error);
      toast.error(
        "An error occurred while processing your onboarding. Please try again."
      );
      return;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-slate-50">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-2">
          {!id ? "SME IPO Onboarding" : "Update SME IPO Details"}
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          {!id
            ? "Complete the following steps to begin your IPO journey"
            : "Update your SME IPO details below."}
        </p>
        <MultiStepForm
          businessDetailsRef={businessDetailsRef}
          companyIdentificationRef={companyIdentificationRef}
          financialFormRef={financialFormRef}
          steps={stepsData}
          onComplete={handleOnboardingComplete}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
