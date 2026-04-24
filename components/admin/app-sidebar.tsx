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
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Session } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { authClient } from "@/lib/auth/client";
import { getAvatarFallback } from "@/lib/utils";
import { SidebarProfile } from "./sidebar-profile";
import { PopoverXDrawer } from "../popover-x-drawer";
import { WarehouseDialog } from "./warehouse-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { SIDEBAR_MENU, SITE_CONFIG } from "@/lib/config";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, ChevronRight, ChevronsUpDown, Plus } from "lucide-react";

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
    <Sidebar>
      <SidebarOrganization />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SIDEBAR_MENU.map((item) => {
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
                        asChild
                        className="h-10 px-3.5 transition duration-200 hover:bg-muted hover:text-sidebar-foreground data-open:hover:bg-muted data-open:hover:text-sidebar-foreground data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-accent-foreground"
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
      </SidebarContent>

      {/* footer/ */}
      <SidebarProfile session={session} />
    </Sidebar>
  );
}

const SidebarOrganization = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data, isPending } = authClient.useListOrganizations();

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const handleChange = async (organizationId: string) => {
    setOpen(false);

    const toastId = toast.loading("Switching warehouse...");

    const { error } = await authClient.organization.setActive({
      organizationId,
    });

    if (error) {
      toast.error(error.message, { id: toastId });
      return;
    }

    toast.success("Warehouse changed successfully.", {
      id: toastId,
    });

    queryClient.invalidateQueries();
  };

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="rounded-xl group-data-[state=expanded]:absolute group-data-[state=expanded]:top-4 group-data-[state=expanded]:-right-4 group-data-[state=expanded]:z-1 group-data-[state=expanded]:bg-muted">
          <SidebarTrigger />
        </SidebarMenuItem>

        <SidebarMenuItem>
          <PopoverXDrawer
            open={open}
            setOpen={setOpen}
            className="w-60 px-0 *:gap-0 data-[slot=popover-content]:max-w-60"
            trigger={
              <SidebarMenuButton
                size="lg"
                className="hover:bg-muted! hover:text-sidebar-foreground! data-open:bg-muted! data-open:hover:bg-muted data-open:hover:text-sidebar-foreground data-active:hover:bg-muted"
              >
                <Avatar className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
                  <AvatarImage src={SITE_CONFIG.logo} alt="Logo" asChild>
                    <Image
                      src={SITE_CONFIG.logo}
                      alt="Logo"
                      width={100}
                      height={100}
                    />
                  </AvatarImage>
                  <AvatarFallback className="rounded-xl bg-primary/40 text-xs font-semibold text-primary">
                    {getAvatarFallback(SITE_CONFIG.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1">
                  <span className="truncate text-base leading-tight font-bold">
                    {SITE_CONFIG.name}
                  </span>
                  <span className="truncate text-sm leading-tight text-muted-foreground">
                    {activeOrganization?.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          >
            <div className="flex flex-col gap-0.5 px-2">
              {isPending ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                data?.map((org) => (
                  <Button
                    key={org.id}
                    variant={
                      org.id === activeOrganization?.id ? "secondary" : "ghost"
                    }
                    onClick={() => handleChange(org.id)}
                    className="rounded-lg!"
                  >
                    <Avatar className="size-6 rounded-md **:rounded-md">
                      <AvatarImage src={org.logo!} alt={org.name} />
                      <AvatarFallback>{org.name[0]}</AvatarFallback>
                    </Avatar>
                    {org.name}

                    <Check
                      className={`ml-auto ${org.id === activeOrganization?.id ? "opacity-100" : "opacity-0"}`}
                    />
                  </Button>
                ))
              )}
            </div>
            <Separator className="my-1" />
            <div className="px-2">
              <WarehouseDialog>
                <Button variant="ghost" className="w-full justify-start">
                  <span className="rounded-md border p-1">
                    <Plus />
                  </span>
                  Add New
                </Button>
              </WarehouseDialog>
            </div>
          </PopoverXDrawer>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
