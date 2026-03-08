import { fetchData } from "@/app/lib/actions";
import { PRCard as PRCardType } from "@/app/types";
import Link from "next/link";
import { PRCard } from "./pr-card";

export async function PRCards({
  prPage,
  perPage,
  owner,
  repo,
}: {
  prPage: number;
  perPage: number;
  owner: string;
  repo: string;
}) {
  const prs = await fetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/pull-requests/${owner}/${repo}?page=${prPage}&per_page=${perPage}`,
  );
  console.log(prs);
  const isNextDisabled = prs.data.length < perPage;
  const isPrevDisabled = prPage <= 1;

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Link
        href={`/dashboard`}
        className="bg-white/80 hover:bg-white transition-all duration-200 text-black rounded-lg cursor-pointer px-4 py-2 font-medium mb-4"
      >
        &larr; Back
      </Link>
      <h1 className="text-gray-400 mb-6 text-lg">
        Select a PR in{" "}
        <span className="rounded-full px-2 bg-white/10 font-mono">
          {owner}/{repo}
        </span>{" "}
        to view its changes
      </h1>
      {prs.data.length > 0 ? (
        <div className="flex flex-row gap-4 flex-wrap w-full justify-center items-center">
          {prs.data.map((pr: PRCardType) => (
            <PRCard key={pr.id} pr={pr} />
          ))}
        </div>
      ) : (
        <p>No PRs found</p>
      )}
      <div className="flex flex-row gap-4 mt-4">
        {!isPrevDisabled ? (
          <Link
            href={`/dashboard?owner=${owner}&repo=${repo}&prPage=${prPage - 1}&perPage=${perPage}`}
            className="bg-white/80 hover:bg-white transition-all duration-200 text-black rounded-lg cursor-pointer px-4 py-2 font-medium"
          >
            Previous
          </Link>
        ) : (
          <button
            disabled
            className="bg-white/50 text-black rounded-lg px-4 py-2 font-medium"
          >
            Previous
          </button>
        )}
        {!isNextDisabled ? (
          <Link
            href={`/dashboard?owner=${owner}&repo=${repo}&prPage=${prPage + 1}&perPage=${perPage}`}
            className="bg-white/80 hover:bg-white transition-all duration-200 text-black rounded-lg cursor-pointer px-4 py-2 font-medium"
          >
            Next
          </Link>
        ) : (
          <button
            disabled
            className="bg-white/50 text-black rounded-lg px-4 py-2 font-medium"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
