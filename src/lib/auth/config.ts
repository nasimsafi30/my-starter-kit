import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET || "my-secret",
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const sql = postgres(DB_URL, { ssl: "require", max: 1 });

        try {
          const email = credentials.email as string;
          const password = credentials.password as string;

          const result = await sql.unsafe("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);

          if (result.length === 0) {
            console.log("User not found:", email);
            return null;
          }

          const user = result[0];

          if (!user.passwordHash) {
            console.log("No password hash for user");
            return null;
          }

          const isValid = await bcrypt.compare(password, user.passwordHash);

          if (!isValid) {
            console.log("Invalid password for:", email);
            return null;
          }

          console.log("Login successful for:", user.email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        } finally {
          await sql.end();
        }
      },
    }),
  ],
});