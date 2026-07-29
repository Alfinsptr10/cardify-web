// app/api/auth/verify-otp/route.ts
//
// Body: { email: string, code: string }
//
// Kalau valid, endpoint ini cuma bilang "OK" — dia TIDAK bikin session next-auth.
// Di halaman Login, setelah dapet response OK dari sini, baru lo panggil
// signIn("credentials", { email, password, verified2fa: true }) versi next-auth-nya.
// Ini best practice: verify-otp cuma jadi "gerbang", session tetap dikontrol next-auth.

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { verifyOtpHash, isOtpExpired } from "@/app/lib/otp";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ message: "Email and code are required" }, { status: 400 });
    }

    const otpRef = adminDb.collection("otp_codes").doc(email.toLowerCase());
    const snap = await otpRef.get();

    if (!snap.exists) {
      return NextResponse.json({ message: "No OTP request found. Please request a new code." }, { status: 400 });
    }

    const data = snap.data()!;

    // Kelindungan brute-force: max 5x percobaan salah per kode
    if (data.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { message: "Too many failed attempts. Please request a new code." },
        { status: 429 }
      );
    }

    const expiresAt = data.expiresAt?.toDate?.() ?? new Date(data.expiresAt);
    if (isOtpExpired(expiresAt)) {
      return NextResponse.json({ message: "Code has expired. Please request a new one." }, { status: 400 });
    }

    const isValid = verifyOtpHash(code, data.hashedCode);

    if (!isValid) {
      await otpRef.update({ attempts: (data.attempts || 0) + 1 });
      return NextResponse.json({ message: "Invalid code. Please try again." }, { status: 400 });
    }

    // Kode benar — hapus dokumennya biar nggak bisa dipakai ulang (one-time use)
    await otpRef.delete();

    // Kalau ini konteks "enable 2FA" (bukan login), sekalian set flag di user doc
    if (data.purpose === "enable") {
      const usersQuery = await adminDb.collection("users").where("email", "==", email.toLowerCase()).limit(1).get();
      if (!usersQuery.empty) {
        await usersQuery.docs[0].ref.update({ twoFactorEnabled: true, twoFactorMethod: "email" });
      }
    }

    return NextResponse.json({ message: "OTP verified successfully", verified: true });
  } catch (err) {
    console.error("verify-otp error:", err);
    return NextResponse.json({ message: "Failed to verify OTP" }, { status: 500 });
  }
}