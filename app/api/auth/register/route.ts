import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // cek email sudah ada
    const q = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await addDoc(collection(db, "users"), {
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      createdAt: new Date(),
    });

    // 🔥 WAJIB RETURN JSON
    return NextResponse.json(
      { message: "Register berhasil" },
      { status: 201 }
    );

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    // 🔥 JANGAN KOSONG
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
