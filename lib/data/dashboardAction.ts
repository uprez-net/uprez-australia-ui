"use server";
import prisma from "../prisma";
import { currentUser } from "@clerk/nextjs/server";
import { UserBackendSession } from "@/app/interface/interface";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getDashboardData() {
  try {
    let organisation = null;
    const user = await currentUser();
    if (!user) {
      throw new Error("User not found");
    }
    const { publicMetadata } = user;
    const organizationId = publicMetadata.organizationId as string;
    const orgType = publicMetadata.orgType as "intermediary" | "sme";
    if (orgType === "intermediary") {
      organisation = await prisma.intermediaryProfile.findFirst({
        where: {
          id: organizationId,
        },
        include: {
          SMECompany: true,
        },
      });
    } else if (orgType === "sme") {
      organisation = await prisma.sMEProfile.findFirst({
        where: {
          id: organizationId,
        },
        include: {
          SMECompany: true,
        },
      });
    }
    if (!organisation) {
      throw new Error("Organization not found");
    }
    const { SMECompany: SWE, ...rest } = organisation;
    return {
      SWE,
      organization: rest,
      orgType,
      userId: user.id,
      organizationId,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch dashboard data"
    );
  }
}

export async function deleteSMECompanyAction(id: string) {
  try {
    const docs = await prisma.document.findMany({
      where: {
        smeCompanyId: id,
      },
    });

    const clientSession = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        email: "admin@uprez.net",
        company_id: crypto.randomUUID(),
        role: "org:admin",
      }),
    });

    if (!clientSession.ok) {
      throw new Error("Failed to create client session");
    }
    const sessionData: UserBackendSession = await clientSession.json();

    if (docs.length > 0) {
      await prisma.document.deleteMany({
        where: {
          smeCompanyId: id,
        },
      });
      await Promise.all(
        docs.map(async (doc) => {
          // await deleteFile(doc.customKey);
          await fetch(`${BASE_URL}/api/v1/delete/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionData.access_token}`,
            },
          });
        })
      );
    }

    const deletedSMECompany = await prisma.sMECompany.delete({
      where: {
        id,
      },
    });
    return deletedSMECompany;
  } catch (error) {
    console.error("Error deleting SME Company:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete SME Company"
    );
  }
}
