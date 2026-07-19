import { pgTable, text, timestamp, uuid, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "user", "moderator"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  bio: text("bio"),
  passwordHash: text("passwordHash"),
  role: roleEnum("role").default("user").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

export const verificationTokens = pgTable("verificationTokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const passwordResetTokens = pgTable("passwordResetTokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const auditLogs = pgTable("auditLogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entityId"),
  details: jsonb("details"),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const activityLogs = pgTable("activityLogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  entity: text("entity"),
  entityId: text("entityId"),
  details: jsonb("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  size: text("size"),
  type: text("type"),
  url: text("url"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info").notNull(),
  read: boolean("read").default(false).notNull(),
  link: text("link"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userSettings = pgTable("userSettings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  darkMode: boolean("darkMode").default(false),
  emailNotifications: boolean("emailNotifications").default(true),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  language: text("language").default("en"),
  timezone: text("timezone").default("UTC"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;