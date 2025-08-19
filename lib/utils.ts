import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SMECompany } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determines the appropriate redirect URL for a user after login/dashboard load
 * @param orgType - The organization type ('sme' | 'intermediary')
 * @param smeCompanies - Array of SME companies for the user/organization
 * @returns The redirect URL path
 */
export function getPostLoginRedirectUrl(
  orgType: "sme" | "intermediary" | undefined,
  smeCompanies: SMECompany[]
): string {
  // For SME users with a company, redirect to their upload page
  if (orgType === "sme" && smeCompanies.length > 0) {
    const smeCompany = smeCompanies[0]; // Get the first/only SME company
    return `/dashboard/client/${smeCompany.id}/upload`;
  }

  // For intermediaries or SME users without companies, show the dashboard
  return "/dashboard";
}
