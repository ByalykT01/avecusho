"use server";

import * as z from "zod";
import { generateVerificationToken } from "~/lib/tokens";
import { RegisterSchema } from "~/schemas";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { getUserByEmail, saltAndHashPassword } from "~/server/queries";

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await saltAndHashPassword(password);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use" };
  }

  const newUser = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({
      id: users.id,
    });

  if (!newUser ?? !newUser[0] ?? !newUser[0].id) {
    return { error: "Error creating user!" };
  }

  const verificationToken = await generateVerificationToken(email)

  //  return { success: "Confirmation email sent!" };

  return { success: "The account has been created!" };
}
