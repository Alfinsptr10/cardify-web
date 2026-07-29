"use client";

import { useState, useEffect } from "react";
// MOCK IMPORTS: Use standard HTML/React components
import {
  ArrowLeft, Mail, Lock, User, Loader2,
  Flower2, Bird, Gift, Heart, Sparkles, Cloud, Music, CheckCircle, X, AlertCircle
} from "lucide-react";

// --- PALETTE (dōzo kawaii-editorial) ---
const INK = "#111111";
const MINT = "#BFE8D4";
const CREAM = "#FFFDF5";
const YELLOW = "#F6C445";
const CORAL = "#F3B8CC";
const SKY = "#BBD8F2";
const LILAC = "#D8C9F2";

// --- MAIN CONTENT ---
export default function RegisterPage() {
  // State
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Modal Sukses & Error
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // <--- State Baru

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [decorations, setDecorations] = useState<any[]>([]);

  // Efek Samping: Dekorasi Background
  useEffect(() => {
    document.title = "Register - Cardify";

    const items: any[] = [];
    const types = ['flower', 'bird', 'gift', 'heart', 'sparkle', 'cloud', 'music'];
    const colors = [
      'text-[#111111]/10', 'text-[#F6C445]/50', 'text-[#F3B8CC]/50', 'text-[#BBD8F2]/60', 'text-[#D8C9F2]/60'
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
      case 'flower': return <Flower2 size={size} />;
      case 'bird': return <Bird size={size} />;
      case 'gift': return <Gift size={size} />;
      case 'heart': return <Heart size={size} fill="currentColor" />;
      case 'sparkle': return <Sparkles size={size} />;
      case 'cloud': return <Cloud size={size} fill="currentColor" />;
      case 'music': return <Music size={size} />;
      default: return <Flower2 size={size} />;
    }
  };

  // --- LOGIC REGISTER DENGAN PENGECEKAN EMAIL ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowErrorModal(false); // Reset error modal sebelum request baru

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Cek apakah errornya karena email sudah terdaftar
        if (res.status === 409 || data.message?.toLowerCase().includes("already") || data.message?.toLowerCase().includes("exist")) {
          setShowErrorModal(true); // <--- Munculkan Modal Error
        } else {
          throw new Error(data.message || "Register failed");
        }
        return; // Berhenti di sini, jangan lanjut ke sukses
      }

      // ✅ REGISTER BERHASIL
      setShowSuccessModal(true);

    } catch (error: any) {
      alert("Failed to register: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border-[2.5px] border-[#111111] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-[#111111] outline-none transition-all placeholder:text-[#111111]/30 placeholder:font-medium focus:shadow-[4px_4px_0_0_#111111] focus:-translate-y-0.5";

  return (
    <div className="min-h-screen w-full text-[#111111] flex items-center justify-center relative overflow-hidden p-6 font-sans" style={{ backgroundColor: MINT }}>

      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-serif-accent { font-family: 'Instrument Serif', serif; }
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
          .font-sans { font-family: 'DM Sans', sans-serif; }
          @keyframes dozo-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
          .dozo-float { animation: dozo-float 4s ease-in-out infinite; }
      `}} />

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {decorations.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.color} dozo-float`}
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              transform: `rotate(${item.rotation}deg)`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration / 3}s`,
            }}
          >
            {renderIcon(item.type, item.size)}
          </div>
        ))}
        {/* soft blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-50" style={{ backgroundColor: YELLOW }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-50" style={{ backgroundColor: LILAC }} />
      </div>

      {/* Back link */}
      <a
        href="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-full border-[2.5px] border-[#111111] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-[3px_3px_0_0_#111111] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#111111] group"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back
      </a>

      {/* Register Card */}
      <div
        className="w-full max-w-[440px] rounded-[2.25rem] border-[3px] border-[#111111] shadow-[10px_10px_0_0_#111111] relative z-10"
        style={{ backgroundColor: CREAM }}
      >
        {/* sticker */}
        <div
          className="absolute -top-4 -right-4 z-20 rotate-6 rounded-full border-[2.5px] border-[#111111] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_0_#111111]"
          style={{ backgroundColor: YELLOW }}
        >
          New here? ✿
        </div>

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center border-[2.5px] border-[#111111] shadow-[4px_4px_0_0_#111111] -rotate-6"
              style={{ backgroundColor: CORAL }}
            >
              <Gift size={30} strokeWidth={2} />
            </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#111111]/50 mb-3">— join cardify —</p>

          <h1 className="text-3xl md:text-4xl text-[#111111] mb-3 font-boldonse font-black" style={{ letterSpacing: "-0.02em" }}>
            Create Account
          </h1>
          <p className="text-[#111111]/60 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
            Join Cardify to start crafting beautiful digital moments.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-10">
          <form onSubmit={handleRegister} className="space-y-5">

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#111111] uppercase tracking-[0.15em] ml-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-4 text-[#111111]/40 group-focus-within:text-[#111111] transition-colors z-10" />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#111111] uppercase tracking-[0.15em] ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-4 text-[#111111]/40 group-focus-within:text-[#111111] transition-colors z-10" />
                <input
                  type="email"
                  required
                  placeholder="hello@cardify.id"
                  className={inputClass}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#111111] uppercase tracking-[0.15em] ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-4 text-[#111111]/40 group-focus-within:text-[#111111] transition-colors z-10" />
                <input
                  type="password"
                  required
                  placeholder="Strong password"
                  className={inputClass}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#111111] text-[#FFFDF5] py-4 rounded-full font-black text-sm uppercase tracking-[0.15em] border-[2.5px] border-[#111111] shadow-[5px_5px_0_0_#F6C445] hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#F6C445] active:translate-y-0 active:shadow-[2px_2px_0_0_#F6C445] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Creating Account...</> : "Sign Up ✦"}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-[2px] flex-1 bg-[#111111]/15" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]/40">or</span>
            <div className="h-[2px] flex-1 bg-[#111111]/15" />
          </div>

          <p className="text-center text-xs text-[#111111]/60 mt-6 font-bold">
            Already have an account?{" "}
            <a href="/login" className="text-[#111111] font-black underline decoration-[2px] underline-offset-4 decoration-[#F3B8CC] hover:decoration-[#111111] cursor-pointer transition-colors">Log in</a>
          </p>
        </div>
      </div>

      {/* --- SUCCESS MODAL POPUP --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/50 p-4 animate-in fade-in duration-300">
          <div
            className="rounded-[2.25rem] border-[3px] border-[#111111] shadow-[10px_10px_0_0_#111111] w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-300 relative"
            style={{ backgroundColor: CREAM }}
          >
            <div
              className="absolute -top-4 -left-4 -rotate-6 rounded-full border-[2.5px] border-[#111111] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_0_#111111]"
              style={{ backgroundColor: MINT }}
            >
              Yay! ♡
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full border-[2.5px] border-[#111111] bg-white hover:shadow-[3px_3px_0_0_#111111] hover:-translate-y-0.5 transition-all"
            >
              <X size={16} strokeWidth={3} />
            </button>

            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 mt-2 text-[#111111] border-[2.5px] border-[#111111] shadow-[4px_4px_0_0_#111111] animate-in zoom-in duration-500"
              style={{ backgroundColor: MINT }}
            >
              <CheckCircle size={40} strokeWidth={2.5} />
            </div>

            <h3 className="text-2xl text-[#111111] mb-3 font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>Welcome Aboard!</h3>
            <p className="text-sm text-[#111111]/60 mb-8 leading-relaxed px-2 font-medium">
              Your account has been successfully created. You're ready to start crafting memories.
            </p>

            <a href="/login" className="block w-full py-3.5 rounded-full bg-[#111111] text-[#FFFDF5] font-black text-sm uppercase tracking-[0.15em] border-[2.5px] border-[#111111] shadow-[5px_5px_0_0_#BFE8D4] hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#BFE8D4] active:translate-y-0 transition-all">
              Continue to Login
            </a>
          </div>
        </div>
      )}

      {/* --- ERROR MODAL POPUP (EMAIL SUDAH ADA) --- */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/50 p-4 animate-in fade-in duration-300">
          <div
            className="rounded-[2.25rem] border-[3px] border-[#111111] shadow-[10px_10px_0_0_#111111] w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-300 relative"
            style={{ backgroundColor: CREAM }}
          >
            <div
              className="absolute -top-4 -left-4 -rotate-6 rounded-full border-[2.5px] border-[#111111] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_0_#111111]"
              style={{ backgroundColor: CORAL }}
            >
              Oops!
            </div>

            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full border-[2.5px] border-[#111111] bg-white hover:shadow-[3px_3px_0_0_#111111] hover:-translate-y-0.5 transition-all"
            >
              <X size={16} strokeWidth={3} />
            </button>

            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 mt-2 text-[#111111] border-[2.5px] border-[#111111] shadow-[4px_4px_0_0_#111111] animate-in zoom-in duration-500"
              style={{ backgroundColor: CORAL }}
            >
              <AlertCircle size={40} strokeWidth={2.5} />
            </div>

            <h3 className="text-2xl text-[#111111] mb-3 font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>Account Exists</h3>
            <p className="text-sm text-[#111111]/60 mb-8 leading-relaxed px-2 font-medium">
              The email <span className="font-black text-[#111111]">{formData.email}</span> is already registered. Would you like to log in instead?
            </p>

            <div className="flex flex-col gap-3">
              <a href="/login" className="block w-full py-3.5 rounded-full bg-[#111111] text-[#FFFDF5] font-black text-sm uppercase tracking-[0.15em] border-[2.5px] border-[#111111] shadow-[5px_5px_0_0_#F3B8CC] hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#F3B8CC] active:translate-y-0 transition-all">
                Go to Login
              </a>
              <button
                onClick={() => setShowErrorModal(false)}
                className="block w-full py-3.5 rounded-full font-black text-sm uppercase tracking-[0.15em] border-[2.5px] border-[#111111] text-[#111111] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#111111] active:translate-y-0 transition-all"
                style={{ backgroundColor: SKY }}
              >
                Try Different Email
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 z-10 text-[10px] text-[#111111]/50 font-black tracking-[0.25em] uppercase">© 2025 Cardify Inc.</div>
    </div>
  );
}
