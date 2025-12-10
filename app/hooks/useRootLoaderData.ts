import { useRouteLoaderData } from "react-router";
import type { Route as RootRoute } from "../+types/root";

export const useRootLoaderData = () => {
  return useRouteLoaderData("root") as RootRoute.ComponentProps["loaderData"];
};
