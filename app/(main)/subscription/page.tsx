"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { PlanToPriceId } from "@/app/interface/interface";
import getCheckoutSession from "@/lib/stripe/checkoutSubscription";
import { getStripe } from "@/lib/stripe";
import { toast } from "sonner";
import { cancelSubscription } from "@/lib/stripe/cancelSubscription";
import { cn } from "@/lib/utils";
import { Countdown } from "@/components/CountDown";
import { useMemo } from "react";

function convertINRtoAUD(inr: number ): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AUD",
  });

  return formatter.format(inr);
}

export default function Component() {
  const { userId, subscriptionId, plan, planStatus, planEndDate, isLoading } =
    useSubscription();
  const plans = useMemo(
    () => [
      {
        name: "Basic",
        id: "basic",
        description: "Perfect for individuals and small teams.",
        price: convertINRtoAUD(300),
        priceSuffix: "/month",
        features: [
          "Up to 5 users",
          // "10 GB storage",
          "1 generation per client",
          "Basic analytics",
          "Email support",
        ],
        buttonText: "Get Started",
        link: "#",
        isFeatured: false,
        checkout: () => handleCheckout("basic" as keyof typeof PlanToPriceId),
        isActive: planStatus === "active" && plan === "basic",
        isCancelled: typeof planEndDate === "number" && plan === "basic",
      },
      {
        name: "Growth",
        id: "growth",
        description: "Scale your business with advanced features.",
        price: convertINRtoAUD(1600),
        priceSuffix: "/month",
        features: [
          "Up to 10 users",
          // "100 GB storage",
          "Advanced analytics",
          "5 generations per client",
          "Priority email support",
          "Custom integrations",
        ],
        buttonText: "Get Started",
        link: "#",
        isFeatured: true,
        checkout: () => handleCheckout("growth" as keyof typeof PlanToPriceId),
        isActive: planStatus === "active" && plan === "growth",
        isCancelled: typeof planEndDate === "number" && plan === "growth",
      },
      {
        name: "Corporate",
        id: "corporate",
        description: "Tailored solutions for large enterprises.",
        price: "Contact Sales",
        priceSuffix: "",
        features: [
          "Unlimited users",
          // "Unlimited storage",
          "Unlimited generations per client",
          "Dedicated account manager",
          "24/7 phone support",
          // "On-premise deployment",
          "Custom security features",
        ],
        buttonText: "Contact Sales",
        // mailto link with subject and body
        link: "mailto:sales@yourcompany.com?subject=Corporate%20Plan%20Inquiry&body=Hello%20Sales%20Team%2C%0A%0AI%20am%20interested%20in%20the%20Corporate%20plan.%20Please%20provide%20more%20details.%0A%0AThanks%2C%0A",
        isFeatured: false,
        isActive: planStatus === "active" && plan === "corporate",
        isCancelled: typeof planEndDate === "number" && plan === "corporate",
      },
    ],
    [plan, planStatus, planEndDate, isLoading]
  );

  const handleCheckout = async (planId: keyof typeof PlanToPriceId) => {
    if (isLoading || !userId) {
      return;
    }
    try {
      const checkoutSession = await getCheckoutSession(
        PlanToPriceId[planId],
        userId,
        subscriptionId
      );
      if (
        checkoutSession.type === "upgrade" ||
        checkoutSession.type === "renewal"
      ) {
        // router.replace(checkoutSession.sessionId);
        window.location.href = checkoutSession.sessionId; // Redirect to the billing portal
        return;
      }
      const stripe = await getStripe();
      if (!checkoutSession || !stripe) {
        throw new Error("Failed to create checkout session or load Stripe.");
      }
      const { error } = await stripe?.redirectToCheckout({
        sessionId: checkoutSession.sessionId,
      });
      if (error) {
        console.error("Stripe checkout error:", error);
        toast.error("Failed to redirect to checkout. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(
        "An error occurred while processing your request. Please try again later."
      );
      return;
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionId) {
      return;
    }
    try {
      const url = await cancelSubscription(subscriptionId as string);
      // router.replace(url);
      window.location.href = url; // Redirect to the billing portal
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Failed to cancel subscription. Please try again later.");
      return;
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center bg-white p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="mb-12 text-center max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Analyze Your Company's{" "}
          <span className="text-green-600">IPO Eligibility</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 sm:text-xl">
          Empowering <strong className="text-green-700">SMEs</strong> to assess
          their readiness for an IPO — get a clear, data-backed understanding of
          where your company stands before going public.
        </p>
      </div>

      {/* Pricing Plans Grid */}
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col justify-between border-2 ${
              plan.isFeatured
                ? "border-green-500 shadow-lg"
                : "border-gray-200 transition-all hover:border-green-500"
            } ${plan.isActive ? "ring-2 ring-green-600 border-green-600" : ""}`}
          >
            {/* Show countdown if plan is cancelled */}
            {plan.isCancelled && planEndDate && (
              <div className="absolute top-2 right-2 bg-amber-100 text-amber-700 px-3 py-1 rounded text-xs font-semibold shadow z-10">
                <Countdown endDate={planEndDate} />
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-green-700">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="text-4xl font-bold text-gray-900">
                {plan.price}
                {plan.priceSuffix && (
                  <span className="text-lg font-normal text-gray-600">
                    {plan.priceSuffix}
                  </span>
                )}
              </div>
              <ul className="space-y-2 text-gray-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.isActive && !plan.isCancelled ? (
                <Button
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </Button>
              ) : (
                <Button
                  asChild
                  className={cn(
                    "w-full",
                    plan.isCancelled
                      ? "bg-amber-400 text-white hover:bg-amber-500"
                      : "bg-green-600 text-white hover:bg-green-700"
                  )}
                  onClick={plan.checkout}
                >
                  {plan.link !== "#" ? (
                    <a href={plan.link} className="select-none">
                      {plan.isCancelled
                        ? "Renew Subscription"
                        : plan.buttonText}
                    </a>
                  ) : (
                    <span className="select-none">
                      {plan.isCancelled
                        ? "Renew Subscription"
                        : plan.buttonText}
                    </span>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
