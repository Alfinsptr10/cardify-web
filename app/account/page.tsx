"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight, Sparkles, Gift, Heart, User, LogOut, Settings, ChevronDown,
  FileImage, Shield, Instagram, MessageCircle,
  Pencil, Download, Trash2, Plus, Camera, Check,
  Sparkle, Clock, Layers, FileEdit, Smartphone, ImageIcon
} from "lucide-react";

// --- REUSABLE MOTION VARIANTS ---
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const favoriteTemplates = [
  { id: 201, title: "Wedding Bloom Set", tag: "Popular", bg: "bg-[#F3B8CC]" },
  { id: 202, title: "8-Bit Congrats!", tag: "Hot", bg: "bg-[#BFE0F5]" },
  { id: 203, title: "Vintage Press", tag: "Classic", bg: "bg-[#A9D6BC]" },
];

// --- WRAPPER SESSION ---
export default function AccountPage() {
  return (
    <SessionProvider>
      <AccountContent />
    </SessionProvider>
  );
}

// --- KONTEN UTAMA ---
function AccountContent() {
  const { data: session } = useSession();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);
  const [activeTab, setActiveTab] = useState<"cards" | "drafts" | "favorites" | "profile" | "settings">("cards");
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [draftCards, setDraftCards] = useState<any[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUserCards() {
      if (!userData?.email) return;
      
      try {
        setIsLoadingCards(true);
        const res = await fetch(`/api/user/cards?email=${encodeURIComponent(userData.email)}`);
        const data = await res.json();

        if (res.ok) {
          setSavedCards(data.saved || []);
          setDraftCards(data.drafts || []);
        }
      } catch (err) {
        console.error("Gagal mengambil data kartu:", err);
      } finally {
        setIsLoadingCards(false);
      }
    }

    fetchUserCards();
  }, [userData]);
  
  useEffect(() => {
    document.title = "My Account - Cardify";

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
    const handleScroll = () => setScrolled(window.scrollY > 20);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [session]);

  const handleLogoutClick = () => {
    setShowProfileMenu(false);
    setShowLogoutConfirm(true);
  };

  const executeLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUserData(null);
    window.location.href = "/";
  };

  const displayName = userData?.name || "Guest";
  const displayEmail = userData?.email || "—";
  const memberSince = "Sep 2025";

  return (
    <div className="min-h-screen w-full bg-[#FDFBF3] text-[#1C1917] selection:bg-[#F6C445] selection:text-[#1C1917] flex flex-col relative overflow-hidden font-sans">

      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,600;1,700&display=swap');
          .font-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
      `}} />

      {/* --- ANNOUNCEMENT TICKER --- */}
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

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-9 z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-[#FDFBF3]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3" : "bg-[#FDFBF3] border-stone-200 py-4"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
         {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-5 cursor-pointer group">
            <motion.div
               className="w-10 h-10"
               whileHover={{ rotate: 8, scale: 1.06 }}
               transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="/logo-cardify.svg" alt="Cardify" className="w-full h-full object-contain scale-135" />
            </motion.div>
            <div className="leading-none">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1C1917]">
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
          
          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wide text-stone-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full">
            <div className="relative group h-full flex items-center cursor-pointer">
                <Link href="/templates" className="hover:text-[#1C1917] transition-colors relative py-2 flex items-center gap-1 group-hover:text-[#D9A400]">
                  Templates
                  <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-transform duration-300 group-hover:rotate-180 text-[#D9A400]" />
                </Link>
                
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
            
            <Link href="/features" className="hover:text-[#1C1917] transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F6C445] transition-all group-hover:w-full"></span>
            </Link>

            <Link href="/about" className="hover:text-[#1C1917] transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F6C445] transition-all group-hover:w-full"></span>
            </Link>
            
            <Link href="/contact" className="hover:text-[#1C1917] transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F6C445] transition-all group-hover:w-full"></span>
            </Link>
          </div>

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
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl border-2 border-[#1C1917] shadow-[6px_6px_0_0_#1C1917] p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 bg-[#FDFBF3] rounded-xl mb-2 border-2 border-stone-100">
                      <p className="text-sm font-bold text-stone-900 truncate">{userData.name}</p>
                      <p className="text-xs text-stone-500 truncate font-medium">{userData.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link href="/account" className="flex items-center gap-3 w-full p-2.5 text-sm text-[#1C1917] bg-[#F6C445]/15 rounded-xl font-bold group">
                        <div className="w-8 h-8 rounded-lg bg-[#F6C445] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917]"><User size={16} /></div>
                        Profile & Account
                      </Link>
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-[#BFE0F5]/25 hover:text-[#1C1917] rounded-xl transition-all font-medium group cursor-pointer">
  <div className="w-8 h-8 rounded-lg bg-[#BFE0F5] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917] group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all"><Settings size={16} /></div>
  Preferences
</button>
<div className="h-px bg-stone-100 my-1 mx-2"></div>
<button onClick={handleLogoutClick} className="flex items-center gap-3 w-full p-2.5 text-sm text-red-600 hover:bg-[#F3B8CC]/25 rounded-xl transition-all font-medium group cursor-pointer">
  <div className="w-8 h-8 rounded-lg bg-[#F3B8CC] border-2 border-[#1C1917] flex items-center justify-center text-red-600 group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all"><LogOut size={16} /></div>
  Sign Out
</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2.5 rounded-full bg-[#1C1917] text-[#FDFBF3] text-sm font-bold border-2 border-[#1C1917]">Log in</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-28">

        {/* --- PROFILE HEADER STRIP --- */}
        <section className="bg-[#F6C445] border-t-4 border-b-4 border-[#111111] py-12 px-6">
          <motion.div
            className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem} className="relative flex-shrink-0">
              {userData?.image ? (
                <Image src={userData.image} alt={displayName} width={96} height={96} className="rounded-3xl border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]" />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-[#1C1917] flex items-center justify-center text-[#F6C445] border-2 border-[#1C1917] shadow-[5px_5px_0_0_rgba(28,25,23,0.3)]">
                  <User size={40} />
                </div>
              )}
              <button className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917] shadow-sm hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#1C1917] transition-all">
                <Camera size={16} />
              </button>
            </motion.div>

            <motion.div variants={staggerItem} className="flex-grow text-center md:text-left">
              <h1 className="text-3xl md:text-4xl text-[#111111] font-boldonse font-black italic" style={{ letterSpacing: "-0.01em" }}>
                {displayName}
              </h1>
              <p className="text-[#1C1917]/70 font-medium text-sm mt-1">{displayEmail}</p>
              <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-[#1C1917] text-[#F6C445] text-[10px] font-black uppercase tracking-widest">
                <Sparkle size={10} /> Free Plan
              </span>
            </motion.div>

            <motion.div variants={staggerItem} className="flex gap-3">
              <Link href="/templates" className="px-5 py-3 rounded-full bg-[#1C1917] text-[#FDFBF3] text-sm font-bold border-2 border-[#1C1917] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(28,25,23,0.3)] transition-all flex items-center gap-2">
                <Plus size={16} /> New Card
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* --- STATS ROW --- */}
        <section className="bg-[#FDFBF3] py-10 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 -mt-4">
            {[
              { icon: <FileImage size={22} />, label: "Cards Created", value: savedCards.length, bg: "bg-[#F3B8CC]" },
              { icon: <Layers size={22} />, label: "Templates Used", value: 3, bg: "bg-[#BFE0F5]" },
              { icon: <Clock size={22} />, label: "Member Since", value: memberSince, bg: "bg-[#A9D6BC]" },
            ].map((s) => (
              <div key={s.label} className="bg-white p-6 rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917] flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${s.bg} border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917] flex-shrink-0`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-black text-[#1C1917] font-boldonse">{s.value}</p>
                  <p className="text-xs text-stone-500 font-bold uppercase tracking-wide">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- TABS + CONTENT --- */}
        <section className="bg-[#FDFBF3] pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

              {/* --- SIDEBAR --- */}
              <aside className="lg:col-span-3">
                <div className="lg:sticky lg:top-28 space-y-1">
                  <p className="text-[11px] font-black text-[#1C1917]/40 uppercase tracking-[0.2em] mb-3 px-4 font-sans">Dashboard</p>
                  {[
                    { id: "cards", label: "My Cards", icon: <FileImage size={16} /> },
                    { id: "drafts", label: "Drafts", icon: <FileEdit size={16} /> },
                    { id: "favorites", label: "Favorites", icon: <Heart size={16} /> },
                    { id: "profile", label: "Profile", icon: <User size={16} /> },
                    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                        activeTab === item.id
                          ? "bg-[#1C1917] text-[#F6C445] border-[#1C1917] shadow-[3px_3px_0_0_rgba(28,25,23,0.2)]"
                          : "text-stone-500 border-transparent hover:bg-white hover:border-stone-200"
                      }`}
                    >
                      {item.icon} {item.label}
                      {item.id === "drafts" && draftCards.length > 0 && (
                        <span className={`ml-auto text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ${activeTab === "drafts" ? "bg-[#F6C445] text-[#1C1917]" : "bg-stone-200 text-stone-600"}`}>
                          {draftCards.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </aside>

              {/* --- CONTENT --- */}
              <div className="lg:col-span-9">

                {/* --- MY CARDS --- */}
                {activeTab === "cards" && (
                  <motion.div initial="hidden" animate="show" variants={staggerContainer}>
                    <h2 className="text-2xl font-black text-[#1C1917] font-boldonse mb-6">My Cards</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {savedCards.map((card) => (
                        <motion.div key={card.id} variants={staggerItem} className="bg-white rounded-[1.75rem] border-2 border-[#1C1917] overflow-hidden hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                          <div className={`aspect-[4/3] ${card.bg} flex items-center justify-center border-b-2 border-[#1C1917]`}>
                            <Gift size={36} className="text-[#1C1917]/40" />
                          </div>
                          <div className="p-4">
                            <p className="font-bold text-sm text-stone-800 truncate font-playfair">{card.title}</p>
                            <p className="text-xs text-stone-400 mt-0.5">{card.template} • {card.date}</p>
                            <div className="flex gap-2 mt-3">
                              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#FDFBF3] border-2 border-stone-200 text-xs font-bold text-stone-600 hover:border-[#1C1917] transition-colors">
                                <Pencil size={12} /> Edit
                              </button>
                              <button className="flex items-center justify-center w-9 py-2 rounded-lg bg-[#FDFBF3] border-2 border-stone-200 text-stone-500 hover:border-[#1C1917] transition-colors">
                                <Download size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <Link href="/templates" className="flex flex-col items-center justify-center gap-3 rounded-[1.75rem] border-2 border-dashed border-stone-300 hover:border-[#1C1917] hover:bg-white transition-all min-h-[220px] text-stone-400 hover:text-[#1C1917]">
                        <div className="w-12 h-12 rounded-full bg-[#FDFBF3] border-2 border-current flex items-center justify-center">
                          <Plus size={22} />
                        </div>
                        <span className="text-sm font-bold">Create New Card</span>
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* --- DRAFTS --- */}
                {activeTab === "drafts" && (
                  <motion.div initial="hidden" animate="show" variants={staggerContainer}>
                    <h2 className="text-2xl font-black text-[#1C1917] font-boldonse mb-2">Drafts</h2>
                    <p className="text-sm text-stone-500 mb-6">Unfinished cards — pick up right where you left off.</p>
                    {draftCards.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {draftCards.map((card) => (
                          <motion.div key={card.id} variants={staggerItem} className="bg-white rounded-[1.75rem] border-2 border-[#1C1917] overflow-hidden hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                            <div className={`aspect-[4/3] ${card.bg} flex items-center justify-center border-b-2 border-[#1C1917] relative opacity-80`}>
                              <Gift size={36} className="text-[#1C1917]/40" />
                              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest bg-white/90 px-2 py-1 rounded-full border-2 border-[#1C1917]">Draft</span>
                            </div>
                            <div className="p-4">
                              <p className="font-bold text-sm text-stone-800 truncate font-playfair">{card.title}</p>
                              <p className="text-xs text-stone-400 mt-0.5">{card.template} • {card.date}</p>
                              <div className="flex gap-2 mt-3">
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1C1917] text-[#F6C445] text-xs font-bold hover:-translate-y-0.5 transition-all">
                                  <Pencil size={12} /> Continue Editing
                                </button>
                                <button className="flex items-center justify-center w-9 py-2 rounded-lg bg-[#FDFBF3] border-2 border-stone-200 text-stone-400 hover:border-red-300 hover:text-red-500 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-[1.75rem] border-2 border-dashed border-stone-300 py-16 text-center text-stone-400">
                        <FileEdit size={32} className="mx-auto mb-3" />
                        <p className="text-sm font-bold">No drafts yet</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* --- FAVORITES --- */}
                {activeTab === "favorites" && (
                  <motion.div initial="hidden" animate="show" variants={staggerContainer}>
                    <h2 className="text-2xl font-black text-[#1C1917] font-boldonse mb-2">Favorites</h2>
                    <p className="text-sm text-stone-500 mb-6">Templates you've saved for later.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {favoriteTemplates.map((tpl) => (
                        <motion.div key={tpl.id} variants={staggerItem} className="bg-white rounded-[1.75rem] border-2 border-[#1C1917] overflow-hidden hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                          <div className={`aspect-[4/3] ${tpl.bg} flex items-center justify-center border-b-2 border-[#1C1917] relative`}>
                            <Sparkle size={32} className="text-[#1C1917]/40" />
                            <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest bg-white/90 px-2 py-1 rounded-full border-2 border-[#1C1917]">{tpl.tag}</span>
                            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border-2 border-[#1C1917] flex items-center justify-center text-red-500">
                              <Heart size={14} className="fill-red-500" />
                            </button>
                          </div>
                          <div className="p-4">
                            <p className="font-bold text-sm text-stone-800 truncate font-playfair">{tpl.title}</p>
                            <Link href="/templates" className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1C1917] text-[#F6C445] text-xs font-bold hover:-translate-y-0.5 transition-all">
                              Use Template
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* --- PROFILE --- */}
                {activeTab === "profile" && (
                  <motion.div initial="hidden" animate="show" variants={staggerContainer} className="max-w-2xl">
                    <h2 className="text-2xl font-black text-[#1C1917] font-boldonse mb-6">Profile</h2>
                    <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]">
                      <div className="flex items-center gap-5 mb-8">
                        {userData?.image ? (
                          <Image src={userData.image} alt={displayName} width={72} height={72} className="rounded-2xl border-2 border-[#1C1917]" />
                        ) : (
                          <div className="w-[72px] h-[72px] rounded-2xl bg-[#1C1917] flex items-center justify-center text-[#F6C445] border-2 border-[#1C1917]">
                            <User size={30} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-lg text-stone-800 font-playfair">{displayName}</p>
                          <button className="text-xs font-bold text-[#1C1917] border-b-2 border-[#1C1917] mt-1">Change Photo</button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Full Name</label>
                          <input defaultValue={displayName} className="w-full bg-[#FDFBF3] border-2 border-stone-200 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#1C1917] focus:ring-4 focus:ring-[#F6C445]/30 outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Email Address</label>
                          <input defaultValue={displayEmail} disabled className="w-full bg-stone-100 border-2 border-stone-200 rounded-xl py-3 px-4 text-sm font-medium text-stone-500 cursor-not-allowed" />
                          <p className="text-[11px] text-stone-400 ml-1">Signed in via {session?.user ? "Google/GitHub" : "email & password"} — contact support to change this.</p>
                        </div>
                      </div>
                      <button className="mt-6 px-6 py-3 rounded-full bg-[#1C1917] text-[#FDFBF3] text-sm font-bold border-2 border-[#1C1917] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#F6C445] transition-all flex items-center gap-2">
                        <Check size={16} /> Save Changes
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                {/* --- SETTINGS --- */}
                {activeTab === "settings" && (
                  <motion.div initial="hidden" animate="show" variants={staggerContainer} className="max-w-2xl space-y-6">
                    <h2 className="text-2xl font-black text-[#1C1917] font-boldonse mb-2">Settings</h2>

                    <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]">
                      <h3 className="text-lg font-bold text-[#1C1917] mb-2 font-playfair flex items-center gap-2"><Shield size={18} /> Notifications &amp; Security</h3>
                      <p className="text-sm text-stone-500 mb-5">Manage notification preferences and two-factor authentication.</p>
                      <Link href="/preferences" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FDFBF3] text-[#1C1917] text-sm font-bold border-2 border-[#1C1917] hover:bg-[#F6C445]/20 transition-all">
                        Go to Preferences <ArrowRight size={14} />
                      </Link>
                    </motion.div>

                    <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]">
                      <h3 className="text-lg font-bold text-[#1C1917] mb-2 font-playfair flex items-center gap-2"><LogOut size={18} /> Sign Out</h3>
                      <p className="text-sm text-stone-500 mb-5">You'll need to log in again to access your saved templates.</p>
                      <button onClick={handleLogoutClick} className="px-6 py-3 rounded-full bg-white text-[#1C1917] text-sm font-bold border-2 border-[#1C1917] hover:bg-[#1C1917] hover:text-[#FDFBF3] transition-all flex items-center gap-2">
                        <LogOut size={16} /> Sign Out of Cardify
                      </button>
                    </motion.div>

                    <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-red-200 shadow-[5px_5px_0_0_#fecaca]">
                      <h3 className="text-lg font-bold text-red-600 mb-2 font-playfair flex items-center gap-2"><Trash2 size={18} /> Danger Zone</h3>
                      <p className="text-sm text-stone-500 mb-5">Deleting your account removes all saved cards and cannot be undone.</p>
                      <button className="px-6 py-3 rounded-full bg-white text-red-600 text-sm font-bold border-2 border-red-200 hover:bg-red-50 transition-all">
                        Delete My Account
                      </button>
                    </motion.div>
                  </motion.div>
                )}

              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer
        className="relative isolate w-full border-t-[2.5px] px-6 py-12 overflow-hidden"
        style={{
          background: "#84D4A4",
          borderColor: "#1C1917",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
               <div className="mb-4 flex items-start gap-1">
                <div className="w-20 h-20 flex items-center justify-center overflow-visible">
                  <img
                    src="/logo-cardify.svg"
                    alt="Cardify"
                    className="w-full h-full object-contain -mt-11 scale-70 drop-shadow-[0_2px_3px_rgba(28,25,23,0.25)]"
                  />
                </div>
                <div className="leading-none">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "#1C1917" }}>
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
              <p className="text-sm font-medium leading-relaxed" style={{ color: "#1C1917" }}>
                The modern way to celebrate. Digital moments that last forever.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-widest" style={{ color: "#1C1917" }}>Product</h4>
              <ul className="space-y-2 text-sm font-bold">
                <li><Link href="/templates" className="transition-opacity hover:opacity-60" style={{ color: "#1C1917" }}>Templates</Link></li>
                <li><Link href="/showcase" className="transition-opacity hover:opacity-60" style={{ color: "#1C1917" }}>Showcase</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-widest" style={{ color: "#1C1917" }}>Company</h4>
              <ul className="space-y-2 text-sm font-bold">
                <li><Link href="/about" className="hover:opacity-60" style={{ color: "#1C1917" }}>About</Link></li>
                <li><Link href="/careers" className="hover:opacity-60" style={{ color: "#1C1917" }}>Careers</Link></li>
                <li><Link href="/blog" className="hover:opacity-60" style={{ color: "#1C1917" }}>Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-widest" style={{ color: "#1C1917" }}>Connect</h4>
              <div className="flex flex-col gap-3">
                <a
                  href="https://instagram.com/alfinnsptr"
                  target="_blank"
                  className="flex items-center gap-3 hover:opacity-60"
                  style={{ color: "#1C1917" }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2" style={{ background: "#FDFBF3", borderColor: "#1C1917" }}>
                    <Instagram size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold">Instagram</span>
                </a>
                <a
                  href="https://wa.me/6289501847804"
                  target="_blank"
                  className="flex items-center gap-3 hover:opacity-60"
                  style={{ color: "#1C1917" }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2" style={{ background: "#FDFBF3", borderColor: "#1C1917" }}>
                    <MessageCircle size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t-[2.5px] pt-6 md:flex-row" style={{ borderColor: "#1C1917" }}>
            <p className="text-xs font-black uppercase tracking-wider" style={{ color: "#1C1917" }}>© 2025 Cardify · Made with love</p>
            <div className="flex gap-6 text-xs font-black uppercase tracking-wider" style={{ color: "#1C1917" }}>
              <Link href="/privacy-policy" className="hover:opacity-60">Privacy</Link>
              <Link href="/terms" className="hover:opacity-60">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* --- POPUP KONFIRMASI LOGOUT --- */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1917]/30 p-4 animate-in fade-in duration-300"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="relative w-full max-w-sm transform scale-100 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hard shadow layer */}
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[2rem] bg-[#111111]" />
    
            {/* Card */}
            <div className="relative rounded-[2rem] bg-[#FFFDF5] border-[2.5px] border-[#111111] p-8 text-center">
              {/* Cute sticker badge */}
              <div className="absolute -top-3 -right-3 rotate-12 rounded-full bg-[#FFE66D] border-[2.5px] border-[#111111] px-3 py-1 shadow-[3px_3px_0_#111111]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#111111]">
                  Bye-bye!
                </span>
              </div>
    
              {/* Icon circle */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD6D6] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111]">
                <LogOut size={28} strokeWidth={2.5} className="text-[#111111]" />
              </div>
    
              <h3
                className="mb-3 text-2xl font-black uppercase tracking-tight text-[#111111]"
                style={{ fontFamily: "'Boldonse', 'Archivo Black', sans-serif" }}
              >
                Sign Out?
              </h3>
    
              <p className="mb-8 px-2 text-sm font-bold leading-relaxed text-[#4A4A4A]">
                Are you sure you want to sign out? You will need to log in again to access your saved templates.
              </p>
    
              <div className="flex flex-col gap-3">
                {/* Primary button */}
                <button
                  onClick={executeLogout}
                  className="group relative w-full cursor-pointer"
                >
                  <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-2xl bg-[#111111] transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5" />
                  <div className="relative flex items-center justify-center gap-2 rounded-2xl bg-[#FF6B6B] border-[2.5px] border-[#111111] py-3.5 font-black text-white transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                    <LogOut size={18} strokeWidth={2.5} />
                    Yes, Sign Out
                  </div>
                </button>
    
                {/* Secondary button */}
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="group relative w-full cursor-pointer"
                >
                  <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-2xl bg-[#111111] transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5" />
                  <div className="relative rounded-2xl bg-[#FFFDF5] border-[2.5px] border-[#111111] py-3.5 font-black text-[#111111] transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5 hover:bg-[#F0F0F0]">
                    Cancel
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}