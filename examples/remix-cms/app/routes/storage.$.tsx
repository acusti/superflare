import { type LoaderFunctionArgs } from "react-router";
import { servePublicPathFromStorage } from "superflare";

export async function loader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url);
  return servePublicPathFromStorage(pathname);
}
