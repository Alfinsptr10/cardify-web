"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { 
  ArrowLeft, Mail, Loader2, Gift, CheckCircle, AlertCircle, 
  Flower2, Bird, Heart, Sparkles, Cloud, Music
} from "lucide-react";

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem = {
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
      "text-amber-400/20", "text-stone-300/30", "text-orange-200/20", "text-yellow-500/10", "text-stone-400/20",
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
    <div className="min-h-screen w-full bg-[#FDFBF3] text-[#1C1917] flex items-center justify-center relative overflow-hidden p-6 font-sans">

      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F6C445]/30 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D8C9F2]/40 rounded-full blur-[100px] -z-10" />
      </div>

      {/* Card */}
      <motion.div
        className="w-full max-w-[420px] bg-white rounded-[2rem] border-2 border-[#1C1917] shadow-[8px_8px_0_0_#1C1917] relative z-10 overflow-hidden"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        {/* Header */}
        <motion.div
          className="px-8 pt-10 pb-6 text-center relative"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={staggerItem} className="absolute top-6 left-6">
            <a href="/login" className="inline-flex items-center gap-2 text-[10px] font-bold text-stone-400 hover:text-stone-800 transition-colors uppercase tracking-widest cursor-pointer group">
               <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back
            </a>
          </motion.div>

          <motion.div variants={staggerItem} className="flex justify-center mb-5 mt-2">
             <AnimatePresence mode="wait">
               <motion.div
                 key={isSent ? "sent" : "idle"}
                 initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
                 animate={{ scale: 1, opacity: 1, rotate: 0 }}
                 transition={{ duration: 0.4, ease: "easeOut" }}
                 className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-[#1C1917] shadow-sm text-[#1C1917] transition-colors ${isSent ? "bg-[#B8E3C9]" : "bg-[#F6C445]"}`}
               >
                  {isSent ? <CheckCircle size={28} strokeWidth={1.5} /> : <Mail size={28} strokeWidth={1.5} />}
               </motion.div>
             </AnimatePresence>
          </motion.div>

          {!isSent ? (
            <>
              <motion.h1 variants={staggerItem} className="text-4xl text-[#111111] mb-2 font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>
                Forgot Password?
              </motion.h1>
              <motion.p variants={staggerItem} className="text-[13px] font-bold font-sans text-[#1C1917]/50 mb-3">パスワードをお忘れですか</motion.p>
              <motion.p variants={staggerItem} className="text-stone-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                No worries. Enter the email tied to your account and we'll send you a link to reset it.
              </motion.p>
            </>
          ) : (
            <>
              <motion.h1 variants={staggerItem} className="text-4xl text-[#111111] mb-2 font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>
                Check Your Inbox
              </motion.h1>
              <motion.p variants={staggerItem} className="text-[13px] font-bold font-sans text-[#1C1917]/50 mb-3">メールをご確認ください</motion.p>
              <motion.p variants={staggerItem} className="text-stone-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                We've sent a password reset link to <span className="font-bold text-stone-800">{email}</span>.
              </motion.p>
            </>
          )}
        </motion.div>

        {/* Body */}
        <div className="px-8 pb-10">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-[#1C1917] transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="hello@cardify.id"
                    className="w-full bg-[#FDFBF3] border-2 border-stone-200 rounded-xl py-3 pl-12 pr-4 text-sm text-stone-800 outline-none focus:bg-white focus:border-[#1C1917] focus:ring-4 focus:ring-[#F6C445]/30 transition-all placeholder:text-stone-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[#F3B8CC]/30 border-2 border-[#1C1917]/10 text-[#1C1917]">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-relaxed">{errorMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1C1917] text-[#FDFBF3] py-3.5 rounded-xl font-bold text-sm border-2 border-[#1C1917] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#F6C445] active:translate-y-0 active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Sending Link...</> : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#FDFBF3] border-2 border-stone-200 text-center">
                <p className="text-xs text-stone-500 leading-relaxed">
                  Didn't get the email? Check your spam folder, or
                </p>
                <button
                  onClick={() => { setIsSent(false); setErrorMsg(null); }}
                  className="text-xs font-bold text-[#1C1917] hover:underline mt-1"
                >
                  try a different email address
                </button>
              </div>

              <a
                href="/login"
                className="block w-full text-center py-3.5 rounded-xl bg-[#1C1917] text-[#FDFBF3] font-bold border-2 border-[#1C1917] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#B8E3C9] active:translate-y-0 active:shadow-none transition-all"
              >
                Back to Login
              </a>
            </div>
          )}

          <p className="text-center text-xs text-stone-400 mt-8 font-medium">
            Remembered your password? <a href="/login" className="text-[#1C1917] font-bold hover:underline cursor-pointer transition-colors">Log in</a>
          </p>
        </div>
      </motion.div>

      <div className="absolute bottom-6 text-[10px] text-stone-400 font-bold tracking-widest opacity-60 uppercase">© 2025 Cardify Inc.</div>
    </div>
  );
}