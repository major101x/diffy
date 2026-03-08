"use client";
import { PRCard as PRCardType } from "@/app/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function PRCard({ pr }: { pr: PRCardType }) {
  const router = useRouter();
  return (
    <button
      className="bg-white/5 flex flex-col justify-between p-4 w-100 rounded-lg border border-white/10 hover:border-blue-300 hover:scale-105 transition-all duration-200 cursor-pointer h-56"
      key={pr.id}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/pull-request/${pr.owner}/${pr.repo}/${pr.number}`);
      }}
    >
      <div className="flex flex-col gap-2 items-start">
        <p className="text-lg font-medium border-b-2 border-white/10 w-full text-left">
          {pr.title}
        </p>
        <div className="flex flex-row justify-between w-full gap-1 items-center">
          <p>Author: {pr.authorName}</p>
          <p className="rounded-lg px-2 py-1 bg-white/10">
            <span className="flex items-center gap-2 capitalize font-mono text-sm">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    pr.state === "open" ? "bg-green-400" : "bg-red-400"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    pr.state === "open" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              </span>
              {pr.state}
            </span>
          </p>
        </div>
        <div className="flex flex-row gap-2 items-center text-sm">
          <p>Created {formatDistanceToNow(new Date(pr.createdAt))} ago</p>
          <span className="text-white/20"> | </span>
          <p>Updated {formatDistanceToNow(new Date(pr.updatedAt))} ago</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-left">
        <div className="flex flex-row gap-2 items-center">
          <p>{pr.head}</p>
          <span className="text-white/50"> &rarr; </span>
          <p>{pr.base}</p>
        </div>
        <Link
          href={pr.htmlUrl}
          target="_blank"
          className="self-end max-w-fit bg-white/80 hover:bg-white transition-all duration-200 text-black rounded-lg cursor-pointer px-4 py-2 font-medium"
        >
          View on GitHub
        </Link>
      </div>
    </button>
  );
}
