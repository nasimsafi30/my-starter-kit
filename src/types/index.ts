export * from "./models";
export * from "./api";
export * from "./components";

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullableFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: NonNullable<T[P]>;
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;

export type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Common Types
export type ID = string;

export type Timestamp = string | Date;

export type ISO8601 = string;

export type URLString = string;

export type Email = string;

export type PhoneNumber = string;

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";

export type Language = "en" | "es" | "fr" | "de" | "zh" | "ja" | "ko";

export type Theme = "light" | "dark" | "system";

export type Status = "active" | "inactive" | "pending" | "suspended" | "deleted";

export type SortDirection = "asc" | "desc";

export type Alignment = "left" | "center" | "right";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export type Variant = "default" | "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";

// Utility Functions
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
