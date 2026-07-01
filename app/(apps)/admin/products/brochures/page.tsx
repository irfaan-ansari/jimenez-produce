import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { PageClient } from "./page-client";
import BrochureDialog from "./brochure-dialog";

export const metadata = {
  title: "Brochures",
};

const CatalogPage = async () => {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap md:flex-nowrap w-full items-center gap-y-4 gap-x-2">
        <div className="flex flex-1 flex-col">
          <h1 className="text-xl font-bold">Brochures</h1>
          <p className="text-muted-foreground text-sm line-clamp-1">
            Manage your brochures
          </p>
        </div>
        <BrochureDialog>
          <Button size="xl" className="rounded-xl">
            <Plus />
            New brochure
          </Button>
        </BrochureDialog>
      </div>
      <PageClient />
    </div>
  );
};

export default CatalogPage;
