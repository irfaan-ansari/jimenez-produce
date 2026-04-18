import { auth } from "@/lib/auth";
import { Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { getSession } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/admin/search-filters";
import { AddUserDialog } from "@/components/admin/add-user-dialog";
import { FilterTabs } from "@/components/admin/filter-tabs";

export const metadata = {
  title: "Users",
};

const TeamPage = async () => {
  const session = await getSession();

  const { success, error } = await auth.api.userHasPermission({
    body: {
      userId: session?.session.userId,
      permissions: {
        user: ["list"],
      },
    },
  });

  return (
    <div className="flex h-full flex-col gap-5">
      <h1 className="text-2xl font-semibold">Users</h1>

      <FilterTabs tabs={[{ label: "All", value: "" }]} queryKey="" />

      <div className="flex items-center gap-4">
        <SearchBar />
        <AddUserDialog>
          <Button size="xl" className="ml-auto rounded-xl" disabled={!success}>
            <Plus /> Add New
          </Button>
        </AddUserDialog>
      </div>
      <PageClient />
    </div>
  );
};

export default TeamPage;
