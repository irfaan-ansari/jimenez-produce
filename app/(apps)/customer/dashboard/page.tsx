import Link from "next/link";
import { Plus } from "lucide-react";
import { OrderStats } from "./order-stats";
import { TopProducts } from "./top-products";
import { RecentOrders } from "./recent-orders";
import { Button } from "@/components/ui/button";
import { OrderTrendChart } from "./order-trend-chart";

export const metadata = {
  title: "Dashboard",
};
export const dynamic = "force-dynamic";
const DashboardPage = async () => {
  return (
    <div className="@container mt-4 flex h-full flex-col gap-8">
      {/* header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Hey there</h1>
        </div>

        <Button size="xl" className="ml-auto rounded-xl" asChild>
          <Link href="/customer/new-order">
            <Plus /> New Order
          </Link>
        </Button>
      </div>
      {/* content */}
      <div className="grid grid-cols-6 gap-8">
        <OrderStats />

        <OrderTrendChart />

        <TopProducts />

        <RecentOrders />
      </div>
    </div>
  );
};

export default DashboardPage;
