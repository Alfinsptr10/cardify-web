"use server";

import { getServerSession } from "next-auth"; // atau method auth yang kamu pakai
// import db atau prisma kamu di sini

export async function saveUserCard(cardData: {
  title: string;
  template: string;
  bg: string;
  status: string;
}) {
  try {
    // 1. Cek sesi login server
    const session = await getServerSession(); // sesuaikan dengan auth setup kamu

    // Jika belum login, return status error, JANGAN pakai alert()
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized: Silakan login terlebih dahulu." };
    }

    const userEmail = session.user.email;

    // 2. Simpan ke database (contoh menggunakan Prisma / MongoDB / dll)
    /*
    await db.card.create({
      data: {
        title: cardData.title,
        template: cardData.template,
        bg: cardData.bg,
        status: cardData.status,
        userEmail: userEmail,
      }
    });
    */

    return { success: true, message: "Kartu berhasil disimpan!" };
  } catch (error) {
    console.error("Gagal menyimpan kartu:", error);
    return { success: false, message: "Terjadi kesalahan pada server." };
  }
}