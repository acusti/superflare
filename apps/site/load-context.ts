import { type PlatformProxy } from "wrangler";

// NOTE: PlatformProxy’s caches property is incompatible with the caches global
// https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/api/integrations/platform/caches.ts
// TS error: Property 'default' is missing in type 'CacheStorage' but required in type 'CacheStorage_2'.
type Cloudflare = Omit<PlatformProxy<Env>, "dispose" | "caches"> & {
  caches: CacheStorage;
};

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}

export {}; // necessary for TS to treat this as a module
