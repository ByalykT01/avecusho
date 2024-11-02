import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateItemOnPurchase } from "~/server/queries";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface RequestBody {
  default_price: string;
  itemId: number;
  userId: string;
  returnPath?: string; // Add this to allow custom return path
}

export async function POST(req: NextRequest) {
  const { default_price, itemId, userId, returnPath } = (await req.json()) as RequestBody;
  const origin = req.headers.get("origin");
  
  // Construct the return URL using the origin and either the provided returnPath or the referrer
  const referrer = req.headers.get("referer");
  const baseReturnPath = returnPath ?? (referrer ? new URL(referrer).pathname : "");
  const returnUrl = `${origin}${baseReturnPath}/return?session_id={CHECKOUT_SESSION_ID}`;
  
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price: default_price,
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { itemId: itemId },
      return_url: returnUrl,
      automatic_tax: { enabled: true },
    });
    // const updatedItem = await updateItemOnPurchase(itemId, userId);
    return NextResponse.json({ clientSecret: session.client_secret }, { status: 200 });
    
  } catch (err) {
    return NextResponse.json({ err }, { status: err.statusCode as number || 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: err.statusCode as number || 500 });
  }
}