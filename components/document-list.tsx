"use client";

import {
  FileText,
  Download,
  Trash2,
  Eye,
  Upload,
  RefreshCw,
  CircleX,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasicCheckStatus, Document } from "@prisma/client";
import { splitCamelCase } from "./document-upload-dialog";
import { useEffect, useState } from "react";
import { FilePreviewDialog } from "./file-preview-dialog";
import { set } from "date-fns";
import {
  formatFileName,
  getMimeType,
  returnFileType,
} from "@/app/utils/returnFileTypes";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { deleteDocumentClient, updateDocument } from "@/app/redux/clientSlice";
import { formatFileSize } from "@/utils/calculateFileProgress";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPublicUrl } from "@/lib/data/bucketAction";

interface DocumentListProps {
  documents: Document[];
  onUpload: (docType: string) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export function DocumentList({ documents, onUpload }: DocumentListProps) {
  const [filePreview, setFilePreview] = useState<{
    name: string;
    type: string;
    url: string;
  } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { sessionToken } = useSelector((state: RootState) => state.client);
  const { docReport, isLoading } = useSelector(
    (state: RootState) => state.report
  );
  const { attemptGeneration } = useSubscription();

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No documents uploaded yet</p>
        <p className="text-sm">
          Click the upload button above to add documents
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string, doc: Document) => {
    switch (status) {
      case BasicCheckStatus.Passed:
        const status = findDocCompliantStatus(doc);
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            {status}
          </Badge>
        );
      case BasicCheckStatus.Pending:
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            Pending
          </Badge>
        );
      case BasicCheckStatus.Failed:
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const onView = async (id: string) => {
    const toastId = toast.loading("Loading document...");
    try {
      console.log(`View document with ID: ${id}`);
      const file = documents.find((doc) => doc.id === id)!;
      const publicUrl = await getPublicUrl(file.uploadThingKey);
      setFilePreview({
        name: file?.fileName,
        type: getMimeType(file.fileName) ?? "application/octet-stream",
        url: publicUrl,
      });
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error loading document preview:", error);
      toast.error("Failed to load document preview", {
        icon: <CircleX className="notification-icon" />,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const onDownload = async (id: string) => {
    // Handle download document logic
    console.log(`Download document with ID: ${id}`);
    const file = documents.find((doc) => doc.id === id)!;
    try {
      // const isReviewed = file.tag.includes("reviewed");
      toast.loading("Downloading file...", {
        icon: <RefreshCw className="notification-icon" />,
      });
      const response = await fetch(file.uploadThingKey);
      // if (!isReviewed && role === UserRole.CUSTOMER) await dispatch(createProjectFile({ ...file, tag: [...file.tag.split(","), "reviewed"].join(", ") }));
      console.log("This is relatesTo field: ", response);
      const blob = await response.blob();

      const contentType = response.headers.get("Content-Type");

      const fileBlob = new Blob([blob], {
        type: contentType || "application/octet-stream",
      });
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName || "download";
      link.innerHTML = file.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("File downloaded successfully", {
        icon: <CheckCircle className="notification-icon" />,
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file", {
        icon: <CircleX className="notification-icon" />,
      });
    } finally {
      toast.dismiss();
    }
  };

  const onDelete = async (id: string, path: string) => {
    // Handle delete document logic
    console.log(`Delete document with ID: ${id}`);
    const toastId = toast.loading("Deleting document...");
    try {
      const res = await dispatch(
        deleteDocumentClient({
          documentId: id,
          filePath: path,
        })
      );
      if (res.meta.requestStatus === "rejected") {
        throw new Error((res.payload as string) || "Failed to delete document");
      }
      // await deleteFile((res.payload as Document).customKey);
      const delRes = await fetch(`${BASE_URL}/api/v1/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (!delRes.ok) {
        // throw new Error("Failed to delete document from server");
        const errorData = await delRes.json();
        console.error("Failed to delete document from server", errorData);
      }
      toast.dismiss(toastId);
      toast.success("Document deleted successfully", {
        icon: <CheckCircle className="notification-icon" />,
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to delete document", {
        icon: <CircleX className="notification-icon" />,
      });
      console.error("Error deleting document:", error);
      return;
    }
  };

  const isDocumentParitallyCompliant = (doc: Document) => {
    const report = docReport.find((r) => r.id === doc.id);
    return (
      report &&
      (report.summary.compliance_status === "non-compliant" ||
        report.summary.compliance_status === "partially-compliant")
    );
  };

  const findDocCompliantStatus = (doc: Document) => {
    const report = docReport.find((r) => r.id === doc.id);
    const statusMap = {
      "non-compliant": "Non-Compliant",
      "partially-compliant": "Partially Compliant",
      compliant: "Compliant",
      pending: "Pending",
      loading: "Loading...",
    };
    if (!report) return statusMap.loading;
    const key = report?.summary.compliance_status as keyof typeof statusMap;
    console.log(
      "Document Report Status:",
      key,
      report?.summary.compliance_status
    );
    return report && key in statusMap
      ? statusMap[key]
      : isLoading
      ? statusMap.loading
      : statusMap["non-compliant"];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Uploaded Documents ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">Document</TableHead>
              <TableHead className="w-[150px]">Type</TableHead>
              {/* <TableHead className="w-[100px]">Year</TableHead> */}
              <TableHead className="w-[150px]">Upload Date</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="w-[220px]">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">
                          {formatFileName(document.fileName, 20)}
                        </div>
                        {document.generationNumber && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border">
                            Gen #{document.generationNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(document.fileSize)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="w-[150px]">
                  <div className="text-sm">
                    {splitCamelCase(document.documentType)}
                  </div>
                </TableCell>
                <TableCell className="w-[150px]">
                  <div className="text-sm">
                    {formatDate(document.createdAt)}
                  </div>
                </TableCell>
                <TableCell className="w-[120px]">
                  {getStatusBadge(document.basicCheckStatus, document)}
                </TableCell>
                <TableCell className="w-[140px] text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(document.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(document.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {isDocumentParitallyCompliant(document) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              onUpload(document.documentType);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          Upload a rectified document
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (
                          document.basicCheckStatus === BasicCheckStatus.Passed
                        ) {
                          // toast.info(
                          //   <>
                          //     <div className="text-sm font-medium text-gray-900 dark:text-white">
                          //       Processed Document can't be deleted
                          //     </div>
                          //     <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          //       This document has already been processed and
                          //       cannot be deleted. If you need to update it,
                          //       please upload a new version.
                          //     </div>
                          //   </>
                          // );
                          toast.info("Processed Document can't be deleted", {
                            icon: <Info className="notification-icon" />,
                            description:
                              "This document has already been processed and cannot be deleted. If you need to update it, please upload a new version.",
                          });
                          return;
                        }
                        onDelete(document.id, document.uploadThingKey);
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                {filePreview && (
                  <FilePreviewDialog
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                    file={filePreview}
                    handleDownload={async () => await onDownload(document.id)}
                  />
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
