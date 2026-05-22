"use client";
import React from "react";

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
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { useTeams } from "@/hooks/use-teams";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { Checkbox } from "@/components/ui/checkbox";

import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "../app-dialog";
import { QueryState } from "./query-state";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export const CustomersSelector = ({
  selected,
  setSelectedChange,
  children,
}: {
  selected: Pick<Customer, "id">[];
  setSelectedChange: (value: Customer) => void;
  children: React.ReactNode;
}) => {
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const { data: teams, isPending, isError, error } = useTeams({ q: debounced });

  const debounceFn = useDebounce((val) => {
    setDebounced(val);
  }, 500);

  const options = React.useMemo(() => {
    return (
      teams?.data?.map((t) => ({
        id: String(t.id),
        name: t.name,
        phone: t.phone,
        email: t.email,
      })) ?? []
    );
  }, [teams]);

  return (
    <AppDialog>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>

      <AppDialogContent className="rounded-2xl ring-ring/10 sm:max-w-2xl">
        <div className="max-h-[min(700px,90svh)] flex  flex-col overflow-hidden gap-4 md:gap-6">
          <AppDialogHeader>
            <AppDialogTitle className="text-xl font-bold">
              Select accounts
            </AppDialogTitle>
          </AppDialogHeader>

          {/* Search */}
          <InputGroup className="rounded-xl shrink-0">
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
          </InputGroup>

          {/* List */}
          <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            <QueryState
              isPending={isPending}
              isEmpty={!options.length}
              isError={isError}
              error={error}
            >
              {options.map((team) => {
                const checked =
                  selected.findIndex((s) => s.id === team.id) >= 0;

                return (
                  <FieldLabel
                    key={team.id}
                    htmlFor={team.id}
                    className="rounded-lg cursor-pointer"
                  >
                    <Field orientation="horizontal">
                      <Checkbox
                        id={team.id}
                        checked={checked}
                        onCheckedChange={() => setSelectedChange(team)}
                      />
                      <FieldContent>
                        <FieldTitle>{team.name}</FieldTitle>
                        <FieldDescription className="flex gap-3 text-xs flex-nowrap">
                          {team.email} • {team.phone}
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                );
              })}
            </QueryState>
          </div>

          {/* Footer */}
          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
            <AppDialogClose asChild>
              <Button size="lg" className="rounded-xl">
                Add
              </Button>
            </AppDialogClose>
          </Field>
        </div>
      </AppDialogContent>
    </AppDialog>
  );
};
