import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { Container } from "@/components/container";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name}"`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "Trusted foodservice distributor delivering fresh produce and essential supplies to restaurants and commercial kitchens across the Gulf Coast",
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (!session) redirect("/admin/signin");

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <Container className="mx-0 py-5 md:py-8 h-full max-w-full">
          {children}
        </Container>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
