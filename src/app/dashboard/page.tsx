import Link from "next/link";
import { getUser } from "../lib/actions";
import { PRCards } from "./components/pr-cards";
import { RepoCards } from "./components/repo-cards";
import { Suspense } from "react";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const owner = (await searchParams).owner?.toString();
  const repo = (await searchParams).repo?.toString();
  const page = Number((await searchParams).page) || 1;
  const perPage = Number((await searchParams).perPage) || 10;
  const prPage = Number((await searchParams).prPage) || 1;

  const user = await getUser();

  return (
    <div className="h-screen w-full px-4 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Diffy!</h1>
      {!user.installationId && (
        <>
          <p>Please install the app to get started.</p>
          <Link
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/install`}
            className="py-2 px-4 bg-white text-gray-800 rounded-lg mt-2"
          >
            Install Diffy
          </Link>
        </>
      )}
      {user.installationId ? (
        <Suspense
          key={`repos-${page}-${prPage}`}
          fallback={
            <div className="w-full px-4 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mb-2"></div>
              <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            </div>
          }
        >
          <>
            {owner && repo ? (
              <PRCards
                prPage={prPage}
                perPage={perPage}
                owner={owner}
                repo={repo}
              />
            ) : (
              <RepoCards page={page} perPage={perPage} />
            )}
          </>
        </Suspense>
      ) : (
        <p>
          Please install diffy to see your repositories{" "}
          <Link href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/install`}>
            here
          </Link>
        </p>
      )}
    </div>
  );
}
