import { type ActionFunctionArgs, redirect } from "react-router";

export async function action({ context: { auth } }: ActionFunctionArgs) {
  auth.logout();

  return redirect("/");
}
