"use client";

import { useActionState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Select } from "@/shared/components/Select";
import { Modal } from "@/shared/components/Modal";
import { createPlanAction, FormState } from "../actions/superAdmin.actions";

interface SubscriptionPlanFormProps {
  open: boolean;
  onClose: () => void;
}

export function SubscriptionPlanForm({ open, onClose }: SubscriptionPlanFormProps) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    async (prev, fd) => {
      const result = await createPlanAction(prev, fd);
      if (!result) onClose();
      return result;
    },
    undefined
  );

  return (
    <Modal open={open} onClose={onClose} title="Create Subscription Plan">
      <form action={action} className="space-y-4">
        {state?.message && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {state.message}
          </div>
        )}
        <Input
          id="name"
          name="name"
          label="Plan Name"
          placeholder="Starter"
          required
          error={state?.errors?.name?.[0]}
        />
        <Select
          id="billingCycle"
          name="billingCycle"
          label="Billing Cycle"
          required
          error={state?.errors?.billingCycle?.[0]}
        >
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </Select>
        <Input
          id="price"
          name="price"
          label="Price (USD)"
          type="number"
          min="0"
          step="0.01"
          placeholder="99.00"
          required
          error={state?.errors?.price?.[0]}
        />
        <Input
          id="maxDoctors"
          name="maxDoctors"
          label="Max Doctors"
          type="number"
          min="1"
          placeholder="5"
          required
          error={state?.errors?.maxDoctors?.[0]}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" loading={isPending}>Create Plan</Button>
        </div>
      </form>
    </Modal>
  );
}
