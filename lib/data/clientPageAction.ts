"use server";
import { BasicCheckStatus, Document } from "@prisma/client";
import prisma from "../prisma";
import { currentUser } from "@clerk/nextjs/server";
import { getUserRoleInOrg } from "../clerk";
import { UserBackendSession } from "@/app/interface/interface";
import { getAllLabelsForDocumentType } from "@/utils/convertDocumentType";
import { stat } from "fs";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";
const IPO_BACKEND_URL =
  process.env.NEXT_PUBLIC_IPO_BACKEND_URL || "http://localhost:4000/api";

export const fetchClientData = async (clientId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const organizationId = user.publicMetadata.organizationId as string;
    const email = user.emailAddresses[0]?.emailAddress ?? "";
    const username = user.username ?? email;

    // Start both queries in parallel
    const [clientData, userRole] = await Promise.all([
      prisma.sMECompany.findUnique({
        where: { id: clientId },
        include: { 
          Documents: true,
          ipoValuations: true,
        },
      }),
      getUserRoleInOrg(user.id, organizationId || ""),
    ]);

    if (!clientData) {
      throw new Error("Client not found");
    }

    const clientSession = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        company_id: clientId,
        role: userRole,
      }),
    });

    if (!clientSession.ok) {
      throw new Error("Failed to create client session");
    }

    const sessionData: UserBackendSession = await clientSession.json();
    console.log("Session Data:", sessionData);

    return { ...clientData, sessionToken: sessionData.access_token, IPOValuations: clientData.ipoValuations };
  } catch (error) {
    console.error("Error fetching client data:", error);
    throw new Error("Failed to fetch client data");
  }
};

export const createDocument = async (
  Document: Document,
  sessionToken: string,
  isIPO: boolean = false
) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (isIPO) {
      console.log("Creating IPO Document:", Document);
      //Register Company IPO Document in IPO Backend
      const companyRes = await fetch(`${IPO_BACKEND_URL}/v1/register-company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Document.smeCompanyId,
        }),
      });
      if (!companyRes.ok) {
        console.error("Failed to register company in IPO backend:", companyRes.statusText);
        throw new Error("Failed to register company in IPO backend");
      }
      // Additional logic for IPO documents can be added here
      const res = await fetch(`${IPO_BACKEND_URL}/v1/valuation-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Document.id,
          client_account_id: Document.smeCompanyId,
          bucket_link: Document.uploadThingKey,
          status: "pending",
          filename: Document.fileName,
        }),
      });
      if (!res.ok) {
        console.error("Failed to create IPO document in backend:", res.statusText);
        throw new Error("Failed to create IPO document in backend");
      }

      const newDocument = await prisma.document.create({
        data: {
          ...Document,
          uploadedById: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return newDocument;
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        id: Document.id,
        client_account_id: Document.smeCompanyId,
        frontend_document_id: Document.id,
        upload_thing_key: Document.uploadThingKey,
        period_year: Document.periodYear,
        file_name: Document.fileName,
        document_type: getAllLabelsForDocumentType(Document.documentType),
        copy_status: "Pending",
      }),
    });
    if (!res.ok) {
      console.error("Failed to create document in backend:", res.statusText);
      throw new Error("Failed to create document in backend");
    }
    const backendDocument:
      | {
        success: boolean;
        message: string;
        document_id: string;
      }
      | { detail: string } = await res.json();

    if ("detail" in backendDocument) {
      console.error("Backend error:", backendDocument.detail);
      throw new Error(backendDocument.detail);
    }
    console.log("Backend Document:", backendDocument);
    console.log(
      "Document ID Same:",
      backendDocument.document_id === Document.id
    );
    console.log("Trigger Payload:");
    console.log({
      id: Document.id,
      client_account_id: Document.smeCompanyId,
      frontend_document_id: Document.id,
      upload_thing_key: Document.uploadThingKey,
      period_year: Document.periodYear,
      file_name: Document.fileName,
      document_type: getAllLabelsForDocumentType(Document.documentType),
      copy_status: "Pending",
    });

    // const response = await fetch(`${BACKEND_URL}/api/v1/generation/trigger`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${sessionToken}`,
    //   },
    //   body: JSON.stringify({
    //     id: Document.id,
    //     client_account_id: Document.smeCompanyId,
    //     frontend_document_id: Document.id,
    //     upload_thing_key: Document.uploadThingKey,
    //     period_year: Document.periodYear,
    //     file_name: Document.fileName,
    //     document_type: getAllLabelsForDocumentType(Document.documentType),
    //     copy_status: "Pending",
    //     callback_url: `${process.env.BASE_URL ?? "http://localhost:3000"}/api/webhooks/generation`,
    //   }),
    // });
    // if (!response.ok) {
    //   console.error("Failed to trigger generation:", response.statusText);
    //   const errorData = await response.json();
    //   console.error("Error Details:", errorData);
    //   throw new Error("Failed to trigger generation");
    // }
    // const generationData: {
    //   client_id: string;
    //   generation_number: number;
    //   generation_id: string;
    //   task_id: string; // Celery Task ID
    // } = await response.json();
    // console.log("Generation Data:", generationData);

    const newDocument = await prisma.document.create({
      data: {
        ...Document,
        // generationId: generationData.generation_id,
        uploadedById: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return newDocument;
  } catch (error) {
    console.error("Error creating document:", error);
    throw new Error("Failed to create document");
  }
};

export const deleteDocument = async (documentId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const deletedDocument = await prisma.document.delete({
      where: { id: documentId },
    });

    return deletedDocument;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }
};

export const triggerGeneration = async (
  sessionToken: string,
  Document: Document
) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/generation/trigger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        // id: Document.id,
        client_account_id: Document.smeCompanyId,
        // frontend_document_id: Document.id,
        // upload_thing_key: Document.uploadThingKey,
        // period_year: Document.periodYear,
        // file_name: Document.fileName,
        // document_type: getAllLabelsForDocumentType(Document.documentType),
        // copy_status: "Pending",
        callback_url: `${process.env.BASE_URL ?? "http://localhost:3000"
          }/api/webhooks/generation`,
      }),
    });
    if (!response.ok) {
      console.error("Failed to trigger generation:", response.statusText);
      const errorData = await response.json();
      console.error("Error Details:", errorData);
      throw new Error("Failed to trigger generation");
    }
    const generationData: {
      client_id: string;
      generation_number: number;
      generation_id: string;
      task_id: string; // Celery Task ID
    } = await response.json();
    console.log("Generation Data:", generationData);

    await prisma.sMECompany.update({
      where: { id: Document.smeCompanyId },
      data: {
        eligibilityStatus: "Pending",
        complianceStatus: "pending",
        generationId: generationData.generation_id,
        generationNumber: generationData.generation_number, //Added to track generation number
        updatedAt: new Date(),
        Documents: {
          updateMany: {
            where: {
              smeCompanyId: Document.smeCompanyId,
              NOT: {
                basicCheckStatus: BasicCheckStatus.Passed
              }
            },
            data: {
              generationId: generationData.generation_id,
              generationNumber: generationData.generation_number, // Added to track generation number
            },
          },
        }
      },
    });

    return {
      success: true,
      message: "Generation triggered successfully",
      generationId: generationData.generation_id,
      generationNumber: generationData.generation_number,
    };
  } catch (error) {
    console.error("Error triggering generation:", error);
    throw new Error("Failed to trigger generation");
  }
};
