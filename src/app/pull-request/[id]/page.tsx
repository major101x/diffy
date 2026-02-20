import { PRRoom } from "@/app/components/pr-room";

export default async function PullRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PRRoom prId={id} />;
}
