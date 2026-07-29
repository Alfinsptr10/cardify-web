"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle,
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

export default function ForgotPasswordPage() {
  // State
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [decorations, setDecorations] = useState<any[]>([]);

  // Efek Samping: Dekorasi Background (pola sama seperti halaman Register)
  useEffect(() => {
    document.title = "Forgot Password - Cardify";

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
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link. Please try again.");
      }

      setIsSent(true);
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
      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-serif-accent { font-family: 'Instrument Serif', serif; }
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
        {/* Chunky pastel blobs */}
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full border-[3px]" style={{ background: YELLOW, borderColor: INK, opacity: 0.55 }} />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full border-[3px]" style={{ background: LILAC, borderColor: INK, opacity: 0.55 }} />
      </div>

      {/* Card */}
      <motion.div
        className="w-full max-w-[440px] rounded-[2rem] border-[3px] relative z-10"
        style={{ background: CREAM, borderColor: INK, boxShadow: `10px 10px 0 0 ${INK}` }}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Sticker */}
        <div
          className="absolute -top-4 -right-4 rotate-6 px-3 py-1.5 rounded-full border-[2.5px] text-[10px] font-black uppercase tracking-widest"
          style={{ background: YELLOW, borderColor: INK, color: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
        >
          Don't panic!
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
            <AnimatePresence mode="wait">
              <motion.div
                key={isSent ? "sent" : "idle"}
                initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: -3 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center border-[3px]"
                style={{
                  background: isSent ? MINT : CORAL,
                  borderColor: INK,
                  color: INK,
                  boxShadow: `4px 4px 0 0 ${INK}`,
                }}
              >
                {isSent ? <CheckCircle size={30} strokeWidth={2} /> : <Mail size={30} strokeWidth={2} />}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {!isSent ? (
            <>
              <motion.h1 variants={staggerItem} className="text-4xl mb-2 font-boldonse font-black italic" style={{ letterSpacing: "-0.02em", color: INK }}>
                Forgot Password?
              </motion.h1>
              <motion.p variants={staggerItem} className="text-[13px] font-bold font-sans mb-3 opacity-50">パスワードをお忘れですか</motion.p>
              <motion.p variants={staggerItem} className="text-sm leading-relaxed max-w-[300px] mx-auto font-medium opacity-70">
                No worries. Enter the email tied to your account and we'll send you a verification code to reset your password.
              </motion.p>
            </>
          ) : (
            <>
              <motion.h1 variants={staggerItem} className="text-4xl mb-2 font-boldonse font-black italic" style={{ letterSpacing: "-0.02em", color: INK }}>
                Check Your Inbox
              </motion.h1>
              <motion.p variants={staggerItem} className="text-[13px] font-bold font-sans mb-3 opacity-50">メールをご確認ください</motion.p>
              <motion.p variants={staggerItem} className="text-sm leading-relaxed max-w-[300px] mx-auto font-medium opacity-70">
                We've sent a verification code to <span className="font-black" style={{ color: INK }}>{email}</span>.
              </motion.p>
            </>
          )}
        </motion.div>

        {/* Body */}
        <div className="px-8 pb-10">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] ml-1 opacity-60">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    type="email"
                    required
                    placeholder="hello@cardify.id"
                    className="w-full rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold outline-none border-[2.5px] transition-all placeholder:opacity-40 focus:-translate-y-0.5"
                    style={{ background: "#fff", borderColor: INK, color: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Sending Link...</> : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div
                className="p-4 rounded-2xl border-[2.5px] text-center"
                style={{ background: "#fff", borderColor: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
              >
                <p className="text-xs font-semibold leading-relaxed opacity-70">
                  Didn't get the email? Check your spam folder, or
                </p>
                <button
                  onClick={() => { setIsSent(false); setErrorMsg(null); }}
                  className="text-xs font-black hover:underline mt-1"
                  style={{ color: INK }}
                >
                  try a different email address
                </button>
              </div>

              <a
                href="/login"
                className="block w-full text-center py-4 rounded-full font-black text-sm uppercase tracking-widest border-[3px] hover:-translate-y-1 active:translate-y-0 transition-all"
                style={{ background: INK, color: CREAM, borderColor: INK, boxShadow: `5px 5px 0 0 ${MINT}` }}
              >
                Back to Login
              </a>
            </div>
          )}

          <p className="text-center text-xs mt-8 font-bold opacity-60">
            Remembered your password?{" "}
            <a href="/login" className="font-black hover:underline cursor-pointer" style={{ color: INK }}>Log in</a>
          </p>
        </div>
      </motion.div>

      <div className="absolute bottom-6 text-[10px] font-black tracking-widest opacity-50 uppercase">© 2025 Cardify Inc.</div>
    </div>
  );
}
