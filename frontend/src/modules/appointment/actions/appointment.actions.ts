"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createApiClient } from "@/shared/api/client";
import { getAuthToken } from "@/shared/lib/session";
import { AppointmentDto } from "../types";

export type FormState = { errors?: Record<string, string[]>; message?: string } | undefined;

const CreateSchema = z.object({
  patientId: z.string().uuid("Select a patient"),
  doctorId: z.string().uuid().optional().or(z.literal("")),
  appointmentTime: z.string().optional().or(z.literal("")),
  isWalkin: z.coerce.boolean().default(false),
  notes: z.string().optional(),
});

async function api() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  return createApiClient(token);
}

export async function createAppointmentAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  const parsed = CreateSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const body = {
    patientId: parsed.data.patientId,
    doctorId: parsed.data.doctorId || null,
    appointmentTime: parsed.data.appointmentTime ? new Date(parsed.data.appointmentTime).toISOString() : null,
    isWalkin: parsed.data.isWalkin,
    notes: parsed.data.notes || null,
  };

  try {
    await (await api()).post<AppointmentDto>("/appointments", body);
    revalidatePath("/appointments");
    redirect("/appointments");
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : "Failed to create appointment" };
  }
}

export async function cancelAppointmentAction(id: string, reason?: string): Promise<void> {
  await (await api()).patch(`/appointments/${id}/cancel`, { reason });
  revalidatePath("/appointments");
  revalidatePath("/doctor/appointments");
  revalidatePath("/walk-in-queue");
}

export async function startAppointmentAction(id: string): Promise<void> {
  await (await api()).patch(`/appointments/${id}/start`);
  revalidatePath("/appointments");
  revalidatePath("/doctor/appointments");
  revalidatePath("/walk-in-queue");
}

export async function completeAppointmentAction(id: string): Promise<void> {
  await (await api()).patch(`/appointments/${id}/complete`);
  revalidatePath("/doctor/appointments");
  revalidatePath("/walk-in-queue");
}
