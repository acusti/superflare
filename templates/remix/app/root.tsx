import {
  type MetaFunction,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { title: "Superflare App" },
  { viewport: "width=device-width,initial-scale=1" },
];

export default function App() {
  return (
    <html lang="en" className="h-full bg-gray-100 dark:bg-black">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
