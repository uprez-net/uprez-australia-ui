"use client"

import { CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EligibilityResultProps {
  isEligible: boolean
  eligibilityType?: "sme" | "mainboard" | "none"
  companyName?: string
  reasons?: string[]
  onContinue?: () => void
  onLearnMore?: () => void
}

export function IPOEligibilityResult({
  isEligible,
  eligibilityType = "sme",
  companyName = "Your Company",
  reasons = [],
  onContinue,
  onLearnMore,
}: EligibilityResultProps) {
  const getStatusConfig = () => {
    if (isEligible && eligibilityType === "sme") {
      return {
        icon: <CheckCircle className="h-12 w-12 text-[#027055]" />,
        status: "Eligible for SME IPO",
        statusColor: "text-[#027055]",
        badgeVariant: "default" as const,
        badgeClass: "bg-[#027055] hover:bg-[#025a44]",
        explanation:
          "Congratulations! Your company meets all the basic requirements for listing on BSE SME or NSE Emerge platforms.",
        actionText: "Continue to SME IPO Process",
        actionIcon: <ArrowRight className="h-4 w-4" />,
      }
    } else if (isEligible && eligibilityType === "mainboard") {
      return {
        icon: <CheckCircle className="h-12 w-12 text-[#027055]" />,
        status: "Eligible for Mainboard IPO",
        statusColor: "text-[#027055]",
        badgeVariant: "default" as const,
        badgeClass: "bg-[#027055] hover:bg-[#025a44]",
        explanation:
          "Your company qualifies for mainboard listing. Consider if SME platform might be more suitable for your current stage.",
        actionText: "Learn More About Mainboard Requirements",
        actionIcon: <ArrowRight className="h-4 w-4" />,
      }
    } else {
      return {
        icon: <XCircle className="h-12 w-12 text-destructive" />,
        status: "Not Currently Eligible",
        statusColor: "text-destructive",
        badgeVariant: "destructive" as const,
        badgeClass: "",
        explanation:
          "Your company doesn't meet some of the current requirements for IPO listing. Review the areas below to understand what needs to be addressed.",
        actionText: "Learn How to Become Eligible",
        actionIcon: <AlertCircle className="h-4 w-4" />,
      }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="flex justify-center w-full py-10 px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center pb-6">
          <h1 className="text-2xl font-bold mb-4">Your IPO Eligibility Assessment</h1>
          <div className="flex flex-col items-center space-y-4">
            {config.icon}
            <div className="space-y-2">
              <h2 className={`text-xl font-semibold ${config.statusColor}`}>{config.status}</h2>
              <Badge variant={config.badgeVariant} className={config.badgeClass}>
                {companyName}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground leading-relaxed">{config.explanation}</p>
          </div>

          {reasons.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                {isEligible ? "Key Strengths" : "Areas to Address"}
              </h3>
              <ul className="space-y-2">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    {isEligible ? (
                      <CheckCircle className="h-4 w-4 text-[#027055] mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-sm text-muted-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isEligible && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Next Steps</p>
                  <p className="text-xs text-muted-foreground">
                    Work on addressing the requirements above and reassess your eligibility. Our platform can help guide
                    you through the compliance process.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-6">
          <Button
            onClick={isEligible ? onContinue : onLearnMore}
            className="w-full bg-[#027055] hover:bg-[#025a44] flex items-center justify-center space-x-2"
            size="lg"
          >
            <span>{config.actionText}</span>
            {config.actionIcon}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
