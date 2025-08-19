"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { OrganizationCustomRoleKey } from "@clerk/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectRole } from "@/components/SelectRole";
import InviteList from "@/components/InviteList";
import MembersList from "@/components/MembersList";



export default function InvitePage() {
  const [email, setEmail] = useState("");

  const { isLoaded, organization, invitations, memberships } = useOrganization({
    memberships: true,
    invitations: true,
  });
  const [emailAddress, setEmailAddress] = useState("");
  const [disabled, setDisabled] = useState(false);

  if (!isLoaded || !organization) {
    return <>Loading</>;
  }

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submittedData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    ) as {
      email: string | undefined;
      role: OrganizationCustomRoleKey | undefined;
    };

    if (!submittedData.email || !submittedData.role) {
      return;
    }

    setDisabled(true);
    await organization.inviteMember({
      emailAddress: submittedData.email,
      role: submittedData.role,
    });
    await invitations?.revalidate?.();
    setEmailAddress("");
    setDisabled(false);
  };

  return (
    <div className="container py-10">
      <Card className="mb-8 w-full">
        <CardHeader>
          <CardTitle>Invite Members</CardTitle>
          <CardDescription>
            Send invitations to new organization members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex w-full items-center space-x-2"
            onSubmit={onSubmit}
          >
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              name="email"
              required
            />
            <SelectRole fieldName={"role"} organization={organization} />
            <Button type="submit" disabled={disabled}>
              <Mail className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </form>
        </CardContent>
      </Card>
      <Tabs defaultValue="invite" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="invite">Invitations</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="invite">
          <InviteList
            invitations={invitations as any}
            memberships={memberships as any}
            isLoaded={isLoaded}
          />
        </TabsContent>

        <TabsContent value="members">
          <MembersList
            memberships={memberships as any}
            organization={organization as any}
            isLoaded={isLoaded}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
