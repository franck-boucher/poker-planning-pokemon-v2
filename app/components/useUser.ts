import { useRouteLoaderData } from "react-router";
import type { Route as RootRoute } from "../+types/root";

export const useUser = () => {
  const { user } = useRouteLoaderData(
    "root",
  ) as RootRoute.ComponentProps["loaderData"];
  return user;
};
