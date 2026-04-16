import React from "react";
import Link from "next/link";
import { OrderStats } from "./order-stats";
import { TopProducts } from "./top-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OrderTrendChart } from "./order-trend-chart";
import { RecentOrders } from "./recent-orders";
import { getCustomer } from "@/server/customer";
import { STATUS_MAP } from "@/lib/constants/status-map";

export const metadata = {
  title: "Dashboard",
};
export const dynamic = "force-dynamic";
const DashboardPage = async () => {
  const { data, success, error } = await getCustomer();
  if (!success) throw new Error(error.message);

  const map = STATUS_MAP[(data?.status ?? "active") as keyof typeof STATUS_MAP];

  return (
    <div className="mt-4 flex h-full flex-col gap-8">
      {/* header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Hey there</h1>
          <p>
            Your account is
            <Badge
              variant="outline"
              style={{ "--color": map.color } as React.CSSProperties}
              className="ml-1.5 h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
            >
              <map.icon className="text-(--color)" />

              {map.label}
            </Badge>
          </p>
        </div>

        <Button size="xl" className="ml-auto rounded-xl" asChild>
          <Link href="/customer/orders/new">
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
