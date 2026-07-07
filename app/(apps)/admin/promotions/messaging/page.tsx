import { SearchBar } from "@/components/admin/search-filters";

import { FilterTab } from "@/components/admin/filter-tabs";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateCampaignDialog } from "./create-campaign-dialog";

export const metadata = {
  title: "Promotions",
};

const OPTIONS = [
  { label: "All", value: "" },
  { label: "Send", value: "active" },
  { label: "Failed", value: "inactive" },
];

const MessagingPage = () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex flex-wrap items-center w-full md:flex-nowrap gap-y-4 gap-x-2">
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-bold">Promotions</h1>
          <p className="text-sm text-muted-foreground line-clamp-1">
            Manage promotions
          </p>
        </div>
        <CreateCampaignDialog>
          <Button size="xl" className="rounded-xl md:order-3">
            <Plus /> New Message
          </Button>
        </CreateCampaignDialog>

        <SearchBar className="max-w-full basis-full md:basis-xs md:order-2" />
      </div>

      <FilterTab tabs={OPTIONS} path="/api/promotions/count" />

      {/* content */}
      {/* <PageClient /> */}
    </div>
  );
};

export default MessagingPage;
