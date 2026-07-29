"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight, Sparkles, Gift, Heart, User, LogOut, Settings, ChevronDown,
  LayoutGrid, FileImage, Shield, Instagram, MessageCircle, Smartphone,
  Image as ImageIcon, Pencil, Download, Trash2, Plus, Camera, Check,
  Sparkle, Clock, Layers
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

// --- MOCK DATA: kartu tersimpan (belum ada backend order history, jadi ini contoh tampilan) ---
const savedCards = [
  { id: 1, title: "Happy Birthday, Sarah!", template: "Retro Birthday Bash", date: "2 days ago", bg: "bg-[#F6C445]" },
  { id: 2, title: "Congrats on the Wedding", template: "Wedding Bloom Set", date: "1 week ago", bg: "bg-[#F3B8CC]" },
  { id: 3, title: "Thank You, Team!", template: "Postcard From Love", date: "3 weeks ago", bg: "bg-[#BFE0F5]" },
  { id: 4, title: "Miss You Already", template: "8-Bit Congrats!", date: "1 month ago", bg: "bg-[#A9D6BC]" },
];

const activity = [
  { id: 1, text: "Created \"Happy Birthday, Sarah!\" using Retro Birthday Bash", time: "2 days ago" },
  { id: 2, text: "Snapped 3 photos with Photobooth", time: "2 days ago" },
  { id: 3, text: "Downloaded \"Congrats on the Wedding\" as image", time: "1 week ago" },
  { id: 4, text: "Joined Cardify", time: "2 months ago" },
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
  const [activeTab, setActiveTab] = useState<"overview" | "cards" | "settings">("overview");

  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUserData(null);
    window.location.href = "/";
  };

  const displayName = userData?.name || "Guest";
  const displayEmail = userData?.email || "—";
  const memberSince = "Sep 2025"; // Placeholder — belum ada field createdAt dari backend

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
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center text-[#F6C445] shadow-[3px_3px_0_0_#F6C445] group-hover:rotate-12 group-hover:shadow-[4px_4px_0_0_#F6C445] transition-all duration-300">
              <Gift size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">A card with a story</span>
              <span className="text-xl font-bold tracking-tight font-playfair italic text-[#1C1917]">cardify</span>
            </div>
          </Link>

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
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-[#BFE0F5]/25 hover:text-[#1C1917] rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-[#BFE0F5] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917] group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all"><Settings size={16} /></div>
                        Preferences
                      </button>
                      <div className="h-px bg-stone-100 my-1 mx-2"></div>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2.5 text-sm text-red-600 hover:bg-[#F3B8CC]/25 rounded-xl transition-all font-medium group">
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

        {/* --- PROFILE HEADER STRIP (Marigold paper) --- */}
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

            {/* Tab Switcher */}
            <div className="flex justify-center mb-10">
              <div className="bg-white p-1.5 rounded-full border-2 border-[#1C1917] shadow-[4px_4px_0_0_#1C1917] inline-flex items-center gap-1">
                {[
                  { id: "overview", label: "Overview", icon: <LayoutGrid size={16} /> },
                  { id: "cards", label: "My Cards", icon: <FileImage size={16} /> },
                  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${
                      activeTab === tab.id ? "bg-[#1C1917] text-[#F6C445] shadow-md" : "text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* --- OVERVIEW TAB --- */}
            {activeTab === "overview" && (
              <motion.div initial="hidden" animate="show" variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={staggerItem} className="lg:col-span-1 space-y-4">
                  <h3 className="text-xs font-black text-[#1C1917]/50 uppercase tracking-widest font-sans">Quick Actions</h3>
                  <Link href="/templates" className="flex items-center gap-4 p-5 bg-white rounded-[1.5rem] border-2 border-[#1C1917] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#1C1917] transition-all">
                    <div className="w-12 h-12 rounded-full bg-[#F6C445] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917]"><Plus size={20} /></div>
                    <div>
                      <p className="font-bold text-stone-800 font-playfair">Create a Card</p>
                      <p className="text-xs text-stone-500">Start from 200+ templates</p>
                    </div>
                  </Link>
                  <Link href="/web-story" className="flex items-center gap-4 p-5 bg-white rounded-[1.5rem] border-2 border-[#1C1917] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#1C1917] transition-all">
                    <div className="w-12 h-12 rounded-full bg-[#F3B8CC] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917]"><Smartphone size={20} /></div>
                    <div>
                      <p className="font-bold text-stone-800 font-playfair">Web Story</p>
                      <p className="text-xs text-stone-500">Add music &amp; animation</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-4 p-5 bg-white rounded-[1.5rem] border-2 border-[#1C1917] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#1C1917] transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#BFE0F5] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917]"><ImageIcon size={20} /></div>
                    <div>
                      <p className="font-bold text-stone-800 font-playfair">Photobooth</p>
                      <p className="text-xs text-stone-500">Snap a fresh photo</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="lg:col-span-2">
                  <h3 className="text-xs font-black text-[#1C1917]/50 uppercase tracking-widest font-sans mb-4">Recent Activity</h3>
                  <div className="bg-white rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917] divide-y-2 divide-stone-100 overflow-hidden">
                    {activity.map((a) => (
                      <div key={a.id} className="flex items-start gap-3 p-5">
                        <div className="w-2 h-2 rounded-full bg-[#F6C445] border border-[#1C1917] mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-stone-700">{a.text}</p>
                          <p className="text-xs text-stone-400 font-bold uppercase tracking-wide mt-1">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* --- MY CARDS TAB --- */}
            {activeTab === "cards" && (
              <motion.div initial="hidden" animate="show" variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              </motion.div>
            )}

            {/* --- SETTINGS TAB --- */}
            {activeTab === "settings" && (
              <motion.div initial="hidden" animate="show" variants={staggerContainer} className="max-w-2xl mx-auto space-y-6">
                <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]">
                  <h3 className="text-lg font-bold text-[#1C1917] mb-6 font-playfair flex items-center gap-2"><User size={18} /> Personal Information</h3>
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

                <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]">
                  <h3 className="text-lg font-bold text-[#1C1917] mb-2 font-playfair flex items-center gap-2"><Shield size={18} /> Sign Out</h3>
                  <p className="text-sm text-stone-500 mb-5">You'll need to log in again to access your saved templates.</p>
                  <button onClick={handleLogout} className="px-6 py-3 rounded-full bg-white text-[#1C1917] text-sm font-bold border-2 border-[#1C1917] hover:bg-[#1C1917] hover:text-[#FDFBF3] transition-all flex items-center gap-2">
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
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative isolate w-full bg-[#1C1917] text-stone-400 py-12 border-t-4 border-[#111111] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#F6C445] rounded-lg flex items-center justify-center text-[#1C1917]">
                  <Gift size={16} />
                </div>
                <span className="text-2xl font-bold text-white font-playfair italic">cardify</span>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed font-medium">
                The modern way to celebrate. Digital moments that last forever.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Product</h4>
              <ul className="space-y-4 text-sm text-stone-500 font-medium">
                <li><Link href="/templates" className="hover:text-white cursor-pointer transition-colors">Templates</Link></li>
                <li><Link href="/features" className="hover:text-white cursor-pointer transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm text-stone-500 font-medium">
                <li><Link href="/about" className="hover:text-white cursor-pointer transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white cursor-pointer transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Connect</h4>
              <div className="flex flex-col gap-4">
                <a href="https://instagram.com/alfinnsptr" target="_blank" className="flex items-center gap-3 text-sm text-stone-500 hover:text-[#E1306C] transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:border-[#E1306C] transition-colors"><Instagram size={16} /></div>
                  <span className="font-medium">Instagram</span>
                </a>
                <a href="https://wa.me/6289501847804" target="_blank" className="flex items-center gap-3 text-sm text-stone-500 hover:text-[#25D366] transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:border-[#25D366] transition-colors"><MessageCircle size={16} /></div>
                  <span className="font-medium">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-500 font-medium">© 2025 Cardify Inc. All rights reserved.</p>
            <div className="flex gap-8 text-xs text-stone-500 font-bold">
              <Link href="/privacy-policy" className="cursor-pointer hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="cursor-pointer hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}