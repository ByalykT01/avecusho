import { NextResponse } from "next/server";
import { addItemToCart, getCartItems } from "~/server/queries";

interface RequestBody {
  itemId: number;
  userId: string;
}

export async function POST(req: Request) {
  try {
    const { itemId, userId } = (await req.json()) as RequestBody;

    if (!itemId || !userId) {
      return NextResponse.json(
        { error: "Missing itemId or userId" },
        { status: 400 }
      );
    }

    // Fetch the cart items for the given user
    const cartItems = await getCartItems(userId);

    // Check if the item is already in the cart
    const existingItem = cartItems?.find((cartItem) => cartItem.itemId === itemId);

    if (existingItem) {
      return NextResponse.json(
        { message: "Item is already in the cart" },
        { status: 200 }
      );
    }

    const result = await addItemToCart(itemId, userId);
    return NextResponse.json({ result }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
