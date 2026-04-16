import { PageClient } from "./page-client";
import { SIDEBAR_MENU } from "@/lib/config";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { InviteCandidate } from "@/components/admin/invite-candidate";

const TAB_OPTIONS =
  SIDEBAR_MENU.find((i) => i.href === "/admin/job-applications")?.items ||
  SIDEBAR_MENU[0]["items"];

export const metadata = {
  title: "Job Applications",
};
const JobApplicationPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Job Applications</h1>
      <FilterTabs tabs={TAB_OPTIONS} queryKey="job-applications" />

      <div className="flex gap-4 items-center">
        <SearchBar />
        <InviteCandidate />
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default JobApplicationPage;
