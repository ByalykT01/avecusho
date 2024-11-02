

import { type NextRequest, NextResponse } from "next/server";
import { updateItemOnPurchase } from "~/server/queries";

interface RequestBody {
  itemId: number;
  userId: string
}

export async function POST(req: NextRequest) {
  try {
    const { itemId, userId } = (await req.json()) as RequestBody;

    const updatedItem = await updateItemOnPurchase(itemId, userId);

    
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
