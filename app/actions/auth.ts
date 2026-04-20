"use server";

import { cookies } from "next/headers";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is not configured in the environment.");
  }

  if (password === adminPassword) {
    cookies().set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "strict",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid credentials" };
}

export async function logoutAdmin() {
  cookies().delete("admin_token");
}
