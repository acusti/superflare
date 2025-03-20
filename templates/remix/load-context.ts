import { type Cloudflare } from "@superflare/remix";

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: Cloudflare<Env>;
  }
}

export {}; // necessary for TS to treat this as a module
