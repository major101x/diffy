"use client";

import { redirectToPR } from "@/app/lib/actions";
import Link from "next/link";

export function Menu({
  handleInstallClick,
}: {
  handleInstallClick: () => void;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Welcome to Diffy!</h1>
        <p>Please install the app to get started.</p>
        <Link
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/install`}
          className="py-2 px-4 bg-white text-gray-800 rounded-lg mt-2"
        >
          Install Diffy
        </Link>

        <form action={redirectToPR} className="py-4">
          <input
            type="text"
            name="prUrl"
            placeholder="Type the pull request url here"
            className="w-80 bg-white mr-2 px-2 py-2 rounded-lg placeholder:text-gray-500"
          />
          <button className="py-2 px-4 bg-white text-gray-800 rounded-lg">
            Analyze PR
          </button>
        </form>
      </div>
    </>
  );
}
