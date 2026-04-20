import { getSession } from "@/server/auth";
import { OrderForm } from "./order-form";

export const metadata = {
  title: "New Order",
};
export const dynamic = "force-dynamic";

const NewOrderPage = async () => {
  const session = await getSession();

  return <OrderForm session={session!} />;
};

export default NewOrderPage;
