"use server";
import { cookies } from "next/headers";

type FetchPRState = {
  pr: Record<string, unknown> | null;
  diff: string | null;
};

export async function fetchData(url: string, type: "json" | "text" = "json") {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });

  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to fetch data on the server");
  }

  if (type === "json") {
    const data = await response.json();
    return data;
  }
  const data = await response.text();

  return data;
}

export async function fetchPR(
  prevState: FetchPRState | null,
  formData: FormData,
): Promise<FetchPRState> {
  const prUrl = formData.get("prUrl")?.toString();
  const regex = /https:\/\/www\.github\.com\/([^/]+)\/([^/]+)\/pull\/([\d]+)/;
  const match = prUrl?.match(regex);
  if (!match) {
    throw new Error("Invalid pull request URL");
  }
  const owner = match[1];
  const repo = match[2];
  const pull_number = Number(match[3]);
  const prAndDiff = Promise.all([
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/pull-request/${owner}/${repo}/${pull_number}`,
    ),
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/diff/${owner}/${repo}/${pull_number}`,
      "text",
    ),
  ]);
  const [pullRequest, diff] = await prAndDiff;
  console.log(pullRequest);
  console.log(diff);
  return { pr: pullRequest, diff };
}
