import { getTeamTaxRules } from "@/server/tax-rule";
import { OrderForm } from "./order-form";
import { ProductSelectionProvider } from "./selection-content";

export const metadata = {
  title: "New Order",
};
export const dynamic = "force-dynamic";

const NewOrderPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const { data } = await getTeamTaxRules();

  return (
    <ProductSelectionProvider>
      <OrderForm taxRules={data ?? []} />
    </ProductSelectionProvider>
  );
};

export default NewOrderPage;
