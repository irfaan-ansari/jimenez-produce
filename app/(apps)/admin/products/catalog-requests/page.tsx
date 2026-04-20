import { PageClient } from "./page-client";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { CustomerInviteDialog } from "@/components/admin/customer-invite-dialog";

const OPTIONS = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Revoked", value: "revoked" },
];

export const metadata = {
  title: "Catalog Request",
};
const JobApplicationPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Catalog Requests</h1>

      <FilterTabs tabs={OPTIONS} queryKey="requests" />

      <div className="flex gap-4 items-center">
        <SearchBar />
        <div className="flex flex-1 justify-end">
          <CustomerInviteDialog type="request" />
        </div>
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default JobApplicationPage;
