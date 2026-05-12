import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

export const ProductItemQty = ({
  value = 0,
  onChange,
  className,
}: {
  value: number;
  onChange: (arg: number) => void;
  className?: string;
}) => {
  return (
    <InputGroup
      className={cn("h-8 w-24 shrink-0 self-center rounded-xl", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <InputGroupInput
        value={value}
        className="px-0 text-center text-xs"
        onChange={(e) => onChange?.(Number(e.target.value))}
      />

      <InputGroupAddon align="inline-start">
        <InputGroupButton
          type="button"
          size="icon-xs"
          className="rounded-xl bg-secondary"
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          <Minus />
        </InputGroupButton>
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-xs"
          variant="default"
          className="rounded-xl bg-foreground hover:bg-foreground/80"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="size-3" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
