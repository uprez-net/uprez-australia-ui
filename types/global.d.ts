import Stripe from "stripe";
import { Plan } from "@/app/interface/interface";

declare global {
  interface UserPublicMetadata {
    organizationId?: string;
    orgType?: 'sme' | 'intermediary';
    subscriptionPlan?: Plan;
    subscriptionStatus?: Stripe.Subscription.Status;
    subscriptionId?: string;
    subscriptionEndDate?: number | null; // Unix timestamp for when the subscription ends
  }
}