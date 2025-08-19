"use server";
import Stripe from "stripe";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

const getCheckoutSession = async (
  priceId: string,
  userId: string,
  subscriptionId?: string
) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Upgrade/Downgrade logic
      if (
        subscription.status === "active" &&
        subscription.cancel_at_period_end === false
      ) {
        // const updatedSubscription = await stripe.subscriptions.update(
        //   subscriptionId,
        //   {
        //     items: [
        //       {
        //         id: subscription.items.data[0].id,
        //         price: priceId,
        //       },
        //     ],
        //     proration_behavior: "create_prorations",
        //   }
        // );
        const session = await stripe.billingPortal.sessions.create({
          customer: subscription.customer as string,
          return_url: `${baseUrl}/dashboard`,
        });

        return {
          type: "upgrade",
          sessionId: session.url,
        };
      }

      //Renewal logic
      if (subscription.cancel_at_period_end) {
        // const updatedSubscription = await stripe.subscriptions.update(
        //   subscriptionId,
        //   {
        //     cancel_at_period_end: false,
        //     items: [
        //       {
        //         id: subscription.items.data[0].id,
        //         price: priceId,
        //       },
        //     ],
        //   }
        // );
        const session = await stripe.billingPortal.sessions.create({
          customer: subscription.customer as string,
          return_url: `${baseUrl}/dashboard`,
        });

        return {
          type: "renewal",
          sessionId: session.url,
        };
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseUrl}/dashboard`,
      cancel_url: `${baseUrl}/subscription`,
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });
    return {
      type: "checkout",
      sessionId: session.id,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

export default getCheckoutSession;
