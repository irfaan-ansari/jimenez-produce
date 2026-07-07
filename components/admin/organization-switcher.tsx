"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  SidebarMenu,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { Button } from "../ui/button";
import { Session } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { SITE_CONFIG } from "@/lib/config";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { authClient } from "@/lib/auth/client";
import { PopoverXDrawer } from "../popover-x-drawer";
import { WarehouseDialog } from "./warehouse-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Check,
  ChevronsUpDown,
  Lock,
  LogOut,
  Plus,
  Settings,
  Store,
  User,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { Badge } from "../ui/badge";

export const OrganizationSwitcher = ({
  session,
  className,
}: {
  session: Session;
  className?: string;
}) => {
  const user = session?.user;
  const router = useRouter();

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
    <SidebarHeader className={className}>
      <SidebarMenu>
        <SidebarMenuItem className="rounded-xl group-data-[state=expanded]:absolute group-data-[state=expanded]:top-4 group-data-[state=expanded]:-right-4 group-data-[state=expanded]:z-1 group-data-[state=expanded]:bg-muted">
          <SidebarTrigger className="hidden md:inline-flex" />
        </SidebarMenuItem>

        <SidebarMenuItem>
          <PopoverXDrawer
            open={open}
            setOpen={setOpen}
            className="w-full p-4 *:gap-0 data-[slot=popover-content]:max-w-72 data-[slot=popover-content]:w-72 data-[slot=popover-content]:rounded-xl"
            trigger={
              <SidebarMenuButton
                size="lg"
                className="hover:bg-muted! hover:text-sidebar-foreground! data-open:bg-muted! data-open:hover:bg-muted data-open:hover:text-sidebar-foreground data-active:hover:bg-muted"
              >
                <Avatar className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
                  <AvatarImage
                    src={activeOrganization?.logo || SITE_CONFIG.logo}
                    alt="Logo"
                  />

                  <AvatarFallback className="rounded-xl">
                    <Store className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 min-w-0">
                  <span className="text-sm font-semibold leading-tight truncate">
                    {SITE_CONFIG.name}
                  </span>

                  {activeOrganization?.name ? (
                    <span className="text-sm font-medium leading-tight truncate text-muted-foreground">
                      {activeOrganization?.name}
                    </span>
                  ) : (
                    <Skeleton className="h-3 w-3/4 mt-1.5 rounded-lg bg-sidebar-accent/10" />
                  )}
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          >
            <div className="space-y-2">
              <Button
                size="lg"
                variant="ghost"
                className="w-full gap-2 px-0 hover:bg-transparent"
              >
                <Avatar className="size-9 rounded-lg ring-2 ring-primary/40 ring-offset-1 **:rounded-lg after:hidden">
                  <AvatarImage
                    src={activeOrganization?.logo || ""}
                    alt={activeOrganization?.name}
                  />
                  <AvatarFallback className="text-xs font-semibold bg-foreground text-primary-foreground">
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 min-w-0 text-left">
                  <span className="text-sm font-semibold leading-tight truncate">
                    {activeOrganization?.name}
                  </span>
                  <Badge variant="success-light">Active</Badge>
                </div>
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  asChild
                  size="sm"
                  className="rounded-md!"
                  disabled={!user.isSuperAdmin}
                >
                  <Link href="/admin/users">
                    <UserRoundPlus />
                    Invite members
                  </Link>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden -mx-4">
              <Separator className="my-2.5 scale-x-150" />
            </div>
            <div className="flex flex-col">
              {isPending ? (
                <Skeleton className="w-full h-9" />
              ) : (
                data?.map((org) => (
                  <Button
                    key={org.id}
                    variant={
                      org.id === activeOrganization?.id ? "secondary" : "ghost"
                    }
                    onClick={() => handleChange(org.id)}
                    className="rounded-lg! pl-0"
                  >
                    <Avatar className="size-8 rounded-md **:rounded-md">
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
              {user.isSuperAdmin && (
                <WarehouseDialog>
                  <Button variant="ghost" className="w-full justify-start px-0">
                    <span className="p-1 border rounded-md">
                      <Plus />
                    </span>
                    Add New
                  </Button>
                </WarehouseDialog>
              )}
            </div>
            <div className="overflow-hidden -mx-4">
              <Separator className="my-2.5 scale-x-150" />
            </div>
            <div>
              <Button
                disabled
                variant="ghost"
                className="w-full rounded-lg! justify-start"
              >
                <UserRound />
                Profile
              </Button>
              <Button
                variant="ghost"
                disabled
                className="w-full rounded-lg! justify-start"
              >
                <Lock />
                Security
              </Button>

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
