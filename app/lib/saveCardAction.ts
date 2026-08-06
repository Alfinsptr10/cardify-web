import { getSession } from "next-auth/react"; // 1. Import helper session NextAuth

type SaveCardParams = {
  title?: string;
  template: string;
  bg?: string;
  status?: string;
};

export async function saveUserCard({ title, template, bg, status = "saved" }: SaveCardParams) {
  try {
    // 2. Ambil data session aktif dari NextAuth secara otomatis
    const session = await getSession();
    const userEmail = session?.user?.email; 
    
    if (!userEmail) {
      alert("Silakan login terlebih dahulu untuk menyimpan kartu!");
      return;
    }

    const res = await fetch("/api/user/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail, // Email dari akun yang sedang aktif login
        title: title || "Untitled Card",
        template: template,
        bg: bg || "bg-[#F6C445]",
        status: status,
      }),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan ke database");
    }
  } catch (err) {
    console.error("Error saving action:", err);
  }
}