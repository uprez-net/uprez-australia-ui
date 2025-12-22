"use client";

import { createDocumentClient } from "@/app/redux/clientSlice";
import { RootState } from "@/app/redux/store";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { BasicCheckStatus, Document, DocumentType } from "@prisma/client";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import UploadDropzone from "./ui/upload-dropzone";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX } from "lucide-react";

interface UploadComponentProps {
  setUploadedFiles?: (file: Document) => void;
  dispatchFunction?: typeof createDocumentClient;
  isIPO?: boolean;
  isICon?: boolean;
  smeCompanyId: string;
  documentType: DocumentType;
  year?: number;
  heading?: string;
  subtext?: string;
  className?: string;
}

/**
 * UploadDropZoneComponent handles file uploads using a drag-and-drop interface.
 *
 * It allows automatic tagging of uploaded files using AI, constructs IProjectFile objects,
 * and either adds them to a local state or dispatches them to the Redux store using the provided async thunk.
 *
 * @component
 * @author Nabeel Wasif
 *
 * @param {Object} props - Props passed to the component.
 * @param {React.Dispatch<React.SetStateAction<Document>>} [props.setUploadedFiles] - Optional state setter for appending uploaded files to local state.
 * @param {number} props.ProjectId - The ID of the project the files are associated with.
 * @param {string} props.milestoneName - Name of the milestone to associate with the uploaded file.
 * @param {typeof createProjectFile} [props.dispatchFunction=createDocumentClient] - Redux thunk to dispatch file upload data to the backend.
 *
 * @returns {JSX.Element} UploadDropzone with upload handlers.
 */
export function UploadDropZoneComponent({
  setUploadedFiles,
  dispatchFunction = createDocumentClient,
  smeCompanyId,
  documentType,
  year,
  heading,
  subtext,
  className,
  isIPO = false,
}: UploadComponentProps) {
  const dispatch = useAppDispatch();
  const { sessionToken } = useSelector((state: RootState) => state.client);

  const handleUploadComplete = async (
    response: {
      path: string
      name: string
      contentType: string
      size: number
    }[]
  ) => {
    response.forEach(
      async (element, index: number) => {
        const doc: Document = {
          id: crypto.randomUUID(),
          smeCompanyId: smeCompanyId,
          uploadedById: "",
          documentType: documentType,
          fileName: element.name,
          uploadThingKey: element.path,
          customKey: element.path,
          fileSize: element.size,
          periodYear: year || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          basicCheckStatus: BasicCheckStatus.Pending,
          basicCheckReason: null,
          generationId: null,
          generationNumber: null
        };
        if (setUploadedFiles) {
          setUploadedFiles(doc);
        } else {
          await dispatch(dispatchFunction({ Document: doc, sessionToken, isIPO }));
        }
        toast.success("File Uploaded Successfully", {
          icon: <CircleCheck className="notification-icon" />
        });
      }
    );
  };

  return (
    <div className={cn("max-w-md mx-auto", className)}>
      <UploadDropzone
        smeCompanyId={smeCompanyId}
        onClientUploadComplete={(res) => {
          handleUploadComplete(res);
        }}
        onUploadError={(error) => toast.error(`ERROR! ${error.message}`, {
          icon: <CircleX className="notification-icon" />
        })}
        heading={heading}
        subtext={subtext}
      />
    </div>
  );
}