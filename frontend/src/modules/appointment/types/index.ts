export interface AppointmentDto {
  id: string;
  tenantId: string;
  patientId: string;
  doctorId: string | null;
  appointmentTime: string | null;
  isWalkin: boolean;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  cancelReason: string | null;
  createdAt: string;
}
