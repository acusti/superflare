import { useRouteLoaderData } from "react-router";

import { loader as adminLoader } from "../admin";

export function useAdmin() {
  return useRouteLoaderData<typeof adminLoader>("routes/admin");
}
