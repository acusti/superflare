import { createRequestHandler, createCookieSessionStorage } from "react-router";
import { handleFetch, SuperflareAuth } from "superflare";
import getConfig from "../superflare.config";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore This file won’t exist if it hasn’t yet been built
import * as build from "../build/server"; // eslint-disable-line import/no-unresolved

let handleRequest: ReturnType<typeof createRequestHandler>;

export const onRequest: PagesFunction<Env> = async (ctx) => {
  if (!handleRequest) {
    handleRequest = createRequestHandler(
      build as any,
      ctx.env.CF_PAGES ? "production" : "development"
    );
  }

  const sessionStorage = createCookieSessionStorage({
    cookie: {
      httpOnly: true,
      path: "/",
      secure: /^(http|ws)s:\/\//.test(ctx.request.url),
      secrets: [ctx.env.APP_KEY],
    },
  });

  const session = await sessionStorage.getSession(
    ctx.request.headers.get("Cookie")
  );

  return handleFetch(
    {
      config: getConfig({
        request: ctx.request,
        env: ctx.env,
        ctx,
      }),
      getSessionCookie: () => sessionStorage.commitSession(session),
    },
    () =>
      handleRequest(ctx.request, {
        auth: new SuperflareAuth(session),
        session,
        env: ctx.env,
      })
  );
};
