import { db } from "~/server/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.verificationToken.findFirst({
      where: (model, { eq }) => eq(model.token, token),
    })
    
    return verificationToken
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationToken.findFirst({
      where: (model, { eq }) => eq(model.email, email),
    })
    
    return verificationToken
  } catch {
    return null;
  }
};
