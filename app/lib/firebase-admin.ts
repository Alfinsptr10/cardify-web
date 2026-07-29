// lib/firebase-admin.ts
//
// Firebase Admin SDK — dipakai KHUSUS di server (API routes), bukan di client.
// Ini beda dari Firebase client SDK yang udah dipakai di halaman Web Story / Scrapbook lo.
// Admin SDK butuh Service Account Key, bukan config biasa (apiKey dkk).
//
// CARA DAPAT SERVICE ACCOUNT KEY:
// 1. Buka Firebase Console -> Project Settings -> Service Accounts
// 2. Klik "Generate New Private Key" -> download file JSON-nya
// 3. JANGAN commit file JSON itu ke git. Ambil 3 value ini dari isinya:
//    - project_id
//    - client_email
//    - private_key
// 4. Taruh di .env.local:
//    FIREBASE_PROJECT_ID=xxxx
//    FIREBASE_CLIENT_EMAIL=xxxx@xxxx.iam.gserviceaccount.com
//    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxxx\n-----END PRIVATE KEY-----\n"
//    (private key-nya ada \n literal, biarin apa adanya, nanti di-replace di kode bawah)

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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