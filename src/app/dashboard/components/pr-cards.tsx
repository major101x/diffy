import { PRCard } from "@/app/types";
import Link from "next/link";

export function PRCards({
  prs,
  prPage,
  perPage,
  owner,
  repo,
}: {
  prs: { data: PRCard[]; totalCount: number };
  prPage: number;
  perPage: number;
  owner: string;
  repo: string;
}) {
  const isNextDisabled = prs.data.length < perPage;
  const isPrevDisabled = prPage <= 1;

  return (
    <div>
      <Link href={`/dashboard`}>Back</Link>
      <h1>PR Cards</h1>
      {prs.data.length > 0 ? (
        prs.data.map((pr) => (
          <div key={pr.id}>
            <h2>{pr.title}</h2>
            <p>{pr.number}</p>
            <p>{pr.authorName}</p>
            <p>{pr.repo}</p>
            <p>{pr.owner}</p>
            <p>{pr.id}</p>
            <p>{pr.state}</p>
            <p>{pr.htmlUrl}</p>
            <p>{pr.base}</p>
            <p>{pr.head}</p>
            <p>{pr.createdAt}</p>
            <p>{pr.updatedAt}</p>
          </div>
        ))
      ) : (
        <p>No PRs found</p>
      )}
      {!isPrevDisabled ? (
        <Link
          href={`/dashboard?owner=${owner}&repo=${repo}&prPage=${prPage - 1}&perPage=${perPage}`}
        >
          Previous
        </Link>
      ) : (
        <button disabled>Previous</button>
      )}
      {!isNextDisabled ? (
        <Link
          href={`/dashboard?owner=${owner}&repo=${repo}&prPage=${prPage + 1}&perPage=${perPage}`}
        >
          Next
        </Link>
      ) : (
        <button disabled>Next</button>
      )}
    </div>
  );
}
