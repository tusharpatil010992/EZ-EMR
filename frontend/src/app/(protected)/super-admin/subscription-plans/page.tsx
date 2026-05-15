"use client";

import { useEffect, useState } from "react";
import { Card } from "@/shared/components/Card";
import { PageContainer } from "@/shared/components/PageContainer";
import { SubscriptionPlanList } from "@/modules/super-admin/components/SubscriptionPlanList";
import { SubscriptionPlanForm } from "@/modules/super-admin/components/SubscriptionPlanForm";
import { SubscriptionPlanDto } from "@/modules/super-admin/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

function getToken() {
  return document.cookie.match(/auth_token=([^;]+)/)?.[1] ?? "";
}

export default function SubscriptionPlansPage() {
  const [showForm, setShowForm] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlanDto[]>([]);

  function load() {
    fetch(`${BASE}/super-admin/subscription-plans`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((p) => setPlans(Array.isArray(p) ? p : []));
  }

  useEffect(() => { load(); }, []);

  return (
    <PageContainer>
      <Card padding={false} className="p-6">
        <SubscriptionPlanList plans={plans} onCreateClick={() => setShowForm(true)} />
      </Card>
      <SubscriptionPlanForm
        open={showForm}
        onClose={() => { setShowForm(false); load(); }}
      />
    </PageContainer>
  );
}
