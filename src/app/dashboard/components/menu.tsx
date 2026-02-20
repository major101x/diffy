"use client";

import { useActionState } from "react";
import { fetchPR } from "@/app/lib/actions";
import Link from "next/link";

export function Menu({
  handleInstallClick,
}: {
  handleInstallClick: () => void;
}) {
  const [prState, fetchPRAction] = useActionState(fetchPR, null);
  return (
    <>
      <h1>Welcome to Diffy!</h1>
      <p>Please install the app to get started.</p>
      <Link href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/install`}>
        Install Diffy
      </Link>

      <form action={fetchPRAction}>
        <input
          type="text"
          name="prUrl"
          placeholder="Type the pull request url here"
        />
        <button>Analyze PR</button>
      </form>
      {prState?.pr && (
        <Link href={`/pull-request/${prState?.pr?.id}`}>View PR</Link>
      )}
      {prState?.pr && <pre>{JSON.stringify(prState.pr, null, 2)}</pre>}
      {prState?.diff && <pre>{prState.diff}</pre>}
    </>
  );
}
