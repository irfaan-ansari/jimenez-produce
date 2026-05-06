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
import React from "react";
import { toast } from "sonner";
import { OrderGuideItemSheet } from "./order-guide-item-sheet";
import Link from "next/link";

export const GUIDES = [
  {
    id: 1,
    name: "Weekly Essentials",
    description: "Frequently ordered items for weekly restock",
    itemsCount: 12,
    recommended: true,
  },
  {
    id: 2,
    name: "Office Supplies",
    description: "Stationery and office basics for daily operations",
    itemsCount: 8,
    recommended: false,
  },
  {
    id: 3,
    name: "Kitchen Stock",
    description: "All kitchen and pantry essentials",
    itemsCount: 15,
    recommended: true,
  },
  {
    id: 4,
    name: "Electronics Backup",
    description: "Spare devices and essential accessories",
    itemsCount: 6,
    recommended: false,
  },
  {
    id: 5,
    name: "Cleaning Supplies",
    description: "Sanitizers, detergents, and cleaning essentials",
    itemsCount: 10,
    recommended: true,
  },
];

export const OrderGuideSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="gap-0">
        <SheetHeader className="gap-0 border-b">
          <SheetTitle className="text-lg font-semibold">
            Order Guides
          </SheetTitle>
          <SheetDescription>Your saved order guides</SheetDescription>
        </SheetHeader>
        <div className="no-scrollbar flex-1 gap-2 space-y-2 overflow-y-auto p-4">
          {GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="rounded-2xl border bg-muted/50 p-4 relative"
            >
              {guide.recommended && (
                <Badge className="absolute right-4 top-4 bg-amber-100 text-foreground border-amber-200">
                  Suggested
                </Badge>
              )}
              <p className="font-semibold mb-2 text-base">{guide.name}</p>
              <p className="text-muted-foreground text-sm">
                {guide.description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1">
                  <span className="font-medium text-muted-foreground">
                    {guide.itemsCount} items
                  </span>
                </div>
                <OrderGuideItemSheet>
                  <Button size="xs" type="button" className="bg-sidebar-accent">
                    View
                  </Button>
                </OrderGuideItemSheet>
                <Button
                  size="xs"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    toast.info("Show checkout dialog or complete the order");
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
        <SheetFooter>
          <Button
            size="xl"
            className="w-full rounded-xl bg-sidebar-accent"
            asChild
          >
            <Link href="/customer/order-guides">View All</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
