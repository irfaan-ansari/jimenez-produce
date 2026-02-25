import { PageClient } from "./page-client";

const CustomerPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return <PageClient params={params} />;
};

export default CustomerPage;
