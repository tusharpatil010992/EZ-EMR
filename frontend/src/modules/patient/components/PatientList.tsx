import { PageContainer } from "@/shared/components/PageContainer";
import { Card, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/shared/components/Table";
import { Badge } from "@/shared/components/Badge";

export function PatientList() {
  return (
    <PageContainer>
      <Card padding={false}>
        <CardHeader className="px-6 pt-6">
          <CardTitle>Patients</CardTitle>
          <Button size="sm">+ Add Patient</Button>
        </CardHeader>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>DOB</Th>
              <Th>Type</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td colSpan={5} className="text-center text-gray-400 py-10">
                No patients yet. Add your first patient.
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Card>
    </PageContainer>
  );
}
