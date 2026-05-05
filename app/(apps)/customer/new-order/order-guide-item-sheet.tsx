import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatUSD, getInitialsAvatar } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const ITEMS = [
  {
    id: 1,
    title: "Organic Almonds",
    categories: ["snacks", "dry fruits"],
    basePrice: 12,
  },
  {
    id: 2,
    title: "Whole Wheat Bread",
    categories: ["bakery", "essentials"],
    basePrice: 3,
  },
  {
    id: 3,
    title: "Extra Virgin Olive Oil",
    categories: ["cooking", "oils"],
    basePrice: 18,
  },
  {
    id: 4,
    title: "Black Pepper Grinder",
    categories: ["spices", "condiments"],
    basePrice: 5,
  },
  {
    id: 5,
    title: "Basmati Rice (5kg)",
    categories: ["grains", "essentials"],
    basePrice: 22,
  },
  {
    id: 6,
    title: "Greek Yogurt",
    categories: ["dairy", "breakfast"],
    basePrice: 4,
  },
  {
    id: 7,
    title: "Dark Chocolate 70%",
    categories: ["snacks", "sweets"],
    basePrice: 6,
  },
  {
    id: 8,
    title: "Green Tea Bags",
    categories: ["beverages", "tea"],
    basePrice: 7,
  },
  {
    id: 9,
    title: "Laundry Detergent",
    categories: ["cleaning", "household"],
    basePrice: 9,
  },
  {
    id: 10,
    title: "Toothpaste Pack",
    categories: ["personal care", "hygiene"],
    basePrice: 4,
  },
];

export const OrderGuideItemSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="gap-0">
        <SheetHeader className="gap-0 border-b">
          <SheetTitle className="text-lg font-semibold">
            Kitchen Stock
          </SheetTitle>
          <SheetDescription>
            All kitchen and pantry essentials (10 items)
          </SheetDescription>
        </SheetHeader>
        <div className="no-scrollbar flex-1 space-y-1 overflow-y-auto p-4">
          {ITEMS.map((item) => (
            <div className="flex flex-1 items-start gap-3 border rounded-xl bg-muted/20 p-2">
              <div className="shrink-0">
                <Avatar className="size-9 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-lg after:hidden">
                  <AvatarImage src={getInitialsAvatar(item.title)} />
                  <AvatarFallback>
                    {getInitialsAvatar(item.title)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p>{item.title}</p>
                <div className="flex gap-1 items-center">
                  {item.categories?.map((cat, i) => (
                    <Badge
                      key={cat + i}
                      variant="outline"
                      className="rounded-sm border border-border bg-primary/20"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="w-28 self-stretch flex flex-col items-end justify-between">
                <span className="font-medium">{formatUSD(item.basePrice)}</span>
                <Button
                  size="icon-xs"
                  type="button"
                  onClick={() =>
                    toast.info("This action will add item to cart")
                  }
                >
                  <PlusIcon />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
