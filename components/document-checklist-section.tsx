"use client";

import { ChevronRight } from "lucide-react";
import { DocumentCategoryHeader } from "./document-category-header";
import { Separator } from "@/components/ui/separator";
import { CategoryProgress } from "@/utils/calculateFileProgress";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DocumentChecklistSectionProps {
  clientName?: string;
  showBreadcrumb?: boolean;
  documentProgress: CategoryProgress[];
}

// Example usage component showing how the header would be used in a document checklist
export function DocumentChecklistSection({
  clientName = "",
  showBreadcrumb = false,
  documentProgress,
}: DocumentChecklistSectionProps) {
  const [activeCategory, setActiveCategory] = useState<"All" | "Completed" | "Pending">("All");
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Document Checklist</h2>
            <div className="flex gap-3">
              {["All", "Completed", "Pending"].map((status, i) => (
                <Badge key={i} variant="outline" className={cn(
                  activeCategory === status ? "bg-primary text-primary-foreground border-primary" : "hover:bg-green-200 hover:border-primary hover:border",
                  "cursor-pointer"
                )} onClick={() => setActiveCategory(status as "All" | "Completed" | "Pending")}>
                  {status}
                </Badge>
              ))}
            </div>
          </div>
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
                {index < documentProgress.length - 1 && (
                  <Separator className="my-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
