import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SetDefaultOrganization } from "@/components/setDefaultOrg";
import { DynamicBreadcrumb } from "@/components/breadcrumbs";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="flex h-screen">
      <SetDefaultOrganization />
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="flex border-b items-center gap-4">
          <SidebarTrigger className="w-10 h-10"/>
          <DynamicBreadcrumb />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
