export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "DOCTOR" | "STAFF";
  tenantId: string;
  active: boolean;
  firstLoginPasswordResetRequired: boolean;
}

export interface CreateUserResponse {
  userId: string;
  email: string;
  generatedPassword: string;
}
