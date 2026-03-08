import Link from "next/link";
import { RepoCard } from "./repo-card";
import { fetchData } from "@/app/lib/actions";
import { RepoCard as RepoCardType } from "@/app/types";
import { SearchableRepoList } from "./searchable-repo-list";

export async function RepoCards({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) {
  const repos = await fetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/repos?page=${page}&per_page=${perPage}`,
  );
  const isNextDisabled = page * perPage >= repos.totalCount;
  const isPrevDisabled = page <= 1;

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-gray-400 mb-6 text-lg">
        Select a repo to get started
      </h1>
      <SearchableRepoList repos={repos.data} />

      {/* <div className="flex flex-row gap-4 mt-4">
        {!isPrevDisabled ? (
          <Link
            href={`/dashboard?page=${page - 1}&perPage=${perPage}`}
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
            href={`/dashboard?page=${page + 1}&perPage=${perPage}`}
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
      </div> */}
    </div>
  );
}
