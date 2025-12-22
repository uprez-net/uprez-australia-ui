"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebarSkeleton({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="z-50">
      {/* ---------- Header ---------- */}
      <SidebarHeader>
        <div className="px-3 py-2">
          <Skeleton className="h-7 w-28" />
        </div>
      </SidebarHeader>

      {/* ---------- Content ---------- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {[1, 2, 3].map((item) => (
                <SidebarMenuItem key={item}>
                  <div className="flex items-center gap-3 px-3 py-2">
                    {/* Icon skeleton */}
                    <Skeleton className="h-5 w-5 rounded-md" />
                    {/* Text skeleton */}
                    <Skeleton className="h-4 w-24" />
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ---------- Footer ---------- */}
      <SidebarFooter className="space-y-3 px-3 pb-3">
        {/* Organization switcher skeleton */}
        <Skeleton className="h-9 w-full rounded-md" />

        {/* User button skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
