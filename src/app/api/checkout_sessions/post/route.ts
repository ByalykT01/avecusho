import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Assuming you're sending JSON data

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
      custom_text: {shipping_address: {message: ''}} 
    });

    return NextResponse.json({ clientSecret: session.client_secret }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}