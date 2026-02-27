import { SIDEBAR_MENU } from "@/lib/config";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { CustomerInviteDialog } from "@/components/admin/customer-invite-dialog";
import { PageClient } from "./page-client";

const TAB_OPTIONS =
  SIDEBAR_MENU.find((i) => i.href === "/admin/catalog-requests")?.items ||
  SIDEBAR_MENU[0]["items"];

export const metadata = {
  title: "Catalog Request",
};
const JobApplicationPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Catalog Requests</h1>

      <FilterTabs tabs={TAB_OPTIONS} queryKey="job-applications" />

      <div className="flex gap-4 items-center">
        <SearchBar />
        <CustomerInviteDialog />
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default JobApplicationPage;
