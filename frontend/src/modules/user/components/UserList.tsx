"use client";

import { useState, useTransition } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/shared/components/Table";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/shared/components/Toast";
import { deactivateUserAction } from "../actions/user.actions";
import { UserDto } from "../types";

interface UserListProps {
  users: UserDto[];
  onCreateClick: () => void;
}

export function UserList({ users, onCreateClick }: UserListProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  function handleDeactivate(id: string) {
    startTransition(async () => {
      try {
        await deactivateUserAction(id);
        addToast("User deactivated", "success");
      } catch {
        addToast("Failed to deactivate user", "error");
      }
      setConfirmId(null);
    });
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Users</h2>
        <Button size="sm" onClick={onCreateClick}>+ Add User</Button>
      </div>
      {users.length === 0 ? (
        <EmptyState message="No users yet" actionLabel="Add User" onAction={onCreateClick} />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((u) => (
              <Tr key={u.id}>
                <Td className="font-medium">{u.fullName}</Td>
                <Td>{u.email}</Td>
                <Td>
                  <Badge variant={u.role === "DOCTOR" ? "info" : "neutral"}>{u.role}</Badge>
                </Td>
                <Td>
                  <Badge variant={u.active ? "success" : "neutral"}>
                    {u.active ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>
                  {u.active && (
                    <Button variant="danger" size="sm" onClick={() => setConfirmId(u.id)}>
                      Deactivate
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      <ConfirmModal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => confirmId && handleDeactivate(confirmId)}
        title="Deactivate User"
        message="Are you sure you want to deactivate this user? They will no longer be able to log in."
        confirmLabel="Deactivate"
        confirmVariant="danger"
        loading={isPending}
      />
    </>
  );
}
