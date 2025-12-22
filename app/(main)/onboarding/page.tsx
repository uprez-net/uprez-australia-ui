"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MultiStepForm } from "@/components/multi-step-form";
import {
  CompanyIdentificationForm,
  CompanyIdentificationFormHandle,
} from "@/components/company-identification-form";
import {
  australianStates,
  BusinessDetailsForm,
  BusinessDetailsFormHandle,
  companyTypes,
  industrySectors,
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
import Image from "next/image";
import { getPublicUrl } from "@/lib/data/bucketAction";
import { CircleCheck, CircleX } from "lucide-react";

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
    legalName: string;
    companyLogo?: string;
    acn: string;
    abn: string;
    paygWithholding: boolean;
    gstRegistered: boolean;
    gstEffectiveDate: string;
    paidUpCapital: number;
    turnover: number;
    netWorth: number;
    yearsOperational: number;
    last3YearsRevenue: {
      year: number;
      revenue: number;
    }[];
    companyType: string;
    stateOfRegistration: string;
    incorporationDate: string;
    asicRegistration: string;
    austracRegistered: boolean;
    chessHin: string;
  };
}) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (smeData.companyLogo) {
      (async () => {
        try {
          const url = await getPublicUrl(smeData.companyLogo!);
          if (mounted) setLogoUrl(url);
        } catch (err) {
          console.error("Failed to load company logo URL", err);
          if (mounted) setLogoUrl(null);
        }
      })();
    } else {
      setLogoUrl(null);
    }
    return () => {
      mounted = false;
    };
  }, [smeData.companyLogo]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Review Information</h2>
      <p className="text-muted-foreground">
        Please review all the information before submitting.
      </p>

      <div className="rounded-md border p-4 mt-4">
        <div className="space-y-6">
          {/* Company Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Company Details
            </h3>
            <div className="mt-2 space-y-1">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt="Company Logo"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-md border object-cover"
                />
              )}
              <p className="text-sm">
                <span className="font-medium">Legal Name:</span>{" "}
                {smeData.legalName}
              </p>
              <p className="text-sm">
                <span className="font-medium">ACN:</span> {smeData.acn}
              </p>
              <p className="text-sm">
                <span className="font-medium">ABN:</span> {smeData.abn}
              </p>
              <p className="text-sm">
                <span className="font-medium">Company Type:</span>{" "}
                {companyTypes.find((type) => type.value === smeData.companyType)
                  ?.label || smeData.companyType}
              </p>
              <p className="text-sm">
                <span className="font-medium">State of Registration:</span>{" "}
                {australianStates.find(
                  (state) => state.value === smeData.stateOfRegistration
                )?.label || smeData.stateOfRegistration}
              </p>
              <p className="text-sm">
                <span className="font-medium">Incorporation Date:</span>{" "}
                {new Date(smeData.incorporationDate).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">ASIC Registration:</span>{" "}
                {smeData.asicRegistration}
              </p>
              <p className="text-sm">
                <span className="font-medium">CHESS HIN:</span>{" "}
                {smeData.chessHin}
              </p>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Business Information
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Industry:</span>{" "}
                {industrySectors.find(
                  (sector) => sector.value === smeData.industrySector
                )?.label || smeData.industrySector}
              </p>
              <p className="text-sm">
                <span className="font-medium">Years Operational:</span>{" "}
                {smeData.yearsOperational} year
                {smeData.yearsOperational > 1 ? "s" : ""}
              </p>
              <p className="text-sm">
                <span className="font-medium">AUSTRAC Registered:</span>{" "}
                {smeData.austracRegistered ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Financial Information */}
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

              {/* Revenue history */}
              <div className="mt-2">
                <span className="font-medium">Last 3 Years Revenue:</span>
                <ul className="ml-4 list-disc text-sm">
                  {smeData.last3YearsRevenue.map((r) => (
                    <li key={r.year}>
                      {r.year}:{" "}
                      {r.revenue.toLocaleString("en-AU", {
                        style: "currency",
                        currency: "AUD",
                      })}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Registrations */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Registrations
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">PAYG Withholding:</span>{" "}
                {smeData.paygWithholding ? "Yes" : "No"}
              </p>
              <p className="text-sm">
                <span className="font-medium">GST Registered:</span>{" "}
                {smeData.gstRegistered ? "Yes" : "No"}
              </p>
              {smeData.gstRegistered && smeData.gstEffectiveDate && (
                <p className="text-sm">
                  <span className="font-medium">GST Effective Date:</span>{" "}
                  {new Date(smeData.gstEffectiveDate).toLocaleDateString()}
                </p>
              )}
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
  const [smeDetails, setSmeDetails] = useState<{
    industrySector: string;
    legalName: string;
    companyLogo: string | null;
    acn: string;
    abn: string;
    paygWithholding: boolean;
    gstRegistered: boolean;
    gstEffectiveDate: string;
    paidUpCapital: number;
    turnover: number;
    netWorth: number;
    yearsOperational: number;
    last3YearsRevenue: Array<{ year: number; revenue: number }>;
    companyType: string;
    stateOfRegistration: string;
    incorporationDate: string;
    asicRegistration: string;
    austracRegistered: boolean;
    chessHin: string;
  }>({
    industrySector: "",
    legalName: "",
    companyLogo: null,
    acn: "", // Australian Company Number
    abn: "", // Australian Business Number
    paygWithholding: false, // PAYG Withholding registration (yes/no)
    gstRegistered: false, // GST registration status
    gstEffectiveDate: "", // GST registration effective date (ISO string)
    paidUpCapital: NaN,
    turnover: NaN,
    netWorth: NaN,
    yearsOperational: NaN,
    last3YearsRevenue: [
      { year: new Date().getFullYear() - 2, revenue: NaN },
      { year: new Date().getFullYear() - 1, revenue: NaN },
      { year: new Date().getFullYear(), revenue: NaN },
    ], // Array of { year: number, revenue: number }

    // Company details
    companyType: "", // Public / Proprietary Limited
    stateOfRegistration: "", // State/Territory of registration
    incorporationDate: "", // Date of incorporation (ISO string)
    asicRegistration: "", // ASIC registration details
    austracRegistered: false, // AUSTRAC registration (if applicable)
    chessHin: "", // CHESS Holding Identification Number
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
            legalName: res.companyName || "",
            companyLogo: res.companyLogo ?? null,

            // AU Identifiers
            acn: res.acn || "", // Australian Company Number
            abn: res.abn || "", // Australian Business Number
            paygWithholding: res.paygWithholding ?? false,
            gstRegistered: res.gstRegistered ?? false,
            gstEffectiveDate: res.gstEffectiveDate?.toISOString() || "",

            // Financials
            paidUpCapital: res.paidUpCapital ?? NaN,
            turnover: res.turnover ?? NaN,
            netWorth: res.netWorth ?? NaN,
            yearsOperational: res.yearsOperational ?? NaN,
            last3YearsRevenue:
              (res.last3YearsRevenue as Array<{
                year: number;
                revenue: number;
              }>) || [],

            // Company details
            companyType: res.companyType || "",
            stateOfRegistration: res.stateOfRegistration || "",
            incorporationDate: res.incorporationDate?.toISOString() || "",
            asicRegistration: res.asicRegistration || "",
            austracRegistered: res.austracRegistered ?? false,
            chessHin: res.chessHin || "",
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
            companyLogo: smeDetails.companyLogo ?? undefined,
            acn: smeDetails.acn,
            abn: smeDetails.abn,
            paygWithholding: smeDetails.paygWithholding,
            gstRegistered: smeDetails.gstRegistered,
            gstEffectiveDate: smeDetails.gstEffectiveDate,
            asicRegistration: smeDetails.asicRegistration,
            austracRegistered: smeDetails.austracRegistered,
            chessHin: smeDetails.chessHin,
          }}
          ref={companyIdentificationRef}
          onSubmitData={(data: {
            legalName: string;
            companyLogo?: string;
            acn: string;
            abn: string;
            paygWithholding: boolean;
            gstRegistered: boolean;
            austracRegistered: boolean;
            gstEffectiveDate?: string;
            asicRegistration?: string;
            chessHin?: string;
          }) => {
            setSmeDetails((prev) => ({
              ...prev,
              legalName: data.legalName,
              companyLogo: data.companyLogo ?? null,
              acn: data.acn,
              abn: data.abn,
              paygWithholding: data.paygWithholding,
              gstRegistered: data.gstRegistered,
              gstEffectiveDate: data.gstEffectiveDate || "",
              asicRegistration: data.asicRegistration || "",
              austracRegistered: data.austracRegistered,
              chessHin: data.chessHin || "",
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
            companyType: smeDetails.companyType,
            stateOfRegistration: smeDetails.stateOfRegistration,
            incorporationDate: smeDetails.incorporationDate,
          }}
          ref={businessDetailsRef}
          onSubmitData={(data: {
            industrySector: string;
            companyType: string;
            stateOfRegistration: string;
            incorporationDate: string;
          }) => {
            setSmeDetails((prev) => ({
              ...prev,
              industrySector: data.industrySector,
              companyType: data.companyType,
              stateOfRegistration: data.stateOfRegistration,
              incorporationDate: data.incorporationDate,
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
            last3YearsRevenue: smeDetails.last3YearsRevenue,
          }}
          ref={financialFormRef}
          onSubmitData={(data: {
            paidUpCapital: number;
            turnover: number;
            netWorth: number;
            yearsOperational: number;
            last3YearsRevenue: { year: number; revenue: number }[];
          }) => {
            console.log("Financial data submitted:", data);
            setSmeDetails((prev) => ({
              ...prev,
              paidUpCapital: Number(data.paidUpCapital),
              turnover: Number(data.turnover),
              netWorth: Number(data.netWorth),
              yearsOperational: Number(data.yearsOperational),
              last3YearsRevenue: data.last3YearsRevenue,
            }));
          }}
        />
      ),
    },
    {
      title: "Review",
      content: <ReviewInformationForm smeData={{...smeDetails, companyLogo: smeDetails.companyLogo ?? undefined}} />,
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
        companyLogo: smeDetails.companyLogo ?? undefined,
        eligibilityStatus: "Pending",
        acn: smeDetails.acn,
        abn: smeDetails.abn,
        paygWithholding: smeDetails.paygWithholding,
        gstRegistered: smeDetails.gstRegistered,
        gstEffectiveDate: new Date(smeDetails.gstEffectiveDate),
        asicRegistration: smeDetails.asicRegistration,
        austracRegistered: smeDetails.austracRegistered,
        chessHin: smeDetails.chessHin,
        paidUpCapital: smeDetails.paidUpCapital,
        turnover: smeDetails.turnover,
        netWorth: smeDetails.netWorth,
        yearsOperational: smeDetails.yearsOperational,
        industrySector: smeDetails.industrySector,
        last3YearsRevenue: smeDetails.last3YearsRevenue,
        companyType: smeDetails.companyType,
        stateOfRegistration: smeDetails.stateOfRegistration,
        incorporationDate: new Date(smeDetails.incorporationDate),
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
      toast.success("Onboarding completed successfully!", {
        icon: <CircleCheck className="notification-icon" />,
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error during onboarding completion:", error);
      toast.error(
        "An error occurred while processing your onboarding. Please try again.", {
          icon: <CircleX className="notification-icon" />,
        }
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
