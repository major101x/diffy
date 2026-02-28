import { PullRequest } from "../types";

export function PRDetails({ pullRequest }: { pullRequest: PullRequest }) {
  return (
    <div>
      <h1>{pullRequest.title}</h1>
      <p>{pullRequest.body}</p>
      <p>{pullRequest.user.login}</p>
      <p>{pullRequest.head.repo.full_name}</p>
      <p>{pullRequest.created_at.toString()}</p>
      <p>{pullRequest.updated_at.toString()}</p>
      <p>{pullRequest.additions}</p>
      <p>{pullRequest.deletions}</p>
      <p>{pullRequest.changed_files}</p>
      <p>{pullRequest.commits}</p>
    </div>
  );
}
