import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-product";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { PopoverXDrawer } from "@/components/popover-x-drawer";

/* Filter By Category */
export const CategoryFilter = ({
  filter,
  setFilter,
}: {
  filter: Record<string, string>;
  setFilter: any;
}) => {
  const [open, setOpen] = React.useState(false);
  const { data, isPending, isError } = useCategories();

  const toggle = (cat: string) => {
    setFilter((prev: any) => {
      const next = { ...prev, page: "1" };
      if (next.cat === cat) delete next.cat;
      else next.cat = cat;
      return next;
    });
  };

  if (isError) return null;

  if (isPending)
    return (
      <div className="flex w-full flex-1 items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-18 rounded-xl" />
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

      <div className="no-scrollbar hidden flex-1 items-center gap-2 overflow-x-auto lg:flex">
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
