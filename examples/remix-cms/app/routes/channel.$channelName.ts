import { handleWebSockets } from "superflare";
import { User } from "~/models/User";

import type { Route } from "./+types/channel.$channelName";

export async function loader({
  request,
  context: { auth, session },
}: Route.LoaderArgs) {
  return handleWebSockets(request, { auth, session, userModel: User });
}
