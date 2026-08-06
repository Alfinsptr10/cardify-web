import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";

// 1. Fungsi untuk MENGAMBIL data kartu (Dashboard)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const cardsRef = adminDb.collection("cards");
    const snapshot = await cardsRef.where("email", "==", normalizedEmail).get();

    const allCards: any[] = [];
    snapshot.forEach((doc) => {
      allCards.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    const saved = allCards.filter((card) => card.status !== "draft");
    const drafts = allCards.filter((card) => card.status === "draft");

    return NextResponse.json({ saved, drafts }, { status: 200 });
  } catch (err) {
    console.error("Error fetching user cards:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// 2. Fungsi untuk MENYIMPAN kartu baru (Saat tombol Download diklik)
export async function POST(req: NextRequest) {
  try {
    const { email, title, template, bg, status } = await req.json();

    if (!email || !title) {
      return NextResponse.json({ message: "Email and title are required" }, { status: 400 });
    }

    const newCard = {
      email: email.toLowerCase(),
      title,
      template: template || "Custom Template",
      bg: bg || "bg-[#F6C445]",
      status: status || "saved",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdAt: new Date(),
    };

    const docRef = await adminDb.collection("cards").add(newCard);

    return NextResponse.json({ message: "Card saved successfully", id: docRef.id }, { status: 201 });
  } catch (err) {
    console.error("Error saving card:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}