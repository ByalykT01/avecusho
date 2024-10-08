import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "~/schemas/index";
import { getUserByEmail } from "~/server/queries";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user?.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;

          return null;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
