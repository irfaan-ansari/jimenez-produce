import { PageClient } from "./page-client";
const CustomerDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return <PageClient params={params} />;
};

export default CustomerDetailsPage;
