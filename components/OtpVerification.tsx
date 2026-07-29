"use client";

// components/OtpVerification.tsx
//
// Komponen reusable buat input kode OTP 6 digit. Dipake di 2 tempat:
// 1. Halaman Login (setelah password cocok, kalau user punya 2FA aktif)
// 2. Halaman Preferences (pas user pertama kali ngaktifin Email OTP 2FA)
//
// Contoh pemakaian:
// <OtpVerification
//    email={email}
//    purpose="login"
//    onVerified={() => signIn("credentials", { email, password, verified2fa: "true" })}
//    onCancel={() => setShowOtpStep(false)}
// />

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, ArrowLeft, RefreshCw } from "lucide-react";

interface OtpVerificationProps {
  email: string;
  purpose: "login" | "enable";
  onVerified: () => void;
  onCancel: () => void;
}

export default function OtpVerification({ email, purpose, onVerified, onCancel }: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Kirim OTP pertama kali pas komponen ini muncul
  useEffect(() => {
    sendCode();
    inputRefs.current[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendCode = async () => {
    setIsResending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send code");
      setCooldown(60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // cuma terima angka
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-submit begitu 6 digit lengkap
    if (value && index === 5 && next.every((d) => d !== "")) {
      handleVerify(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setDigits(next);
    if (pasted.length === 6) handleVerify(pasted);
  };

  const handleVerify = async (code?: string) => {
    const fullCode = code || digits.join("");
    if (fullCode.length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid code");
      onVerified();
    } catch (err: any) {
      setError(err.message);
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[380px] mx-auto"
    >
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-stone-800 uppercase tracking-widest mb-6 transition-colors"
      >
        <ArrowLeft size={12} /> Back
      </button>

      <div className="w-14 h-14 rounded-2xl bg-[#F6C445] border-2 border-[#1C1917] shadow-[3px_3px_0_0_#1C1917] flex items-center justify-center text-[#1C1917] mb-5">
        <Mail size={26} />
      </div>

      <h1 className="text-3xl text-[#111111] font-boldonse font-black italic mb-2" style={{ letterSpacing: "-0.01em" }}>
        Check your email
      </h1>
      <p className="text-stone-500 text-sm leading-relaxed mb-8">
        We sent a 6-digit code to <span className="font-bold text-stone-800">{email}</span>. Enter it below to continue.
      </p>

      <div className="flex gap-2 justify-between mb-4" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={isVerifying}
            className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all bg-[#FDFBF3] text-[#1C1917] disabled:opacity-60 ${
              error ? "border-red-300 focus:border-red-400" : "border-stone-200 focus:border-[#1C1917] focus:ring-4 focus:ring-[#F6C445]/30"
            }`}
          />
        ))}
      </div>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-red-500 mb-4">
          {error}
        </motion.p>
      )}

      <button
        onClick={() => handleVerify()}
        disabled={isVerifying || digits.some((d) => !d)}
        className="w-full py-3.5 rounded-xl bg-[#1C1917] text-[#FDFBF3] font-bold text-sm border-2 border-[#1C1917] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#F6C445] active:translate-y-0 active:shadow-none transition-all disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 mb-4"
      >
        {isVerifying ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : "Verify Code"}
      </button>

      <button
        onClick={sendCode}
        disabled={cooldown > 0 || isResending}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#1C1917] disabled:opacity-50 disabled:hover:text-stone-500 transition-colors"
      >
        {isResending ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <RefreshCw size={12} />
        )}
        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
      </button>
    </motion.div>
  );
}