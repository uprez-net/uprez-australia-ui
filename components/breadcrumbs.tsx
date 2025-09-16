"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Map route segments to custom labels
const breadcrumbMap: Record<string, string> = {
  dashboard: "Dashboard",
  client: "Clients",
  report: "Compliance Report",
  upload: "Upload Documents",
  valuation: "Valuation",
  organisation: "Organisation",
  invite: "Invite",
  create: "Create",
  subscription: "Subscription",
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()

  // Split path into segments (remove empty parts)
  const segments = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb className="select-none">
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/")
          const isLast = index === segments.length - 1
          const label = breadcrumbMap[segment] || segment

          return (
            <BreadcrumbItem key={href}>
              {!isLast ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={label === "Clients" ? "/dashboard" : href}>{label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
