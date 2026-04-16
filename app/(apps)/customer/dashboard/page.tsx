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
import { statusMap } from "@/lib/constants/customer";

export const metadata = {
  title: "Dashboard",
};
export const dynamic = "force-dynamic";
const DashboardPage = async () => {
  const { data, success, error } = await getCustomer();
  if (!success) throw new Error(error.message);

  const map = statusMap[(data?.status ?? "active") as keyof typeof statusMap];

  return (
    <div className="flex flex-col gap-8 mt-4 h-full">
      {/* header */}
      <div className="flex gap-4 items-center">
        <div>
          <h1 className="text-2xl font-semibold">Hey there</h1>
          <p>
            Your account is
            <Badge
              variant="outline"
              style={{ "--color": map.color } as React.CSSProperties}
              className="h-7 ml-1.5 rounded-xl pl-1.5 pr-2.5 gap-1.5 [&>svg]:size-3.5! bg-(--color)/10 border-(--color)/10 text-sm"
            >
              <map.icon className="text-(--color)" />

              {map.label}
            </Badge>
          </p>
        </div>

        <Button size="xl" className="rounded-xl ml-auto" asChild>
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
