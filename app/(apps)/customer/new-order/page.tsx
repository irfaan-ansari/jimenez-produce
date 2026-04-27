import { getTeamTaxRules } from "@/server/tax-rule";
import { OrderForm } from "./order-form";

export const metadata = {
  title: "New Order",
};
export const dynamic = "force-dynamic";

const NewOrderPage = async () => {
  const { data } = await getTeamTaxRules();

  return <OrderForm taxRules={data ?? []} />;
};

export default NewOrderPage;
