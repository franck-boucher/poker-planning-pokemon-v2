import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sizings/:sizingId", "routes/sizings/sizing.tsx"),
] satisfies RouteConfig;
