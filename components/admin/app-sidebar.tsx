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
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Session } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { APPLICATION_GROUP, SIDEBAR_MENU } from "@/lib/config";
import { OrganizationSwitcher } from "./organization-switcher";

const ROLES = ["admin", "owner"];

export function AppSidebar({ session }: { session: Session }) {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <OrganizationSwitcher session={session} />
      <SidebarContent>
        <SidebarGroup>
          <MenuGroup menu={SIDEBAR_MENU} />
        </SidebarGroup>
        {ROLES.includes(session?.session?.role as string) && (
          <SidebarGroup>
            <SidebarGroupLabel>Applications</SidebarGroupLabel>
            <MenuGroup menu={APPLICATION_GROUP} />
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

const MenuGroup = ({ menu }: { menu: typeof SIDEBAR_MENU }) => {
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
    <SidebarMenu>
      {menu.map((item) => {
        if (item.items.length <= 0) {
          return (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
                className="h-10 rounded-xl px-3.5 transition duration-200 group-data-[collapsible=icon]:px-1.5! hover:bg-muted hover:text-sidebar-foreground data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-accent-foreground [&>svg]:size-5"
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
                  asChild
                  className="h-10 px-3.5 transition duration-200 group-data-[collapsible=icon]:px-1.5! hover:bg-muted hover:text-sidebar-foreground data-open:hover:bg-muted data-open:hover:text-sidebar-foreground data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-accent-foreground [&>.duo-icons]:size-5"
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
                        className="px-3 rounded-xl hover:bg-muted hover:text-sidebar-foreground data-active:bg-muted data-active:text-sidebar-foreground"
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
  );
};
