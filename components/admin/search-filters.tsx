"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { PopoverXDrawer } from "../popover-x-drawer";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { Calendar, ChevronDown, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const options = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Yesterday",
    value: "yesterday",
  },
  {
    label: "Last 7 days",
    value: "7d",
  },
  {
    label: "Last 30 days",
    value: "30d",
  },
  {
    label: "Last 3 months",
    value: "3m",
  },
  {
    label: "Last 12 months",
    value: "12m",
  },
  {
    label: "All",
    value: "all",
  },
];
export const DateFilter = () => {
  const [open, setOpen] = useState(false);
  const { searchParamsObj, queryParams } = useRouterStuff();
  const { range } = searchParamsObj;
  return (
    <PopoverXDrawer
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          variant="outline"
          className="min-w-40 justify-start rounded-xl"
          size="xl"
        >
          <Calendar /> Today
          <ChevronDown className="ml-auto" />
        </Button>
      }
    >
      {options.map((opt) => (
        <Button variant="ghost" key={opt.value}>
          {opt.label}
        </Button>
      ))}
    </PopoverXDrawer>
  );
};

export const SearchBar = ({
  className,
  placeholder = "Search...",
  ...props
}: React.ComponentProps<"div"> & { placeholder?: string }) => {
  const { searchParamsObj, queryParams } = useRouterStuff();

  const debouncedSetQuery = useDebounce((value: string) => {
    queryParams({
      set: { q: value },
      del: ["page", "limit"],
    });
  }, 400);

  return (
    <InputGroup
      className={cn("h-11 w-full max-w-sm rounded-xl", className)}
      {...props}
    >
      <InputGroupAddon className="pl-3">
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        value={searchParamsObj.q}
        onChange={(e) => debouncedSetQuery(e.target.value)}
        className="rounded-xl"
        placeholder={placeholder}
      />
    </InputGroup>
  );
};
