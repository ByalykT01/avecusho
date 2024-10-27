import { type NextRequest, NextResponse } from "next/server";
import { getOneItem } from "~/server/queries";

interface RequestBody {
  itemId: number;
}

export async function POST(req: NextRequest) {
  try {
    const { itemId } = (await req.json()) as RequestBody;

    const foundItem = await getOneItem(itemId);

    if (!foundItem) {
      return NextResponse.json(
        { message: "Item not found in db" },
        { status: 404 },
      );
    }

    return NextResponse.json(foundItem, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
