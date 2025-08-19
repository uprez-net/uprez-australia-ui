"use client"

import type React from "react"

import { use, useEffect, useState } from "react"
import { Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Document, DocumentType } from "@prisma/client"
import { UploadDropZoneComponent } from "./upload-component"
import { useAppDispatch } from "@/app/redux/use-dispatch"
import { createDocumentClient } from "@/app/redux/clientSlice"
import { toast } from "sonner"
import { documentCategories } from "@/utils/calculateFileProgress"
import { RootState } from "@/app/redux/store"
import { useSelector } from "react-redux"

interface DocumentUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryName: string
  clientId: string
  // onUpload: (file: File, documentType: string, year: string) => void
  type?: DocumentType
}

export function splitCamelCase(input: string): string {
  return input.replace(/([a-z])([A-Z])/g, '$1 $2') // split lower->Upper
              .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // split acronyms like "PDFParser"
}

export function DocumentUploadDialog({ open, onOpenChange, categoryName, clientId, type }: DocumentUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<Document[]>([])
  const [documentType, setDocumentType] = useState<DocumentType>(documentCategories[categoryName as keyof typeof documentCategories][0] as DocumentType)
  const [year, setYear] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString())
  const dispatch = useAppDispatch()
  const { sessionToken } = useSelector((state: RootState) => state.client)

  useEffect(() => {
    if (open) {
      setYear(years[0]) // Reset to the most recent year when dialog opens
    }
  }, [open])

  useEffect(() => {
    if (type) {
      setDocumentType(type)
    }
  }, [type])

  const handleUpload = async () => {
    if (!selectedFile || !documentType || !year) return
    try {
      setIsUploading(true)
      const uploadPromises = selectedFile.map(file =>
        dispatch(createDocumentClient({ Document: file, sessionToken }))
      );
      const results = await Promise.all(uploadPromises);
      results.forEach(res => {
        if (createDocumentClient.rejected.match(res)) {
          throw new Error(res.error.message);
        }
      });
      toast.success("Document uploaded successfully")
      setSelectedFile([])
      setYear(years[0]) // Reset to the most recent year after upload
      setDocumentType(documentCategories[categoryName as keyof typeof documentCategories][0] as DocumentType) // Reset to first document type
      setIsUploading(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Upload failed:", error)
      toast.error("Failed to upload document")
      setIsUploading(false)
    }
  }

  const canUpload = selectedFile.length > 0 && documentType && year

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document for {categoryName}. Please select the document type and year.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select Document</Label>
            <UploadDropZoneComponent
              setUploadedFiles={(file: Document) => setSelectedFile(p => [...p, file])}
              smeCompanyId={clientId}
              documentType={documentType}
              year={Number(year)}
            />
          </div>

          {/* Document Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={documentType} onValueChange={(value) => {
              setDocumentType(value as DocumentType)
              if (selectedFile.length > 0) {
                setSelectedFile((prev) =>
                  prev.map((file) => ({
                    ...file,
                    documentType: value as DocumentType,
                  }))
                )
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentCategories[categoryName as keyof typeof documentCategories]?.map((type) => (
                  <SelectItem key={type} value={type as DocumentType}>
                    {splitCamelCase(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Selection */}
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select value={year} onValueChange={(value) => {
              setYear(value)
              if (selectedFile.length > 0) {
                setSelectedFile((prev) =>
                  prev.map((file) => ({
                    ...file,
                    periodYear: value ? Number(value) : null,
                  }))
                )
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((yearOption) => (
                  <SelectItem key={yearOption} value={yearOption}>
                    {yearOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!canUpload || isUploading}
            className="bg-[#027055] hover:bg-[#025a44]"
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
