import { PageClient } from "./page-client";
import { SIDEBAR_MENU } from "@/lib/config";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { CustomerInviteDialog } from "@/components/admin/customer-invite-dialog";
import { JobPostDialog } from "@/components/admin/job-post-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const metadata = {
  title: "Job Posts",
};
const TAB_OPTIONS =
  SIDEBAR_MENU.find((i) => i.href === "/admin/job-posts")?.items ||
  SIDEBAR_MENU[0]["items"];

const JobPosts = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Job Posts</h1>

      <FilterTabs tabs={TAB_OPTIONS} queryKey="job-posts" />

      <div className="flex gap-4 items-center">
        <SearchBar />
        <JobPostDialog>
          <Button size="xl" className="rounded-xl ml-auto min-w-32 px-8">
            <PlusCircle /> New Job Post
          </Button>
        </JobPostDialog>
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default JobPosts;
