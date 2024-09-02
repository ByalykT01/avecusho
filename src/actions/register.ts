"use server";

import bcrypt from "bcrypt";
import * as z from "zod";
import { RegisterSchema } from "~/schemas";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { getUserByEmail } from "~/server/queries";

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use" };
  }

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { success: "Account created!" };
}
