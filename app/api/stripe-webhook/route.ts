import { NextResponse } from "next/server";

// Handler sementara agar build tidak error
export async function POST(request: Request) {
  try {
    // Logika webhook Stripe akan ada di sini nanti
    return NextResponse.json({ message: "Stripe Webhook endpoint active" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}