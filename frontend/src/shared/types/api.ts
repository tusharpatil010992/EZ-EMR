export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "STAFF";
  tenantId: string | null;
  firstLoginPasswordResetRequired: boolean;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "STAFF";
  tenantId: string | null;
}

export interface ApiPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}
