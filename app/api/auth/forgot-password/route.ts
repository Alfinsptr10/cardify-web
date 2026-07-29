// app/api/auth/send-otp/route.ts
//
// Dipanggil dari 2 tempat:
// 1. Halaman Login, setelah email+password user cocok DAN twoFactorEnabled === true
// 2. Halaman Preferences, pas user pertama kali ngaktifin "Email OTP 2FA"
//
// Body: { email: string, purpose: "login" | "enable" }

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { sendOtpEmail } from "@/app/lib/email";
import { generateOtp, hashOtp, getOtpExpiry, canResendOtp } from "@/app/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Simpan OTP di collection terpisah "otp_codes", bukan langsung di document user.
    // Key dokumennya = email, jadi gampang di-lookup pas verify.
    const otpRef = adminDb.collection("otp_codes").doc(email.toLowerCase());
    const existing = await otpRef.get();

    // Anti-spam: cegah user nge-klik "resend" berkali-kali dalam waktu singkat
    if (existing.exists) {
      const lastSentAt = existing.data()?.lastSentAt?.toDate?.() ?? null;
      if (!canResendOtp(lastSentAt)) {
        return NextResponse.json(
          { message: "Please wait a moment before requesting another code." },
          { status: 429 }
        );
      }
    }

    const code = generateOtp();
    const hashedCode = hashOtp(code);
    const expiresAt = getOtpExpiry();

    await otpRef.set({
      email: email.toLowerCase(),
      hashedCode,
      expiresAt,
      lastSentAt: new Date(),
      purpose: purpose || "reset-password",
      attempts: 0, // dipakai buat rate-limit percobaan verify yang salah
      verified: false,
    });

    await sendOtpEmail(email, code);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}