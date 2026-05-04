import { PageClient } from "./page-client";
import { FilterTab } from "@/components/admin/filter-tabs";
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
    <div className="flex h-full flex-col gap-5">
      <div className="flex justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <p className="text-sm text-muted-foreground">
            Manage all applications in one place
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <SearchBar />
          <InviteCandidate />
        </div>
      </div>
      <FilterTab tabs={OPTIONS} path="/api/applications/candidate/count" />

      {/* content */}
      <PageClient />
    </div>
  );
};

export default JobApplicationPage;
