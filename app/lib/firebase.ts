// Import fungsi yang dibutuhkan dari SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyARXc6uS0PgVrEs3yegd4wtz9OwCJ7Onzg",        // <-- Tempel dari Firebase Console
  authDomain: "ccardify-app-f6ea0.firebaseapp.com",
  projectId: "cardify-app-f6ea0",
  storageBucket: "cardify-app-f6ea0.firebasestorage.app",
  messagingSenderId: "1046962577236",
  appId: "1:1046962577236:web:a9df22e65b65947d3d72c1",
  measurementId: "G-MF7DMEYKL9"
};

// Inisialisasi Firebase (Mencegah inisialisasi ganda saat hot-reload Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };