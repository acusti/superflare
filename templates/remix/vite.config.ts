import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { superflareDevProxyVitePlugin } from "@superflare/remix/dev";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    superflareDevProxyVitePlugin<Env>(),
    reactRouter(),
    tsconfigPaths(),
  ],
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
});
