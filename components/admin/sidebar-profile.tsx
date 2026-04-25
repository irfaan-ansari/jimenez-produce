"use client";

import Image from "next/image";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import {
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Session } from "@/lib/types";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAvatarFallback } from "@/lib/utils";
import { ProfileDialog } from "../profile-dialog";
import { PopoverXDrawer } from "../popover-x-drawer";
import { useQueryClient } from "@tanstack/react-query";
import { ChangePasswordDialog } from "../change-password";
import { ChevronsUpDown, Lock, LogOut, Moon, Sun, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTheme } from "next-themes";

export const SidebarProfile = ({ session }: { session: Session }) => {
  const user = session?.user;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    setOpen(false);
    const promise = authClient.signOut();
    toast.promise(promise, {
      loading: "Signing out...",
      success: () => {
        queryClient.clear();
        router.push("/signin");
        return "Signed out successfully";
      },
      error: "Failed to sign out",
    });
  };

  return (
    <SidebarFooter>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Button
            variant="ghost"
            size="xl"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="justify-start rounded-xl"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 left-2.5" />
            <span>Toggle theme</span>
          </Button>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <PopoverXDrawer
          open={open}
          setOpen={setOpen}
          className="w-60 overflow-hidden px-0 pt-0 *:gap-0 data-[slot=popover-content]:max-w-60"
          trigger={
            <SidebarMenuButton
              size="lg"
              className="hover:bg-muted! hover:text-sidebar-foreground! data-open:bg-muted! data-open:hover:bg-muted data-open:hover:text-sidebar-foreground data-active:hover:bg-muted"
            >
              <Avatar className="size-9 rounded-lg ring-2 ring-primary/40 ring-offset-1 **:rounded-lg after:hidden">
                <AvatarImage src={user.image!} alt="Logo" asChild>
                  <Image
                    src={user.image!}
                    alt="Logo"
                    width={40}
                    height={40}
                    unoptimized
                  />
                </AvatarImage>
                <AvatarFallback className="bg-foreground text-xs font-semibold text-primary-foreground">
                  {getAvatarFallback(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1">
                <span className="truncate text-sm leading-tight font-semibold">
                  {user.name}
                </span>
                <span className="truncate text-sm leading-tight text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          }
        >
          <div className="flex items-center gap-3 border-b bg-secondary px-4 py-2">
            <Avatar className="size-8 rounded-lg ring-2 ring-primary/40 ring-offset-1 **:rounded-lg after:hidden">
              <AvatarImage src={user.image!} alt="Profile" asChild>
                <Image
                  src={user.image!}
                  alt="profile"
                  width={40}
                  height={40}
                  unoptimized
                />
              </AvatarImage>
              <AvatarFallback className="bg-foreground text-xs font-semibold text-primary-foreground">
                {getAvatarFallback(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
          <div className="px-2 pt-2 *:w-full">
            <ProfileDialog
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
              }}
            >
              <Button className="justify-start rounded-lg" variant="ghost">
                <User />
                Profile
              </Button>
            </ProfileDialog>
            <ChangePasswordDialog>
              <Button className="justify-start rounded-lg" variant="ghost">
                <Lock />
                Change Password
              </Button>
            </ChangePasswordDialog>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full rounded-lg!"
            >
              <LogOut />
              Logout
            </Button>
          </div>
        </PopoverXDrawer>
      </SidebarMenuItem>
    </SidebarFooter>
  );
};
