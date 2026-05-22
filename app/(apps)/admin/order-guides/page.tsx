import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageClient } from "./page-client";
import { SearchBar } from "@/components/admin/search-filters";
import { OrderGuideAdmin } from "@/components/admin/order-guide-admin";

const OrderGuidesPage = () => {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-wrap items-center md:flex-nowrap gap-y-4 gap-x-2">
        <div className="flex-1 space-y-1">
          <h1 className="text-xl font-bold">Order guides</h1>
          <p className="text-sm text-muted-foreground line-clamp-1">
            Create and manage order guides for customers.
          </p>
        </div>

        <OrderGuideAdmin>
          <Button size="xl" className="min-w-28 rounded-xl md:order-3">
            <Plus /> New Guide
          </Button>
        </OrderGuideAdmin>
        <SearchBar className="max-w-full basis-full md:max-w-xs" />
      </div>

      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrderGuidesPage;
