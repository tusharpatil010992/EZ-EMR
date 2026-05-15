"use client";

import { useEffect, useState } from "react";
import { Card } from "@/shared/components/Card";
import { PageContainer } from "@/shared/components/PageContainer";
import { UserList } from "@/modules/user/components/UserList";
import { CreateUserForm } from "@/modules/user/components/CreateUserForm";
import { UserDto } from "@/modules/user/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

function getToken() {
  return document.cookie.match(/auth_token=([^;]+)/)?.[1] ?? "";
}

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<UserDto[]>([]);

  function load() {
    fetch(`${BASE}/users`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((u) => setUsers(Array.isArray(u) ? u : []));
  }

  useEffect(() => { load(); }, []);

  return (
    <PageContainer>
      <Card padding={false} className="p-6">
        <UserList users={users} onCreateClick={() => setShowForm(true)} />
      </Card>
      <CreateUserForm
        open={showForm}
        onClose={() => { setShowForm(false); load(); }}
      />
    </PageContainer>
  );
}
