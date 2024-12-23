import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "~/server/db";
import { getUserById } from "~/server/queries";
import { JWT } from "next-auth/jwt";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) {
        await db
          .update(users)
          .set({ emailVerified: new Date() })
          .where(eq(users.id, user.id));
      } else {
        throw new Error("User ID is undefined.");
      }
    },
  },
  callbacks: {
    // async signIn({user, account }) { 
    //   //allow oAuth without verification
    //   if (account?.provider !== "credentials") return true;
      
    //   const existingUser = await getUserById(user.id)
      
    //   if (!existingUser?.emailVerified) return false;
      
    //   //Add 2FA
      
    //   return true;
      
    // },
    async session({ token, session }) {
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
