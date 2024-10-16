import { type NextRequest, NextResponse } from "next/server";
import { getOneItem } from "~/server/queries";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    const products = await stripe.products.list();
    const existingProduct = products.data.find(
      (product) => product.name === foundItem.name,
    );

    if (existingProduct) {
      // If the product already exists, return it
      return NextResponse.json(existingProduct, { status: 200 });
    }

    // If the product doesn't exist, create a new one
    const itemNumPriceInCents: number = +foundItem.price * 100;
    const newProduct = await stripe.products.create({
      name: foundItem.name,
      description: foundItem.description,
      images: [foundItem.url],
      default_price_data: {
        currency: "pln",
        unit_amount: itemNumPriceInCents,
      },
    });

    return NextResponse.json(newProduct, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
