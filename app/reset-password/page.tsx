"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft, KeyRound, Mail, Lock, Loader2, CheckCircle, AlertCircle,
  Flower2, Bird, Heart, Sparkles, Cloud, Music
} from "lucide-react";

const INK = "#111111";
const MINT = "#B8E3C9";
const CREAM = "#FFFDF5";
const YELLOW = "#F6C445";
const CORAL = "#F3B8CC";
const LILAC = "#D8C9F2";

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [decorations, setDecorations] = useState<any[]>([]);

  // Dekorasi background acak ala Cardify
  useEffect(() => {
    document.title = "Reset Password - Cardify";

    const items: any[] = [];
    const types = ["flower", "bird", "heart", "sparkle", "cloud", "music"];
    const colors = [
      "text-[#111111]/10", "text-[#F6C445]/60", "text-[#F3B8CC]/70", "text-[#D8C9F2]/70", "text-[#111111]/15",
    ];

    for (let i = 0; i < 25; i++) {
      items.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 20 + Math.random() * 30,
        rotation: Math.random() * 360,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setDecorations(items);
  }, []);

  const renderIcon = (type: string, size: number) => {
    switch (type) {
      case "flower": return <Flower2 size={size} />;
      case "bird": return <Bird size={size} />;
      case "heart": return <Heart size={size} fill="currentColor" />;
      case "sparkle": return <Sparkles size={size} />;
      case "cloud": return <Cloud size={size} fill="currentColor" />;
      case "music": return <Music size={size} />;
      default: return <Flower2 size={size} />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password. Please try again.");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000); // Redirect otomatis ke login setelah 3 detik
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-6 font-sans"
      style={{ background: MINT, color: INK }}
    >
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
          .font-sans { font-family: 'DM Sans', sans-serif; }
      `}} />

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {decorations.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.color} animate-pulse`}
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              transform: `rotate(${item.rotation}deg)`,
              animationDuration: `${item.duration}s`,
            }}
          >
            {renderIcon(item.type, item.size)}
          </div>
        ))}
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full border-[3px]" style={{ background: YELLOW, borderColor: INK, opacity: 0.55 }} />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full border-[3px]" style={{ background: LILAC, borderColor: INK, opacity: 0.55 }} />
      </div>

      {/* Card Wrapper */}
      <motion.div
        className="w-full max-w-[440px] rounded-[2rem] border-[3px] relative z-10"
        style={{ background: CREAM, borderColor: INK, boxShadow: `10px 10px 0 0 ${INK}` }}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className="absolute -top-4 -right-4 rotate-6 px-3 py-1.5 rounded-full border-[2.5px] text-[10px] font-black uppercase tracking-widest"
          style={{ background: YELLOW, borderColor: INK, color: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
        >
          Secure Auth!
        </div>

        {/* Header */}
        <motion.div
          className="px-8 pt-10 pb-6 text-center relative"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={staggerItem} className="absolute top-6 left-6">
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-[2.5px] text-[10px] font-black uppercase tracking-widest cursor-pointer group transition-all hover:-translate-y-0.5"
              style={{ borderColor: INK, background: "#fff", color: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back
            </a>
          </motion.div>

          <motion.div variants={staggerItem} className="flex justify-center mb-5 mt-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center border-[3px]"
              style={{ background: isSuccess ? MINT : YELLOW, borderColor: INK, color: INK, boxShadow: `4px 4px 0 0 ${INK}` }}
            >
              {isSuccess ? <CheckCircle size={30} strokeWidth={2} /> : <KeyRound size={30} strokeWidth={2} />}
            </div>
          </motion.div>

          {!isSuccess ? (
            <>
              <motion.h1 variants={staggerItem} className="text-4xl mb-2 font-boldonse font-black italic tracking-tight" style={{ color: INK }}>
                New Password
              </motion.h1>
              <motion.p variants={staggerItem} className="text-sm leading-relaxed max-w-[300px] mx-auto font-medium opacity-70">
                Enter the 6-digit verification code sent to your email and choose a brand-new password.
              </motion.p>
            </>
          ) : (
            <>
              <motion.h1 variants={staggerItem} className="text-4xl mb-2 font-boldonse font-black italic tracking-tight" style={{ color: INK }}>
                All Done!
              </motion.h1>
              <motion.p variants={staggerItem} className="text-sm leading-relaxed max-w-[300px] mx-auto font-medium opacity-70">
                Your password has been successfully reset. Redirecting you to login...
              </motion.p>
            </>
          )}
        </motion.div>

        {/* Form Body */}
        <div className="px-8 pb-10">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] ml-1 opacity-60">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-3.5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    type="email"
                    required
                    placeholder="hello@cardify.id"
                    className="w-full rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold outline-none border-[2.5px] transition-all placeholder:opacity-40 focus:-translate-y-0.5"
                    style={{ background: "#fff", borderColor: INK, color: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* OTP Code Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] ml-1 opacity-60">6-Digit OTP Code</label>
                <div className="relative group">
                  <KeyRound size={18} className="absolute left-4 top-3.5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    className="w-full rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold tracking-widest outline-none border-[2.5px] transition-all placeholder:opacity-40 focus:-translate-y-0.5"
                    style={{ background: "#fff", borderColor: INK, color: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] ml-1 opacity-60">New Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-3.5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold outline-none border-[2.5px] transition-all placeholder:opacity-40 focus:-translate-y-0.5"
                    style={{ background: "#fff", borderColor: INK, color: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              {errorMsg && (
                <div
                  className="flex items-start gap-2.5 px-4 py-3 rounded-2xl border-[2.5px]"
                  style={{ background: CORAL, borderColor: INK, color: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
                >
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">{errorMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest border-[3px] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                style={{ background: INK, color: CREAM, borderColor: INK, boxShadow: `5px 5px 0 0 ${YELLOW}` }}
              >
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Resetting...</> : "Reset Password"}
              </button>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              <a
                href="/login"
                className="block w-full text-center py-4 rounded-full font-black text-sm uppercase tracking-widest border-[3px] hover:-translate-y-1 active:translate-y-0 transition-all"
                style={{ background: INK, color: CREAM, borderColor: INK, boxShadow: `5px 5px 0 0 ${MINT}` }}
              >
                Go to Login Now
              </a>
            </div>
          )}
        </div>
      </motion.div>

      <div className="absolute bottom-6 text-[10px] font-black tracking-widest opacity-50 uppercase">© 2025 Cardify Inc.</div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}