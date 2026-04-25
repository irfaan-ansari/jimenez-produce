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
  const auth = await getSession();
  const { session, user } = auth || {};

  // unauthorised redirect to signin
  if (!session?.activeOrganizationId || !user) redirect("/signin");
  // customer user - redirect to customer dashboard
  if (user.accountType === "customer") redirect("/customer/dashboard");

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar session={{ session, user }} />
      <SidebarInset className="min-w-0 bg-slate-50 dark:bg-zinc-950">
        <Container className="mx-0 h-full max-w-full p-5 md:p-8">
          {children}
        </Container>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
