import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "~/server/db";
import { getUserById } from "~/server/queries";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "USER";
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    
    async session({ token, session }) {
      console.log({ sessionToken: token });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user && (token.role === "ADMIN" || token.role === "USER")) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token }) {
      if (token.sub) {
        const existingUser = await getUserById(token.sub);

        if (existingUser) {
          token.role = existingUser.role;
        }
      }

      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
