import "server-only";
import { db } from "~/server/db";

export async function getItems() {
  const items = await db.query.items.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return items;
}

export async function getOneItem(id: number) {
  const item = await db.query.items.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!item) throw new Error("Item not found");

  return item;
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.email, email),
    });
    return user;
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.id, id),
    });
    return user;
  } catch {
    return null;
  }
}
