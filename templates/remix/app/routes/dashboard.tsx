import { redirect, useLoaderData } from "react-router";
import { User } from "~/models/User";

import type { Route } from "./+types/dashboard";

export async function loader({ context: { auth } }: Route.LoaderArgs) {
  if (!(await auth.check(User))) {
    return redirect("/login");
  }

  return {
    user: (await auth.user(User)) as User,
  };
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Dashboard</h1>
      <p>You're logged in as {user.email}</p>

      <form method="post" action="/logout">
        <button type="submit">Log out</button>
      </form>
    </>
  );
}
