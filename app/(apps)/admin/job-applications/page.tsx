import { PageClient } from "./page-client";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { InviteCandidate } from "@/components/admin/invite-candidate";

export const metadata = {
  title: "Job Applications",
};

const OPTIONS = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Interview", value: "interview" },
  { label: "Agreement", value: "pending" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
];

const JobApplicationPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Job Applications</h1>
      <FilterTabs tabs={OPTIONS} queryKey="job-applications" />

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
