import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github"; // 1. Pastikan GitHub diimport
import { db } from "@/app/lib/firebase"; 
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // 2. Cek apakah loginnya pakai Google ATAU GitHub
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const { name, email, image } = user;
          
          // Guard clause: Pastikan email ada
          if (!email) {
             console.error("Email tidak ditemukan dari provider:", account.provider);
             return false; // Tolak login jika provider tidak kasih email
          }

          // Cek apakah user sudah ada di database
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            // Jika belum ada, SIMPAN KE DATABASE
            await addDoc(usersRef, {
              name: name || "Pengguna Baru", // Fallback jika nama kosong
              email: email,
              image: image,
              createdAt: new Date().toISOString(),
              role: "user",
              provider: account.provider // Simpan info login pakai apa (google/github)
            });
            console.log(`User ${account.provider} baru berhasil disimpan ke Firestore!`);
          } else {
            console.log(`User ${account.provider} sudah terdaftar, login sukses.`);
          }
          
          return true; // Lanjut login
        } catch (error) {
          console.error("Gagal menyimpan user ke Firestore:", error);
          return false; // Batalkan login jika error database
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: true,
});

export { handler as GET, handler as POST };