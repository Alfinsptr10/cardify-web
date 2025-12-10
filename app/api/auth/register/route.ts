import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase"; // Import koneksi database yang sudah kita buat
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Validasi Input: Pastikan semua data diisi
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 2. Cek apakah email sudah terdaftar di Firebase
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json({ error: "Email sudah terdaftar! Silakan login." }, { status: 400 });
    }

    // 3. Hash Password (Acak password agar aman)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan User Baru ke Firestore
    const newUser = {
      name,
      email,
      password: hashedPassword, // Simpan password yang sudah diacak
      createdAt: new Date().toISOString(),
      role: "user",
      image: null // Foto profil kosong dulu
    };

    await addDoc(usersRef, newUser);

    return NextResponse.json({ message: "Pendaftaran berhasil", success: true }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}