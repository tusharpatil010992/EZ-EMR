"use client";

import { useActionState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Card } from "@/shared/components/Card";
import { loginAction, FormState } from "@/modules/auth/actions/auth.actions";

export function LoginForm() {
  const [state, action, isPending] = useActionState<FormState, FormData>(loginAction, undefined);

  return (
    <Card>
      <form action={action} className="space-y-4">
        {state?.message && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {state.message}
          </div>
        )}
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@clinic.com"
          required
          autoComplete="email"
          error={state?.errors?.email?.[0]}
        />
        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          error={state?.errors?.password?.[0]}
        />
        <Button type="submit" loading={isPending} className="w-full mt-2">
          Sign In
        </Button>
      </form>
    </Card>
  );
}
