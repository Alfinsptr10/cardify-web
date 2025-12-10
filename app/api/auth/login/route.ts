import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Validasi Input
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    // 2. Cari user di Database
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Email tidak ditemukan/belum terdaftar" }, { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // 3. Cek Password (Bcrypt)
    // Pastikan user ini login manual (punya password), bukan user Google
    if (!userData.password) {
        return NextResponse.json({ error: "Akun ini terdaftar via Google. Silakan login dengan tombol Google." }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Password salah!" }, { status: 401 });
    }

    // 4. Login Sukses
    return NextResponse.json({ 
        message: "Login berhasil", 
        user: { name: userData.name, email: userData.email },
        success: true 
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}