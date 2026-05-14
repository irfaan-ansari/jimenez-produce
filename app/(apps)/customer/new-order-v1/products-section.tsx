import React from "react";
import {
  LAYOUT_MAP,
  LayoutType,
  useLayoutPreference,
} from "@/hooks/use-layout-prefrence";
import { ItemList } from "./item-list";
import { GuideItems } from "./guide-items";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import { CategoryFilter } from "./category-filter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const ProductsSection = withForm({
  ...formOpt,
  render: function Render({ form }) {
    const [layout, setLayout] = useLayoutPreference();
    const [filters, setFilters] = React.useState<Record<string, string>>({});

    return (
      <div
        data-layout={layout}
        className="group/card @container min-h-svh min-w-0 flex-1 space-y-5"
      >
        {/* toolbar */}
        <div className="flex items-center justify-between gap-3">
          <CategoryFilter filter={filters} setFilter={setFilters} />
          <ToggleGroup
            type="single"
            variant="outline"
            value={layout}
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
                  className="data-[state=on]:bg-sidebar-accent data-[state=on]:text-primary-foreground"
                >
                  <Icon />
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>

        {/* order guide */}
        <GuideItems form={form} layout={layout} />

        {/* item list */}
        <ItemList form={form} layout={layout} filters={filters} />
      </div>
    );
  },
});
