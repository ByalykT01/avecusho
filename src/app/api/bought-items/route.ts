import { type NextRequest, NextResponse } from "next/server";
import { getBoughtItems } from "~/server/queries";

interface RequestBody {
  userId: string;
}

export async function POST(req: NextRequest) {
  const { userId } = (await req.json()) as RequestBody;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const boughtItems = await getBoughtItems(userId);
    return NextResponse.json(boughtItems, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
