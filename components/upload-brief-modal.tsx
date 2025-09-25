"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { UploadDropZoneComponent } from "./upload-component";
import UploadDropzone from "./ui/upload-dropzone";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface UploadBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { file?: File; brief?: string }) => void;
  sectionTitle: string;
}

interface UploadedFile {
  path: string;
  name: string;
  contentType: string;
  size: number;
}

export function UploadBriefModal({
  isOpen,
  onClose,
  onSubmit,
  sectionTitle,
}: UploadBriefModalProps) {
  const [brief, setBrief] = useState("");
  const [file, setFile] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { clientData } = useSelector((state: RootState) => state.client);

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing
    // onSubmit({ file: file || undefined, brief: brief || undefined });
    setIsLoading(false);
    setBrief("");
    setFile([]);
    onClose();
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = e.target.files?.[0];
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //   }
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload or Add Brief</DialogTitle>
          <DialogDescription>
            Provide context for AI generation for{" "}
            <span className="font-semibold">{sectionTitle}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload */}
          <UploadDropzone
            smeCompanyId={clientData?.id || ""}
            onClientUploadComplete={(res) => {
              setFile([...file, ...res]);
            }}
            onUploadError={(error) => toast.error(`Upload failed! ${error.message}`)}
            heading="Upload supporting documents"
            subtext={`Drag and drop files here or click to browse.
               Supports DOCX, PDF, and TXT files (MAX. 30MB each)`}
            />

          {/* Brief Textarea */}
          <div>
            <label
              htmlFor="brief-textarea"
              className="block text-sm font-medium mb-2"
            >
              Or provide a brief
            </label>
            <Textarea
              id="brief-textarea"
              rows={4}
              placeholder="e.g., 'Draft this section focusing on recurring revenue and expansion into Asia...'"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (!file && !brief.trim())}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
