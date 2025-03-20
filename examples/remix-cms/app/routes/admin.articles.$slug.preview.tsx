import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useLoaderData } from "react-router";
import invariant from "tiny-invariant";

import { SecondaryButton } from "~/components/admin/Button";
import { Page } from "~/components/admin/Page";
import { Article } from "~/models/Article";
import { convertToHtml } from "~/utils/markdown.server";

import type { Route } from "./+types/admin.articles.$slug.preview";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  invariant(typeof slug === "string", "Missing slug");

  const article = await Article.where("slug", slug).first();

  if (!article) {
    throw new Response("Not found", { status: 404 });
  }

  return {
    article,
    html: await convertToHtml(article.content ?? ""),
  };
}

export default function NewArticle() {
  const { html, article } = useLoaderData<typeof loader>();

  return (
    <Page
      title={"Preview: " + article.title}
      action={
        <SecondaryButton to="../" relative="path">
          <PencilSquareIcon className="w-4 h-4" />
          <span>Edit</span>
        </SecondaryButton>
      }
    >
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </Page>
  );
}
