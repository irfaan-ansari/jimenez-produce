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
import { Check, ChevronRight, ChevronsUpDown } from "lucide-react";
import { getAvatarFallback, getInitialsAvatar } from "@/lib/utils";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { SIDEBAR_MENU_CUSTOMER, SITE_CONFIG } from "@/lib/config";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarProfile } from "./sidebar-profile";
import { PopoverXDrawer } from "../popover-x-drawer";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import { useTeams } from "@/hooks/use-teams";

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
      <SidebarTeam session={session} />
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
                        className="h-10 px-3.5 transition duration-200 group-data-[collapsible=icon]:px-1.5! hover:bg-muted hover:text-sidebar-foreground data-open:hover:bg-muted data-open:hover:text-sidebar-foreground data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-accent-foreground [&>svg]:size-5!"
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
                            className="after:absolute  after:top-1/2 after:-left-3.5 after:size-2 after:-translate-y-1/2  after:rounded-full after:bg-(--color) after:opacity-0 after:transition group-data-[active=true]/collapsible:after:opacity-100"
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
            <SidebarMenuItem className="rounded-xl bg-linear-to-br from-lime-100 via-emerald-50 to-white p-4">
              <div className="mb-1 font-semibold dark:text-background">
                Reorder smarter
              </div>
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

const SidebarTeam = ({ session: auth }: { session: Session }) => {
  const { session } = auth;

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data, isPending } = useTeams();

  const activeTeam = data?.data?.find(
    (team) => team.id === session.activeTeamId,
  );

  const handleChange = async (teamId: string) => {
    setOpen(false);

    const toastId = toast.loading("Please wait...");
    const { error } = await authClient.organization.setActiveTeam({
      teamId,
    });
    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success("Account changed successfully.", {
        id: toastId,
      });
    }

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
            className="w-60 px-0 *:gap-0 data-[slot=popover-content]:max-w-56"
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
                      width={40}
                      height={40}
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
                    {activeTeam?.name ?? "Loading..."}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          >
            <div className="flex flex-col gap-0.5 px-2">
              <span className="px-2 pt-1 pb-2 text-xs font-medium text-muted-foreground">
                ACCOUNTS
              </span>
              {isPending ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                data?.data?.map((team) => (
                  <Button
                    key={team.id}
                    variant={team.id === activeTeam?.id ? "secondary" : "ghost"}
                    onClick={() => handleChange(team.id)}
                    className="rounded-lg!"
                  >
                    <Avatar className="size-6 rounded-md **:rounded-md">
                      <AvatarImage src={team.logo!} alt={team.name} />
                      <AvatarFallback>
                        {getInitialsAvatar(team.name)}
                      </AvatarFallback>
                    </Avatar>
                    {team.name}

                    <Check
                      className={`ml-auto ${team.id === activeTeam?.id ? "opacity-100" : "opacity-0"}`}
                    />
                  </Button>
                ))
              )}
            </div>
          </PopoverXDrawer>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
