import {
  type LinksFunction,
  type MetaFunction,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./tailwind.css";
import "./styles/syntax.css";

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { title: "Remix CMS" },
  { viewport: "width=device-width,initial-scale=1" },
];

export default function App() {
  return (
    <html lang="en" className="h-full bg-gray-100 dark:bg-black">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="dark:text-gray-100 h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
