"use client";

import { useActionState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Card, CardTitle } from "@/shared/components/Card";
import { changePasswordAction, FormState } from "@/modules/auth/actions/auth.actions";

export function ChangePasswordForm() {
  const [state, action, isPending] = useActionState<FormState, FormData>(changePasswordAction, undefined);

  return (
    <Card>
      <CardTitle className="mb-4">Change Password</CardTitle>
      <p className="mb-4 text-sm text-gray-500">
        Your account requires a password change before you can continue.
      </p>
      <form action={action} className="space-y-4">
        {state?.message && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {state.message}
          </div>
        )}
        <Input
          id="currentPassword"
          name="currentPassword"
          label="Current Password"
          type="password"
          required
          error={state?.errors?.currentPassword?.[0]}
        />
        <Input
          id="newPassword"
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="Min. 8 characters"
          required
          error={state?.errors?.newPassword?.[0]}
        />
        <Button type="submit" loading={isPending} className="w-full">
          Update Password
        </Button>
      </form>
    </Card>
  );
}
