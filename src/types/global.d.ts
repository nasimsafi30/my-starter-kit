// Global window extensions
declare global {
  interface Window {
    __FEATURE_FLAGS__?: Record<string, boolean>;
    __REACT_QUERY_CACHE__?: any;
    __NEXT_DATA__?: any;
  }
}

// Environment variables type
declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;

    // Authentication
    AUTH_SECRET: string;
    AUTH_URL: string;
    JWT_ACCESS_SECRET?: string;
    JWT_REFRESH_SECRET?: string;

    // OAuth
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;

    // Email
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    EMAIL_FROM_NAME?: string;

    // Upload
    UPLOADTHING_SECRET?: string;
    UPLOADTHING_APP_ID?: string;

    // Redis
    UPSTASH_REDIS_URL?: string;
    UPSTASH_REDIS_TOKEN?: string;

    // AI
    OPENAI_API_KEY?: string;
    ANTHROPIC_API_KEY?: string;

    // AWS
    AWS_REGION?: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    BACKUP_BUCKET?: string;

    // Stripe
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;

    // App
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_WS_URL?: string;

    // Feature Flags
    NEXT_PUBLIC_FEATURE_FLAGS_ENDPOINT?: string;

    // Logging
    LOG_LEVEL?: "debug" | "info" | "warn" | "error";

    // Monitoring
    SENTRY_DSN?: string;
    DATADOG_API_KEY?: string;

    // Environment
    NODE_ENV: "development" | "production" | "test";
  }
}

// Module declarations
declare module "*.svg" {
  import React from "react";
  const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.json" {
  const content: any;
  export default content;
}

// Export empty object to make this a module
export {};
