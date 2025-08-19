import { createClerkClient } from "@clerk/nextjs/server";

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
})

export async function getUserRoleInOrg(userId: string, orgId: string) {
      const memberships = await clerkClient.users.getOrganizationMembershipList({
        userId,
    });
    if (!memberships.data || memberships.data.length === 0) {
      throw new Error("User is not a member of any organization");
    }

  const orgMembership = memberships.data.find(m => m.organization.id === orgId);
    if (!orgMembership) {
        throw new Error(`User is not a member of organization with ID ${orgId}`);
    }
  return orgMembership.role;
}