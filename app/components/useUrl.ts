import { useRouteLoaderData } from "react-router";
import type { Route as RootRoute } from "../+types/root";

export const useUrl = () => {
  const { url } = useRouteLoaderData(
    "root",
  ) as RootRoute.ComponentProps["loaderData"];
  return url;
};
