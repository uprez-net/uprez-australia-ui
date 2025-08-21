"use client";

import { useRef, useState } from "react";
import {
  BusinessDetailsForm,
  BusinessDetailsFormHandle,
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
                {!isNaN(Number(smeData.paidUpCapital))
                  ? Number(smeData.paidUpCapital).toLocaleString("en-AU", {
                      style: "currency",
                      currency: "AUD",
                    })
                  : "-"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Annual Turnover:</span>{" "}
                {!isNaN(Number(smeData.turnover))
                  ? Number(smeData.turnover).toLocaleString("en-AU", {
                      style: "currency",
                      currency: "AUD",
                    })
                  : "-"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Net Worth:</span>{" "}
                {!isNaN(Number(smeData.netWorth))
                  ? Number(smeData.netWorth).toLocaleString("en-AU", {
                      style: "currency",
                      currency: "AUD",
                    })
                  : "-"}
              </p>
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
