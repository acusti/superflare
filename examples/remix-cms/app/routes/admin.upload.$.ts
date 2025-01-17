import { type ActionFunctionArgs } from "react-router";
import { parseMultipartFormData, storage } from "superflare";

export async function action({ request }: ActionFunctionArgs) {
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
