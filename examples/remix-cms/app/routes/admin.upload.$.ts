import { parseMultipartFormData, storage } from "superflare";

import type { Route } from "./+types/admin.upload.$";

export async function action({ request }: Route.ActionArgs) {
  const formData = await parseMultipartFormData(
    request,
    async ({ stream, filename }) => {
      const object = await storage().putRandom(stream, {
        extension: filename?.split(".").pop(),
      });

      return object.key;
    }
  );

  return { url: storage().url(formData.get("file") as string) };
}
