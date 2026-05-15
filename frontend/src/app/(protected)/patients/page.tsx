"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/shared/components/Card";
import { PageContainer } from "@/shared/components/PageContainer";
import { PatientList } from "@/modules/patient/components/PatientList";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

function getToken() {
  return document.cookie.match(/auth_token=([^;]+)/)?.[1] ?? "";
}

interface PatientDto {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  dateOfBirth: string | null;
  isWalkin: boolean;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();

  function load(p: number) {
    fetch(`${BASE}/patients?page=${p}&size=20`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setPatients(data.content ?? data);
        setTotalPages(data.totalPages ?? 1);
      });
  }

  useEffect(() => { load(page); }, [page]);

  return (
    <PageContainer>
      <Card padding={false} className="p-6">
        <PatientList
          patients={patients}
          totalPages={totalPages}
          page={page}
          onPageChange={(p: number) => { setPage(p); load(p); }}
          onRegister={() => router.push("/patients/new")}
        />
      </Card>
    </PageContainer>
  );
}
