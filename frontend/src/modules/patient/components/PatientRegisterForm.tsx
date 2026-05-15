"use client";

import { useActionState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Select } from "@/shared/components/Select";
import { Card, CardTitle } from "@/shared/components/Card";
import { PageContainer } from "@/shared/components/PageContainer";
import { createPatientAction, PatientFormState } from "../actions/patient.actions";

export function PatientRegisterForm() {
  const [state, action, isPending] = useActionState<PatientFormState, FormData>(
    createPatientAction,
    null
  );

  return (
    <PageContainer>
      <Card>
        <CardTitle className="mb-6">Register Patient</CardTitle>
        <form action={action} className="max-w-lg space-y-4">
          {state?.message && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.message}
            </div>
          )}

          <Input
            id="fullName"
            name="fullName"
            label="Full Name"
            placeholder="Jane Doe"
            required
            error={state?.errors?.fullName?.[0]}
          />

          <Input
            id="phone"
            name="phone"
            label="Phone"
            type="tel"
            placeholder="+1 555 000 0000"
            error={state?.errors?.phone?.[0]}
          />

          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="patient@email.com"
            error={state?.errors?.email?.[0]}
          />

          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            error={state?.errors?.dateOfBirth?.[0]}
          />

          <Select
            id="gender"
            name="gender"
            label="Gender"
            placeholder="Select gender"
            error={state?.errors?.gender?.[0]}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </Select>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isPending}>Register Patient</Button>
            <Button type="button" variant="secondary" onClick={() => history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
