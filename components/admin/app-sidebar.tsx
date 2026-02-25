"use client";
import Link from "next/link";

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
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { SITE_CONFIG } from "@/lib/config";
import { SIDEBAR_MENU } from "@/lib/config";
import { useSession, useSignout } from "@/hooks/use-auth";
import { ProfileDialog } from "../profile-dialog";
import { useTabRouter } from "@/hooks/use-tab-router";
import { ChevronRight, Lock, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { ChangePasswordDialog } from "../change-password";

export function AppSidebar() {
  const { pathname, buildPath, isActive: subItemActive } = useTabRouter();

  const isActive = (href: string) => {
    return pathname === href || (pathname.includes(href) && pathname !== "/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="mb-4">
        <SidebarMenuItem className="px-2.5 py-2 inline-flex gap-4 items-center  bg-sidebar-accent rounded-xl">
          <Avatar className="rounded-xl **:rounded-xl after:hidden size-9 ring-2 ring-offset-1 ring-green-600/20">
            <AvatarImage src={SITE_CONFIG.logo} alt="profile image" asChild>
              <Image
                src={SITE_CONFIG.logo}
                alt="Logo"
                width={100}
                height={100}
              />
            </AvatarImage>
            <AvatarFallback className="bg-primary/40 font-medium text-xs">
              {SITE_CONFIG.name}
            </AvatarFallback>
          </Avatar>

          <span className="font-semibold text-base">{SITE_CONFIG.name}</span>
        </SidebarMenuItem>
      </SidebarHeader>
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
                      className="data-[state=open]:bg-sidebar-accent rounded-xl h-10"
                    >
                      <Link href={item.href}>
                        {item.icon && (
                          <item.icon className="text-muted-foreground" />
                        )}
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
                        className="h-10"
                      >
                        {item.icon && (
                          <item.icon className="text-muted-foreground" />
                        )}
                        <span>{item.label}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem
                            key={subItem.label}
                            className="after:absolute after:opacity-0 after:transition group-data-[active=true]/collapsible:after:opacity-100 after:size-2  after:rounded-full after:bg-(--color) after:-left-3.5 after:top-1/2 after:-translate-y-1/2"
                            style={
                              {
                                "--color": subItem.color,
                              } as React.CSSProperties
                            }
                          >
                            <SidebarMenuSubButton
                              asChild
                              className="rounded-xl"
                              isActive={subItemActive(subItem)}
                            >
                              <Link href={buildPath(subItem)}>
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

const Profile = () => {
  const { data } = useSession();
  const { mutate } = useSignout();
  const router = useRouter();
  return (
    <SidebarFooter>
      <SidebarMenu className="rounded-2xl gap-0 border">
        <SidebarMenuItem>
          <div className="flex gap-2 px-2.5 py-2 items-center">
            <Avatar className="rounded-xl **:rounded-xl after:hidden size-9 ring-2 ring-offset-1 ring-green-600/20">
              <AvatarImage src={data?.user.image!} alt="profile image" />
              <AvatarFallback className="rounded-xl bg-primary/40 font-semibold text-xs text-primary">
                {data?.user.name}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="truncate font-medium text-sm">
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
              Porfile
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
            onClick={() =>
              mutate(undefined, {
                onSuccess: () => router.replace("/admin/signin"),
              })
            }
            className="hover:bg-destructive/10 hover:text-destructive rounded-xl"
          >
            <LogOut />
            Logout
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
