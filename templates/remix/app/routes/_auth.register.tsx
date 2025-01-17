import {
  type ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useActionData,
} from "react-router";
import { User } from "~/models/User";
import { hash } from "superflare";

export async function action({
  request,
  context: { auth },
}: ActionFunctionArgs) {
  if (await auth.check(User)) {
    return redirect("/dashboard");
  }

  const formData = new URLSearchParams(await request.text());
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (await User.where("email", email).count()) {
    return Response.json({ error: "Email already exists" }, { status: 400 });
  }

  const user = await User.create({
    email,
    password: await hash().make(password),
  });

  auth.login(user);

  return redirect("/dashboard");
}

export default function Register() {
  const actionData = useActionData<{ error: string }>();

  return (
    <Form method="post">
      <h1>Register</h1>

      <div>
        <label htmlFor="email">Email</label>
        <input name="email" type="email" required />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input name="password" type="password" required />
      </div>

      {actionData?.error && (
        <div style={{ color: "red" }}>{actionData.error}</div>
      )}

      <button type="submit">Register</button>

      <Link to="/login">Log in</Link>
    </Form>
  );
}
