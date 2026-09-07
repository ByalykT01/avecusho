

import { type NextRequest, NextResponse } from "next/server";
import { updateItemOnPurchase } from "~/server/queries";

interface RequestBody {
  itemId: number;
  userId: string
}

export async function POST(req: NextRequest) {
  try {
    const { itemId, userId } = (await req.json()) as RequestBody;

    const result = await updateItemOnPurchase(itemId, userId);

    if (!result.success) {
      return NextResponse.json(
        { message: "Item not found in db" },
        { status: 404 },
      );
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
