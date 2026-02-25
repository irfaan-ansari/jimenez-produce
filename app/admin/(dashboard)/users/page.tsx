import { PlusCircle } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/admin/search-filters";
import { AddUserDialog } from "@/components/admin/add-user-dialog";

export const metadata = {
  title: "Users",
};
const TeamPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Users</h1>
      <div className="flex gap-4 items-center">
        <SearchBar />
        <AddUserDialog>
          <Button size="xl" className="min-w-36 ml-auto rounded-xl">
            <PlusCircle /> Add User
          </Button>
        </AddUserDialog>
      </div>
      <PageClient />
    </div>
  );
};

export default TeamPage;
