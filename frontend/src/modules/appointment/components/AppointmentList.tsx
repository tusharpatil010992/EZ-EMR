import { PageContainer } from "@/shared/components/PageContainer";
import { Card, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/shared/components/Table";
import { Badge } from "@/shared/components/Badge";

export function AppointmentList() {
  return (
    <PageContainer>
      <Card padding={false}>
        <CardHeader className="px-6 pt-6">
          <CardTitle>Appointments</CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Walk-in</Button>
            <Button size="sm">+ Schedule</Button>
          </div>
        </CardHeader>
        <Table>
          <Thead>
            <Tr>
              <Th>Patient</Th>
              <Th>Date &amp; Time</Th>
              <Th>Type</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td colSpan={4} className="text-center text-gray-400 py-10">
                No appointments yet. Schedule your first appointment.
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Card>
    </PageContainer>
  );
}
