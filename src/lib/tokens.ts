import { eq } from "drizzle-orm";
import {v4 as uuidv4} from "uuid"
import { db } from "~/server/db";
import { verificationToken } from "~/server/db/schema";
import { getVerificationTokenByEmail } from "~/server/queries/verification-tokens";

export const generateVerificationToken = async(email: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  
  const existingToken = await getVerificationTokenByEmail(email);
  if(existingToken){
    await db.delete(verificationToken).where(eq(verificationToken.id, existingToken.id))
  }
  
  const newVerificationToken = await db.insert(verificationToken).values({email, token, expires})
  return newVerificationToken;
}