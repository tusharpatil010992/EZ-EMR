"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { publicApi, createApiClient } from "@/shared/api/client";
import { clearSession, getAuthToken, setSession } from "@/shared/lib/session";
import { AuthResponse } from "@/shared/types/api";

const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
} | undefined;

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  let data: AuthResponse;
  try {
    data = await publicApi.post<AuthResponse>("/auth/login", parsed.data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Login failed";
    return { message: msg };
  }

  await setSession(data.accessToken);

  if (data.firstLoginPasswordResetRequired) {
    redirect("/change-password");
  }

  const role = data.role;
  if (role === "SUPER_ADMIN") redirect("/super-admin/tenants");
  if (role === "ADMIN") redirect("/dashboard");
  if (role === "DOCTOR") redirect("/doctor/appointments");
  if (role === "STAFF") redirect("/appointments");
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}

export async function changePasswordAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = ChangePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const token = await getAuthToken();
  if (!token) redirect("/login");

  try {
    await createApiClient(token).post("/auth/change-password", parsed.data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to change password";
    return { message: msg };
  }

  redirect("/dashboard");
}
