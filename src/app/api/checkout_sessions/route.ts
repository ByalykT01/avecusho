import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price: "price_1Q9BL9Kx0KQIze9gi2rKNcg8",
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${req.headers.get("origin")}/return?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: true },
    });

    return NextResponse.json({ clientSecret: session.client_secret }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: err.statusCode as number || 500 });
  }
}

// Handle GET requests
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id'); // Assuming you want to retrieve the session ID from query params

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
