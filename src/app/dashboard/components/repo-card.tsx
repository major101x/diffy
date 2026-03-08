"use client";
import { RepoCard as RepoCardType } from "@/app/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function RepoCard({ repo }: { repo: RepoCardType }) {
  const router = useRouter();
  return (
    <button
      key={repo.id}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/dashboard?owner=${repo.owner}&repo=${repo.name}`);
      }}
      className="bg-white/5 flex flex-col gap-2 p-4 w-100 rounded-lg border border-white/10 hover:border-blue-300 hover:scale-105 transition-all duration-200 cursor-pointer"
    >
      <div className="flex flex-row gap-1 items-center">
        <span className="text-lg font-semibold">{repo.name}</span>/{" "}
        <span className="text-sm text-gray-400">{repo.owner}</span>
      </div>
      <Link
        href={repo.link}
        target="_blank"
        className="self-end max-w-fit bg-white/80 hover:bg-white transition-all duration-200 text-black rounded-lg cursor-pointer px-4 py-2 font-medium"
      >
        View on GitHub
      </Link>
    </button>
  );
}
