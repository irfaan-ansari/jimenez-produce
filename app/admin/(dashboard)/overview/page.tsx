import { ProductCounts } from "./product-stats";
import { CustomerCounts } from "./customer-counts";
import { CustomerInvites } from "./customer-invites";
import { JobApplications } from "./job-applications";
import { WelcomeBanner } from "./welcome";

export const metadata = {
  title: "Overview",
};
const OverviewPage = () => {
  return (
    <div className="flex flex-col gap-8 h-full">
      <WelcomeBanner />

      <CustomerCounts />
      <div className="grid grid-cols-6 gap-8">
        <CustomerInvites />
        <ProductCounts />
      </div>
      <JobApplications />
    </div>
  );
};

export default OverviewPage;
