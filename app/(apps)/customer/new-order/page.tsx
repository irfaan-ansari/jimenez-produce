import { SearchBar } from "@/components/admin/search-filters";
import { OrderForm } from "./order-form";
import { getCustomer } from "@/server/customer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "New Order",
};
export const dynamic = "force-dynamic";

const NewOrderPage = async () => {
  const { data: customer, success, error } = await getCustomer();
  if (!success) throw new Error(error?.message);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center gap-4 w-full **:data-[slot=input-group]:bg-background">
        <div className="space-y-1 flex-1">
          <h1 className="text-2xl font-bold">Build a new order</h1>
          <p className="text-sm text-muted-foreground">
            Search products, update quantities, and send an order faster.
          </p>
        </div>
        <SearchBar placeholder="Search products..." />

        <Button size="xl" className="rounded-xl" asChild>
          <Link href="/customer/new-order">View Cart (4)</Link>
        </Button>
      </div>

      {/* content */}
      <OrderForm customer={customer!} lineItems={[]} />
    </div>
  );
};

export default NewOrderPage;
