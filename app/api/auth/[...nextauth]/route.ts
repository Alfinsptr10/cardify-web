import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const handler = NextAuth({
  providers: [
    // ================= GOOGLE =================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    // ================= GITHUB =================
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),

    // ================= EMAIL / PASSWORD =================
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 🔥 PAKAI API LOGIN EMAIL LO YANG SUDAH ADA
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) return null;

        const data = await res.json();

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image || null,
        };
      },
    }),
  ],

  // ================= SESSION =================
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // ================= SIMPAN USER GOOGLE / GITHUB =================
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const { name, email, image } = user;
          if (!email) return false;

          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            await addDoc(usersRef, {
              name: name || "Pengguna Baru",
              email,
              image,
              createdAt: new Date().toISOString(),
              role: "user",
              provider: account.provider,
            });
          }
          return true;
        } catch (error) {
          console.error("Firestore error:", error);
          return false;
        }
      }

      // EMAIL LOGIN → BOLEH LANJUT
      if (account?.provider === "credentials") {
        return true;
      }

      return true;
    },

    // ================= JWT =================
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },

    // ================= SESSION =================
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  debug: true,
});

export { handler as GET, handler as POST };
