import React from "react";
import {
  LAYOUT_MAP,
  LayoutType,
  useOrderUIStore,
} from "@/lib/store/order-store";
import { cn } from "@/lib/utils";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-product";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { Search, X, Check, ChevronDown, Filter } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const OrderFormToolbar = () => {
  const layout = useOrderUIStore((s) => s.layout);
  const setLayout = useOrderUIStore((s) => s.setLayout);
  const selectedTab = useOrderUIStore((s) => s.selectedTab);

  return (
    <div className="flex gap-4 flex-1 justify-between">
      <ToggleGroup
        type="single"
        variant="default"
        className="h-9 px-0.5 bg-background shadow-none rounded-lg items-center justify-center border"
        value={layout}
        size="sm"
        spacing={0.5}
        onValueChange={(v) => {
          if (!v) return;
          setLayout(v as LayoutType);
        }}
      >
        {Object.values(LAYOUT_MAP).map((item) => {
          const Icon = item.icon;

          return (
            <ToggleGroupItem
              key={item.value}
              value={item.value}
              className="capitalize text-muted-foreground data-[state=on]:text-foreground"
            >
              <Icon className="size-3.5" /> {item.value}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      {selectedTab == "all" && <CategoryFilter />}
    </div>
  );
};

export const ToolbarSearch = ({ className }: { className?: string }) => {
  const filter = useOrderUIStore((s) => s.filter);
  const setFilter = useOrderUIStore((s) => s.setFilter);

  const [search, setSearch] = React.useState(filter.q || "");

  const debouncedSetQuery = useDebounce((value: string) => {
    setFilter({ q: value });
  }, 400);

  return (
    <InputGroup
      className={cn("h-11 bg-background max-w-2xs rounded-lg ", className)}
    >
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          debouncedSetQuery(e.target.value);
        }}
        placeholder="Search..."
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>
          <X />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export const CategoryFilter = () => {
  const [open, setOpen] = React.useState(false);
  const { data, isPending, isError } = useCategories();

  const filter = useOrderUIStore((s) => s.filter);
  const setFilter = useOrderUIStore((s) => s.setFilter);

  const toggle = (cat: string) => {
    setFilter({
      cat: filter.cat === cat ? undefined : cat,
      page: "1",
    });
  };

  if (isError) return null;

  if (isPending)
    return (
      <div className="flex w-full flex-1 items-center gap-0.5">
        {[...Array(1)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-18 rounded-xl bg-slate-200" />
        ))}
      </div>
    );

  const categories = data.data.slice(0, 8);

  const displayPills =
    filter.cat && !categories.includes(filter.cat)
      ? [...data.data.slice(0, 7), filter.cat]
      : categories;

  return (
    <>
      <PopoverXDrawer
        open={open}
        setOpen={setOpen}
        trigger={
          <Button type="button" variant="outline" className="rounded-lg">
            <Filter />
            All Categories
            <ChevronDown className="opacity-80" />
          </Button>
        }
        className="no-scrollbar max-h-80 overflow-auto *:gap-0"
      >
        <>
          <Button
            variant={!filter.cat ? "secondary" : "ghost"}
            className="rounded-lg!"
            type="button"
            onClick={() => setFilter({ ...filter, cat: "" })}
          >
            All
            <Check
              data-selected={!filter.cat}
              className="ml-auto opacity-0 data-[selected=true]:opacity-100"
            />
          </Button>
          {data?.data?.map((cat, i) => (
            <Button
              variant={filter.cat === cat ? "secondary" : "ghost"}
              className="rounded-lg!"
              type="button"
              key={cat + i}
              onClick={() => setFilter({ ...filter, cat })}
            >
              {cat}
              <Check
                data-selected={cat === filter.cat}
                className="ml-auto opacity-0 data-[selected=true]:opacity-100"
              />
            </Button>
          ))}
        </>
      </PopoverXDrawer>

      <div className="no-scrollbar flex-1 items-center gap-2 overflow-x-auto hidden lg:flex">
        {displayPills.map((cat: string) => (
          <Button
            key={cat}
            type="button"
            data-active={filter.cat === cat}
            variant="outline"
            className="rounded-lg data-[active=true]:bg-foreground data-[active=true]:text-primary-foreground"
            onClick={() => toggle(cat)}
          >
            {cat}
            {filter.cat === cat && (
              <Button
                size="icon-xs"
                className="rounded-xl"
                variant="ghost"
                type="button"
                asChild
              >
                <span>
                  <X />
                </span>
              </Button>
            )}
          </Button>
        ))}
      </div>
    </>
  );
};
