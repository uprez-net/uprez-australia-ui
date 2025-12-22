"use client";

import type React from "react";

import { deleteJustFile, generateSignedUrl } from "@/lib/data/bucketAction";
import { useState } from "react";
import { Upload, X, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import axios from "axios";
import { getContentType } from "@/utils/uploadHelper";
import { toast } from "sonner";

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB

interface FileUploadState {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  path?: string;
  error?: string;
}

interface UploadDropzoneProps {
  smeCompanyId: string;
  onClientUploadComplete: (
    response: {
      path: string;
      name: string;
      contentType: string;
      size: number;
    }[]
  ) => void;
  onUploadError: (error: Error) => void;
  heading?: string;
  subtext?: string;
}

export default function UploadDropzone({
  smeCompanyId,
  onClientUploadComplete,
  onUploadError,
  heading,
  subtext
}: UploadDropzoneProps) {
  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const setProgress = (fileName: string, pct: number) => {
    setFileStates((prev) =>
      prev.map((fileState) =>
        fileState.file.name === fileName
          ? { ...fileState, progress: pct, status: "uploading" as const }
          : fileState
      )
    );
  };

  const setFileStatus = (
    fileName: string,
    status: FileUploadState["status"],
    error?: string,
    path?: string,
  ) => {
    setFileStates((prev) =>
      prev.map((fileState) =>
        fileState.file.name === fileName
          ? { ...fileState, status, error, path }
          : fileState
      )
    );
  };

  const onUpload = async (files: File[]) => {
    try {
      setIsUploading(true);

      const initialFileStates: FileUploadState[] = files.map((file) => ({
        file,
        progress: 0,
        status: "pending",
      }));
      setFileStates(initialFileStates);

      const uploadedFiles = await Promise.allSettled(
        files.map(async (file) => {
          try {
            const { url: signedUrl, filePath } = await generateSignedUrl(
              {
                name: file.name,
                type: file.type,
              },
              smeCompanyId
            );

            await putWithProgress(signedUrl, file, (pct) =>
              setProgress(file.name, pct)
            );

            setFileStatus(file.name, "completed", undefined, filePath);

            return {
              path: filePath,
              name: file.name,
              contentType: getContentType(file.name),
              size: file.size,
            };
          } catch (error) {
            setFileStatus(
              file.name,
              "error",
              error instanceof Error ? error.message : String(error)
            );
            throw error;
          }
        })
      );

      const successfulUploads = uploadedFiles
        .filter(
          (
            result
          ): result is PromiseFulfilledResult<{
            path: string;
            name: string;
            contentType: string;
            size: number;
          }> => result.status === "fulfilled"
        )
        .map((result) => result.value);

      const failedUploads = uploadedFiles
        .filter(
          (result): result is PromiseRejectedResult =>
            result.status === "rejected"
        )
        .map((result) => result);

      if (failedUploads.length > 0) {
        throw new Error(
          `Failed To Upload: ${failedUploads.map((f) => f.reason).join(", ")}`
        );
      }

      onClientUploadComplete(successfulUploads);
    } catch (error) {
      if (error instanceof Error) {
        onUploadError(error);
      } else {
        onUploadError(new Error(String(error)));
      }
    } finally {
      setIsUploading(false);
    }
  };

  async function putWithProgress(
    url: string,
    file: File,
    onProgress: (pct: number) => void
  ) {
    try {
      console.log("Upload Url:", url);
      console.log("File Type:", getContentType(file.name));
      await axios.put(url, file, {
        headers: {
          "Content-Type": getContentType(file.name),
        },
        onUploadProgress: (evt) => {
          if (evt.total) {
            const pct = (evt.loaded / evt.total) * 100;
            onProgress(pct);
          }
        },
      });
    } catch (err: any) {
      console.error("Upload failed:", err);
      throw new Error(
        `Upload failed: ${err.response?.status || ""} ${err.message}`
      );
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const oversized = files.filter((file) => file.size > MAX_FILE_SIZE);
    const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);

    if (oversized.length > 0) {
      if (oversized.length === files.length) {
        toast.warning("All selected files must be smaller than 30 MB", {
          icon: <AlertTriangle className="notification-icon" />
        });
      } else if (oversized.length === 1) {
        toast.warning("One file is too large. File size must be less than 30 MB", {
          icon: <AlertTriangle className="notification-icon" />
        });
      } else {
        toast.warning(
          "Some files are too large. Each file must be less than 30 MB",
          {
            icon: <AlertTriangle className="notification-icon" />
          }
        );
      }
    }

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  };

  const removeFile = async (fileName: string, path?: string) => {
    setFileStates((prev) =>
      prev.filter((fileState) => fileState.file.name !== fileName)
    );
    if (path) {
      await deleteJustFile(path);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${isUploading ? "pointer-events-none opacity-50" : "cursor-pointer"}
        `}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {heading || "Drop files here or click to browse"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subtext || "Select multiple files to upload simultaneously"}
        </p>
      </div>

      {/* File List with Progress */}
      {fileStates.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Upload Progress
          </h3>
          <div className="overflow-y-auto max-h-44">
            {fileStates.map((fileState) => (
              <div
                key={fileState.file.name}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 "
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {fileState.status === "completed" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {fileState.status === "error" && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      {(fileState.status === "pending" ||
                        fileState.status === "uploading") && (
                        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {fileState.file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(fileState.file.size)}
                      </p>
                    </div>
                  </div>

                  {fileState.status !== "uploading" && (
                    <button
                      onClick={() => removeFile(fileState.file.name, fileState.path)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      fileState.status === "completed"
                        ? "bg-green-500"
                        : fileState.status === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                    style={{
                      width: `${
                        fileState.status === "completed"
                          ? 100
                          : fileState.progress
                      }%`,
                    }}
                  />
                </div>

                {/* Progress Text */}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {fileState.status === "completed" && "Upload completed"}
                    {fileState.status === "error" &&
                      `Error: ${fileState.error}`}
                    {fileState.status === "uploading" &&
                      `${Math.round(fileState.progress)}% uploaded`}
                    {fileState.status === "pending" && "Preparing upload..."}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
