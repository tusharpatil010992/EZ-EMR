"use client";

import { useActionState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Textarea } from "@/shared/components/Textarea";
import { Card, CardTitle } from "@/shared/components/Card";
import { PageContainer } from "@/shared/components/PageContainer";
import { createAppointmentAction, FormState } from "../actions/appointment.actions";

interface Patient {
  id: string;
  fullName: string;
}

interface Doctor {
  id: string;
  fullName: string;
}

interface CreateAppointmentFormProps {
  patients: Patient[];
  doctors: Doctor[];
  defaultWalkin?: boolean;
}

export function CreateAppointmentForm({
  patients,
  doctors,
  defaultWalkin = false,
}: CreateAppointmentFormProps) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    createAppointmentAction,
    undefined
  );

  return (
    <PageContainer>
      <Card>
        <CardTitle className="mb-6">
          {defaultWalkin ? "Register Walk-in" : "Schedule Appointment"}
        </CardTitle>
        <form action={action} className="space-y-4 max-w-lg">
          {state?.message && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {state.message}
            </div>
          )}

          <input type="hidden" name="isWalkin" value={defaultWalkin ? "true" : "false"} />

          <div>
            <label htmlFor="patientId" className="mb-1 block text-sm font-medium text-gray-700">
              Patient <span className="text-red-500">*</span>
            </label>
            <select
              id="patientId"
              name="patientId"
              required
              className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
            {state?.errors?.patientId && (
              <p className="mt-1 text-xs text-red-600">{state.errors.patientId[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="doctorId" className="mb-1 block text-sm font-medium text-gray-700">
              Doctor
            </label>
            <select
              id="doctorId"
              name="doctorId"
              className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Assign later</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.fullName}</option>
              ))}
            </select>
          </div>

          {!defaultWalkin && (
            <Input
              id="appointmentTime"
              name="appointmentTime"
              label="Appointment Date & Time"
              type="datetime-local"
              error={state?.errors?.appointmentTime?.[0]}
            />
          )}

          <Textarea
            id="notes"
            name="notes"
            label="Notes"
            placeholder="Additional notes..."
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isPending}>
              {defaultWalkin ? "Register Walk-in" : "Schedule Appointment"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
