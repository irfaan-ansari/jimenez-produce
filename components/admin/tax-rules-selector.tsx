"use client";
import React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { useTaxRules } from "@/hooks/use-product";
import { Checkbox } from "@/components/ui/checkbox";
import { TaxRuleDialog } from "../../app/(apps)/admin/products/tax-rules/tax-rule-dialog";
import { LoadingSkeleton } from "@/components/admin/placeholder-component";
import { useDebounce } from "@/hooks/use-debounce";
import { QueryState } from "./query-state";

interface TaxRule {
  id: string | number;
  name: string;
  rate: string;
}

export const TaxRulesSelector = ({
  selected,
  setSelectedChange,
  children,
}: {
  selected: number | undefined;
  setSelectedChange: (value: TaxRule) => void;
  children: React.ReactNode;
}) => {
  const [search, setSearch] = React.useState("");

  const [filters, setFilters] = React.useState({ q: "", page: "1" });

  const { data: taxRules, isPending, isError, error } = useTaxRules(filters);

  const debounceFn = useDebounce((value: string) => {
    setFilters({ q: value, page: "1" });
  }, 500);

  const options = React.useMemo(() => {
    return (
      taxRules?.data?.map((t) => ({
        id: String(t.id),
        name: t.name,
        rate: t.rate,
      })) ?? []
    );
  }, [taxRules]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="h-full flex flex-col max-h-[calc(100svh-10rem)] overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Select tax rules
          </DialogTitle>
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
          <QueryState
            isPending={isPending}
            isError={isError}
            isEmpty={options.length === 0}
            error={error}
          >
            {options.map((rule) => {
              return (
                <FieldLabel
                  key={rule.id}
                  htmlFor={rule.id}
                  className="cursor-pointer rounded-xl! bg-secondary/20"
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{rule.name}</FieldTitle>
                      <FieldDescription>{rule.rate}%</FieldDescription>
                    </FieldContent>

                    <Checkbox
                      id={rule.id}
                      checked={Number(rule.id) === selected}
                      onCheckedChange={() => setSelectedChange(rule)}
                    />
                  </Field>
                </FieldLabel>
              );
            })}
          </QueryState>
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
