"use server";

import { cookies } from "next/headers";

export async function setMockAdminCookie() {
  cookies().set("mock_admin_token", "superadmin", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}
