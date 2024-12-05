import { auth } from "auth"; // Add this import at the top
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { dateRequests } from "~/server/db/schema";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    const newDateRequest = await db.insert(dateRequests).values({
      userId: session.user.id,
      status: "pending",
      location: body.location,
      timePreference: body.timePreference,
      mood: body.mood,
      gift: body.gift,
      stNicholasGift: body.stNicholasGift || null,
      dessert: body.dessert || null,
      endingActivity: body.endingActivity || null,
    }).returning();
    
    return NextResponse.json(newDateRequest[0]);
  } catch (error) {
    console.error("Error creating date request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}