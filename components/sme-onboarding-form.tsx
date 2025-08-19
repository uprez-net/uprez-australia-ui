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

export function SmeOnboardingForm({ onComplete }: SmeOnboardingFormProps) {
  const [smeDetails, setSmeDetails] = useState({
    industrySector: "",
    businessDescription: "",
    legalName: "",
    cin: "",
    pan: "",
    tan: "",
    gstin: "",
    paidUpCapital: 0,
    turnover: 0,
    netWorth: 0,
    yearsOperational: 0,
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
              paidUpCapital: data.paidUpCapital,
              turnover: data.turnover,
              netWorth: data.netWorth,
              yearsOperational: data.yearsOperational,
            }));
          }}
        />
      ),
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
      />
    </div>
  );
}
