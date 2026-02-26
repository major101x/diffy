import { fetchData } from "@/app/lib/actions";
import { PullRequestWrapper } from "@/app/components/pull-request-wrapper";

export default async function PullRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prComments = await fetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/pr/${id}`,
    "json",
  );
  return <PullRequestWrapper prId={id} prComments={prComments} />;
}
