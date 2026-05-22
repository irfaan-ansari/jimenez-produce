import { Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { UserDialog } from "./user-dialog";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/admin/search-filters";

export const metadata = {
  title: "Users",
};

const TeamPage = async () => {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-y-4 gap-x-2">
        <h1 className="text-xl font-bold flex-1">Users</h1>

        <UserDialog data={{ accountType: "admin" }}>
          <Button size="xl" className="rounded-xl md:order-3">
            <Plus /> Add New
          </Button>
        </UserDialog>
        <SearchBar className="basis-full max-w-full md:max-w-xs" />
      </div>
      <PageClient />
    </div>
  );
};

export default TeamPage;
