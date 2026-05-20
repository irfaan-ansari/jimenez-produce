import { OrderForm } from "./order-form";
import { getTeamTaxRule } from "@/server/tax-rule";

export const metadata = {
  title: "New Order",
};

export const dynamic = "force-dynamic";

const NewOrderPage = async () => {
  const { data } = await getTeamTaxRule();

  return <OrderForm taxRule={data!} />;
};

export default NewOrderPage;
