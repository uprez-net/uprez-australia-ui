"use server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Intermediary, Organisation, SWE } from "../interface/interface";
import {
  createIntermediaryAction,
  createSWEAction,
} from "./createUserOrgAction";
import { createUserAction } from "./createUserAction";
import prisma from "@/lib/prisma";

export async function createOrganizationAction(
  orgData: Organisation,
  swe?: SWE,
  intermediary?: Intermediary
) {
  try {
    const client = await clerkClient();

    const organization = await client.organizations.createOrganization({
      name: orgData.organisationName,
      publicMetadata: {
        orgType: orgData.orgType,
      },
    });

    if (!organization) {
      throw new Error("Organization not created");
    }
    const user = await currentUser();
    if (!user) {
      throw new Error("User not found");
    }
    // Ensure user exists in local DB
    let localUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!localUser) {
      await createUserAction({
        id: user.id,
        name: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : user.username || user.emailAddresses?.[0]?.emailAddress || "",
        email: user.emailAddresses?.[0]?.emailAddress || "",
        role: "TeamMember", // Default role, will be updated below
      });
    }
    const adminAllocation =
      await client.organizations.createOrganizationMembership({
        organizationId: organization.id,
        userId: user.id!,
        role: "org:admin",
      });
    if (!adminAllocation) {
      throw new Error("Organization admin not created");
    }

    await client.users.updateUser(user.id, {
      publicMetadata: {
        organizationId: organization.id,
        orgType: orgData.orgType,
      },
    });

    let result: { smeCompanyId?: string; intermediaryId?: string } = {};

    if (orgData.orgType === "sme" && swe) {
      const { id, userId, ...sweData } = swe;
      const sweResult = await createSWEAction({
        id: organization.id,
        userId: user.id,
        ...sweData,
      });
      result.smeCompanyId = sweResult.smeCompany.id;
    } else if (orgData.orgType === "intermediary" && intermediary) {
      Object.assign(intermediary, {
        id: organization.id,
        userId: user.id,
      });
      const intermediaryResult = await createIntermediaryAction(intermediary);
      result.intermediaryId = intermediaryResult.id;
    }

    return result;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw new Error("Failed to create organization");
  }
}
