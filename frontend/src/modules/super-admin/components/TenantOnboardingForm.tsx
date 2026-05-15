"use client";

import { useActionState, useState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Select } from "@/shared/components/Select";
import { Modal } from "@/shared/components/Modal";
import { onboardTenantAction, TenantFormState } from "../actions/superAdmin.actions";
import { SubscriptionPlanDto, TenantOnboardingResponse } from "../types";

interface TenantOnboardingFormProps {
  open: boolean;
  onClose: () => void;
  plans: SubscriptionPlanDto[];
}

export function TenantOnboardingForm({ open, onClose, plans }: TenantOnboardingFormProps) {
  const [credentials, setCredentials] = useState<TenantOnboardingResponse | null>(null);
  const [state, action, isPending] = useActionState<TenantFormState, FormData>(
    async (prev, fd) => {
      const result = await onboardTenantAction(prev, fd);
      if (result?.result) setCredentials(result.result);
      return result;
    },
    null
  );

  if (credentials) {
    return (
      <Modal open={open} onClose={() => { setCredentials(null); onClose(); }} title="Tenant Onboarded">
        <div className="space-y-3 text-sm">
          <p className="text-gray-600">Save these credentials — the password is shown only once.</p>
          <div className="rounded-md bg-gray-50 border border-gray-200 p-4 space-y-2 font-mono text-xs">
            <div><span className="text-gray-500">Tenant:</span> {credentials.tenantName}</div>
            <div><span className="text-gray-500">Admin Email:</span> {credentials.adminEmail}</div>
            <div><span className="text-gray-500">Password:</span> <span className="font-bold text-blue-700">{credentials.generatedPassword}</span></div>
          </div>
          <Button className="w-full" onClick={() => { setCredentials(null); onClose(); }}>Done</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Onboard New Tenant">
      <form action={action} className="space-y-4">
        {state?.message && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {state.message}
          </div>
        )}
        <Input
          id="tenantName"
          name="tenantName"
          label="Clinic / Organization Name"
          placeholder="City Medical Center"
          required
          error={state?.errors?.tenantName?.[0]}
        />
        <Select
          id="subscriptionPlanId"
          name="subscriptionPlanId"
          label="Subscription Plan"
          placeholder="Select a plan"
          required
          error={state?.errors?.subscriptionPlanId?.[0]}
        >
          {plans.filter(p => p.active).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.billingCycle}) — ${p.price}
            </option>
          ))}
        </Select>
        <Input
          id="adminFullName"
          name="adminFullName"
          label="Admin Full Name"
          placeholder="Dr. Jane Smith"
          required
          error={state?.errors?.adminFullName?.[0]}
        />
        <Input
          id="adminEmail"
          name="adminEmail"
          label="Admin Email"
          type="email"
          placeholder="admin@clinic.com"
          required
          error={state?.errors?.adminEmail?.[0]}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" loading={isPending}>Onboard Tenant</Button>
        </div>
      </form>
    </Modal>
  );
}
