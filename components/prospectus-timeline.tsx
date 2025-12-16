"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  FileText,
  Scale,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

export type ProspectusStageStatus = "completed" | "current" | "pending";

export interface ProspectusStage {
  label: string;
  description: string;
  status: ProspectusStageStatus;
  icon: React.ElementType;
}

interface ProspectusWorkflowVisualizerProps {
  currentStage: "collaboration" | "legal" | "asic" | "final";
}

// -----------------------------
// Workflow definition
// -----------------------------
const WORKFLOW: Record<
  ProspectusWorkflowVisualizerProps["currentStage"],
  number
> = {
  collaboration: 0,
  legal: 1,
  asic: 2,
  final: 3,
};

const STAGES: Omit<ProspectusStage, "status">[] = [
  {
    label: "Collaboration Review",
    description: "Internal drafting & collaboration",
    icon: FileText,
  },
  {
    label: "Legal Review",
    description: "Lawyer validation & sign-off",
    icon: Scale,
  },
  {
    label: "ASIC Review",
    description: "Regulatory submission & review",
    icon: ShieldCheck,
  },
  {
    label: "Final Approval",
    description: "Approved & lodged",
    icon: BadgeCheck,
  },
];

// -----------------------------
// Helpers
// -----------------------------
function getStageStatus(
  index: number,
  activeIndex: number
): ProspectusStageStatus {
  if (index < activeIndex) return "completed";
  if (index === activeIndex) return "current";
  return "pending";
}

function getStageStyles(status: ProspectusStageStatus) {
  switch (status) {
    case "completed":
      return {
        container: "bg-green-50 border-green-300",
        iconBg: "bg-green-100",
        icon: CheckCircle,
        iconColor: "text-green-600",
      };
    case "current":
      return {
        container: "bg-blue-50 border-blue-400",
        iconBg: "bg-blue-100",
        icon: Clock,
        iconColor: "text-blue-600",
      };
    default:
      return {
        container: "bg-gray-50 border-gray-200",
        iconBg: "bg-gray-100",
        icon: Clock,
        iconColor: "text-gray-400",
      };
  }
}

// -----------------------------
// Component
// -----------------------------
export function ProspectusWorkflowVisualizer({
  currentStage,
}: ProspectusWorkflowVisualizerProps) {
  const activeIndex = WORKFLOW[currentStage];

  return (
    <div className="w-full overflow-hidden pb-2">
      <div className="flex w-full">
        {STAGES.map((stage, index) => {
          const status = getStageStatus(index, activeIndex);
          const styles = getStageStyles(status);
          const StageIcon = stage.icon;
          const StatusIcon = styles.icon;

          const isFirst = index === 0;
          const isLast = index === STAGES.length - 1;

          return (
            <div
              key={stage.label}
              className={cn(
                "relative flex-1 px-6 py-6 border transition-all",
                styles.container,
                !isFirst && "-ml-4",
                !isLast && "pe-8",
                status === "current" && "z-30",
                status === "completed" && "z-20",
                status === "pending" && "z-10"
              )}
              style={{
                clipPath: isFirst
                  ? "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)"
                  : isLast
                  ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 6% 50%)"
                  : "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 6% 50%)",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {stage.label}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {stage.description}
                  </p>
                </div>

                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center",
                    styles.iconBg
                  )}
                >
                  <StatusIcon className={cn("h-5 w-5", styles.iconColor)} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                <StageIcon className="h-4 w-4" />
                <span className="capitalize">{status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
