import { PageClient } from "./page-client";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { CustomerInviteDialog } from "@/components/admin/customer-invite-dialog";

export const metadata = {
  title: "Customer Invites",
};

const OPTIONS = [
  { label: "All", value: "" },
  { label: "Invited", value: "invited" },
  { label: "Applied", value: "applied" },
  { label: "Approved", value: "converted" },
];

const InvitesPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Customer Invitations</h1>

      <FilterTabs tabs={OPTIONS} queryKey="invites" />

      <div className="flex gap-4 items-center">
        <SearchBar />
        <div className="flex flex-1 justify-end items-center">
          <CustomerInviteDialog type="invitation" />
        </div>
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default InvitesPage;
