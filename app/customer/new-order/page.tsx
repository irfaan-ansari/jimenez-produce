import { getTaxRule } from "@/features/order/actions/tax-rule";
import { OrderForm } from "@/features/order/components/order-form";

export const metadata = {
  title: "New Order",
};

export const dynamic = "force-dynamic";

const NewOrderPage = async () => {
  const { data } = await getTaxRule();

  return <OrderForm taxRule={data!} />;
};

export default NewOrderPage;
