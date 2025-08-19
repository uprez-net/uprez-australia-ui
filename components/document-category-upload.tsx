"use client";

import { useState } from "react";
import { Upload, CheckCircle, AlertTriangle, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DocumentCategoryHeader } from "@/components/document-category-header";
import {
  DocumentUploadDialog,
  splitCamelCase,
} from "@/components/document-upload-dialog";
import { DocumentList } from "@/components/document-list";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Document, DocumentType } from "@prisma/client";
import { CategoryProgress } from "@/utils/calculateFileProgress";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";

interface DocumentCategoryUploadProps {
  categoryName: string;
  requiredDocuments?: string[];
  optionalDocuments?: string[];
  className?: string;
  documentProgress: CategoryProgress;
}

export function DocumentCategoryUpload({
  categoryName,
  requiredDocuments = [],
  optionalDocuments = [],
  className = "",
  documentProgress,
}: DocumentCategoryUploadProps) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  // const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const { documents, clientData } = useSelector(
    (state: RootState) => state.client
  );
  const [docType, setDocType] = useState<DocumentType | null>(null);
  const { attemptGeneration } = useSubscription();

  // Calculate completion status
  const totalRequired = requiredDocuments.length || 0; // Default to 7 if not specified
  const uploadedCount = documentProgress.uploadedCount;

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <DocumentCategoryHeader
              categoryName={categoryName}
              uploadedCount={uploadedCount}
              totalCount={totalRequired}
              showProgress={true}
            />
            <Button
              onClick={() => {
                setUploadDialogOpen(true);
              }}
              className="bg-[#027055] hover:bg-[#025a44] flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Required Documents Info */}
          {requiredDocuments.length > 0 && (
            <div className="mb-6" key={`required-${documents.length}`}>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Required Documents:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {requiredDocuments.map((docType, index) => {
                  const isUploaded = documents.some(
                    (doc) => splitCamelCase(doc.documentType) === docType
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                    >
                      {isUploaded ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                      <span
                        className={
                          isUploaded ? "text-green-700" : "text-gray-600"
                        }
                      >
                        {docType}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional Documents Info */}
          {optionalDocuments.length > 0 && (
            <div className="mb-6" key={`optional-${documents.length}`}>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Optional Documents:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {optionalDocuments.map((docType, index) => {
                  const isUploaded = documents.some(
                    (doc) => splitCamelCase(doc.documentType) === docType
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                    >
                      {isUploaded ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <InfoIcon className="h-4 w-4 text-blue-500" />
                      )}
                      <span
                        className={
                          isUploaded ? "text-green-700" : "text-gray-600"
                        }
                      >
                        {docType}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Separator className="my-4" />

          {/* Document List */}
          <DocumentList
            onUpload={(docType: string) => {
              setDocType(docType as DocumentType);
              setUploadDialogOpen(true);
            }}
            documents={documents.filter(
              (doc) =>
                requiredDocuments.includes(splitCamelCase(doc.documentType)) ||
                optionalDocuments.includes(splitCamelCase(doc.documentType))
            )}
          />
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        categoryName={categoryName}
        clientId={clientData!.id}
        // onUpload={handleUpload}
        type={docType ?? undefined}
      />
    </div>
  );
}
