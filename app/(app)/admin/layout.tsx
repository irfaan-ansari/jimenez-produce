import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { SITE_CONFIG } from "@/lib/config";
import { Container } from "@/components/container";
import { AppSidebar } from "@/components/admin/app-sidebar";

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "Trusted foodservice distributor delivering fresh produce and essential supplies to restaurants and commercial kitchens across the Gulf Coast",
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (!session) redirect("/signin");

  if (session.user.role === "customer") {
    redirect("/customer/dashboard");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="admin" />
      <SidebarInset className="min-w-0">
        <Container className="mx-0 pb-5 md:pb-8 pt-2 h-full max-w-full">
          <SidebarTrigger className="-ml-1 rounded-xl" size="icon" />
          {children}
        </Container>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
