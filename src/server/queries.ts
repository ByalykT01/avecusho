import "server-only";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";

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

export async function getCartItems(userId: string) {
  const userCart = await db.query.cart.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  if (!userCart) {
    return null;
  }

  const cartId = userCart.id;

  const cartItems = await db.query.cartItems.findMany({
    where: (model, { eq }) => eq(model.cartId, cartId),
    orderBy: (model, { desc }) => desc(model.addedAt),
  });

  return cartItems;
}

export async function getItemFromCart(itemId: number) {
  const ItemFromCart = await db.query.items.findFirst({
    where: (model, { eq }) => eq(model.id, itemId),
  });

  return ItemFromCart;
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

export async function saltAndHashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePasswords(
  plainTextPassword: string | null,
  hashedPassword: string,
): Promise<boolean> {
  if (plainTextPassword)
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  return false;
}

export async function getUserFromDb(email: string, hashedPassword: string) {
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.email, email),
  });

  // Verify hashed password if user is found
  if (user && (await comparePasswords(user.password, hashedPassword))) {
    return user;
  }

  return null;
}
