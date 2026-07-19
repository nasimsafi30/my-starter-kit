// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
  ok: boolean;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, any>;
  status: number;
}

export interface ApiSuccess<T = any> {
  data: T;
  message?: string;
  status: number;
}

// API Request Types
export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

// Auth API
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// User API
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
}

export interface UpdatePreferencesRequest {
  theme?: string;
  language?: string;
  timezone?: string;
  notifications?: Record<string, any>;
}

// Upload API
export interface UploadRequest {
  file: File;
  folder?: string;
  metadata?: Record<string, any>;
}

export interface UploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
}

// Search API
export interface SearchRequest {
  query: string;
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
}

export interface SearchResponse<T> {
  results: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Admin API
export interface AdminUpdateUserRequest {
  userId: string;
  role?: string;
  isActive?: boolean;
}

export interface AdminGetUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

// Analytics API
export interface AnalyticsQueryRequest {
  startDate?: string;
  endDate?: string;
  metric?: string;
  groupBy?: "hour" | "day" | "week" | "month";
}

export interface AnalyticsResponse {
  data: Array<{
    date: string;
    value: number;
    [key: string]: any;
  }>;
  summary: {
    total: number;
    average: number;
    min: number;
    max: number;
  };
}

// Webhook Types
export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  createdAt: string;
}

export interface StripeWebhookEvent extends WebhookEvent {
  type: string;
  data: {
    object: Record<string, any>;
  };
}

// Health Check
export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  checks: Record<string, {
    status: "pass" | "fail" | "warn";
    latency?: number;
    message?: string;
  }>;
}
