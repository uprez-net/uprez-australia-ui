"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react"

interface FilePreviewDialogProps {
  isOpen: boolean
  onClose: () => void
  handleDownload: () => Promise<void>;
  file: {
    name: string
    type: string
    url: string
  }
}

export function FilePreviewDialog({ isOpen, onClose, file, handleDownload }: FilePreviewDialogProps) {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
  }

  useEffect(()=> {
    if(file.type.includes("pdf") || file.type.includes("image")) {
      setIsLoading(true)
    }
    else setIsLoading(false)
  }, [file.type])

  const renderPreview = () => {
    if (file.type.includes("pdf")) {
      return <iframe src={file.url} className="w-full h-[70vh] border rounded-md" onLoad={handleLoad} />
    } else if (file.type.includes("image")) {
      return (
        <img
          src={file.url || "/placeholder.svg"}
          alt={file.name}
          className="max-w-full max-h-[70vh] mx-auto object-contain"
          onLoad={handleLoad}
        />
      )
    } else if (file.type.includes("spreadsheet") || file.type.includes("excel")) {
      return (
        <div className="w-full h-[70vh] flex items-center justify-center bg-muted/50 rounded-md">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Spreadsheet preview not available</p>
            <Button variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Download to View</span>
            </Button>
          </div>
        </div>
      )
    } else if (file.type.includes("zip") || file.type.includes("archive")) {
      return (
        <div className="w-full h-[70vh] flex items-center justify-center bg-muted/50 rounded-md">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Archive preview not available</p>
            <Button variant="outline" className="flex items-center gap-1" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span>Download to View</span>
            </Button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="w-full h-[70vh] flex items-center justify-center bg-muted/50 rounded-md">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Preview not available for this file type</p>
            <Button variant="outline" className="flex items-center gap-1" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span>Download to View</span>
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="truncate max-w-[80%]">{file.name}</DialogTitle>
          {/* <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div> */}
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center h-[70vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        <div className={isLoading ? "hidden" : "flex-1 overflow-auto"}>{renderPreview()}</div>

        <DialogFooter className="flex justify-between mt-4">
          {/* <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div> */}
          <Button className="flex items-center gap-1" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}