"use client";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Plus, Search } from "lucide-react";
import { useListTeamMembers, useUsers } from "@/hooks/use-teams";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { UserDialog } from "@/app/(apps)/admin/users/user-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LoadingSkeleton } from "@/components/admin/placeholder-component";

export const UserSelector = ({
  accountType = "customer",
  teamId,
  children,
}: {
  children: React.ReactNode;
  teamId: string;
  accountType?: string;
}) => {
  const [search, setSearch] = React.useState("");
  const auth = authClient.useSession();
  const [debounced, setDebounced] = React.useState("");

  const debounceFn = useDebounce((val) => {
    setDebounced(val);
  }, 500);

  const { data: teamMembers } = useListTeamMembers(teamId);

  const { data: users, isPending } = useUsers({
    q: debounced,
    accountType,
  });

  const options = React.useMemo(() => {
    return (
      users?.data?.map((t) => {
        const isMember = teamMembers?.some((m) => m.userId === t.id);
        return {
          id: t.id,
          name: t.name,
          phoneNumber: t.phoneNumber,
          email: t.email,
          image: t.image,
          accountType: t.accountType,
          isMember,
        };
      }) ?? []
    );
  }, [users, teamMembers]);

  const handleAssign = async (userId: string) => {
    const { data } = auth;
    if (!data || !data?.session?.activeOrganizationId || !teamId) {
      toast.error("Please select organization");
      return;
    }
    const toastId = toast.loading("Please wait...");
    const { error } = await authClient.organization.addTeamMember({
      teamId,
      userId,
    });
    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success("User assigned successfully", { id: toastId });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-full max-h-[calc(100svh-10rem)] flex-col overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Assign user</DialogTitle>
          <DialogDescription>
            Select the user to assign to this customer account.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <InputGroup className="rounded-xl">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>

          <InputGroupInput
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debounceFn(e.target.value);
            }}
          />

          <InputGroupAddon align="inline-end">
            <UserDialog
              data={{
                accountType,
                member: { role: "customer", id: null as any },
              }}
            >
              <InputGroupButton size="icon-sm">
                <Plus />
              </InputGroupButton>
            </UserDialog>
          </InputGroupAddon>
        </InputGroup>

        {/* List */}
        <div className="no-scrollbar flex-1 space-y-1 overflow-y-auto">
          {isPending ? (
            <LoadingSkeleton />
          ) : options.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">
              No result found
            </p>
          ) : (
            <div className="space-y-1">
              {options.map((user) => {
                return (
                  <FieldLabel
                    key={user.id}
                    htmlFor={user.id}
                    className="rounded-xl!"
                  >
                    <Field orientation="horizontal" className="rounded-xl">
                      <Avatar className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt="profile image"
                        />
                        <AvatarFallback className="rounded-xl bg-primary/40 text-xs font-semibold text-primary">
                          {user.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <FieldContent className="gap-0">
                        <FieldTitle>{user.name}</FieldTitle>
                        <FieldDescription>{user.email}</FieldDescription>
                      </FieldContent>

                      <Button
                        size="sm"
                        onClick={() => handleAssign(user.id)}
                        disabled={user.isMember}
                      >
                        {user.isMember ? "Assigned" : "Assign"}
                      </Button>
                    </Field>
                  </FieldLabel>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
