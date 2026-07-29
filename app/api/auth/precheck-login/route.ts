// app/api/auth/precheck-login/route.ts
//
// Dipanggil dari halaman Login SEBELUM signIn("credentials", ...).
// Tujuannya cuma buat 1 hal: cek "apakah password ini benar, dan kalau
// benar, apakah user ini punya 2FA aktif?" — TANPA bikin session next-auth.
//
// Sengaja manggil ulang /api/auth/login yang SAMA PERSIS dipanggil oleh
// authorize() di app/api/auth/[...nextauth]/route.ts — jadi logic
// verifikasi password cuma ada di SATU tempat (nggak duplikat/nggak nebak).

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // STEP 1: verifikasi password lewat endpoint login yang sudah ada —
    // ini persis logic yang dipanggil authorize() di [...nextauth]/route.ts
    const loginRes = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const loginData = await loginRes.json();
    const userEmail = loginData.user?.email || email;

    // STEP 2: password sudah valid -> sekarang cek status 2FA dari Firestore.
    // Query berdasarkan email, sama seperti pola yang dipakai di signIn
    // callback punya NextAuth lo (query(usersRef, where("email", "==", email))).
    const usersQuery = await adminDb
      .collection("users")
      .where("email", "==", userEmail)
      .limit(1)
      .get();

    const twoFactorEnabled = !usersQuery.empty && usersQuery.docs[0].data()?.twoFactorEnabled === true;

    return NextResponse.json({ valid: true, twoFactorEnabled });
  } catch (err) {
    console.error("precheck-login error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}