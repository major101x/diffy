import { fetchData, getUser } from "@/app/lib/actions";
import { PullRequestWrapper } from "@/app/components/pull-request-wrapper";

export default async function PullRequestPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string; pull_number: string }>;
}) {
  const { owner, repo, pull_number } = await params;

  const prAndDiff = Promise.all([
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/pull-request/${owner}/${repo}/${pull_number}`,
    ),
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/diff/${owner}/${repo}/${pull_number}`,
      "text",
    ),
  ]);
  const [pullRequest, diff] = await prAndDiff;

  const prId = pullRequest.id.toString();

  const prComments = await fetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/pr/${prId}`,
    "json",
  );

  const user = await getUser();

  return (
    <PullRequestWrapper
      pullRequest={pullRequest}
      diff={diff}
      prId={prId}
      prComments={prComments}
      user={user}
    />
  );
}
