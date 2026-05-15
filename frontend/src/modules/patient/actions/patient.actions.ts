"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createApiClient } from "@/shared/api/client";
import { getAuthToken } from "@/shared/lib/session";

export type PatientFormState = {
  errors?: Record<string, string[]>;
  message?: string;
} | null;

const CreatePatientSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
});

async function api() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  return createApiClient(token);
}

export async function createPatientAction(
  _prev: PatientFormState,
  formData: FormData
): Promise<PatientFormState> {
  const parsed = CreatePatientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const body = {
    fullName: parsed.data.fullName,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    gender: parsed.data.gender || null,
    dateOfBirth: parsed.data.dateOfBirth || null,
    isWalkin: false,
  };

  try {
    await (await api()).post("/patients", body);
    revalidatePath("/patients");
    redirect("/patients");
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : "Failed to register patient" };
  }
}
