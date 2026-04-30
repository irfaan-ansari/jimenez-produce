"use client";
import React from "react";

import {
  Dialog,
  DialogClose,
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Plus, Search } from "lucide-react";
import { useUsers } from "@/hooks/use-teams";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { UserDialog } from "@/app/(apps)/admin/users/user-dialog";
import { LoadingSkeleton } from "@/components/admin/placeholder-component";
import { useDebounce } from "@/hooks/use-debounce";

interface User {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
}

export const UserSelector = ({
  value,
  disabled,
  onValueChange,
  children,
  accountType = "customer",
}: {
  value?: User;
  disabled?: User[];
  onValueChange: (value: User) => void;
  children: React.ReactNode;
  accountType?: string;
}) => {
  const [search, setSearch] = React.useState("");

  const [debounced, setDebounced] = React.useState("");

  const debounceFn = useDebounce((val) => {
    setDebounced(val);
  }, 500);

  const [selected, setSelected] = React.useState<User | undefined>(value);

  const { data: users, isPending } = useUsers({
    q: debounced,
    accountType,
  });

  const options = React.useMemo(() => {
    return (
      users?.data?.map((t) => ({
        id: t.id,
        name: t.name,
        phoneNumber: t.phoneNumber,
        email: t.email,
      })) ?? []
    );
  }, [users, value]);

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
            <UserDialog>
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
            <RadioGroup
              className="gap-1"
              value={selected?.id}
              onValueChange={(value) => {
                const index = options.findIndex((user) => user.id === value);

                setSelected(options[index]);
              }}
            >
              {options.map((user) => {
                const isDisabled = disabled?.some((u) => u.id === user.id);

                return (
                  <FieldLabel
                    key={user.id}
                    htmlFor={user.id}
                    className="cursor-pointer rounded-xl! data-disabled:opacity-50"
                    data-disabled={isDisabled}
                  >
                    <Field orientation="horizontal" className="rounded-xl">
                      <FieldContent>
                        <FieldTitle>{user.name}</FieldTitle>
                        <FieldDescription>{user.email}</FieldDescription>
                      </FieldContent>

                      <RadioGroupItem
                        value={user.id}
                        id={user.id}
                        disabled={isDisabled}
                      />
                    </Field>
                  </FieldLabel>
                );
              })}
            </RadioGroup>
          )}
        </div>

        {/* Footer */}
        <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
          <DialogClose asChild onClick={() => onValueChange(selected!)}>
            <Button size="lg">Done</Button>
          </DialogClose>
        </Field>
      </DialogContent>
    </Dialog>
  );
};
