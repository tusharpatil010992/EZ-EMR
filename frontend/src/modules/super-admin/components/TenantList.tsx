"use client";

import { useState, useTransition } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/shared/components/Table";
import { Button } from "@/shared/components/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/shared/components/Toast";
import { toggleTenantStatusAction } from "../actions/superAdmin.actions";
import { TenantDto } from "../types";

interface TenantListProps {
  tenants: TenantDto[];
  onCreateClick: () => void;
}

export function TenantList({ tenants, onCreateClick }: TenantListProps) {
  const [confirm, setConfirm] = useState<{ id: string; activate: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  function handleToggle(id: string, activate: boolean) {
    startTransition(async () => {
      try {
        await toggleTenantStatusAction(id, activate);
        addToast(`Tenant ${activate ? "activated" : "deactivated"}`, "success");
      } catch {
        addToast("Action failed", "error");
      }
      setConfirm(null);
    });
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Tenants</h2>
        <Button size="sm" onClick={onCreateClick}>+ Onboard Tenant</Button>
      </div>
      {tenants.length === 0 ? (
        <EmptyState message="No tenants yet" description="Onboard your first tenant to get started." actionLabel="Onboard Tenant" onAction={onCreateClick} />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Plan</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tenants.map((t) => (
              <Tr key={t.id}>
                <Td className="font-medium">{t.name}</Td>
                <Td><StatusBadge status={t.status} type="tenant" /></Td>
                <Td className="text-gray-400">{t.subscriptionPlanId ?? "—"}</Td>
                <Td>
                  {t.status === "ACTIVE" ? (
                    <Button variant="danger" size="sm" onClick={() => setConfirm({ id: t.id, activate: false })}>
                      Deactivate
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => setConfirm({ id: t.id, activate: true })}>
                      Activate
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      {confirm && (
        <ConfirmModal
          open
          onClose={() => setConfirm(null)}
          onConfirm={() => handleToggle(confirm.id, confirm.activate)}
          title={confirm.activate ? "Activate Tenant" : "Deactivate Tenant"}
          message={`Are you sure you want to ${confirm.activate ? "activate" : "deactivate"} this tenant?`}
          confirmLabel={confirm.activate ? "Activate" : "Deactivate"}
          confirmVariant={confirm.activate ? "primary" : "danger"}
          loading={isPending}
        />
      )}
    </>
  );
}
