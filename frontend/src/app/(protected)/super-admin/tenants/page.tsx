"use client";

import { useEffect, useState } from "react";
import { Card } from "@/shared/components/Card";
import { PageContainer } from "@/shared/components/PageContainer";
import { TenantList } from "@/modules/super-admin/components/TenantList";
import { TenantOnboardingForm } from "@/modules/super-admin/components/TenantOnboardingForm";
import { TenantDto, SubscriptionPlanDto } from "@/modules/super-admin/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

function getToken() {
  return document.cookie.match(/auth_token=([^;]+)/)?.[1] ?? "";
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" };
}

export default function TenantsPage() {
  const [showForm, setShowForm] = useState(false);
  const [tenants, setTenants] = useState<TenantDto[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlanDto[]>([]);

  function load() {
    Promise.all([
      fetch(`${BASE}/super-admin/tenants`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${BASE}/super-admin/subscription-plans`, { headers: authHeaders() }).then((r) => r.json()),
    ]).then(([t, p]) => {
      setTenants(Array.isArray(t) ? t : []);
      setPlans(Array.isArray(p) ? p : []);
    });
  }

  useEffect(() => { load(); }, []);

  return (
    <PageContainer>
      <Card padding={false} className="p-6">
        <TenantList tenants={tenants} onCreateClick={() => setShowForm(true)} />
      </Card>
      <TenantOnboardingForm
        open={showForm}
        onClose={() => { setShowForm(false); load(); }}
        plans={plans}
      />
    </PageContainer>
  );
}
