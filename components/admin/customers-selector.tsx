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
import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import { TaxRuleDialog } from "../../app/(apps)/admin/products/tax-rules/tax-rule-dialog";
import { LoadingSkeleton } from "@/components/admin/placeholder-component";
import { useDebounce } from "@/hooks/use-debounce";
import { useTeams } from "@/hooks/use-teams";

interface Customer {
  id: string;
  name: string;
}

export const CustomersSelector = ({
  selected,
  setSelectedChange,
  children,
}: {
  selected: Customer[];
  setSelectedChange: (value: Customer) => void;
  children: React.ReactNode;
}) => {
  const [search, setSearch] = React.useState("");

  const [debounced, setDebounced] = React.useState("");

  const debounceFn = useDebounce((val) => {
    setDebounced(val);
  }, 500);

  const { data: teams, isPending } = useTeams(debounced);

  const options = React.useMemo(() => {
    return (
      teams?.data?.map((t) => ({
        id: String(t.id),
        name: t.name,
      })) ?? []
    );
  }, [teams]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="h-full max-h-[min(700px,90svh)] overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Select accounts
          </DialogTitle>
          <DialogDescription>
            Select the accounts you want to assign access
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
            <TaxRuleDialog>
              <InputGroupButton size="icon-sm">
                <Plus />
              </InputGroupButton>
            </TaxRuleDialog>
          </InputGroupAddon>
        </InputGroup>

        {/* List */}
        <div className="no-scrollbar flex-1 space-y-1 overflow-y-auto">
          {isPending ? (
            <LoadingSkeleton />
          ) : options.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">
              No accounts found
            </p>
          ) : (
            options.map((team) => {
              const checked = selected.findIndex((s) => s.id === team.id) >= 0;

              return (
                <FieldLabel
                  key={team.id}
                  htmlFor={team.id}
                  className="cursor-pointer rounded-xl! bg-secondary/20"
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{team.name}</FieldTitle>
                    </FieldContent>

                    <Checkbox
                      id={team.id}
                      checked={checked}
                      onCheckedChange={() => setSelectedChange(team)}
                    />
                  </Field>
                </FieldLabel>
              );
            })
          )}
        </div>

        {/* Footer */}
        <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
          <DialogClose asChild>
            <Button size="lg">Done</Button>
          </DialogClose>
        </Field>
      </DialogContent>
    </Dialog>
  );
};
