"use client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrganizationCustomRoleKey, OrganizationResource } from "@clerk/types";
import { useEffect, useRef, useState } from "react";

type SelectRoleProps = {
  fieldName?: string;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
  defaultRole?: string;
  organization: OrganizationResource;
};

export function SelectRole(props: SelectRoleProps) {
  const { fieldName, isDisabled = false, onChange, defaultRole, organization } = props;
  const [fetchedRoles, setRoles] = useState<
    {
      name: string;
      key: OrganizationCustomRoleKey;
    }[]
  >([]);
  const isPopulated = useRef(false);

  useEffect(() => {
    if (isPopulated.current) return;
    organization
      ?.getRoles({
        pageSize: 20,
        initialPage: 1,
      })
      .then((res) => {
        isPopulated.current = true;
        console.dir(res, { depth: Infinity });
        setRoles(
          res.data.map((roles) => {
            return {
              name: roles.name,
              key: roles.key as OrganizationCustomRoleKey,
            };
          })
        );
      });
  }, [organization?.id]);

  if (fetchedRoles.length === 0) return null;

  return (
    <Select
      name={fieldName}
      disabled={isDisabled}
      value={defaultRole}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Roles</SelectLabel>

          {fetchedRoles?.map((role, ind) => {
            // console.log(role);
            return (
              <SelectItem key={ind} value={role.key}>
                {role.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}