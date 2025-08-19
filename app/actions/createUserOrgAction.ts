import prisma from "@/lib/prisma";
import { Intermediary, SWE } from "../interface/interface";
import { ComplianceStatus, UserRole } from "@prisma/client";

export const createSWEAction = async (sweData: SWE) => {
  try {
    // Check if SMEProfile already exists for this user
    let existingSMEProfile = await prisma.sMEProfile.findUnique({
      where: { userId: sweData.userId },
    });

    let newSWE;
    if (existingSMEProfile) {
      // Update existing profile
      newSWE = await prisma.sMEProfile.update({
        where: { userId: sweData.userId },
        data: {
          companyName: sweData.companyName,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new profile - use sweData.id (organization ID) as the profile ID
      newSWE = await prisma.sMEProfile.create({
        data: {
          id: sweData.id, // This should be the organization ID from Clerk
          companyName: sweData.companyName,
          userId: sweData.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
    // Only pick valid SMECompany fields
    const validCompanyFields = [
      "companyName",
      "cin",
      "pan",
      "tan",
      "gstin",
      "paidUpCapital",
      "turnover",
      "netWorth",
      "yearsOperational",
      "industrySector",
      "eligibilityStatus",
      "complianceStatus",
      "createdAt",
      "updatedAt",
      "smeProfileId",
      "intermediaryId",
    ];
    const { id, userId, ...rest } = sweData as any;
    delete rest.businessDescription;
    delete rest.legalName;
    // Map legalName to companyName if needed
    if (
      !rest.companyName &&
      "legalName" in sweData &&
      (sweData as any).legalName
    )
      rest.companyName = (sweData as any).legalName;
    // Filter only valid fields
    const companyData: any = {
      smeProfileId: newSWE.id,
      complianceStatus: ComplianceStatus.pending,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    for (const key of validCompanyFields) {
      if (rest[key] !== undefined) companyData[key] = rest[key];
    }
    const newSMECompany = await prisma.sMECompany.create({
      data: companyData,
    });

    await prisma.user.update({
      where: {
        id: sweData.userId,
      },
      data: {
        role: UserRole.SME,
      },
    });

    return { smeProfile: newSWE, smeCompany: newSMECompany };
  } catch (error) {
    console.error("Error creating SWE:", error);
    throw new Error("Failed to create SWE");
  }
};

export const createIntermediaryAction = async (
  intermediaryData: Intermediary
) => {
  try {
    // Check if IntermediaryProfile already exists for this user
    let existingIntermediaryProfile =
      await prisma.intermediaryProfile.findUnique({
        where: { userId: intermediaryData.userId },
      });

    let newIntermediary;
    if (existingIntermediaryProfile) {
      // Update existing profile
      newIntermediary = await prisma.intermediaryProfile.update({
        where: { userId: intermediaryData.userId },
        data: {
          firmName: intermediaryData.firmName,
          type: intermediaryData.type,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new profile - use intermediaryData.id (organization ID) as the profile ID
      newIntermediary = await prisma.intermediaryProfile.create({
        data: {
          id: intermediaryData.id, // This should be the organization ID from Clerk
          userId: intermediaryData.userId,
          firmName: intermediaryData.firmName,
          type: intermediaryData.type,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    await prisma.user.update({
      where: {
        id: intermediaryData.userId,
      },
      data: {
        role: UserRole.Intermediary,
      },
    });

    return newIntermediary;
  } catch (error) {
    console.error("Error creating Intermediary:", error);
    throw new Error("Failed to create Intermediary");
  }
};
