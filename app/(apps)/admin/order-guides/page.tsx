import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageClient } from "./page-client";
import { SearchBar } from "@/components/admin/search-filters";
import { OrderGuideAdmin } from "@/components/order-guide-admin";

const OrderGuidesPage = () => {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-y-4 gap-x-2">
        <div className="flex-1 space-y-1">
          <h1 className="text-xl font-bold">Order guides</h1>
          <p className="text-sm text-muted-foreground line-clamp-1">
            Create and nmanage order guides for your customers.
          </p>
        </div>

        <OrderGuideAdmin>
          <Button size="xl" className="min-w-28 rounded-xl md:order-3">
            <Plus /> New Guide
          </Button>
        </OrderGuideAdmin>
        <SearchBar className="basis-full max-w-full md:max-w-xs" />
      </div>

      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrderGuidesPage;
