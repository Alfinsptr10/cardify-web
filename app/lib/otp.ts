// lib/otp.ts
//
// Helper murni buat generate & verifikasi kode OTP 6 digit.
// Kode di-hash sebelum disimpan ke Firestore — jadi kalau database bocor,
// orang nggak bisa langsung baca kode OTP siapa aja yang lagi aktif.

import { createHash, randomInt } from "crypto";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 60;

/** Generate kode OTP 6 digit acak, misal "482913" */
export function generateOtp(): string {
  let code = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += randomInt(0, 10).toString();
  }
  return code;
}

/** Hash kode OTP pakai SHA-256 sebelum disimpan ke database */
export function hashOtp(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

/** Bandingin kode yang diinput user vs hash yang tersimpan */
export function verifyOtpHash(inputCode: string, storedHash: string): boolean {
  return hashOtp(inputCode) === storedHash;
}

/** Timestamp kadaluarsa (Date), dipanggil pas generate OTP baru */
export function getOtpExpiry(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

/** Cek apakah OTP udah kadaluarsa */
export function isOtpExpired(expiresAt: Date | number): boolean {
  const expiryTime = expiresAt instanceof Date ? expiresAt.getTime() : expiresAt;
  return Date.now() > expiryTime;
}

/** Cek apakah user boleh minta kirim ulang OTP (anti-spam) */
export function canResendOtp(lastSentAt: Date | number | null): boolean {
  if (!lastSentAt) return true;
  const lastSentTime = lastSentAt instanceof Date ? lastSentAt.getTime() : lastSentAt;
  return Date.now() - lastSentTime > RESEND_COOLDOWN_SECONDS * 1000;
}

export { OTP_LENGTH, OTP_EXPIRY_MINUTES, RESEND_COOLDOWN_SECONDS };