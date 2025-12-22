import { Skeleton } from "@/components/ui/skeleton";

export function ProspectusEditorSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ================= Workflow ================= */}
      <div className="w-full pb-2">
        <div className="flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative flex-1 px-6 py-6 border bg-gray-50"
              style={{
                clipPath:
                  i === 0
                    ? "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)"
                    : i === 3
                    ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 6% 50%)"
                    : "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 6% 50%)",
              }}
            >
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
              <Skeleton className="h-3 w-20 mt-4" />
            </div>
          ))}
        </div>
      </div>

      {/* ================= Main Layout ================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* -------- Left Sidebar -------- */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="h-16 px-6 border-b flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-10 w-full rounded-xl" />
                <div className="ml-6 space-y-2">
                  <Skeleton className="h-8 w-5/6 rounded-lg" />
                  <Skeleton className="h-8 w-4/6 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* -------- Center Content -------- */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Nav */}
          <div className="h-16 border-b px-6 flex items-center justify-between bg-white">
            <Skeleton className="h-6 w-64" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
          </div>

          {/* Document Viewer */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {/* Floating Generate Button */}
              <div className="sticky top-6 z-20 flex justify-center mb-8">
                <Skeleton className="h-14 w-80 rounded-2xl" />
              </div>

              <div className="max-w-5xl mx-auto px-6 pb-12 space-y-8">
                {Array.from({ length: 2 }).map((_, page) => (
                  <div
                    key={page}
                    className="bg-white rounded-2xl p-12 space-y-10"
                  >
                    {/* Header */}
                    <div className="text-center space-y-4">
                      <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
                      <Skeleton className="h-8 w-80 mx-auto" />
                      <Skeleton className="h-5 w-64 mx-auto" />
                    </div>

                    {/* Sections */}
                    {Array.from({ length: 3 }).map((_, section) => (
                      <div key={section} className="space-y-4">
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
