import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { InviteCandidate } from "@/components/admin/invite-candidate";
import { PageClient } from "./page-client";

export const metadata = {
  title: "Candidate Invitations",
};
const OPTIONS = [
  { label: "All", value: "" },
  { label: "Invited", value: "new" },
  { label: "Applied", value: "applied" },
  { label: "Hired", value: "hired" },
];
const JobApplicationPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Candidate Invitations</h1>
      <FilterTabs tabs={OPTIONS} queryKey="job-invites" />

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
