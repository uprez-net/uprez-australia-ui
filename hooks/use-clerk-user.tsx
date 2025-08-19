"use client";
import { useUser } from "@clerk/nextjs";

export function useClerkUser() {
  const { user, isLoaded, isSignedIn } = useUser();

  // const appUser = user as ClerkExtendedUserClient | null;
  const appUser = user ;

  return {
    user: appUser,
    isLoaded,
    isSignedIn,
  };
}
