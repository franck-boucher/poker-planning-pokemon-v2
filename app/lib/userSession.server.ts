import type { Id } from "convex/_generated/dataModel";
import { createCookieSessionStorage, redirect } from "react-router";
import { convexClient } from "./convexClient.server";
import { api } from "convex/_generated/api";

type SessionData = {
  userId: Id<"users">;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__ppp_userSession",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 400, // 400 days
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: import.meta.env.DEV ? false : true,
    },
  });

export const getUserId = (request: Request) => {
  return getSession(request.headers.get("Cookie")).then((session) => {
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") return null;
    return userId;
  });
};

export const requireUserId = async (request: Request) => {
  const userId = await getUserId(request);
  if (!userId) throw redirect("/");
  return userId;
};

export const createUserSession = (request: Request, userId: Id<"users">) => {
  return getSession(request.headers.get("Cookie")).then((session) => {
    session.set("userId", userId);
    return commitSession(session);
  });
};

export const destroyUserSession = (request: Request) => {
  return getSession(request.headers.get("Cookie")).then((session) => {
    return destroySession(session);
  });
};

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  if (!userId) return null;
  return convexClient.query(api.users.getById, { id: userId });
};

export const getOrCreateUser = async (request: Request) => {
  let user = await getUser(request);
  if (user) return { user, cookie: null };

  const newUserId = await convexClient.mutation(api.users.create);
  const cookie = await createUserSession(request, newUserId);
  user = await convexClient.query(api.users.getById, { id: newUserId });
  if (!user) throw new Error("Failed to create user");

  return { user, cookie };
};
