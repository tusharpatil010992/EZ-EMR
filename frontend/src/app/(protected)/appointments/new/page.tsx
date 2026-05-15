"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreateAppointmentForm } from "@/modules/appointment/components/CreateAppointmentForm";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

function getToken() {
  return document.cookie.match(/auth_token=([^;]+)/)?.[1] ?? "";
}

interface Person { id: string; fullName: string; }

export default function NewAppointmentPage() {
  const params = useSearchParams();
  const isWalkin = params.get("walkin") === "true";
  const [patients, setPatients] = useState<Person[]>([]);
  const [doctors, setDoctors] = useState<Person[]>([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${getToken()}` };
    Promise.all([
      fetch(`${BASE}/patients?size=100`, { headers }).then((r) => r.json()),
      fetch(`${BASE}/users`, { headers }).then((r) => r.json()),
    ]).then(([p, u]) => {
      setPatients((p.content ?? p).map((pt: { id: string; fullName: string }) => ({ id: pt.id, fullName: pt.fullName })));
      setDoctors(
        ((u as { role: string; id: string; fullName: string }[])
          .filter((user) => user.role === "DOCTOR"))
          .map((d) => ({ id: d.id, fullName: d.fullName }))
      );
    });
  }, []);

  return <CreateAppointmentForm patients={patients} doctors={doctors} defaultWalkin={isWalkin} />;
}
