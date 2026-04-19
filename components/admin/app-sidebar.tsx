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
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-auth";
import { authClient } from "@/lib/auth/client";
import { getAvatarFallback } from "@/lib/utils";
import { ProfileDialog } from "../profile-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { ChangePasswordDialog } from "../change-password";
import { ChevronRight, Lock, LogOut, User } from "lucide-react";
import { SIDEBAR_MENU, SITE_CONFIG } from "@/lib/config";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebar() {
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
      <SidebarLogo />
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
                        className="h-10 px-3.5 transition duration-200 hover:bg-muted hover:text-sidebar-foreground data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-accent-foreground data-open:hover:bg-muted data-open:hover:text-sidebar-foreground"
                      >
                        {item.icon && <item.icon className="opacity-80" />}
                        <span>{item.label}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        {/* <SidebarMenuBadge className="rounded-full bg-red-500">
                          4
                        </SidebarMenuBadge> */}
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
                              className="rounded-xl px-3 hover:bg-muted hover:text-sidebar-foreground data-active:bg-sidebar-accent! data-active:text-sidebar-accent-foreground!"
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

      {/* footer/profile */}
      <Profile />
    </Sidebar>
  );
}
export const SidebarLogo = () => {
  return (
    <SidebarHeader className="mb-4">
      <SidebarMenuItem className="inline-flex items-center gap-4 rounded-xl  px-2.5 py-2">
        <Avatar className="size-9 rounded-xl ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
          <AvatarImage src={SITE_CONFIG.logo} alt="profile image" asChild>
            <Image src={SITE_CONFIG.logo} alt="Logo" width={100} height={100} />
          </AvatarImage>
          <AvatarFallback className="bg-primary/40 text-xs font-medium">
            {getAvatarFallback(SITE_CONFIG.name)}
          </AvatarFallback>
        </Avatar>

        <span className="text-base font-semibold">{SITE_CONFIG.name}</span>
      </SidebarMenuItem>
    </SidebarHeader>
  );
};

const Profile = () => {
  const { data } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.clear();
          router.push("/signin");
        },
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
      },
    });
  };
  return (
    <SidebarFooter>
      <SidebarMenu className="gap-0 rounded-2xl border">
        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2.5 py-2">
            <Avatar className="size-9 rounded-xl ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
              <AvatarImage src={data?.user.image!} alt="profile image" />
              <AvatarFallback className="rounded-xl bg-primary/40 text-xs font-semibold text-primary">
                {getAvatarFallback(data?.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="truncate text-sm font-medium">
                {data?.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {data?.user.email}
              </span>
            </div>
          </div>
        </SidebarMenuItem>
        <SidebarMenuItem className="border-t p-1">
          <ProfileDialog
            user={{
              id: data?.user.id,
              name: data?.user.name,
              email: data?.user.email,
              image: data?.user.image,
            }}
          >
            <SidebarMenuButton className="rounded-xl">
              <User />
              Profile
            </SidebarMenuButton>
          </ProfileDialog>
          <ChangePasswordDialog>
            <SidebarMenuButton className="rounded-xl">
              <Lock />
              Change Password
            </SidebarMenuButton>
          </ChangePasswordDialog>
        </SidebarMenuItem>
        <SidebarMenuItem className="border-t p-1">
          <SidebarMenuButton
            onClick={handleLogout}
            className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut />
            {loading ? "Please wait..." : "Logout"}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
