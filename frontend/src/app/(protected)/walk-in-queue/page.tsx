"use client";

import { useEffect, useState, useTransition } from "react";
import { Card } from "@/shared/components/Card";
import { PageContainer } from "@/shared/components/PageContainer";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/shared/components/Table";
import { Button } from "@/shared/components/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/shared/components/Toast";
import { startAppointmentAction, completeAppointmentAction } from "@/modules/appointment/actions/appointment.actions";
import { AppointmentDto } from "@/modules/appointment/types";
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

export default function WalkInQueuePage() {
  const [queue, setQueue] = useState<AppointmentDto[]>([]);
  const [role, setRole] = useState("");
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  function load() {
    fetch(`${BASE}/appointments/walk-in-queue`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((q) => setQueue(Array.isArray(q) ? q : []));
  }

  useEffect(() => { setRole(getRole()); load(); }, []);

  function handleStart(id: string) {
    startTransition(async () => {
      try { await startAppointmentAction(id); addToast("Appointment started", "success"); }
      catch { addToast("Failed", "error"); }
      load();
    });
  }

  function handleComplete(id: string) {
    startTransition(async () => {
      try { await completeAppointmentAction(id); addToast("Appointment completed", "success"); }
      catch { addToast("Failed", "error"); }
      load();
    });
  }

  const canStart = ["ADMIN", "DOCTOR", "SUPER_ADMIN"].includes(role);
  const canComplete = ["DOCTOR", "SUPER_ADMIN"].includes(role);

  return (
    <PageContainer>
      <Card padding={false} className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Walk-in Queue</h2>
          <Button variant="secondary" size="sm" onClick={load}>Refresh</Button>
        </div>
        {queue.length === 0 ? (
          <EmptyState message="Queue is empty" description="Walk-in patients will appear here." />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Patient</Th>
                <Th>Arrived</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {queue.map((a) => (
                <Tr key={a.id}>
                  <Td className="font-medium">{a.patientId}</Td>
                  <Td>{new Date(a.createdAt).toLocaleTimeString()}</Td>
                  <Td><StatusBadge status={a.status} /></Td>
                  <Td>
                    <div className="flex gap-2">
                      {canStart && a.status === "SCHEDULED" && (
                        <Button size="sm" loading={isPending} onClick={() => handleStart(a.id)}>
                          Start
                        </Button>
                      )}
                      {canComplete && a.status === "IN_PROGRESS" && (
                        <Button variant="secondary" size="sm" loading={isPending} onClick={() => handleComplete(a.id)}>
                          Complete
                        </Button>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </PageContainer>
  );
}
