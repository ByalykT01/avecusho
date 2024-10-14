import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { UploadItemSchema } from "~/schemas";
import { createNewItem } from "~/server/queries";

export async function POST(req: NextRequest) {
  try {
    const body = UploadItemSchema.parse(await req.json());

    const { name, price, description, url } = body;

    const newItemId = await createNewItem(body)
    
    
    return NextResponse.json({ message: `success, new item - ${newItemId[0]?.insertedId}` }, { status: 200 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ errors: e.errors }, { status: 400 });
    }

    return NextResponse.json({ e }, { status: 500 });
  }
}
