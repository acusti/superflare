import { servePublicPathFromStorage } from "superflare";

import type { Route } from "./+types/storage.$";

export async function loader({ request }: Route.LoaderArgs) {
  const { pathname } = new URL(request.url);
  return servePublicPathFromStorage(pathname);
}
