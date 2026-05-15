"use client";

import { Table, Thead, Tbody, Tr, Th, Td } from "@/shared/components/Table";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { EmptyState } from "@/shared/components/EmptyState";
import { Pagination } from "@/shared/components/Pagination";

interface PatientDto {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  dateOfBirth: string | null;
  isWalkin: boolean;
}

interface PatientListProps {
  patients: PatientDto[];
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
  onRegister?: () => void;
}

export function PatientList({
  patients,
  totalPages,
  page,
  onPageChange,
  onRegister,
}: PatientListProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Patients</h2>
        {onRegister && (
          <Button size="sm" onClick={onRegister}>+ Walk-in</Button>
        )}
      </div>
      {patients.length === 0 ? (
        <EmptyState message="No patients yet" description="Register your first patient." />
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>DOB</Th>
                <Th>Type</Th>
              </Tr>
            </Thead>
            <Tbody>
              {patients.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-medium">{p.fullName}</Td>
                  <Td>{p.phone ?? "—"}</Td>
                  <Td>{p.email ?? "—"}</Td>
                  <Td>{p.dateOfBirth ?? "—"}</Td>
                  <Td>
                    {p.isWalkin && <Badge variant="warning">Walk-in</Badge>}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </>
  );
}
