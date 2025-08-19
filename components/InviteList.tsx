// InviteList.tsx
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
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  OrganizationInvitationResource,
  OrganizationMembershipResource,
} from "@clerk/types";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Pending
        </Badge>
      );
    case "accepted":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Accepted
        </Badge>
      );
    case "expired":
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          Expired
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

interface InviteListProps {
  invitations: {
    data: OrganizationInvitationResource[];
    revalidate: () => Promise<void>;
  };
  memberships: {
    data: OrganizationMembershipResource[];
    revalidate: () => Promise<void>;
  };
  isLoaded: boolean;
}

export default function InviteList({
  invitations,
  memberships,
  isLoaded,
}: InviteListProps) {
  console.log(`InviteList rendered with ${invitations.data.length} invitations`);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
        <CardDescription>
          Manage your pending and past invitations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoaded || invitations.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-600">
                  No invitations found.
                </TableCell>
              </TableRow>
            )}
            {invitations.data.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">
                  {invitation.emailAddress}
                </TableCell>
                <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                <TableCell>
                  {formatDate(invitation.updatedAt, "do MMM yyyy hh:mm a")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={async () => {
                      await invitation.revoke();
                      await Promise.all([
                        memberships.revalidate(),
                        invitations.revalidate(),
                      ]);
                    }}
                  >
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
