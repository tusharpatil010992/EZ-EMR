"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createApiClient } from "@/shared/api/client";
import { getAuthToken } from "@/shared/lib/session";
import { CreateUserResponse } from "../types";

export type FormState = { errors?: Record<string, string[]>; message?: string } | undefined;
export type CreateUserFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  result?: CreateUserResponse;
} | null;

const CreateUserSchema = z.object({
  email: z.string().email("Valid email required"),
  fullName: z.string().min(2, "Full name required"),
  role: z.enum(["DOCTOR", "STAFF"], { message: "Select a role" }),
});

async function api() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  return createApiClient(token);
}

export async function createUserAction(
  _prev: CreateUserFormState,
  formData: FormData
): Promise<CreateUserFormState> {
  const parsed = CreateUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  try {
    const result = await (await api()).post<CreateUserResponse>("/users", parsed.data);
    revalidatePath("/admin/users");
    return { result };
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : "Failed to create user" };
  }
}

export async function deactivateUserAction(id: string): Promise<void> {
  await (await api()).del(`/users/${id}`);
  revalidatePath("/admin/users");
}
