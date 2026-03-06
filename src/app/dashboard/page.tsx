import { fetchData } from "../lib/actions";
import { Menu } from "./components/menu";
import { PRCards } from "./components/pr-cards";
import { RepoCards } from "./components/repo-cards";

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

  async function handleInstallClick() {
    "use server";
    fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/install`);
  }

  const repos = await fetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/repos?page=${page}&per_page=${perPage}`,
  );
  console.log(repos);

  let prs = null;
  if (owner && repo) {
    prs = await fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/pull-requests/${owner}/${repo}?page=${prPage}&per_page=${perPage}`,
    );
    console.log(prs);
  }

  return (
    <div className="px-3">
      {/* <Menu handleInstallClick={handleInstallClick} /> */}
      {owner && repo ? (
        <PRCards
          prs={prs}
          prPage={prPage}
          perPage={perPage}
          owner={owner}
          repo={repo}
        />
      ) : (
        <RepoCards repos={repos} page={page} perPage={perPage} />
      )}
    </div>
  );
}
