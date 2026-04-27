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
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold">Tax Rules</h1>
          <p className="text-sm text-muted-foreground">
            Manage tax rules settings.
          </p>
        </div>

        <div className="flex flex-1 justify-end items-center gap-4">
          <SearchBar />
          <TaxRuleDialog>
            <Button size="xl" className="min-w-28 rounded-xl">
              <Plus /> Add New
            </Button>
          </TaxRuleDialog>
        </div>
      </div>

      {/* content */}
      <PageClient />
    </div>
  );
};

export default TaxRulesPage;
