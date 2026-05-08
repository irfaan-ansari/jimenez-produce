import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderGuidesClientPage } from "./page-client";
import { SearchBar } from "@/components/admin/search-filters";

const OrderGuidesPage = () => {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex w-full items-center gap-4 **:data-[slot=input-group]:bg-background">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold">Order guides</h1>
          <p className="text-sm text-muted-foreground">
            Manage your saved order guides for quick reordering.
          </p>
        </div>
        <SearchBar />

        <Button size="xl" className="rounded-xl" asChild>
          <Link href="/customer/order-guides/new">
            <Plus /> New Guide
          </Link>
        </Button>
      </div>

      {/* content */}
      <OrderGuidesClientPage />
    </div>
  );
};

export default OrderGuidesPage;
