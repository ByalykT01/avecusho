import {  NextResponse } from "next/server";
import { getItems } from "~/server/queries";

export async function GET() {
  try {
    // An empty store is a successful query yielding an empty set, not a
    // missing resource: always respond 200 with the (possibly empty) list.
    const items = await getItems();

    return NextResponse.json(items, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
