"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/shared/components/Table";
import { Button } from "@/shared/components/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Badge } from "@/shared/components/Badge";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { Pagination } from "@/shared/components/Pagination";
import { useToast } from "@/shared/components/Toast";
import { cancelAppointmentAction, startAppointmentAction, completeAppointmentAction } from "../actions/appointment.actions";
import { AppointmentDto } from "../types";

interface AppointmentListProps {
  appointments: AppointmentDto[];
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
  canBook?: boolean;
  canStart?: boolean;
  canCancel?: boolean;
  canComplete?: boolean;
}

export function AppointmentList({
  appointments,
  totalPages,
  page,
  onPageChange,
  canBook = false,
  canStart = false,
  canCancel = false,
  canComplete = false,
}: AppointmentListProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCancel(id: string) {
    startTransition(async () => {
      try {
        await cancelAppointmentAction(id);
        addToast("Appointment cancelled", "success");
      } catch {
        addToast("Failed to cancel", "error");
      }
      setCancelId(null);
    });
  }

  function handleStart(id: string) {
    startTransition(async () => {
      try {
        await startAppointmentAction(id);
        addToast("Appointment started", "success");
      } catch {
        addToast("Failed to start", "error");
      }
    });
  }

  function handleComplete(id: string) {
    startTransition(async () => {
      try {
        await completeAppointmentAction(id);
        addToast("Appointment completed", "success");
      } catch {
        addToast("Failed to complete", "error");
      }
    });
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Appointments</h2>
        {canBook && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push("/appointments/new?walkin=true")}>
              Walk-in
            </Button>
            <Button size="sm" onClick={() => router.push("/appointments/new")}>
              + Schedule
            </Button>
          </div>
        )}
      </div>
      {appointments.length === 0 ? (
        <EmptyState
          message="No appointments"
          description={canBook ? "Schedule your first appointment." : undefined}
          actionLabel={canBook ? "Schedule Appointment" : undefined}
          onAction={canBook ? () => router.push("/appointments/new") : undefined}
        />
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>Patient</Th>
                <Th>Time</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments.map((a) => (
                <Tr key={a.id}>
                  <Td className="font-medium text-gray-700">{a.patientId}</Td>
                  <Td>
                    {a.appointmentTime
                      ? new Date(a.appointmentTime).toLocaleString()
                      : <span className="text-gray-400">Walk-in</span>}
                  </Td>
                  <Td>
                    {a.isWalkin && <Badge variant="warning">Walk-in</Badge>}
                  </Td>
                  <Td><StatusBadge status={a.status} /></Td>
                  <Td>
                    <div className="flex gap-2">
                      {canStart && a.status === "SCHEDULED" && (
                        <Button variant="secondary" size="sm" loading={isPending} onClick={() => handleStart(a.id)}>
                          Start
                        </Button>
                      )}
                      {canComplete && a.status === "IN_PROGRESS" && (
                        <Button size="sm" loading={isPending} onClick={() => handleComplete(a.id)}>
                          Complete
                        </Button>
                      )}
                      {canCancel && a.status !== "CANCELLED" && a.status !== "COMPLETED" && (
                        <Button variant="danger" size="sm" onClick={() => setCancelId(a.id)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
      <ConfirmModal
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={() => cancelId && handleCancel(cancelId)}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment?"
        confirmLabel="Cancel Appointment"
        confirmVariant="danger"
        loading={isPending}
      />
    </>
  );
}
