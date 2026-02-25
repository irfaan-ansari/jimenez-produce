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
          className="rounded-xl min-w-40 justify-start"
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
  ...props
}: React.ComponentProps<"div">) => {
  const { searchParamsObj, queryParams } = useRouterStuff();
  const { q } = searchParamsObj;

  return (
    <InputGroup
      className={cn("max-w-sm w-full rounded-xl h-12", className)}
      {...props}
    >
      <InputGroupAddon className="pl-3">
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        value={searchParamsObj[q]}
        onChange={(e) =>
          queryParams({ set: { q: e.target.value }, del: ["page", "limit"] })
        }
        className="rounded-xl"
        placeholder="Search..."
      />
    </InputGroup>
  );
};
