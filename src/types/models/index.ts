import type { User, Document, Notification, ActivityLog, UserSettings } from "@/lib/db/schema";

// User Types
export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  isActive: boolean;
  emailVerified: Date | null;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface UserWithRelations extends User {
  accounts?: Record<string, unknown>[];
  sessions?: Record<string, unknown>[];
  auditLogs?: Record<string, unknown>[];
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  token?: string;
  expiresAt?: Date;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Search Types
export interface SearchParams {
  query: string;
  filters?: Record<string, unknown>;
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
  pagination?: PaginationParams;
}

export interface SearchResult<T> {
  results: T[];
  total: number;
  facets?: Record<string, Array<{ value: string; count: number }>>;
  suggestions?: string[];
}

// File Types
export interface FileUpload {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  createdAt: Date;
}

export interface FileUploadProgress {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed";
  error?: string;
  result?: FileUpload;
}

// Notification Types
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  data?: Record<string, unknown>;
  link?: string;
  createdAt: Date;
}

export interface NotificationPreferences {
  email: {
    welcome: boolean;
    security: boolean;
    updates: boolean;
    marketing: boolean;
  };
  push: {
    messages: boolean;
    comments: boolean;
    mentions: boolean;
  };
  inApp: {
    system: boolean;
    social: boolean;
    billing: boolean;
  };
}

// Audit Types
export interface AuditEvent {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogEntry extends AuditEvent {
  id: string;
  createdAt: Date;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

// Settings Types
export interface AppSettings {
  theme: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  weekStartsOn: 0 | 1 | 6;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: "app" | "sms" | "email";
  passwordLastChanged: Date;
  loginNotifications: boolean;
  trustedDevices: boolean;
}

export interface BillingSettings {
  plan: "free" | "pro" | "enterprise";
  status: "active" | "past_due" | "canceled" | "trialing";
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}