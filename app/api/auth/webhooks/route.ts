import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { UserData } from "@/app/interface/interface";
import { UserRole } from "@prisma/client";
import { createUserAction } from "@/app/actions/createUserAction";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    try {
        const evt = await verifyWebhook(request)
        if (!evt) {
            console.error("Invalid webhook event");
            console.dir(evt);
            return new Response("Invalid webhook", { status: 400 });
        }

        switch (evt.type) {
            case "user.created":
                const {
                    email_addresses,
                    first_name,
                    last_name,
                    id,
                } = evt.data;
                const newUser: UserData = {
                    id,
                    name: `${first_name} ${last_name}`,
                    email: email_addresses[0].email_address,
                    role: UserRole.TeamMember,
                }
                await createUserAction(newUser);
                return new Response("User created", { status: 200 });
            case "organizationMembership.created":
                const {
                    organization,
                    public_user_data,
                } = evt.data;
                const client = await clerkClient();
                const userId = public_user_data.user_id;
                const orgType = organization.public_metadata?.orgType as "sme" | "intermediary";
                const orgId = organization.id;
                if (orgType === "sme") {
                    await client.users.updateUser(userId, {
                        publicMetadata: {
                            organizationId: orgId,
                            orgType: "sme",
                        },
                    });
                }
                else if (orgType === "intermediary") {
                    await client.users.updateUser(userId, {
                        publicMetadata: {
                            organizationId: orgId,
                            orgType: "intermediary",
                        },
                    });
                }
                return new Response("User role updated", { status: 200 });
        }

        return new Response("Webhook event not handled", { status: 200 });

    } catch (error) {
        console.error("Error verifying webhook:", error);
        return new Response("Error verifying webhook", { status: 400 });
    }
}