import { NextResponse } from "next/server";
import { deleteItemFromCart } from "~/server/queries";

interface RequestBody {
  itemId: number;
  userId: string;
}

export async function DELETE(req: Request) {
  try {
    const { itemId, userId } = (await req.json()) as RequestBody;

    if (!itemId || !userId) {
      return NextResponse.json(
        { error: "Missing itemId or userId" },
        { status: 400 },
      );
    }

    const result = await deleteItemFromCart(itemId, userId);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
