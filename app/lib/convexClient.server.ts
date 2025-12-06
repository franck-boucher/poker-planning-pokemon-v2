import { ConvexHttpClient } from "convex/browser";

export const convexClient = new ConvexHttpClient(
  import.meta.env.VITE_CONVEX_URL as string,
);
