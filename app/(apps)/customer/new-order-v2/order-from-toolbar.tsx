import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  LAYOUT_MAP,
  LayoutType,
  useOrderUIStore,
} from "@/lib/store/order-store";
import { CategoryFilter } from "./category-filter";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const OrderFormToolbar = () => {
  const layout = useOrderUIStore((s) => s.layout);
  const setLayout = useOrderUIStore((s) => s.setLayout);
  return (
    <div className="flex gap-4 flex-1 justify-end">
      {/* hide this when selected tab is guide */}

      <CategoryFilter filter={{}} setFilter={() => {}} />

      {/* this toggle is for all products  / maintain new group for the guides stab*/}
      <ToggleGroup
        type="single"
        variant="default"
        className="h-10 px-1 bg-background shadow-sm rounded-lg items-center justify-center border"
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
              <Icon />
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
};

export const ToolbarSearch = ({ className }: { className?: string }) => {
  return (
    <InputGroup
      className={cn("h-11 bg-background max-w-2xs rounded-lg ", className)}
    >
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>
          <X />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
