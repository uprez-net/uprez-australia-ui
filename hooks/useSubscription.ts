"use client";
import { useUser } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useUpgradeDialog } from "@/context/UpgradeDialogContext";
import { RootState } from "@/app/redux/store";
import { Stripe } from "stripe";

type PlanType = "basic" | "growth" | "corporate";

const planLimits: Record<PlanType, number | null> = {
  basic: 1,
  growth: 5,
  corporate: null, // unlimited
};

const planUpgradePath: Record<PlanType, PlanType | null> = {
  basic: "growth",
  growth: "corporate",
  corporate: null,
};

export const useSubscription = () => {
  const { user, isLoaded } = useUser();
  const { openUpgradeDialog } = useUpgradeDialog();
  const hasAttemptedGeneration = useRef(false);

  const clientData = useSelector((state: RootState) => state.client.clientData);

  const plan = (user?.publicMetadata?.subscriptionPlan ?? null) as PlanType | null;
  const planStatus = user?.publicMetadata?.subscriptionStatus as Stripe.Subscription.Status | undefined;
  const planEndDate = user?.publicMetadata?.subscriptionEndDate as Date | undefined;
  const currentGenerationCount = clientData?.generationNumber ?? 0;
  // const currentGenerationCount = 0; // For testing purposes, replace with actual logic if needed
  const subscriptionId = user?.publicMetadata?.subscriptionId;
  const limit = plan && planLimits[plan] !== undefined ? planLimits[plan] : null;

  const canGenerateMore =
    limit === null ? true : currentGenerationCount < limit;

  useEffect(() => {
    if (isLoaded && plan === null && hasAttemptedGeneration.current) {
      openUpgradeDialog("basic");
    }
    else if (
      isLoaded &&
      !canGenerateMore &&
      planStatus !== "active" &&
      plan !== null &&
      planUpgradePath[plan] &&
      hasAttemptedGeneration.current
    ) {
      openUpgradeDialog(planUpgradePath[plan]!);
    }
  }, [canGenerateMore, plan, isLoaded]);

  const attemptGeneration = () => {
    hasAttemptedGeneration.current = true;
    if (!canGenerateMore && plan && planUpgradePath[plan]) {
      openUpgradeDialog(planUpgradePath[plan]!);
    }
    else if (!canGenerateMore && plan === null) {
      openUpgradeDialog("basic");
    }
    return canGenerateMore;
  };

  return {
    isLoading: !isLoaded,
    userId: user?.id,
    plan,
    planStatus,
    planEndDate,
    subscriptionId,
    generationCount: currentGenerationCount,
    generationLimit: limit,
    attemptGeneration,
  };
};
