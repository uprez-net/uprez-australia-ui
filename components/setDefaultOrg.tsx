"use client";

import { useOrganizationList, useOrganization, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function SetDefaultOrganization() {
  const { userMemberships, isLoaded: membershipsLoaded, setActive } = useOrganizationList({
    userMemberships: true,
  });
  const { organization, isLoaded: orgLoaded } = useOrganization();

  const [hasSet, setHasSet] = useState(false); // prevent re-triggering

  useEffect(() => {
    if (!membershipsLoaded || !orgLoaded || hasSet) return;
    if (organization) return; // Already has active org — don't overwrite

    if (userMemberships.data.length > 0) {
      const defaultOrg = userMemberships.data[0].organization;
      console.log("Setting default organization:", defaultOrg);

      setActive({ organization: defaultOrg })
        .then(() => setHasSet(true))
        .catch((err) => console.error("Failed to set active organization:", err));
    }
  }, [membershipsLoaded, orgLoaded, organization, userMemberships, setActive, hasSet]);

  return null;
}
