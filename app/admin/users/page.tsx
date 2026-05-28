import { Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { UserDialog } from "@/features/admin/components/user-dialog";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/admin/search-filters";

export const metadata = {
  title: "Users",
};

const TeamPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex flex-wrap items-center md:flex-nowrap gap-y-4 gap-x-2">
        <h1 className="flex-1 text-xl font-bold">Users</h1>

        <UserDialog data={{ accountType: "admin" }}>
          <Button size="xl" className="rounded-xl md:order-3">
            <Plus /> Add New
          </Button>
        </UserDialog>
        <SearchBar className="max-w-full basis-full md:max-w-xs" />
      </div>
      <PageClient />
    </div>
  );
};

export default TeamPage;
