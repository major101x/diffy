import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cookieStore = await cookies();
  const token = searchParams.get("token");

  if (!token) {
    return new Response("No token found", { status: 400 });
  }

  const fetchResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const user = await fetchResponse.json();

  if (user) {
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60,
    });

    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
