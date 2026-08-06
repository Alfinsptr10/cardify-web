// lib/firebase-admin.ts
//
// Firebase Admin SDK — dipakai KHUSUS di server (API routes), bukan di client.
// Ini beda dari Firebase client SDK yang udah dipakai di halaman Web Story / Scrapbook lo.
// Admin SDK butuh Service Account Key, bukan config biasa (apiKey dkk).

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp: App;

if (getApps().length === 0) {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // .env menyimpan \n sebagai teks literal, ini yang mengubahnya balik jadi newline asli
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
} else {
  adminApp = getApps()[0];
}

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);