import { SearchBar } from "@/components/admin/search-filters";

import { FilterTab } from "@/components/admin/filter-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MessageDialog } from "./message-dialog";
import PageClient from "./page-client";

export const metadata = {
  title: "Promotions",
};

const OPTIONS = [
  { label: "All", value: "" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
];

const PromotionsPage = () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex flex-wrap items-center w-full md:flex-nowrap gap-y-4 gap-x-2">
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-bold">Messages</h1>
          <p className="text-sm text-muted-foreground line-clamp-1">
            View past messages
          </p>
        </div>

        <MessageDialog>
          <Button size="xl" className="rounded-xl md:order-3">
            <Plus /> New Message
          </Button>
        </MessageDialog>

        <SearchBar className="max-w-full basis-full md:basis-xs md:order-2" />
      </div>

      <FilterTab tabs={OPTIONS} path="/api/promotions/messages/count" />

      {/* content */}
      <PageClient />
    </div>
  );
};

export default PromotionsPage;
