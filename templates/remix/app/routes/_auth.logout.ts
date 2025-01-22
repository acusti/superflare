import { redirect } from "react-router";

import type { Route } from "./+types/_auth.logout";

export async function action({ context: { auth } }: Route.ActionArgs) {
  auth.logout();

  return redirect("/");
}
