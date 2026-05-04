"use client";

import Image from "next/image";
import { toast } from "sonner";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { useState } from "react";
import { Session } from "@/lib/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { getAvatarFallback } from "@/lib/utils";
import { PopoverXDrawer } from "../popover-x-drawer";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown, Lock, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const SidebarProfile = ({ session }: { session: Session }) => {
  const user = session?.user;
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
      <SidebarMenu>
        <SidebarMenuItem>
          <PopoverXDrawer
            open={open}
            setOpen={setOpen}
            className="w-60 overflow-hidden rounded-xl px-0 pt-0 *:gap-0 data-[slot=popover-content]:max-w-56"
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
              <Button
                className="justify-start rounded-lg"
                variant="ghost"
                asChild
              >
                <Link href={`/${user.accountType}/settings?tab=profile`}>
                  <User />
                  Profile
                </Link>
              </Button>

              <Button
                className="justify-start rounded-lg"
                variant="ghost"
                asChild
              >
                <Link href={`/${user.accountType}/settings?tab=password`}>
                  <Lock />
                  Change Password
                </Link>
              </Button>

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
      </SidebarMenu>
    </SidebarFooter>
  );
};
