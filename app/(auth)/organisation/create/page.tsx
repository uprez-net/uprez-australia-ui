"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IntermediaryForm } from "@/components/intermediary-form";
import { SmeOnboardingForm } from "@/components/sme-onboarding-form";

export default function OnboardingPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"sme" | "intermediary" | null>(null);

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      {!userType ? (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome! Let's get started</h1>
            <p className="text-muted-foreground">
              Please select your user type to continue
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setUserType("sme")}
            >
              <CardHeader>
                <Building2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Small & Medium Enterprise</CardTitle>
                <CardDescription>
                  I represent a company seeking to raise capital through an SME
                  IPO
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full bg-[#027055] hover:bg-[#025a44]">
                  Select SME
                </Button>
              </CardFooter>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setUserType("intermediary")}
            >
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Intermediary</CardTitle>
                <CardDescription>
                  I represent a financial institution or advisory firm assisting
                  SMEs
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full bg-[#027055] hover:bg-[#025a44]">
                  Select Intermediary
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : userType === "intermediary" ? (
        <IntermediaryForm onComplete={() => router.push("/dashboard")} />
      ) : (
        <SmeOnboardingForm
          onComplete={(smeCompanyId) => {
            // if (smeCompanyId) {
            //   router.push(`/dashboard/client/${smeCompanyId}/upload`);
            // } else {
              router.push("/dashboard");
            // }
          }}
        />
      )}
    </div>
  );
}
