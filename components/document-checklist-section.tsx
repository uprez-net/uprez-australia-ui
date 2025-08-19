"use client"

import { ChevronRight } from "lucide-react"
import { DocumentCategoryHeader } from "./document-category-header"
import { Separator } from "@/components/ui/separator"
import { CategoryProgress } from "@/utils/calculateFileProgress"

interface DocumentChecklistSectionProps {
  clientName?: string
  showBreadcrumb?: boolean
  documentProgress: CategoryProgress[]
}

// Example usage component showing how the header would be used in a document checklist
export function DocumentChecklistSection({ clientName = "", showBreadcrumb = false, documentProgress }: DocumentChecklistSectionProps) {

  return (
    <div className="space-y-4">
      {showBreadcrumb && clientName && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span>Clients</span>
          <ChevronRight className="h-4 w-4" />
          <span>{clientName}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">Upload Documents</span>
        </div>
      )}

      <div className="bg-background rounded-lg border shadow-sm p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Document Checklist</h2>
          <Separator />

          <div className="space-y-1">
            {documentProgress.map((category, index) => (
              <div key={category.category}>
                <DocumentCategoryHeader
                  categoryName={category.category}
                  uploadedCount={category.uploadedCount}
                  totalCount={category.requiredCount}
                  showProgress={true}
                />
                {index < documentProgress.length - 1 && <Separator className="my-3" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
