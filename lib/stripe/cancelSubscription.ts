"use server";
import Stripe from "stripe";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function cancelSubscription(
  subscriptionId: string,
  atPeriodEnd = true
) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customer as string,
      return_url: `${baseUrl}/dashboard`,
    });

    return session.url;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}
