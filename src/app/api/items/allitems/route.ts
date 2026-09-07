import {  NextResponse } from "next/server";
import { getItems } from "~/server/queries";

export async function GET() {
  try {
    const items = await getItems();

    // findMany always resolves to an array, so an empty store must be
    // checked explicitly — a bare falsy check here would be unreachable.
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Item not found in db" },
        { status: 404 },
      );
    }

    return NextResponse.json(items, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
