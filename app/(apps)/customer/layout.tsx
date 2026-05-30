import React from "react";

import { getSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { SITE_CONFIG } from "@/lib/config";
import { Container } from "@/components/container";
import { AppSidebar } from "@/components/admin/customer-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/components/admin/app-header";

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
  const auth = await getSession();
  const { session, user } = auth || {};

  // unauthorised redirect to signin
  if (!session?.activeOrganizationId || !user) redirect("/signin");
  // customer user - redirect to customer dashboard
  if (session.role !== "customer") redirect("/admin/overview");

  return (
    <SidebarProvider
      className="bg-slate-50"
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar session={{ session, user }} />
      <SidebarInset className="min-w-0 bg-slate-50">
        <AppHeader session={{ session, user }} type="customer" />
        <Container className="h-full max-w-full p-4 mx-0 md:p-8">
          {children}
        </Container>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
