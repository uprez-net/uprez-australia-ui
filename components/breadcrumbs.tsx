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
  prospectus: "Generate Prospectus",
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
          let label = breadcrumbMap[segment] || segment

          //if label is UUID shorten it
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
          if (uuidRegex.test(label)) {
            label = label.slice(0, 8) + "..." + label.slice(-4)
          }


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
