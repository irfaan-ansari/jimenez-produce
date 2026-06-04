"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

import {
  SidebarMenu,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Session } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { useUserTeams } from "@/hooks/use-teams";
import { authClient } from "@/lib/auth/client";
import { PopoverXDrawer } from "../popover-x-drawer";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, ChevronsUpDown, LogOut, Store, User } from "lucide-react";
import { getInitialsAvatar } from "@/lib/utils";

export const TeamSwitcher = ({
  session: auth,
  className,
}: {
  session: Session;
  className?: string;
}) => {
  const { session, user } = auth;
  const router = useRouter();
  const queryClient = useQueryClient();

  // const { data, isPending } = useTeams();
  const { data, isPending } = useUserTeams();

  const [open, setOpen] = useState(false);

  const activeTeam = data?.find((team) => team.id === session.activeTeamId);

  const handleSwitchAccount = async ({
    id: teamId,
    organizationId,
  }: {
    id: string;
    organizationId: string;
  }) => {
    setOpen(false);

    const toastId = toast.loading("Please wait...");

    const [{ error: teamError }, { error: organizationError }] =
      await Promise.all([
        authClient.organization.setActiveTeam({
          teamId,
        }),
        authClient.organization.setActive({
          organizationId,
        }),
      ]);

    const error = teamError || organizationError;

    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success("Account changed successfully.", {
        id: toastId,
      });
    }
    window.location.reload();
  };

  const handleLogout = async () => {
    setOpen(false);
    const promise = authClient.signOut();
    toast.promise(promise, {
      loading: "Signing out...",
      success: () => {
        queryClient.clear();
        window.location.href = "/signin";
        return "Signed out successfully";
      },
      error: "Failed to sign out",
    });
  };

  return (
    <SidebarHeader className={className}>
      <SidebarMenu>
        <SidebarMenuItem className="rounded-full text-sidebar-foreground group-data-[state=expanded]:bg-sidebar-accent shadow-sm group-data-[state=expanded]:text-sidebar-accent-foreground overflow-hidden group-data-[state=expanded]:absolute group-data-[state=expanded]:top-4 group-data-[state=expanded]:-right-4 group-data-[state=expanded]:z-1">
          <SidebarTrigger className="hidden md:inline-flex w-full min-w-8" />
        </SidebarMenuItem>

        <SidebarMenuItem>
          <PopoverXDrawer
            open={open}
            setOpen={setOpen}
            className="w-full px-0 *:gap-0 data-[slot=popover-content]:max-w-56 data-[slot=popover-content]:w-56"
            trigger={
              <SidebarMenuButton size="lg">
                <Avatar className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
                  <AvatarImage
                    src={getInitialsAvatar(activeTeam?.name)}
                    alt="Logo"
                  />
                  <AvatarFallback className="rounded-xly">
                    <Store className="size-4" />
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 min-w-0">
                  {activeTeam?.name ? (
                    <span className="text-sm font-semibold leading-tight truncate">
                      {activeTeam?.name}
                    </span>
                  ) : (
                    <Skeleton className="w-3/4 h-4 rounded-lg bg-sidebar-accent/10" />
                  )}

                  <span className="text-xs leading-tight truncate">
                    {user?.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          >
            <div className="px-1">
              <Button
                size="lg"
                variant="ghost"
                className="w-full gap-2 hover:bg-transparent"
                asChild
              >
                <Link href={`/customer/settings?tab=profile`}>
                  <Avatar className="size-9 rounded-lg ring-2 ring-primary/40 ring-offset-1 **:rounded-lg after:hidden">
                    <AvatarImage src={user?.image || ""} alt={user?.name} />
                    <AvatarFallback className="text-xs font-semibold bg-foreground text-primary-foreground">
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 min-w-0 text-left">
                    <span className="text-sm font-semibold leading-tight truncate">
                      {user?.name}
                    </span>
                    <span className="text-sm font-normal leading-tight truncate text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </Link>
              </Button>
            </div>
            <Separator className="my-1" />
            <div className="flex flex-col px-1">
              <span className="px-2 pt-1 pb-2 text-xs font-muted text-muted-foreground">
                Accounts
              </span>
              {isPending ? (
                <Skeleton className="w-full h-9" />
              ) : (
                data?.map((team) => (
                  <Button
                    key={team.id}
                    variant={team.id === activeTeam?.id ? "secondary" : "ghost"}
                    onClick={() => handleSwitchAccount(team)}
                    className="rounded-lg! px-1.5"
                  >
                    <Avatar className="size-6 rounded-md **:rounded-md">
                      <AvatarImage
                        src={getInitialsAvatar(team.name)}
                        alt={team.name}
                      />
                      <AvatarFallback>
                        <Store className="size-4" />
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
            <Separator className="my-1" />
            <div className="px-2">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full rounded-lg! bg-transparent justify-start"
              >
                <LogOut />
                Logout
              </Button>
            </div>
          </PopoverXDrawer>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
