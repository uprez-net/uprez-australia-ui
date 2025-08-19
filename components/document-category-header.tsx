"use client"

import { FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DocumentCategoryHeaderProps {
  categoryName: string
  uploadedCount?: number
  totalCount?: number
  showProgress?: boolean
  className?: string
}

export function DocumentCategoryHeader({
  categoryName,
  uploadedCount = 0,
  totalCount = 0,
  showProgress = true,
  className = "",
}: DocumentCategoryHeaderProps) {
  // Calculate completion percentage
  const completionPercentage = totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0
  const isComplete = uploadedCount === totalCount && totalCount > 0
  const hasPartialProgress = uploadedCount > 0 && uploadedCount < totalCount

  // Determine status color and icon
  const getStatusConfig = () => {
    if (isComplete) {
      return {
        badgeVariant: "default" as const,
        badgeClass: "bg-green-500 hover:bg-green-600 text-white",
        icon: <CheckCircle className="h-3 w-3" />,
      }
    } else if (hasPartialProgress) {
      return {
        badgeVariant: "secondary" as const,
        badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        icon: <FileText className="h-3 w-3" />,
      }
    } else {
      return {
        badgeVariant: "outline" as const,
        badgeClass: "border-gray-300 text-gray-600",
        icon: <AlertCircle className="h-3 w-3" />,
      }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <div className={`flex items-center justify-between py-3 ${className} gap-2`}>
      <div className="flex items-center space-x-3">
        <h3 className="text-lg font-semibold text-foreground">{categoryName}</h3>
        {showProgress && totalCount > 0 && (
          <Badge
            variant={statusConfig.badgeVariant}
            className={`flex items-center space-x-1 ${statusConfig.badgeClass}`}
          >
            {statusConfig.icon}
            <span className="text-xs font-medium">
              {uploadedCount}/{totalCount} uploaded
            </span>
          </Badge>
        )}
      </div>

      {showProgress && totalCount > 0 && (
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">{Math.round(completionPercentage)}% complete</div>
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isComplete ? "bg-green-500" : hasPartialProgress ? "bg-amber-500" : "bg-gray-300"
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
