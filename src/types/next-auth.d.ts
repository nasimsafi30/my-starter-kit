import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
    accessToken?: string;
    expires: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  }

  interface Profile {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken?: string;
  }
}

declare module "next-auth/providers/credentials" {
  interface CredentialsConfig {
    credentials: {
      email: { label: string; type: string; placeholder?: string };
      password: { label: string; type: string };
    };
    authorize: (
      credentials: Record<"email" | "password", string> | undefined,
      req: Request
    ) => Promise<User | null>;
  }
}
