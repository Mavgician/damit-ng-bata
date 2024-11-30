import { NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { amount } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'php',
      automatic_payment_methods: { enabled: true }
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 })

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }
}