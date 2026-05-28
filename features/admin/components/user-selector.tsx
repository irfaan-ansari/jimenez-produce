"use client";
import React from "react";

import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@/components/app-dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { QueryState } from "@/components/admin/query-state";
import { Plus, Search } from "lucide-react";
import { useUsers } from "@/hooks/use-teams";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDialog } from "./user-dialog";

export const UserSelector = ({
  selected,
  onAction,
  children,
}: {
  selected: string[];
  children: React.ReactNode;
  onAction: (userId: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");

  const debounceFn = useDebounce((val) => {
    setDebounced(val);
  }, 500);

  const {
    data: users,
    isPending,
    isError,
    error,
  } = useUsers({
    q: debounced,
    accountType: "customer",
  });

  const options = React.useMemo(() => {
    return (
      users?.data?.map((t) => {
        return {
          id: t.id,
          name: t.name,
          phoneNumber: t.phoneNumber,
          email: t.email,
          image: t.image,
          accountType: t.accountType,
        };
      }) ?? []
    );
  }, [users]);

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="flex h-full max-h-[calc(100svh-10rem)] flex-col overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <div className="flex flex-col gap-6 w-full items-start *:w-full overflow-auto">
          <AppDialogHeader>
            <AppDialogTitle className="text-xl font-bold text-left">
              Assign user
            </AppDialogTitle>
          </AppDialogHeader>

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
                  accountType: "customer",
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
            <QueryState
              isPending={isPending}
              isError={isError}
              error={error}
              isEmpty={options.length === 0}
            >
              <div className="space-y-1">
                {options.map((user) => {
                  const isMember = selected.includes(user.id);
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
                          size="xs"
                          variant={isMember ? "outline" : "default"}
                          onClick={() => {
                            onAction(user.id);
                            setOpen(false);
                          }}
                          disabled={isMember}
                        >
                          {!isMember && <Plus className="size-3" />}
                          {isMember ? "Assigned" : "Assign"}
                        </Button>
                      </Field>
                    </FieldLabel>
                  );
                })}
              </div>
            </QueryState>
          </div>
        </div>
      </AppDialogContent>
    </AppDialog>
  );
};
