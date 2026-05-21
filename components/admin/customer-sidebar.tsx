"use client";

import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Session } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { TeamSwitcher } from "./team-switcher";
import { SIDEBAR_MENU_CUSTOMER } from "@/lib/config";
import { useRouterStuff } from "@/hooks/use-router-stuff";

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
    <Sidebar collapsible="icon" variant="floating">
      {/* <SidebarLogo /> */}
      <TeamSwitcher session={session} />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SIDEBAR_MENU_CUSTOMER.map((item) => {
              const Icon = item.icon;
              if (item.items.length <= 0) {
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                      className="h-10 rounded-xl px-3.5 font-medium transition duration-200 group-data-[collapsible=icon]:px-1.5! hover:bg-muted hover:text-sidebar-foreground data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-accent-foreground [&>svg]:size-5!"
                    >
                      <Link href={item.href}>
                        {item.icon && <item.icon />}
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
                        className="h-10 px-3.5 transition duration-200 group-data-[collapsible=icon]:px-1.5! hover:bg-muted hover:text-sidebar-foreground data-open:hover:bg-muted data-open:hover:text-sidebar-foreground data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-accent-foreground [&>.duo-icons]:size-5"
                        asChild
                      >
                        <Link href={item.href}>
                          {item.icon && <item.icon />}
                          <span>{item.label}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </Link>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-5">
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem
                            key={subItem.href}
                            className="after:absolute after:top-1/2 after:-left-3.5 after:size-2 after:-translate-y-1/2  after:rounded-full after:bg-(--color) after:opacity-0 after:transition group-data-[active=true]/collapsible:after:opacity-100"
                            style={
                              {
                                "--color": subItem.color,
                              } as React.CSSProperties
                            }
                          >
                            <SidebarMenuSubButton
                              asChild
                              className="rounded-xl px-3  hover:bg-muted hover:text-sidebar-foreground data-active:bg-muted data-active:text-sidebar-foreground"
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
            <SidebarMenuItem className="rounded-xl bg-linear-to-br relative from-lime-100 via-emerald-50 to-white p-4">
              <div className="mb-1 font-semibold dark:text-background">
                Reorder smarter
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Your top items and recent purchases are ready to add in seconds.
                <br />
                <span className="bg-lime-200 py-0.5 rounded-lg text-xs px-2 inline-block mt-2">
                  Coming Soon
                </span>
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
    </Sidebar>
  );
}
