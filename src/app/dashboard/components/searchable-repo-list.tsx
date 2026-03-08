"use client";

import { useState } from "react";
import { RepoCard as RepoCardType } from "@/app/types";
import { RepoCard } from "./repo-card";

export function SearchableRepoList({ repos }: { repos: RepoCardType[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Search repos..."
        className="mx-auto bg-white/5 border border-white/10 rounded-lg text-white w-full max-w-100 px-4 py-2 placeholder-gray-400 focus:outline-none focus:border-blue-300"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="flex flex-row gap-4 flex-wrap w-full justify-center items-center">
        {filteredRepos.length === 0 ? (
          <p>No repos found</p>
        ) : (
          filteredRepos.map((repo: RepoCardType) => (
            <RepoCard key={repo.id} repo={repo} />
          ))
        )}
      </div>
    </div>
  );
}
