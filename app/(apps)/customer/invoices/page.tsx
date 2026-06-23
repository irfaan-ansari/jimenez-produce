import { Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { FilterTab } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";

export const metadata = {
  title: "Invoices",
};

const OPTIONS = [
  { label: "All", value: "" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Paid", value: "paid" },
  { label: "Partially Paid", value: "partially_paid" },
  { label: "Overdue", value: "overdue" },
];

const InvoicePage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex w-full flex-wrap md:flex-nowrap items-start gap-x-2 gap-y-4">
        <div className="flex-1 space-y-1">
          <h1 className="text-xl font-bold">Manage Invoices</h1>
          <p className="text-sm text-muted-foreground">
            View, track, and manage all invoice in one place.
          </p>
        </div>
        {/* <Button size="xl" className="rounded-xl md:order-3">
          <Plus /> Draft Order
        </Button> */}
        <SearchBar className="basis-full max-w-full md:basis-xs md:order-2" />
      </div>

      <FilterTab tabs={OPTIONS} path="/api/orders/count" />
      {/* content */}
      <PageClient />
    </div>
  );
};

export default InvoicePage;
