"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createApiClient } from "@/shared/api/client";
import { getAuthToken } from "@/shared/lib/session";
import { TenantOnboardingResponse, SubscriptionPlanDto } from "../types";

export type FormState = { errors?: Record<string, string[]>; message?: string } | undefined;
export type TenantFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  result?: TenantOnboardingResponse;
} | null;

const OnboardSchema = z.object({
  tenantName: z.string().min(2, "Tenant name required"),
  adminEmail: z.string().email("Valid email required"),
  adminFullName: z.string().min(2, "Admin name required"),
  subscriptionPlanId: z.string().uuid("Select a plan"),
});

const PlanSchema = z.object({
  name: z.string().min(2, "Name required"),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  price: z.coerce.number().min(0),
  maxDoctors: z.coerce.number().int().min(1),
});

async function api() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  return createApiClient(token);
}

export async function onboardTenantAction(
  _prev: TenantFormState,
  formData: FormData
): Promise<TenantFormState> {
  const parsed = OnboardSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  try {
    const result = await (await api()).post<TenantOnboardingResponse>("/super-admin/tenants", parsed.data);
    revalidatePath("/super-admin/tenants");
    return { result };
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : "Failed to onboard tenant" };
  }
}

export async function toggleTenantStatusAction(id: string, activate: boolean): Promise<void> {
  const action = activate ? "activate" : "deactivate";
  await (await api()).patch(`/super-admin/tenants/${id}/${action}`);
  revalidatePath("/super-admin/tenants");
}

export async function createPlanAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = PlanSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  try {
    await (await api()).post<SubscriptionPlanDto>("/super-admin/subscription-plans", parsed.data);
    revalidatePath("/super-admin/subscription-plans");
    return undefined;
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : "Failed to create plan" };
  }
}

export async function togglePlanAction(id: string): Promise<void> {
  await (await api()).patch(`/super-admin/subscription-plans/${id}/toggle`);
  revalidatePath("/super-admin/subscription-plans");
}
