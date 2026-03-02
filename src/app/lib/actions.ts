"use server";
import { cookies } from "next/headers";

export async function fetchData(
  url: string,
  type: "json" | "text" = "json",
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
  },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    ...options,
  });

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

export async function getUser() {
  const user = await fetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
  );
  return user;
}

import { redirect } from "next/navigation";

export async function redirectToPR(formData: FormData) {
  const prUrl = formData.get("prUrl")?.toString();
  const regex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/([\d]+)/;
  // Fallback to match www just in case
  const regexWww =
    /https:\/\/www\.github\.com\/([^/]+)\/([^/]+)\/pull\/([\d]+)/;

  const match = prUrl?.match(regex) || prUrl?.match(regexWww);

  if (!match) {
    throw new Error(
      "Invalid pull request URL. Please use standard GitHub PR URL format.",
    );
  }

  const owner = match[1];
  const repo = match[2];
  const pull_number = Number(match[3]);

  redirect(`/pull-request/${owner}/${repo}/${pull_number}`);
}

export async function createComment(
  prId: string,
  parentCommentId: number | null,
  formData: FormData,
) {
  const comment = formData.get("comment")?.toString();
  const filePath = formData.get("filePath")?.toString();
  const lineNumber = Number(formData.get("lineNumber"));
  console.log("PAYLOAD:", {
    body: comment,
    pullRequestId: Number(prId),
    filePath,
    lineNumber,
    parentCommentId,
  });
  const response = await fetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments`,
    "json",
    {
      method: "POST",
      body: JSON.stringify({
        body: comment,
        pullRequestId: prId,
        filePath,
        lineNumber,
        parentCommentId,
      }),
    },
  );
  return response;
}

export async function resolveComment(commentId: number) {
  const response = await fetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${commentId}/resolve`,
    "json",
    {
      method: "PATCH",
    },
  );
  return response;
}

export async function unresolveComment(commentId: number) {
  const response = await fetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${commentId}/unresolve`,
    "json",
    {
      method: "PATCH",
    },
  );
  return response;
}
