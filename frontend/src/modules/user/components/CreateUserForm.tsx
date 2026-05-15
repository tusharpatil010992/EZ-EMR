"use client";

import { useActionState, useState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Select } from "@/shared/components/Select";
import { Modal } from "@/shared/components/Modal";
import { createUserAction, CreateUserFormState } from "../actions/user.actions";
import { CreateUserResponse } from "../types";

interface CreateUserFormProps {
  open: boolean;
  onClose: () => void;
}

export function CreateUserForm({ open, onClose }: CreateUserFormProps) {
  const [credentials, setCredentials] = useState<CreateUserResponse | null>(null);
  const [state, action, isPending] = useActionState<CreateUserFormState, FormData>(
    async (prev, fd) => {
      const result = await createUserAction(prev, fd);
      if (result?.result) setCredentials(result.result);
      return result;
    },
    null
  );

  if (credentials) {
    return (
      <Modal open={open} onClose={() => { setCredentials(null); onClose(); }} title="User Created">
        <div className="space-y-3 text-sm">
          <p className="text-gray-600">Share these credentials with the user. Password is shown only once.</p>
          <div className="rounded-md bg-gray-50 border border-gray-200 p-4 space-y-2 font-mono text-xs">
            <div><span className="text-gray-500">Email:</span> {credentials.email}</div>
            <div><span className="text-gray-500">Password:</span> <span className="font-bold text-blue-700">{credentials.generatedPassword}</span></div>
          </div>
          <Button className="w-full" onClick={() => { setCredentials(null); onClose(); }}>Done</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Add User">
      <form action={action} className="space-y-4">
        {state?.message && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {state.message}
          </div>
        )}
        <Input
          id="fullName"
          name="fullName"
          label="Full Name"
          placeholder="Dr. John Doe"
          required
          error={state?.errors?.fullName?.[0]}
        />
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="doctor@clinic.com"
          required
          error={state?.errors?.email?.[0]}
        />
        <Select
          id="role"
          name="role"
          label="Role"
          placeholder="Select role"
          required
          error={state?.errors?.role?.[0]}
        >
          <option value="DOCTOR">Doctor</option>
          <option value="STAFF">Staff</option>
        </Select>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" loading={isPending}>Create User</Button>
        </div>
      </form>
    </Modal>
  );
}
