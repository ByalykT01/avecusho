import "server-only";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { cart, cartItems, items, users } from "./db/schema";
import { and, eq } from "drizzle-orm";
import type { NewItemProps, UserDataProps } from "~/lib/definitions";

export async function getItems() {
  const items = await db.query.items.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return items;
}

export async function getBoughtItems(userId: string) {
  const items = await db.query.items.findMany({
    where: (model, {eq}) => eq(model.userId, userId)
  })
  
  return items;
}

export async function getOneItem(id: number) {
  const item = await db.query.items.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!item) throw new Error("Item not found");

  return item;
}

export async function getCartByUserId(userId: string) {
  const userCart = await db.query.cart.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  return userCart;
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
  const itemFromCart = await db.query.items.findFirst({
    where: (model, { eq }) => eq(model.id, itemId),
  });

  return itemFromCart;
}

export async function deleteItemFromCart(itemId: number, userId: string) {
  const existingCart = await getCartByUserId(userId);
  if (!existingCart) {
    throw new Error("Nothing to delete! User has no cart!");
  }
  const cartId = existingCart?.id;

  const foundCart = await getCartItems(userId);
  if (!foundCart) {
    throw new Error("Nothing to delete! User has no items in his cart!");
  }

  const deletedItemFromCart = await db
    .delete(cartItems)
    .where(and(eq(cartItems.itemId, itemId), eq(cartItems.cartId, cartId)))
    .returning({ itemId: cartItems.itemId });

  return deletedItemFromCart;
}

export async function findItemFromCart(itemId: number, userId: string) {
  const foundCart = await getCartByUserId(userId);

  if (!foundCart) {
    throw new Error("No cart found for this user.");
  }

  // Check if the item exists in the database
  const foundItem = await getOneItem(itemId);
  if (!foundItem) {
    throw new Error("Item not found in the database.");
  }

  // Get items in the user's cart and check for the specific item
  const foundCartItems = await getCartItems(userId);
  const foundItemInCart = foundCartItems?.find((e) => e.itemId === itemId);

  return foundItemInCart ?? null; // Return null if the item is not found in the cart
}

export async function addItemToCart(itemId: number, userId: string) {
  const foundCart = await getCartByUserId(userId);
  let cartId = foundCart?.id;

  if (!foundCart) {
    const newCart = await db
      .insert(cart)
      .values({
        userId,
      })
      .returning({
        id: cart.id,
      });

    cartId = newCart[0]?.id;
  }

  const foundItem = await getOneItem(itemId);
  if (!foundItem) {
    throw new Error("Item not found");
  }

  const foundCartItems = await getCartItems(userId);
  foundCartItems?.map((item) => {
    if (item.itemId === itemId) return null;
  });

  const addedItem = await db.insert(cartItems).values({
    itemId: itemId,
    cartId: cartId,
  });

  if (!addedItem) {
    throw new Error("Failed to add item to cart");
  }

  return { message: "Item added to cart successfully!", cartId, itemId };
}

export async function updateItemOnPurchase(itemId: number, userId: string){
  const updateddItem = await db.update(items)
    .set({ userId: userId })
    .where(eq(items.id, itemId));
  
  return updateddItem
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
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
  return user as UserDataProps;
}

export async function updateUser(user: UserDataProps) {
  try {
    await db.update(users).set(user).where(eq(users.id, user.id));
  } catch (e) {
    throw new Error(e as string);
  }
}

export async function createNewItem(body: NewItemProps) {
  try{
    const newItemId = await db.insert(items).values({
      name: body.name,
      url: body.url,
      price: body.price.toFixed(2),
      description: body.description
    }).returning({ insertedId: items.id });
    
    return newItemId
  } catch(e){
    throw new Error(e as string)
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
