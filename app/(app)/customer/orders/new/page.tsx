import { OrderForm } from "./order-form";
import { getCustomer } from "@/server/customer";

export const metadata = {
  title: "New Order",
};
export const dynamic = "force-dynamic";

const NewOrderPage = async () => {
  const { data: customer, success, error } = await getCustomer();
  if (!success) throw new Error(error?.message);

  return (
    <div className="mt-3">
      <OrderForm customer={customer!} />
    </div>
  );
};

export default NewOrderPage;
