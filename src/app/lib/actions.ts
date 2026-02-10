import { cookies } from "next/headers";

export async function fetchData(url: string) {
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

  if (!response.ok) {
    throw new Error("Failed to fetch data on the server");
  }

  const data = await response.json();
  return data;
}
