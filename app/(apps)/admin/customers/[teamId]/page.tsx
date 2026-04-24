import React from "react";

const CustomerDetailsPage = async ({
  params,
}: {
  params: { teamId: string };
}) => {
  const { teamId } = await params;
  return <div>CustomerDetailsPage {teamId}</div>;
};

export default CustomerDetailsPage;
