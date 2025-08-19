"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IPOEligibilityResult } from "@/components/ipo-eligibility-result";
import { Button } from "@/components/ui/button";
import { EligibilityStatus } from "@prisma/client";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scenario, setScenario] = useState<EligibilityStatus>(
    EligibilityStatus.Pending
  );
  const [companyName, setCompanyName] = useState("Unnamed Company");
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    // Get initial scenario and company name from URL params
    const initialScenario = searchParams.get("scenario");
    const initialCompanyName = searchParams.get("companyName");
    const initialClientId = searchParams.get("clientId");

    if (initialScenario) {
      setScenario(initialScenario as EligibilityStatus);
    }

    if (initialCompanyName) {
      setCompanyName(decodeURIComponent(initialCompanyName));
    }

    if (initialClientId) {
      setClientId(initialClientId);
    }
  }, [searchParams]);

  const eligibleReasons = [
    "Paid-up capital meets SME requirements (₹1 crore - ₹25 crores)",
    "Company operational for required minimum period",
    "Financial statements are audited and up-to-date",
    "No regulatory restrictions or pending legal issues",
    "Meets minimum net worth requirements",
  ];

  const notEligibleReasons = [
    "Paid-up capital below minimum requirement of ₹1 crore",
    "Company operational for less than 3 years",
    "Latest financial statements not audited",
    "Pending regulatory compliance issues",
  ];

  const mainboardReasons = [
    "Paid-up capital exceeds ₹25 crores (SME limit)",
    "Annual turnover above ₹500 crores",
    "Company size suitable for mainboard listing",
    "Strong financial performance and market presence",
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto">
        {/* Demo controls */}
        <div className="py-6 text-center space-x-4">
          <Button
            variant={
              scenario === EligibilityStatus.SME_Eligible
                ? "default"
                : "outline"
            }
            onClick={() => setScenario(EligibilityStatus.SME_Eligible)}
            className={
              scenario === EligibilityStatus.SME_Eligible
                ? "bg-[#027055] hover:bg-[#025a44]"
                : ""
            }
          >
            SME Eligible
          </Button>
          <Button
            variant={
              scenario === EligibilityStatus.Mainboard_Eligible
                ? "default"
                : "outline"
            }
            onClick={() => setScenario(EligibilityStatus.Mainboard_Eligible)}
            className={
              scenario === EligibilityStatus.Mainboard_Eligible
                ? "bg-[#027055] hover:bg-[#025a44]"
                : ""
            }
          >
            Mainboard Eligible
          </Button>
          <Button
            variant={
              scenario === EligibilityStatus.Not_Eligible
                ? "destructive"
                : "outline"
            }
            onClick={() => setScenario(EligibilityStatus.Not_Eligible)}
          >
            Not Eligible
          </Button>
        </div>

        {/* Eligibility Result */}
        {scenario === EligibilityStatus.SME_Eligible && (
          <IPOEligibilityResult
            isEligible={true}
            eligibilityType="sme"
            companyName={companyName}
            reasons={eligibleReasons}
            onContinue={() => router.push(`/dashboard/client/${clientId}`)}
          />
        )}

        {scenario === EligibilityStatus.Mainboard_Eligible && (
          <IPOEligibilityResult
            isEligible={true}
            eligibilityType="mainboard"
            companyName={companyName}
            reasons={mainboardReasons}
            onLearnMore={() =>
              alert("Learning about mainboard requirements...")
            }
          />
        )}

        {scenario === EligibilityStatus.Not_Eligible && (
          <IPOEligibilityResult
            isEligible={false}
            eligibilityType="none"
            companyName={companyName}
            reasons={notEligibleReasons}
            onLearnMore={() => alert("Learning how to become eligible...")}
          />
        )}
      </div>
    </main>
  );
}
