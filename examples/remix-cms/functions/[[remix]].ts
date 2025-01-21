import { createRequestHandler, createCookieSessionStorage } from "react-router";
import { handleFetch } from "@superflare/remix";
import config from "../superflare.config";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore This file won’t exist if it hasn’t yet been built
import * as build from "../build/server"; // eslint-disable-line import/no-unresolved

let handleRequest: ReturnType<typeof createRequestHandler>;

export const onRequest: PagesFunction<Env & { CF_PAGES?: string }> = async (
  context
) => {
  if (!handleRequest) {
    handleRequest = createRequestHandler(
      build as any,
      context.env.CF_PAGES ? "production" : "development"
    );
  }

  const ctx = {
    passThroughOnException: context.passThroughOnException.bind(context),
    props: {},
    waitUntil: context.waitUntil.bind(context),
  };

  return handleFetch<Env>(
    context.request,
    context.env,
    ctx,
    config,
    handleRequest
  );
};
