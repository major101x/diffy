import { PullRequest } from "../types";

export function PRDetails({ pullRequest }: { pullRequest: PullRequest }) {
  return (
    <div className="mb-6 border-b border-gray-200 pb-6 p-2 sticky top-0 z-50 bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-100 mb-2">
        {pullRequest.title}
      </h1>
      <div className="flex flex-row items-center gap-4 text-sm text-gray-300 mb-4">
        <span className="font-medium text-gray-300">
          {pullRequest.user.login}
        </span>
        <span>wants to merge into {pullRequest.head.repo.full_name}</span>

        <span className="text-gray-300">•</span>

        <span className="text-gray-300">{pullRequest.commits} commits</span>
        <span className="text-green-600">+{pullRequest.additions}</span>
        <span className="text-red-600">-{pullRequest.deletions}</span>
        <span className="text-blue-600">
          {pullRequest.changed_files} files changed
        </span>
      </div>
      <div className="text-gray-800 text-base mt-4">{pullRequest.body}</div>
    </div>
  );
}
