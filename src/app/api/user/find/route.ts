import { type NextRequest, NextResponse } from "next/server";
import { getUserWithDetails } from "~/server/queries";

interface UserProps {
  userId: string;
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as UserProps;

    const foundUserInfo = await getUserWithDetails(data.userId);

    return NextResponse.json(foundUserInfo, { status: 200 });
  } catch (e) {
    console.error("Error fetching user:", e);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}
