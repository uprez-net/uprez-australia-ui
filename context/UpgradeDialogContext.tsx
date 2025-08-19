"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlanToPriceId } from "@/app/interface/interface";
import { useSubscription } from "@/hooks/useSubscription";
import getCheckoutSession from "@/lib/stripe/checkoutSubscription";
import { getStripe } from "@/lib/stripe";
import { toast } from "sonner";
import Link from "next/link";
import { Check } from "lucide-react";

type PlanType = "basic" | "growth" | "corporate";

const plans = [
  {
    name: "Basic",
    id: "basic",
    description: "Perfect for individuals and small teams.",
    price: "₹20,000",
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
    // checkout: () => handleCheckout("basic" as keyof typeof PlanToPriceId),
    // isActive: plan === "basic",
  },
  {
    name: "Growth",
    id: "growth",
    description: "Scale your business with advanced features.",
    price: "₹1,00,000",
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
    // checkout: () => handleCheckout("growth" as keyof typeof PlanToPriceId),
    // isActive: plan === "growth",
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
    // isActive: plan === "corporate",
  },
];

const UpgradeDialogContext = createContext({
  openUpgradeDialog: (requiredPlan: PlanType) => {},
});

export const useUpgradeDialog = () => useContext(UpgradeDialogContext);

export const UpgradeDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [requiredPlan, setRequiredPlan] = useState<PlanType>("growth");
  const { userId, isLoading } = useSubscription();
  const selectedPlan = plans.find((p) => p.id === requiredPlan)!;

  const openUpgradeDialog = (plan: PlanType) => {
    setRequiredPlan(plan);
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  const handleCheckout = async (planId: keyof typeof PlanToPriceId) => {
    if (isLoading || !userId) {
      return;
    }
    try {
      const checkoutSession = await getCheckoutSession(
        PlanToPriceId[planId],
        userId
      );
      const stripe = await getStripe();
      if (!checkoutSession || !stripe) {
        throw new Error("Failed to create checkout session or load Stripe.");
      }
      const { error } = await stripe?.redirectToCheckout({
        sessionId: checkoutSession,
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

  return (
    <UpgradeDialogContext.Provider value={{ openUpgradeDialog }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border-green-500 border-2">
          <DialogHeader>
            <DialogTitle className="text-green-700">
              Upgrade Required
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              You’ve reached the limit of your current plan. To continue, please
              upgrade to the{" "}
              <strong className="capitalize text-green-600">
                {selectedPlan.name}
              </strong>{" "}
              plan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="text-3xl font-bold text-gray-900">
              {selectedPlan.price}
              {selectedPlan.priceSuffix && (
                <span className="text-base font-normal text-gray-600">
                  {selectedPlan.priceSuffix}
                </span>
              )}
            </div>
            <ul className="space-y-2 text-gray-700">
              {selectedPlan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2">
            {selectedPlan.id === "corporate" ? (
              <Button
                asChild
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                <Link href={selectedPlan.link}>{selectedPlan.buttonText}</Link>
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleCheckout(selectedPlan.id as keyof typeof PlanToPriceId)
                }
                className="w-full bg-green-600 text-white hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Checkout"}
              </Button>
            )}
            {/* <Button
              onClick={closeDialog}
              variant="outline"
              className="w-full sm:w-auto mt-2 sm:mt-0 border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
            >
              Close
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UpgradeDialogContext.Provider>
  );
};
