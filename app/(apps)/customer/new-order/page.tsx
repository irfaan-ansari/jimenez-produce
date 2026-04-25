import { OrderForm } from "./order-form";

export const metadata = {
  title: "New Order",
};
export const dynamic = "force-dynamic";

const NewOrderPage = async () => {
  return <OrderForm />;
};

export default NewOrderPage;
