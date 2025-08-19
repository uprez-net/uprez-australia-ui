// MembersList.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  OrganizationResource,
  OrganizationMembershipResource,
  OrganizationCustomRoleKey,
} from "@clerk/types";
import { SelectRole } from "./SelectRole";
import { useMemo } from "react";

interface MembersListProps {
  memberships: {
    data: OrganizationMembershipResource[];
    revalidate: () => Promise<void>;
  };
  organization: OrganizationResource;
  isLoaded: boolean;
}

export default function MembersList({
  memberships,
  organization,
  isLoaded,
}: MembersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          View and manage your current organization members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoaded && memberships.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No members found.
                </TableCell>
              </TableRow>
            )}
            {memberships.data.map((member: any) => {
              const selectRoleMemo = useMemo(() => {
                return (
                  <SelectRole
                    organization={organization}
                    fieldName="role"
                    isDisabled={
                      (member.role as OrganizationCustomRoleKey) === "org:admin"
                    }
                    defaultRole={member.role}
                    onChange={async (newRole) => {
                      if (newRole !== member.role) {
                        await member.update({
                          role: newRole as OrganizationCustomRoleKey,
                        });
                        await memberships.revalidate();
                      }
                    }}
                  />
                );
                // memoize based on stable member + org
              }, [member.id, member.role, organization.id]);

              return (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.publicUserData?.firstName || "-"}
                  </TableCell>
                  <TableCell>{member.publicUserData?.identifier}</TableCell>
                  <TableCell>
                    {selectRoleMemo}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      disabled={
                        (member.role as OrganizationCustomRoleKey) === "org:admin"
                      }
                      onClick={async () => {
                        await organization.removeMember(member.id);
                        await memberships.revalidate();
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
