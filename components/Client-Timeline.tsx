import React from "react";

export type TimelineStatus = "completed" | "active" | "upcoming";

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  status: TimelineStatus;
}

export interface HorizontalTimelineProps {
  title: string;
  completedSteps: number;
  totalSteps: number;
  items: TimelineItem[];
}

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  title,
  completedSteps,
  totalSteps,
  items,
}) => {
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <span className="text-sm font-semibold text-emerald-600">
          {completedSteps} of {totalSteps} steps completed
        </span>
      </div>

      {/* Timeline */}
      <div className="relative overflow-x-auto py-10">
        {/* Track */}
        <div className="relative mx-4 h-1 rounded bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full rounded bg-gradient-to-r from-emerald-700 to-emerald-400 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Items */}
        <div className="relative -mt-4 flex min-w-max justify-between px-4">
          {items.map((item) => {
            const isCompleted = item.status === "completed";
            const isActive = item.status === "active";

            return (
              <div
                key={item.id}
                className="flex w-32 flex-col items-center text-center"
              >
                {/* Point */}
                <div
                  className={[
                    "mb-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-transform",
                    isCompleted &&
                      "border-emerald-700 bg-emerald-700 text-white",
                    isActive && "border-emerald-700 bg-white",
                    !isCompleted &&
                      !isActive &&
                      "border-gray-300 bg-white",
                  ].join(" ")}
                >
                  {isCompleted && (
                    <span className="text-xs font-bold">✓</span>
                  )}
                  {isActive && (
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
                  )}
                </div>

                {/* Meta */}
                <span className="text-[11px] text-gray-500">
                  {item.date}
                </span>
                <span className="mt-1 text-xs font-semibold text-gray-900">
                  {item.title}
                </span>
                <span className="mt-1 max-w-[140px] text-[10px] leading-snug text-gray-500">
                  {item.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

