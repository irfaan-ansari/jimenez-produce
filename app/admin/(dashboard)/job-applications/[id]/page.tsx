import { PageClient } from "./page-client";

export default function ApplicationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PageClient params={params} />;
}
