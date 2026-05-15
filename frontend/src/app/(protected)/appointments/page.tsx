"use client";

import { useEffect, useState } from "react";
import { Card } from "@/shared/components/Card";
import { PageContainer } from "@/shared/components/PageContainer";
import { AppointmentList } from "@/modules/appointment/components/AppointmentList";
import { AppointmentDto } from "@/modules/appointment/types";
import { ApiPage } from "@/shared/types/api";
import { getTokenRole } from "@/shared/lib/jwt";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

function getToken() {
  return document.cookie.match(/auth_token=([^;]+)/)?.[1] ?? "";
}

function getRole(): string {
  const token = getToken();
  if (!token) return "";
  return getTokenRole(token);
}

export default function AppointmentsPage() {
  const [data, setData] = useState<ApiPage<AppointmentDto>>({
    content: [], totalElements: 0, totalPages: 0, size: 20, number: 0,
  });
  const [page, setPage] = useState(0);
  const [role, setRole] = useState("");

  function load(p: number) {
    fetch(`${BASE}/appointments?page=${p}&size=20`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d?.content) setData(d); });
  }

  useEffect(() => { setRole(getRole()); load(page); }, [page]);

  const canBook = ["ADMIN", "STAFF", "SUPER_ADMIN"].includes(role);
  const canStart = ["ADMIN", "DOCTOR", "SUPER_ADMIN"].includes(role);
  const canCancel = ["ADMIN", "STAFF", "SUPER_ADMIN"].includes(role);

  return (
    <PageContainer>
      <Card padding={false} className="p-6">
        <AppointmentList
          appointments={data.content}
          totalPages={data.totalPages}
          page={page}
          onPageChange={(p) => { setPage(p); load(p); }}
          canBook={canBook}
          canStart={canStart}
          canCancel={canCancel}
        />
      </Card>
    </PageContainer>
  );
}
