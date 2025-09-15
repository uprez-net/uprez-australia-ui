"use client";

import { useRef, useState } from "react";
import {
  australianStates,
  BusinessDetailsForm,
  BusinessDetailsFormHandle,
  companyTypes,
  industrySectors,
} from "./business-details-form";
import {
  CompanyIdentificationForm,
  CompanyIdentificationFormHandle,
} from "./company-identification-form";
import {
  FinancialInformationForm,
  FinancialInformationFormHandle,
} from "./financial-information-form";
import { MultiStepForm } from "./multi-step-form";
import { number } from "zod";
import { createOrganizationAction } from "@/app/actions/organisationAction";
import { Organisation } from "@/app/interface/interface";
import { EligibilityStatus } from "@prisma/client";
import { toast } from "sonner";

interface SmeOnboardingFormProps {
  onComplete?: (smeCompanyId?: string) => void;
}

function ReviewInformationForm({
  smeData,
}: {
  smeData: {
    industrySector: string;
    legalName: string;
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
                {new Date(smeData.incorporationDate).toLocaleDateString("en-AU")}
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
                  {new Date(smeData.gstEffectiveDate).toLocaleDateString("en-AU")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SmeOnboardingForm({ onComplete }: SmeOnboardingFormProps) {
  const [smeDetails, setSmeDetails] = useState({
    industrySector: "",
    legalName: "",
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
    ] as Array<{ year: number; revenue: number }>, // Array of { year: number, revenue: number }

    // Company details
    companyType: "", // Public / Proprietary Limited
    stateOfRegistration: "", // State/Territory of registration
    incorporationDate: "", // Date of incorporation (ISO string)
    asicRegistration: "", // ASIC registration details
    austracRegistered: false, // AUSTRAC registration (if applicable)
    chessHin: "", // CHESS Holding Identification Number
  });
  const businessDetailsRef = useRef<BusinessDetailsFormHandle>(null);
  const companyIdentificationRef =
    useRef<CompanyIdentificationFormHandle>(null);
  const financialFormRef = useRef<FinancialInformationFormHandle>(null);
  const stepsData = [
    {
      title: "Company Identification",
      content: (
        <CompanyIdentificationForm
          data={{
            legalName: smeDetails.legalName,
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
      content: <ReviewInformationForm smeData={smeDetails} />,
    },
  ];

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">SME Onboarding</h1>
        <p className="text-muted-foreground">
          Please complete the following steps to set up your SME profile
        </p>
      </div>
      <MultiStepForm
        steps={stepsData}
        businessDetailsRef={businessDetailsRef}
        companyIdentificationRef={companyIdentificationRef}
        financialFormRef={financialFormRef}
        onComplete={async () => {
          const orgData: Organisation = {
            organisationName: smeDetails.legalName,
            orgType: "sme",
            organisationImage: "",
          };
          try {
            toast.loading("Creating organization...");
            const result = await createOrganizationAction(
              orgData,
              {
                id: "",
                userId: "",
                ...smeDetails,
                gstEffectiveDate: new Date(smeDetails.gstEffectiveDate),
                incorporationDate: new Date(smeDetails.incorporationDate),
                companyName: smeDetails.legalName,
                eligibilityStatus: EligibilityStatus.Pending,
              },
              undefined
            );
            toast.dismiss();
            toast.success("Organization created successfully!");

            if (onComplete && result?.smeCompanyId) {
              onComplete(result.smeCompanyId);
            } else if (onComplete) {
              onComplete();
            }
          } catch (error) {
            console.error("Error creating organization:", error);
            toast.dismiss();
            toast.error("Failed to create organization. Please try again.");
            return;
          }
        }}
        isSubmitting={false}
      />
    </div>
  );
}
