"use server";

import { cookies } from "next/headers";

export type AdminRole = "superadmin" | "admin" | "manager" | "user";

/**
 * Sets the mock_admin_token cookie to the supplied role value.
 * The middleware reads this cookie to allow access to /admin/* routes.
 * The value is the role string itself so page-level RBAC guards can read it directly.
 *
 * TODO: Replace with AWS Cognito JWT token when Cognito is provisioned.
 * The role should then come from a Cognito User Pool custom attribute (custom:role)
 * decoded from the verified ID token, not hardcoded here.
 */
export async function setMockAdminCookie(role: AdminRole) {
  cookies().set("mock_admin_token", role, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}
