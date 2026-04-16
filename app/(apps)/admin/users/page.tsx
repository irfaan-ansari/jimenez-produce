import { auth } from "@/lib/auth";
import { PlusCircle } from "lucide-react";
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
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Users</h1>

      <FilterTabs tabs={[{ label: "All", value: "" }]} queryKey="" />

      <div className="flex gap-4 items-center">
        <SearchBar />
        <AddUserDialog>
          <Button
            size="xl"
            className="min-w-36 ml-auto rounded-xl"
            disabled={!success}
          >
            <PlusCircle /> Add User
          </Button>
        </AddUserDialog>
      </div>
      <PageClient />
    </div>
  );
};

export default TeamPage;
