import { type NextRequest, NextResponse } from "next/server";
import { getCartItems } from "~/server/queries";

interface RequestBody {
  userId: string;
}

export async function POST(req: NextRequest) {
  const { userId } = (await req.json()) as RequestBody;

  try {
    const cartItems = await getCartItems(userId);
    return NextResponse.json(cartItems, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
