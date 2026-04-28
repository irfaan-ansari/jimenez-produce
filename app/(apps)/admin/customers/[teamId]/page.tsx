import { PageClient } from "./page-client";
const CustomerDetailsPage = async ({
  params,
}: {
  params: { teamId: string };
}) => {
  const { teamId } = await params;
  return <PageClient teamId={teamId} />;
};

export default CustomerDetailsPage;
