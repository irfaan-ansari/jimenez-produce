import { PageClient } from "./page-client";
import { SIDEBAR_MENU } from "@/lib/config";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { CustomerInviteDialog } from "@/components/admin/customer-invite-dialog";

export const metadata = {
  title: "Customer Invites",
};

const TAB_OPTIONS =
  SIDEBAR_MENU.find((i) => i.href === "/admin/invites")?.items ||
  SIDEBAR_MENU[0]["items"];

const InvitesPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Customer Invitations</h1>

      <FilterTabs tabs={TAB_OPTIONS} queryKey="invites" />

      <div className="flex gap-4 items-center">
        <SearchBar />
        <CustomerInviteDialog type="invitation" />
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default InvitesPage;
