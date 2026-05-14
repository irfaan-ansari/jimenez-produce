import { OrderForm } from "./order-form";
import { getTeamTaxRules } from "@/server/tax-rule";

export const metadata = {
  title: "New Order",
};
export const dynamic = "force-dynamic";

const NewOrderPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const { data } = await getTeamTaxRules();

  return <OrderForm taxRules={data ?? []} />;
};

export default NewOrderPage;
