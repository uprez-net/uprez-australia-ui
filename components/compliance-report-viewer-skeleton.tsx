"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ComplianceReportViewerSkeleton() {
  return (
    <div className="space-y-8">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-72" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* ---------------- Summary Card ---------------- */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score Circle */}
            <div className="flex flex-col items-center justify-center gap-4">
              <Skeleton className="h-40 w-40 rounded-full" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Category Breakdown */}
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-5 w-40" />

              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------- Detailed Findings ---------------- */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-56" />

        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="py-4 space-y-4">
              {Array.from({ length: 2 }).map((__, j) => (
                <div
                  key={j}
                  className="space-y-2 rounded-md border p-4"
                >
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-4/6" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---------------- Actions ---------------- */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-44" />
      </div>
    </div>
  );
}
