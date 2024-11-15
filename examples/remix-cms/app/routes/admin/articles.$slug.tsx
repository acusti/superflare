import { EyeIcon } from "@heroicons/react/24/outline";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button, SecondaryButton } from "~/components/admin/Button";
import { Page } from "~/components/admin/Page";
import { SayHelloJob } from "~/jobs/SayHelloJob";
import { Article } from "~/models/Article";
import { useChannel } from "~/utils/use-channel";
import { ArticleForm } from "./components/article-form";

export { action } from "./components/article-form";

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  invariant(typeof slug === "string", "Missing slug");

  const article = await Article.where("slug", slug).first();

  if (!article) {
    throw new Response("Not found", { status: 404 });
  }

  SayHelloJob.dispatch(article);

  return json({ article });
}

export default function NewArticle() {
  const { article } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();
  useChannel(`article.${article.slug}`, (message) => {
    console.log(message);
    revalidate();
  });

  return (
    <Page
      title="Edit Article"
      action={
        <div className="flex justify-end space-x-2">
          <SecondaryButton to="./preview">
            <EyeIcon className="w-4 h-4" />
            <span>Preview</span>
          </SecondaryButton>
          <Button type="submit" form="article-form">
            Save
          </Button>
        </div>
      }
    >
      <ArticleForm article={article} id="article-form" />
    </Page>
  );
}
