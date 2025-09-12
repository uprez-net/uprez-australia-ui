"use client";

import type React from "react";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BusinessDetailsFormHandle } from "./business-details-form";
import { CompanyIdentificationFormHandle } from "./company-identification-form";
import { FinancialInformationFormHandle } from "./financial-information-form";

interface MultiStepFormProps {
  steps: {
    title: string;
    content: React.ReactNode;
  }[];
  onComplete?: () => void;
  businessDetailsRef?: React.RefObject<BusinessDetailsFormHandle | null>
  companyIdentificationRef?: React.RefObject<CompanyIdentificationFormHandle | null>
  financialFormRef?: React.RefObject<FinancialInformationFormHandle | null>
  isSubmitting: boolean;
}

export function MultiStepForm({ steps, onComplete, businessDetailsRef, financialFormRef, companyIdentificationRef, isSubmitting }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      switch (steps[currentStep].title) {
        case "Business Information":
          if (businessDetailsRef?.current) {
            const isValid = await businessDetailsRef.current.submit()
            if (!isValid) return
          }
          break
        case "Company Identification":
          if (companyIdentificationRef?.current) {
            const isValid = await companyIdentificationRef.current.submit()
            if (!isValid) return
          }
          break
        case "Financial Information":
          // Handle financial information validation if needed
          if (financialFormRef?.current) {
            const isValid = await financialFormRef.current.submit()
            console.log(`Form submission valid: ${isValid}`);
            if (!isValid) return
          }
          break
        default:
          break
      }
      setCurrentStep(currentStep + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex justify-center w-full py-10 px-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="pb-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span>{steps[currentStep].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="min-h-[400px] py-6 border-y">
          {steps[currentStep].content}
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-[#027055] hover:bg-[#025a44]"
            disabled={isSubmitting}
          >
            {currentStep === totalSteps - 1 ? "Complete" : "Next"}
            {currentStep !== totalSteps - 1 && (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
