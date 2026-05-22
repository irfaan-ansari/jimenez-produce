import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaxRuleDialog } from "./tax-rule-dialog";
import { SearchBar } from "@/components/admin/search-filters";
import { PageClient } from "./page-client";

export const metadata = {
  title: "Tax Rules",
};

const TaxRulesPage = async () => {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-y-4 gap-x-2">
        <div className="flex-1 space-y-1">
          <h1 className="text-xl font-bold">Tax Rules</h1>
          <p className="text-sm text-muted-foreground">
            Manage tax rules settings.
          </p>
        </div>

        <TaxRuleDialog>
          <Button size="xl" className="min-w-28 rounded-xl md:order-3">
            <Plus /> Add New
          </Button>
        </TaxRuleDialog>
        <SearchBar className="basis-full max-w-full md:max-w-xs" />
      </div>

      {/* content */}
      <PageClient />
    </div>
  );
};

export default TaxRulesPage;
