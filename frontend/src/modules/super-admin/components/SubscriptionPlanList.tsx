"use client";

import { useState, useTransition } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/shared/components/Table";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/shared/components/Toast";
import { togglePlanAction } from "../actions/superAdmin.actions";
import { SubscriptionPlanDto } from "../types";

interface SubscriptionPlanListProps {
  plans: SubscriptionPlanDto[];
  onCreateClick: () => void;
}

export function SubscriptionPlanList({ plans, onCreateClick }: SubscriptionPlanListProps) {
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  function handleToggle(id: string) {
    startTransition(async () => {
      try {
        await togglePlanAction(id);
        addToast("Plan updated", "success");
      } catch {
        addToast("Failed to update plan", "error");
      }
    });
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Subscription Plans</h2>
        <Button size="sm" onClick={onCreateClick}>+ New Plan</Button>
      </div>
      {plans.length === 0 ? (
        <EmptyState message="No plans yet" actionLabel="Create Plan" onAction={onCreateClick} />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Billing</Th>
              <Th>Price</Th>
              <Th>Max Doctors</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {plans.map((p) => (
              <Tr key={p.id}>
                <Td className="font-medium">{p.name}</Td>
                <Td>{p.billingCycle}</Td>
                <Td>${p.price}</Td>
                <Td>{p.maxDoctors}</Td>
                <Td>
                  <Badge variant={p.active ? "success" : "neutral"}>
                    {p.active ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>
                  <Button
                    variant={p.active ? "secondary" : "ghost"}
                    size="sm"
                    loading={isPending}
                    onClick={() => handleToggle(p.id)}
                  >
                    {p.active ? "Disable" : "Enable"}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
}
