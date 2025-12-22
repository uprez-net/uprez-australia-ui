"use client";
import { CreditCard, LayoutDashboard, UserPlus, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useClerkUser } from "@/hooks/use-clerk-user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { title } from "process";
import { AppSidebarSkeleton } from "./sidebar-skeleton";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Team",
    url: "/organisation/invite",
    icon: UserPlus,
  },
  {
    title: "Subscriptions",
    url: "/subscription",
    icon: CreditCard,
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, openMobile } = useSidebar();
  const { user, isSignedIn, isLoaded } = useClerkUser();

  const router = useRouter();

  if (!isLoaded) {
    return <AppSidebarSkeleton />;
  }

  if (!isSignedIn) {
    router.replace("/sign-in");
    return;
  }

  return (
    <Sidebar collapsible="icon" {...props} className="z-50">
      <SidebarHeader>
        {open || openMobile ? (
          <Link href="/">
            <h1 className="mx-3 text-2xl font-semibold text-primary transition-colors">
              UpRez
            </h1>
          </Link>
        ) : (
          <Link href="/home">
            <Image
              src={"/buildx_logo_1_1.png"}
              width={40}
              height={40}
              alt="Logo"
            />
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <OrganizationSwitcher />
        <UserButton
          showName={open || openMobile}
          appearance={{
            elements: {
              userButtonBox: "w-full flex flex-row-reverse gap-2 justify-end",
              userButtonTrigger: "w-full",
              rootBox: "w-full",
              userButtonOuterIdentifier: "text-base",
              userButtonAvatarBox: "w-8 h-8",
            },
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
