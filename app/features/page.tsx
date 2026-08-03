"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight, Sparkles, Gift, Heart, User, LogOut, Settings, ChevronDown,
  Zap, Image as ImageIcon, Smartphone, Palette, Share2, ShieldCheck, Users,
  Instagram, MessageCircle, CheckCircle2, Music, Download, Link2
} from "lucide-react";

// --- REUSABLE MOTION VARIANTS (sama seperti halaman lain) ---
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

// --- WRAPPER SESSION ---
export default function FeaturesPage() {
  return (
    <SessionProvider>
      <FeaturesContent />
    </SessionProvider>
  );
}

// --- KONTEN UTAMA ---
function FeaturesContent() {
  const { data: session } = useSession();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Features - Cardify";

    if (session?.user) {
      setUserData({
        name: session.user.name || "Pengguna",
        email: session.user.email || "user@cardify.id",
        image: session.user.image || null,
      });
    } else if (typeof window !== "undefined") {
      const isManualLogin = localStorage.getItem("isLoggedIn");
      if (isManualLogin === "true") {
        setUserData({
          name: localStorage.getItem("userName") || "Pengguna",
          email: localStorage.getItem("userEmail") || "user@cardify.id",
          image: null,
        });
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [session]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUserData(null);
    window.location.href = "/";
  };

  const coreFeatures = [
    { icon: <Zap size={26} />, bg: "bg-[#F6C445]", title: "Instant & Easy", desc: "No design skills needed. Fill in the blanks, hit send." },
    { icon: <ImageIcon size={26} />, bg: "bg-[#F3B8CC]", title: "Photobooth", desc: "Snap a picture inside the app and tape it onto any card." },
    { icon: <Smartphone size={26} />, bg: "bg-[#BFE0F5]", title: "Interactive Web Story", desc: "Add music, animations, and page-turn stories to any greeting." },
    { icon: <Palette size={26} />, bg: "bg-[#A9D6BC]", title: "Unique Templates", desc: "From Retro, Minimalist, to Classic Postcard — 200+ styles." },
    { icon: <Share2 size={26} />, bg: "bg-[#D8C9F2]", title: "Share Anywhere", desc: "Send as a link, download as an image, or print a real postcard." },
    { icon: <ShieldCheck size={26} />, bg: "bg-[#F6C445]", title: "Secure & Private", desc: "Your data and messages are encrypted and never sold." },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FDFBF3] text-[#1C1917] selection:bg-[#F6C445] selection:text-[#1C1917] flex flex-col relative overflow-hidden font-sans">

      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,600;1,700&display=swap');
          .font-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
      `}} />

      {/* --- ANNOUNCEMENT TICKER (fixed — navbar halaman ini juga fixed) --- */}
      <div className="fixed top-0 left-0 z-[60] w-full bg-[#1C1917] text-[#FDFBF3] overflow-hidden py-2.5 select-none">
        <motion.div
          className="flex whitespace-nowrap w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4 text-[11px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2"><Sparkles size={12} className="text-[#F6C445]" /> New — Photobooth is live, snap &amp; send in seconds</span>
              <span className="text-stone-600">•</span>
              <span>Free templates every week</span>
              <span className="text-stone-600">•</span>
              <span>Ships worldwide as a shareable link</span>
              <span className="text-stone-600">•</span>
              <span className="flex items-center gap-2"><Heart size={12} className="text-[#F3B8CC] fill-[#F3B8CC]" /> Made with love for Gen Z &amp; couples</span>
              <span className="text-stone-600">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- NAVBAR (fixed, digeser top-9 karena ada ticker) --- */}
      <nav className={`fixed top-9 z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-[#FDFBF3]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3" : "bg-transparent border-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">

          {/* Logo Brand */}
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center shadow-[3px_3px_0_0_#F6C445] group-hover:rotate-12 group-hover:shadow-[4px_4px_0_0_#F6C445] transition-all duration-300 p-1.5">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="/logo-cardify.svg" alt="Cardify" className="w-full h-full object-contain" />
            </div>
            <div className="leading-none">
  <div
    className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1C1917]"
  >
    A CARD WITH A STORY
  </div>

  <div
    className="text-2xl font-black italic tracking-[-0.02em]"
    style={{
      fontFamily: "'Boldonse', 'Archivo Black', sans-serif",
      color: "#1C1917",
    }}
  >
    cardify
  </div>
</div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wide text-stone-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

            {/* Templates Dropdown */}
            <div className="relative group h-full flex items-center cursor-pointer">
              <Link href="/templates" className="hover:text-[#1C1917] transition-colors relative py-2 flex items-center gap-1">
                Templates
                <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-transform duration-300 group-hover:rotate-180 text-[#D9A400]" />
              </Link>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white rounded-2xl shadow-xl border-2 border-[#1C1917] p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50 normal-case">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">Create New</p>

                <Link href="/web-story" className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F3B8CC]/20 transition-colors group/item relative z-10 mb-1">
                  <div className="w-10 h-10 rounded-full bg-[#F3B8CC] flex-shrink-0 flex items-center justify-center text-[#1C1917] border-2 border-[#1C1917] shadow-sm">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">Web Story</p>
                    <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5 normal-case">Interactive, Music, Animations</p>
                  </div>
                </Link>

                <Link href="/templates?filter=card-image" className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F6C445]/20 transition-colors group/item relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#F6C445] flex-shrink-0 flex items-center justify-center text-[#1C1917] border-2 border-[#1C1917] shadow-sm">
                    <ImageIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">Card Image</p>
                    <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5 normal-case">Static, Printable, Classic</p>
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/features" className="text-[#1C1917]">Features</Link>
            <Link href="/about" className="hover:text-[#1C1917] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#1C1917] transition-colors">Contact</Link>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {userData ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border-2 border-[#1C1917] shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  {userData.image ? (
                    <Image src={userData.image} alt={userData.name} width={34} height={34} className="rounded-full border border-stone-100" />
                  ) : (
                    <div className="w-[34px] h-[34px] bg-[#F6C445] rounded-full flex items-center justify-center border border-white text-[#1C1917] shadow-inner">
                      <User size={16} />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-bold text-stone-800 block max-w-[80px] truncate leading-tight">{userData.name}</span>
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider leading-none">Free Plan</span>
                  </div>
                  <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border-2 border-[#1C1917] p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 bg-stone-50/50 rounded-xl mb-2 border border-stone-100">
                      <p className="text-sm font-bold text-stone-900 truncate">{userData.name}</p>
                      <p className="text-xs text-stone-500 truncate font-medium">{userData.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link href="/account" className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-black rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all"><User size={16} /></div>
                        Profile & Account
                      </Link>
                      <div className="h-px bg-stone-100 my-1 mx-2"></div>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all"><LogOut size={16} /></div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/login" className="hidden md:flex text-sm font-bold uppercase tracking-wide text-stone-600 hover:text-black transition-colors">Log in</Link>
                <Link href="/register" className="hidden md:flex text-sm font-bold uppercase tracking-wide text-stone-600 hover:text-black transition-colors">Sign Up</Link>
              </div>
            )}
            <Link href="/templates" className="px-5 py-2.5 rounded-full bg-[#1C1917] text-[#FDFBF3] text-sm font-bold hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#F6C445] transition-all flex items-center gap-2 border-2 border-[#1C1917]">
              Start Creating <ArrowRight size={16} strokeWidth={2.5} className="text-[#F6C445]" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Mint paper) --- */}
      <section className="pt-44 pb-24 px-6 relative z-10 bg-[#B8E3C9] border-t-4 border-b-4 border-[#111111]">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.span variants={staggerItem} className="inline-block py-1.5 px-4 rounded-full bg-[#1C1917] text-[#F6C445] text-xs font-black tracking-widest uppercase mb-2 -rotate-2 font-sans">
            Why Cardify
          </motion.span>
          <motion.h1
            variants={staggerItem}
            className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Everything you need to say it right.
          </motion.h1>
          <motion.p variants={staggerItem} className="text-[14px] font-bold font-sans text-[#1C1917]/60">すべてが揃った機能</motion.p>
          <motion.p variants={staggerItem} className="text-lg text-[#1C1917]/70 max-w-2xl mx-auto leading-relaxed font-medium pt-2">
            From your first photo to the final "send," Cardify is built to make every greeting feel personal, playful, and unmistakably yours.
          </motion.p>
        </motion.div>
      </section>

      {/* --- CORE FEATURES GRID (Lilac paper) --- */}
      <section className="py-24 bg-[#D8C9F2] border-t-4 border-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[11px] font-black text-[#1C1917]/50 uppercase tracking-[0.3em] mb-3 block font-sans">— What's Inside —</span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic"
              style={{ letterSpacing: "-0.02em" }}
            >
              Built for the little details.
            </motion.h2>
            <p className="mt-3 text-[14px] font-bold font-sans text-[#1C1917]/60">細部までこだわりました</p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {coreFeatures.map((f) => (
              <motion.div
                key={f.title}
                variants={staggerItem}
                className="p-7 rounded-[1.75rem] bg-white border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.bg} text-[#1C1917] flex items-center justify-center mb-6 border-2 border-[#1C1917] shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2 font-playfair">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FEATURE SPOTLIGHT: PHOTOBOOTH (Sky paper) --- */}
      <section className="py-24 bg-[#BFE0F5] border-t-4 border-[#111111] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#F6C445] text-xs font-black uppercase tracking-widest mb-6 -rotate-2 font-sans">
              <ImageIcon size={12} />
              Spotlight Feature
            </motion.span>
            <motion.h2
              variants={staggerItem}
              className="text-5xl md:text-6xl text-[#111111] font-boldonse font-black italic mb-4 leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Photobooth, built right in.
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[14px] font-bold font-sans text-[#1C1917]/60 mb-6">フォトブース機能</motion.p>
            <motion.p variants={staggerItem} className="text-[#1C1917]/70 text-lg leading-relaxed font-medium mb-8">
              No need to switch apps. Snap a photo — or a burst of three — right inside Cardify, then tape it straight onto your card with a couple of taps.
            </motion.p>
            <motion.ul variants={staggerItem} className="space-y-3">
              {["Snap directly in the editor", "Retake as many times as you like", "Tape it onto any template instantly"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#1C1917] font-medium">
                  <div className="w-6 h-6 rounded-full bg-[#F6C445] border-2 border-[#1C1917] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right: Phone mockup (dekoratif, sama gaya seperti hero homepage) */}
          <motion.div
            className="relative h-[420px] md:h-[500px] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative z-10 w-64 md:w-72 aspect-[9/16] bg-[#FDFBF3] rounded-[2.5rem] shadow-2xl border-[8px] border-[#1C1917] overflow-hidden transform rotate-[3deg]">
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-b from-[#F3B8CC]/30 to-[#FDFBF3]">
                <div className="w-28 h-28 rounded-full bg-[#F3B8CC] border-2 border-[#1C1917] flex items-center justify-center">
                  <ImageIcon size={40} className="text-[#1C1917]" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-[#1C1917]/60 font-sans">Tap to snap</p>
              </div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full flex items-center justify-center gap-2 px-3 shadow-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-800"></div>
                <div className="w-10 h-1.5 rounded-full bg-stone-800/50"></div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute top-8 -right-2 md:right-4 z-20 bg-[#FDFBF3] px-4 py-2 rounded-full shadow-xl border-2 border-[#1C1917] text-[10px] font-bold uppercase tracking-wide">
              📸 Snap &amp; Tape
            </div>
            <div className="absolute bottom-10 -left-2 md:left-0 z-20 bg-[#FDFBF3] px-4 py-2 rounded-full shadow-xl border-2 border-[#1C1917] text-[10px] font-bold uppercase tracking-wide">
              ✨ No extra app
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECONDARY FEATURES STRIP (Sage paper) --- */}
      <section className="py-24 bg-[#A9D6BC] border-t-4 border-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[11px] font-black text-[#1C1917]/50 uppercase tracking-[0.3em] mb-3 block font-sans">— Made To Fit Your Life —</span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic"
              style={{ letterSpacing: "-0.02em" }}
            >
              For everyone, for everything.
            </motion.h2>
            <p className="mt-3 text-[14px] font-bold font-sans text-[#1C1917]/60">誰にでも、どんな時にも</p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem} className="space-y-4 p-8 bg-white rounded-[1.75rem] border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
              <div className="w-14 h-14 bg-[#F6C445] rounded-2xl flex items-center justify-center mx-auto text-[#1C1917] mb-4 border-2 border-[#1C1917]">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-black text-[#1C1917] font-boldonse">Every Occasion</h3>
              <p className="text-stone-500 leading-relaxed text-sm">
                Birthdays, weddings, thank-yous, and the everyday in-betweens — there's a template for it.
              </p>
            </motion.div>
            <motion.div variants={staggerItem} className="space-y-4 p-8 bg-white rounded-[1.75rem] border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
              <div className="w-14 h-14 bg-[#BFE0F5] rounded-2xl flex items-center justify-center mx-auto text-[#1C1917] mb-4 border-2 border-[#1C1917]">
                <Music size={28} />
              </div>
              <h3 className="text-2xl font-black text-[#1C1917] font-boldonse">Sound &amp; Motion</h3>
              <p className="text-stone-500 leading-relaxed text-sm">
                Add background music and gentle animations so your card feels alive, not static.
              </p>
            </motion.div>
            <motion.div variants={staggerItem} className="space-y-4 p-8 bg-white rounded-[1.75rem] border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
              <div className="w-14 h-14 bg-[#F3B8CC] rounded-2xl flex items-center justify-center mx-auto text-[#1C1917] mb-4 border-2 border-[#1C1917]">
                <Download size={28} />
              </div>
              <h3 className="text-2xl font-black text-[#1C1917] font-boldonse">Send However</h3>
              <p className="text-stone-500 leading-relaxed text-sm">
                Share a link, download it as an image, or print it as a real postcard — your call.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- FINAL CTA (Ink paper) --- */}
      <section className="py-20 px-4 border-t-3 border-[#111111]">
                 <div className="max-w-6xl mx-auto relative bg-[#1C1917] rounded-[2.5rem] px-8 md:px-16 py-16 md:py-20 text-center overflow-hidden">
                    <div className="absolute top-6 left-8 text-[#F6C445] rotate-[-12deg]"><Sparkles size={28} /></div>
                    <div className="absolute bottom-8 right-10 w-14 h-14 rounded-full bg-[#F3B8CC] flex items-center justify-center rotate-6">
                       <Heart size={22} className="text-[#1C1917] fill-[#1C1917]" />
                    </div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-[0.3em] mb-4 block">— Ready when you are —</span>
                    <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto mb-10 max-w-3xl text-5xl font-black italic leading-[0.95] md:text-7xl"
        style={{
          fontFamily: "'Boldonse', 'Archivo Black', sans-serif",
          color:"#FDFBF3",
          letterSpacing: "-0.02em",
        }}
      >
        All these features. <br />
        <span style={{ color: "#F6C445" }}>
          One good card.
        </span>
      </motion.h2>
                    <a
                       href={session ? "/templates" : "/register"}
                       className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F6C445] text-[#1C1917] font-bold hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] transition-all"
                    >
                       Start Creating — It's Free
                       <ArrowRight size={16} strokeWidth={2.5} />
                    </a>
                 </div>
              </section>

      {/* --- FOOTER (sama seperti halaman lain) --- */}
      <footer
  className="relative isolate w-full border-t-[2.5px] px-6 py-12 overflow-hidden"
  style={{
    background: "#84D4A4", // MINT
    borderColor: "#1C1917", // INK
  }}
>
  <div className="mx-auto max-w-7xl">

    <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4">

      {/* Brand */}
      <div className="col-span-2 md:col-span-1">

        <div className="mb-4 flex items-center gap-3">

          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px]"
            style={{
              background: "#1C1917",
              borderColor: "#1C1917",
            }}
          >
            <img
              src="/logo-cardify.svg"
              alt="Cardify"
              className="h-8 w-8 object-contain"
            />
          </div>

          <div className="leading-none">
  <div
    className="text-[9px] font-black uppercase tracking-[0.2em]"
    style={{ color: "#1C1917" }}
  >
    A CARD WITH A STORY
  </div>

  <div
    className="text-2xl font-black italic tracking-[-0.02em]"
    style={{
      fontFamily: "'Boldonse', 'Archivo Black', sans-serif",
      color: "#1C1917",
    }}
  >
    cardify
  </div>
</div>

        </div>

        <p
          className="text-sm font-medium leading-relaxed"
          style={{ color: "#1C1917" }}
        >
          The modern way to celebrate.
          Digital moments that last forever.
        </p>

      </div>

      {/* Product */}

      <div>

        <h4
          className="mb-4 text-xs font-black uppercase tracking-widest"
          style={{ color: "#1C1917" }}
        >
          Product
        </h4>

        <ul className="space-y-2 text-sm font-bold">

          <li>
            <a
              href="/templates"
              className="transition-opacity hover:opacity-60"
              style={{ color: "#1C1917" }}
            >
              Templates
            </a>
          </li>

          <li>
            <a
              href="/showcase"
              className="transition-opacity hover:opacity-60"
              style={{ color: "#1C1917" }}
            >
              Showcase
            </a>
          </li>

        </ul>

      </div>

      {/* Company */}

      <div>

        <h4
          className="mb-4 text-xs font-black uppercase tracking-widest"
          style={{ color: "#1C1917" }}
        >
          Company
        </h4>

        <ul className="space-y-2 text-sm font-bold">

          <li>
            <a href="/about" className="hover:opacity-60" style={{ color: "#1C1917" }}>
              About
            </a>
          </li>

          <li>
            <a href="/careers" className="hover:opacity-60" style={{ color: "#1C1917" }}>
              Careers
            </a>
          </li>

          <li>
            <a href="/blog" className="hover:opacity-60" style={{ color: "#1C1917" }}>
              Blog
            </a>
          </li>

        </ul>

      </div>

      {/* Connect */}

      <div>

        <h4
          className="mb-4 text-xs font-black uppercase tracking-widest"
          style={{ color: "#1C1917" }}
        >
          Connect
        </h4>

        <div className="flex flex-col gap-3">

          <a
            href="https://instagram.com/alfinnsptr"
            target="_blank"
            className="flex items-center gap-3 hover:opacity-60"
            style={{ color: "#1C1917" }}
          >

            <div
              className="flex h-8 w-8 items-center justify-center rounded-full border-2"
              style={{
                background: "#FDFBF3",
                borderColor: "#1C1917",
              }}
            >
              <Instagram size={14} strokeWidth={2.5} />
            </div>

            <span className="text-sm font-bold">
              Instagram
            </span>

          </a>

          <a
            href="https://wa.me/6289501847804"
            target="_blank"
            className="flex items-center gap-3 hover:opacity-60"
            style={{ color: "#1C1917" }}
          >

            <div
              className="flex h-8 w-8 items-center justify-center rounded-full border-2"
              style={{
                background: "#FDFBF3",
                borderColor: "#1C1917",
              }}
            >
              <MessageCircle size={14} strokeWidth={2.5} />
            </div>

            <span className="text-sm font-bold">
              WhatsApp
            </span>

          </a>

        </div>

      </div>

    </div>

    {/* Bottom */}

    <div
      className="flex flex-col items-center justify-between gap-3 border-t-[2.5px] pt-6 md:flex-row"
      style={{ borderColor: "#1C1917" }}
    >

      <p
  className="text-xs font-black uppercase tracking-wider"
  style={{ color: "#1C1917" }}
>
  © 2025 Cardify · Made with love
</p>

      <div
        className="flex gap-6 text-xs font-black uppercase tracking-wider"
        style={{ color: "#1C1917" }}
      >

        <a
          href="/privacy-policy"
          className="hover:opacity-60"
        >
          Privacy
        </a>

        <a
          href="/terms"
          className="hover:opacity-60"
        >
          Terms
        </a>

      </div>

    </div>

  </div>
</footer>

    </div>
  );
}