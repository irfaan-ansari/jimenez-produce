"use client";

import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Image from "next/image";
import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Session } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { getAvatarFallback } from "@/lib/utils";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { SIDEBAR_MENU_CUSTOMER, SITE_CONFIG } from "@/lib/config";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { SidebarProfile } from "./sidebar-profile";

export function AppSidebar({ session }: { session: Session }) {
  const { pathname, getQueryString } = useRouterStuff();

  const isActive = (href: string) => {
    return pathname === href || (pathname.includes(href) && pathname !== "/");
  };

  const isSubItemActive = (href: any) => {
    if (!href) return false;
    const path = pathname + getQueryString();
    return href === path;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarLogo />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SIDEBAR_MENU_CUSTOMER.map((item) => {
              if (item.items.length <= 0) {
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                      className="h-10 rounded-xl px-3.5 transition duration-200 hover:bg-muted hover:text-sidebar-foreground data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-accent-foreground"
                    >
                      <Link href={item.href}>
                        {item.icon && <item.icon className="opacity-80" />}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
              return (
                <Collapsible
                  key={item.href}
                  asChild
                  className="group/collapsible"
                  defaultOpen={isActive(item.href)}
                  data-active={isActive(item.href)}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild className="rounded-xl">
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={isActive(item.href)}
                        className="h-10 px-3.5 transition duration-200 hover:bg-muted hover:text-sidebar-foreground data-open:hover:bg-muted data-open:hover:text-sidebar-foreground data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-accent-foreground"
                        asChild
                      >
                        <Link href={item.href}>
                          {item.icon && <item.icon className="opacity-80" />}
                          <span>{item.label}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </Link>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem
                            key={subItem.href}
                            className="after:absolute  after:top-1/2 after:-left-3.5 after:size-2 after:-translate-y-1/2  after:rounded-full after:bg-(--color) after:opacity-0 after:transition group-data-[active=true]/collapsible:after:opacity-100"
                            style={
                              {
                                "--color": subItem.color,
                              } as React.CSSProperties
                            }
                          >
                            <SidebarMenuSubButton
                              asChild
                              className="rounded-xl px-3 hover:bg-muted hover:text-sidebar-foreground data-active:bg-muted data-active:text-sidebar-foreground"
                              isActive={isSubItemActive(subItem.href)}
                            >
                              <Link href={subItem.href}>
                                <span>{subItem.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[state=collapsed]:hidden">
          <SidebarMenu className="mb-4">
            <SidebarMenuItem className="rounded-xl bg-linear-to-br from-lime-100 via-emerald-50 to-white p-4">
              <div className="mb-1 font-semibold">Reorder smarter</div>
              <p className="mb-4 text-sm text-muted-foreground">
                Your top items and recent purchases are ready to add in seconds.
              </p>
              <Button
                asChild
                variant="secondary"
                className="w-full rounded-xl bg-sidebar-accent! text-sidebar-accent-foreground"
              >
                <Link href="/customer/new-order">Start New Order</Link>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* footer/profile */}
      <SidebarProfile session={session} />
    </Sidebar>
  );
}
export const SidebarLogo = () => {
  return (
    <SidebarHeader className="mb-4">
      <SidebarMenu>
        <SidebarMenuItem className="rounded-xl group-data-[state=expanded]:absolute group-data-[state=expanded]:top-4 group-data-[state=expanded]:-right-4 group-data-[state=expanded]:z-1 group-data-[state=expanded]:bg-muted">
          <SidebarTrigger />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="hover:bg-sidebar hover:text-sidebar-foreground"
          >
            <Avatar className="aspect-square size-8 rounded-md ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
              <AvatarImage src={SITE_CONFIG.logo} alt="profile image" asChild>
                <Image
                  src={SITE_CONFIG.logo}
                  alt="Logo"
                  width={40}
                  height={40}
                />
              </AvatarImage>
              <AvatarFallback className="bg-primary/40 text-xs font-medium">
                {getAvatarFallback(SITE_CONFIG.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{SITE_CONFIG.name}</span>
              <span className="truncate text-xs"> Ordering Platform</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
