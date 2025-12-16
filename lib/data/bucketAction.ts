"use server";
import { buildObjectPath, getContentType } from "@/utils/uploadHelper";
import { bucket } from "../bucket";
import { deleteDocument } from "./clientPageAction";

export const generateSignedUrl = async (
  file: {
    name: string;
    type: string;
  },
  smeId: string
) => {
  try {
    console.log("File Type:", file.type);
    const filePath = buildObjectPath(smeId, file.name);
    const [url] = await bucket.file(filePath).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 1000 * 60 * 15, // 15 minutes
      contentType: getContentType(file.name),
    });

    return { url, filePath };
  } catch (err) {
    console.error("Error generating signed URL:", err);
    throw err;
  }
};

export const deleteJustFile = async (filePath: string) => {
  try {
    await bucket.file(filePath).delete();
    console.log("File deleted successfully:", filePath);
  } catch (err) {
    console.error("Error deleting file:", err);
    throw err;
  }
};

export const deleteFile = async (filePath: string, documentId: string) => {
  try {
    // const filePath = buildObjectPath(smeId, fileName);

    // Delete from GCS (returns a promise)
    await bucket.file(filePath).delete();
    console.log("File deleted successfully:", filePath);

    // Delete the document after file deletion
    const res = await deleteDocument(documentId);
    console.log("Document deleted successfully:", documentId);
    return res;
  } catch (err) {
    console.error("Error deleting file or document:", err);
    throw err; // rethrow if caller should handle
  }
};

export const getPublicUrl = async (filePath: string) => {
  try {
    const [url] = await bucket.file(filePath).getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 1000 * 60 * 30, // 30 minutes
    });
    return url;
  } catch (err) {
    console.error("Error generating public URL:", err);
    throw err;
  }
};
