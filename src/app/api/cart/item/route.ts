import { type NextRequest, NextResponse } from "next/server";
import { getItemFromCart } from "~/server/queries";

interface RequestBody {
  itemId: number;
}

export async function POST(req: NextRequest) {
  try {
    const { itemId } = (await req.json()) as RequestBody;

    const cartItem = await getItemFromCart(itemId);

    if (cartItem) {
      return NextResponse.json(cartItem, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 },
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
