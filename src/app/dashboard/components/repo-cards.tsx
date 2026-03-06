import { RepoCard } from "@/app/types";
import Link from "next/link";

export function RepoCards({
  repos,
  page,
  perPage,
}: {
  repos: { data: RepoCard[]; totalCount: number };
  page: number;
  perPage: number;
}) {
  const isNextDisabled = page * perPage >= repos.totalCount;
  const isPrevDisabled = page <= 1;

  return (
    <div>
      <h1>Repo Cards</h1>
      {repos.data.map((repo) => (
        <Link
          key={repo.id}
          href={`/dashboard?owner=${repo.owner}&repo=${repo.name}`}
        >
          <h2>{repo.name}</h2>
          <p>{repo.owner}</p>
          <p>{repo.link}</p>
        </Link>
      ))}
      {!isPrevDisabled ? (
        <Link href={`/dashboard?page=${page - 1}&perPage=${perPage}`}>
          Previous
        </Link>
      ) : (
        <button disabled>Previous</button>
      )}

      {!isNextDisabled ? (
        <Link href={`/dashboard?page=${page + 1}&perPage=${perPage}`}>
          Next
        </Link>
      ) : (
        <button disabled>Next</button>
      )}
    </div>
  );
}
