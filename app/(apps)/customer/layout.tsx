import React from "react";
import "@/app/globalsv2.css";
import { getSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { SITE_CONFIG } from "@/lib/config";
import { Container } from "@/components/container";
import { AppSidebar } from "@/components/admin/customer-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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

  if (session.user.role !== "customer") {
    redirect("/admin/overview");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-slate-50">
        <Container className="mx-0 p-5 md:p-8 h-full max-w-full">
          {children}
        </Container>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
