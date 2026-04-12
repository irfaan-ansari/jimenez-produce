import { PageClient } from "./page-client";

const OrderDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return <PageClient params={params} />;
};

export default OrderDetailPage;
