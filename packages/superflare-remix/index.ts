import { type AppLoadContext } from "react-router";
import {
  type DefineConfigReturn,
  handleFetch as superflareHandleFetch,
  SuperflareAuth,
  SuperflareSession,
} from "superflare";

import { type Cloudflare, getLoadContext } from "./load-context";

export { type Cloudflare, getLoadContext } from "./load-context";

declare module "react-router" {
  interface AppLoadContext {
    auth: InstanceType<typeof SuperflareAuth>;
    session: InstanceType<typeof SuperflareSession>;
    getSessionCookie: () => Promise<string>;
  }
}

/**
 * `handleFetch` is a Remix-specific wrapper around Superflare's function of the same name.
 * It calls getLoadContext to inject `auth` and `session` into the Remix load context.
 */
export async function handleFetch<Env extends { APP_KEY: string }>(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  config: DefineConfigReturn<any>,
  remixHandler: (
    request: Request,
    loadContext: AppLoadContext
  ) => Promise<Response>
) {
  const loadContext = await getLoadContext<Env>({
    request,
    context: {
      // This object matches the return value from Wrangler's
      // `getPlatformProxy` used during development via Remix's
      // `cloudflareDevProxyVitePlugin`:
      // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
      cloudflare: { caches, ctx, env, cf: request.cf as Cloudflare<Env>["cf"] },
    },
    SuperflareAuth,
    SuperflareSession,
  });

  return await superflareHandleFetch<Env>(
    {
      request,
      env,
      ctx,
      config,
      session: loadContext.session,
      getSessionCookie: loadContext.getSessionCookie,
    },
    () => {
      return remixHandler(
        request as any as Request,
        loadContext as any as AppLoadContext
      );
    }
  );
}
