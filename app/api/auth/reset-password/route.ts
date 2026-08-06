import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { verifyOtpHash } from "@/app/lib/otp";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { message: "Email, code, and new password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // 1. Ambil data OTP dari collection "otp_codes"
    const otpRef = adminDb.collection("otp_codes").doc(normalizedEmail);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      return NextResponse.json(
        { message: "Invalid or expired reset code." },
        { status: 400 }
      );
    }

    const otpData = otpDoc.data()!;
    
    // 2. Cek apakah tujuan OTP memang untuk reset-password
    if (otpData.purpose && otpData.purpose !== "reset-password") {
      return NextResponse.json(
        { message: "Invalid request type." },
        { status: 400 }
      );
    }

    // 3. Cek batas kedaluwarsa (expiresAt)
    const expiresAt = otpData.expiresAt?.toDate?.() || new Date(otpData.expiresAt);
    if (new Date() > expiresAt) {
      return NextResponse.json(
        { message: "Reset code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 4. Cek batas maksimal salah input (Rate limit attempts, misal max 5 kali)
    if (otpData.attempts >= 5) {
      await otpRef.delete();
      return NextResponse.json(
        { message: "Too many failed attempts. Please request a new code." },
        { status: 429 }
      );
    }

    // 5. Verifikasi kode OTP dengan hash-nya
    const isCodeValid = verifyOtpHash(code, otpData.hashedCode);

    if (!isCodeValid) {
      await otpRef.update({ attempts: (otpData.attempts || 0) + 1 });
      return NextResponse.json(
        { message: "Incorrect verification code." },
        { status: 400 }
      );
    }

    // 6. Cek user di collection Firestore (sesuaikan nama collection kamu, misal "users")
    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where("email", "==", normalizedEmail).get();

    if (snapshot.empty) {
      return NextResponse.json(
        { message: "User account not found in database." },
        { status: 404 }
      );
    }

    // 7. Hash password baru dengan bcrypt agar sesuai dengan struktur database kamu
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 8. Update password di dokumen user Firestore
    const userDocRef = snapshot.docs[0].ref;
    await userDocRef.update({
      password: hashedPassword,
    });

    // 9. Hapus dokumen OTP agar tidak bisa dipakai ulang (One-time use)
    await otpRef.delete();

    return NextResponse.json(
      { message: "Password has been reset successfully." },
      { status: 200 }
    );

  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}