import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-product";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerItem,
  DropDrawerTrigger,
} from "@/components/dropdrawer";

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
      <DropDrawer open={open} onOpenChange={setOpen}>
        <DropDrawerTrigger asChild>
          <Button type="button" variant="outline" className="rounded-lg">
            <Filter />
            All Categories
            <ChevronDown className="opacity-80" />
          </Button>
        </DropDrawerTrigger>

        <DropDrawerContent className="flex flex-col md:max-h-[500px]">
          <DropDrawerItem
            onClick={() => setFilter({ ...filter, cat: "" })}
            icon={<Check data-selected={!filter.cat} className="size-4" />}
          >
            All
          </DropDrawerItem>

          {data?.data?.map((cat, i) => (
            <DropDrawerItem
              key={cat + i}
              onClick={() => setFilter({ ...filter, cat })}
            >
              {cat}
            </DropDrawerItem>
          ))}
        </DropDrawerContent>
      </DropDrawer>

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
