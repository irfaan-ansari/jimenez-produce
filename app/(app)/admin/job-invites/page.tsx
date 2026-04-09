import { SIDEBAR_MENU } from "@/lib/config";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { InviteCandidate } from "@/components/admin/invite-candidate";
import { PageClient } from "./page-client";

const TAB_OPTIONS =
  SIDEBAR_MENU.find((i) => i.href === "/admin/job-invites")?.items ||
  SIDEBAR_MENU[0]["items"];

export const metadata = {
  title: "Candidate Invitations",
};
const JobApplicationPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Candidate Invitations</h1>
      <FilterTabs tabs={TAB_OPTIONS} queryKey="job-invites" />

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
