"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Card } from "@/shared/components/Card";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to auth API
    await new Promise((r) => setTimeout(r, 500));
    router.push("/dashboard");
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="email" label="Email" type="email" placeholder="you@clinic.com" required />
        <Input id="password" label="Password" type="password" placeholder="••••••••" required />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Sign In
        </Button>
      </form>
    </Card>
  );
}
