"use client";

import Link from "next/link";
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, Gift, Heart, Instagram, MessageCircle,
  Flower2, Bird, Cloud, Music, BookOpen, Search, Clock, Calendar, Tag, ArrowUpRight,
  User, LogOut, Settings, ChevronDown, Smartphone, Image as ImageIcon
} from "lucide-react";

// --- FONT CONFIG (Manual CSS Injection used in render) ---
const playfair = { className: "font-playfair" };
const dmSans = { className: "font-dm-sans" };

// --- DŌZO PALETTE ---
const INK = "#1C1917";
const CREAM = "#FFFDF5";
const PAPER = "#FDFBF3";
const MINT = "#84D4A4";
const YELLOW = "#F6C445";
const PINK = "#F3B8CC";
const SKY = "#BFE0F5";
const LILAC = "#D9C7F2";
const CORAL = "#F58A73";

const CAT_COLORS: Record<string, string> = {
  Lifestyle: PINK,
  Tutorial: SKY,
  Design: YELLOW,
  Stories: LILAC,
  Tech: MINT,
  All: CREAM,
};

const renderIcon = (type: string, size: number) => {
  switch (type) {
    case 'flower': return <Flower2 size={size} />;
    case 'bird': return <Bird size={size} />;
    case 'gift': return <Gift size={size} />;
    case 'heart': return <Heart size={size} fill="currentColor" className="opacity-50" />;
    case 'sparkle': return <Sparkles size={size} />;
    case 'cloud': return <Cloud size={size} fill="currentColor" className="opacity-30" />;
    case 'music': return <Music size={size} />;
    default: return <Flower2 size={size} />;
  }
};

// --- MOCK DATA BLOG ---
const BLOG_POSTS = [
  {
    id: 1,
    title: "The Art of Digital Gifting in 2025",
    excerpt: "Why digital cards are becoming more meaningful than physical ones in our hyper-connected world. Discover the psychology behind virtual gestures.",
    category: "Lifestyle",
    date: "Oct 12, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800",
    slug: "art-of-digital-gifting",
    featured: true
  },
  {
    id: 2,
    title: "5 Tips to Make Your Web Story Stand Out",
    excerpt: "Learn how to use animations and music effectively to create immersive greeting experiences that leave a lasting impression.",
    category: "Tutorial",
    date: "Oct 08, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1626785774573-4b799314346d?auto=format&fit=crop&q=80&w=800",
    slug: "web-story-tips",
    featured: false
  },
  {
    id: 3,
    title: "Why Retro Design is Making a Comeback",
    excerpt: "Exploring the nostalgia behind 8-bit art and why Gen Z loves the pixelated aesthetic in modern digital products.",
    category: "Design",
    date: "Sep 28, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    slug: "retro-comeback",
    featured: false
  },
  {
    id: 4,
    title: "Connecting Long Distance Relationships",
    excerpt: "How Cardify helps bridge the gap between hearts separated by miles. Real stories from our community.",
    category: "Stories",
    date: "Sep 15, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
    slug: "ldr-connection",
    featured: false
  },
  {
    id: 5,
    title: "The Future of E-Cards is Interactive",
    excerpt: "Static images are out. See how interactivity is changing the way we celebrate birthdays and anniversaries.",
    category: "Tech",
    date: "Sep 10, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    slug: "interactive-future",
    featured: false
  }
];

// --- WRAPPER SESSION (dibutuhkan karena komponen ini pakai useSession()) ---
export default function BlogPage() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  );
}

// --- KONTEN UTAMA ---
function HomeContent() {
  // State
  const [decorations, setDecorations] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  // NEW (tambahan, tidak mengubah fungsi lama): search query
  const [query, setQuery] = useState("");

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Efek Samping: Auth Check & Scroll
  useEffect(() => {
    document.title = "Blog - Cardify";

    // Check Manual Login
    if (typeof window !== "undefined") {
      const isManualLogin = localStorage.getItem("isLoggedIn");
      if (isManualLogin === "true") {
        setUserData({
          name: localStorage.getItem("userName") || "User",
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
  }, []);

  const initiateLogout = () => {
    setShowProfileMenu(false);
    setShowLogoutConfirm(true);
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUserData(null);
    window.location.href = "/";
  };

  const categoryPosts = activeCategory === "All"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  // search hanya menyaring hasil (fungsi tambahan)
  const filteredPosts = query.trim()
    ? categoryPosts.filter(p =>
        (p.title + " " + p.excerpt + " " + p.category).toLowerCase().includes(query.trim().toLowerCase())
      )
    : categoryPosts;

  return (
    <div className="min-h-screen w-full flex flex-col font-sans" style={{ background: PAPER, color: INK }}>

      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Archivo+Black&family=Boldonse&display=swap');
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'DM Sans', sans-serif; }
          .font-dozo { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
      `}} />

      {/* --- ANNOUNCEMENT TICKER --- */}
            <div className="relative z-[60] w-full bg-[#1C1917] text-[#FDFBF3] overflow-hidden py-2.5 select-none">
              <motion.div
                className="flex whitespace-nowrap w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-8 px-4 text-[11px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Sparkles size={12} className="text-[#F6C445]" /> New Photobooth is live, snap &amp; send in seconds</span>
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

      {/* --- BACKGROUND DECORATIONS (SUBTLE) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {decorations.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.color} opacity-20 animate-pulse transition-transform duration-[4000ms] ease-in-out`}
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              transform: `rotate(${item.rotation}deg)`,
              animationDuration: `${4 + item.delay}s`,
            }}
          >
            {renderIcon(item.type, item.size)}
          </div>
        ))}
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full opacity-40" style={{ background: LILAC }} />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full opacity-40" style={{ background: SKY }} />
      </div>

      {/* --- NAVBAR --- */}
      <nav
        className={`relative z-50 w-full border-b-[2.5px] transition-all duration-300 ${scrolled ? "py-3 shadow-[0_4px_0_0_#1C1917]" : "py-5"}`}
        style={{ background: CREAM, borderColor: INK }}
      >
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

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center gap-8 text-sm font-black uppercase tracking-wide absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full" style={{ color: INK }}>

            {/* 1. Templates Dropdown */}
            <div className="relative group h-full flex items-center cursor-pointer">
              <a href="/templates" className="relative py-2 flex items-center gap-1 transition-opacity hover:opacity-60">
                Templates
                <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
              </a>

              {/* Dropdown Menu */}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 rounded-3xl border-[2.5px] p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50 normal-case"
                style={{ background: CREAM, borderColor: INK, boxShadow: `6px 6px 0 0 ${INK}` }}
              >
                <p className="text-[10px] font-black uppercase tracking-wider mb-2 px-2 opacity-60">Create New</p>

                <a href="/web-story" className="flex items-start gap-3 p-3 rounded-2xl transition-colors hover:bg-[#F3B8CC]/30 mb-1">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-[2.5px]" style={{ background: PINK, borderColor: INK, color: INK }}>
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Web Story</p>
                    <p className="text-[10px] font-bold leading-tight mt-0.5 normal-case opacity-60">Interactive, Music, Animations</p>
                  </div>
                </a>

                <a href="/templates?filter=card-image" className="flex items-start gap-3 p-3 rounded-2xl transition-colors hover:bg-[#F6C445]/30">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-[2.5px]" style={{ background: YELLOW, borderColor: INK, color: INK }}>
                    <ImageIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Card Image</p>
                    <p className="text-[10px] font-bold leading-tight mt-0.5 normal-case opacity-60">Static, Printable, Classic</p>
                  </div>
                </a>
              </div>
            </div>

            {/* 2. Features */}
            <a href="/features" className="relative group transition-opacity hover:opacity-60">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-[3px] transition-all group-hover:w-full" style={{ background: CORAL }}></span>
            </a>

            {/* 3. About */}
            <a href="/about" className="relative group transition-opacity hover:opacity-60">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-[3px] transition-all group-hover:w-full" style={{ background: MINT }}></span>
            </a>

            {/* 4. Contact */}
            <a href="/contact" className="relative group transition-opacity hover:opacity-60">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-[3px] transition-all group-hover:w-full" style={{ background: SKY }}></span>
            </a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">

            {session ? (
              // --- LOGGED IN STATE ---
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border-[2.5px] transition-all duration-200 active:translate-y-0.5"
                  style={{ background: CREAM, borderColor: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
                >
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={34}
                      height={34}
                      className="rounded-full border-2"
                      style={{ borderColor: INK }}
                    />
                  ) : (
                    <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center border-2" style={{ background: YELLOW, borderColor: INK, color: INK }}>
                      <User size={16} />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-black block max-w-[80px] truncate leading-tight" style={{ color: INK }}>
                      {session?.user?.name || "User"}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider leading-none opacity-60">Free Plan</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div
                    className="absolute top-full right-0 mt-3 w-72 rounded-3xl border-[2.5px] p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                    style={{ background: CREAM, borderColor: INK, boxShadow: `6px 6px 0 0 ${INK}` }}
                  >
                    <div className="p-4 rounded-2xl mb-2 border-[2.5px]" style={{ background: PAPER, borderColor: INK }}>
                      <p className="text-sm font-black truncate">{session?.user?.name}</p>
                      <p className="text-xs font-bold truncate opacity-60">{session?.user?.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <a href="/account" className="flex items-center gap-3 w-full p-2.5 text-sm rounded-2xl transition-all font-bold hover:bg-[#F6C445]/25 group">
                        <div className="w-8 h-8 rounded-xl border-[2.5px] flex items-center justify-center group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all" style={{ background: YELLOW, borderColor: INK, color: INK }}><User size={16} /></div>
                        Profile &amp; Account
                      </a>
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm rounded-2xl transition-all font-bold hover:bg-[#BFE0F5]/35 group">
                        <div className="w-8 h-8 rounded-xl border-[2.5px] flex items-center justify-center group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all" style={{ background: SKY, borderColor: INK, color: INK }}><Settings size={16} /></div>
                        Preferences
                      </button>
                      <div className="h-[2px] my-1 mx-2" style={{ background: INK, opacity: 0.15 }}></div>
                      <button onClick={initiateLogout} className="flex items-center gap-3 w-full p-2.5 text-sm rounded-2xl transition-all font-bold hover:bg-[#F3B8CC]/35 group">
                        <div className="w-8 h-8 rounded-xl border-[2.5px] flex items-center justify-center group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all" style={{ background: PINK, borderColor: INK, color: INK }}><LogOut size={16} /></div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // --- LOGGED OUT STATE ---
              <div className="flex items-center gap-6">
                <a href="/login" className="hidden md:flex text-sm font-black uppercase tracking-wide transition-opacity hover:opacity-60" style={{ color: INK }}>
                  Log in
                </a>
                <a href="/register" className="hidden md:flex text-sm font-black uppercase tracking-wide transition-opacity hover:opacity-60" style={{ color: INK }}>
                  Sign Up
                </a>
              </div>
            )}
            <a
              href="/templates"
              className="px-6 py-2.5 rounded-full border-[2.5px] text-sm font-black flex items-center gap-2 transition-all active:translate-y-0.5"
              style={{ background: INK, color: CREAM, borderColor: INK, boxShadow: `4px 4px 0 0 ${CORAL}` }}
            >
              Start Creating <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO HEADER --- */}
      <header className="relative overflow-hidden border-b-[2.5px] px-6 pt-20 pb-16" style={{ background: MINT, borderColor: INK }}>
        {/* stickers */}
        <div className="pointer-events-none absolute left-8 top-14 hidden rotate-[-12deg] md:block">
        </div>
        <div className="pointer-events-none absolute right-10 top-24 hidden rotate-[10deg] md:block">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-[2.5px]" style={{ background: PINK, borderColor: INK, color: INK, boxShadow: `4px 4px 0 0 ${INK}` }}>
            <Heart size={22} fill="currentColor" />
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">

          <h1 className="font-dozo text-5xl md:text-7xl font-black italic leading-[0.9] tracking-[-0.03em]" style={{ color: INK }}>
            Stories &amp;<br />Inspiration
          </h1>

          <p className="mx-auto max-w-2xl text-base font-bold leading-relaxed" style={{ color: INK }}>
            Tips, tutorials, and stories to help you express your feelings beautifully in the digital age.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border-[2.5px] pl-12 pr-4 py-3.5 text-sm font-bold placeholder:opacity-50 focus:outline-none"
              style={{ background: CREAM, borderColor: INK, color: INK, boxShadow: `4px 4px 0 0 ${INK}` }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: INK }} />
          </div>
        </div>
      </header>

      {/* --- BLOG CONTENT --- */}
      <div className="flex-grow py-16 px-6" style={{ background: PAPER }}>
        <div className="max-w-7xl mx-auto">

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['All', 'Lifestyle', 'Tutorial', 'Design', 'Stories', 'Tech'].map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-full border-[2.5px] px-5 py-2 text-sm font-black uppercase tracking-wide transition-all active:translate-y-0.5"
                  style={{
                    background: active ? INK : CREAM,
                    color: active ? CREAM : INK,
                    borderColor: INK,
                    boxShadow: active ? `4px 4px 0 0 ${CAT_COLORS[cat] || YELLOW}` : `3px 3px 0 0 ${INK}`,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Featured Post (Only show if All or Lifestyle) */}
          {activeCategory === 'All' && (
            <div className="mb-16">
              <div
                className="group relative overflow-hidden rounded-[2.5rem] border-[2.5px] transition-all duration-300 hover:-translate-y-1"
                style={{ background: CREAM, borderColor: INK, boxShadow: `10px 10px 0 0 ${INK}` }}
              >
                <div className="grid md:grid-cols-2 gap-0 h-full">
                  <div className="relative h-64 md:h-auto overflow-hidden border-b-[2.5px] md:border-b-0 md:border-r-[2.5px]" style={{ borderColor: INK }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={BLOG_POSTS[0].image}
                      alt={BLOG_POSTS[0].title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-6 left-6 rotate-[-6deg]">
                      <span className="rounded-full border-[2.5px] px-3 py-1 text-[10px] font-black uppercase tracking-widest" style={{ background: YELLOW, borderColor: INK, color: INK, boxShadow: `3px 3px 0 0 ${INK}` }}>
                        ★ Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest mb-4" style={{ color: INK }}>
                      <span className="flex items-center gap-1 rounded-full border-2 px-2.5 py-1" style={{ background: CAT_COLORS[BLOG_POSTS[0].category], borderColor: INK }}>
                        <Tag size={11} /> {BLOG_POSTS[0].category}
                      </span>
                      <span>{BLOG_POSTS[0].date}</span>
                    </div>
                    <h2 className="font-dozo mb-4 text-3xl md:text-4xl font-black italic leading-tight tracking-[-0.02em]" style={{ color: INK }}>
                      {BLOG_POSTS[0].title}
                    </h2>
                    <p className="mb-8 text-base font-bold leading-relaxed opacity-70" style={{ color: INK }}>
                      {BLOG_POSTS[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-2 rounded-full border-[2.5px] px-5 py-2.5 text-sm font-black transition-all active:translate-y-0.5"
                        style={{ background: INK, color: CREAM, borderColor: INK, boxShadow: `4px 4px 0 0 ${CORAL}` }}
                      >
                        Read Article <ArrowUpRight size={16} />
                      </button>
                      <span className="flex items-center gap-1 text-xs font-black uppercase tracking-wider opacity-60">
                        <Clock size={12} /> {BLOG_POSTS[0].readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => !post.featured || activeCategory !== 'All').map((post, i) => (
              <article
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-[2rem] border-[2.5px] transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: CREAM, borderColor: INK, boxShadow: `8px 8px 0 0 ${INK}` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b-[2.5px]" style={{ borderColor: INK }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 rotate-[6deg]">
                    <span className="rounded-full border-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest" style={{ background: CAT_COLORS[post.category] || YELLOW, borderColor: INK, color: INK, boxShadow: `3px 3px 0 0 ${INK}` }}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-full border-2 px-2.5 py-0.5 text-[10px] font-black" style={{ background: CREAM, borderColor: INK, color: INK }}>
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">
                    <Calendar size={12} />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-dozo mb-3 text-xl font-black italic leading-snug tracking-[-0.02em]" style={{ color: INK }}>
                    {post.title}
                  </h3>
                  <p className="mb-6 flex-grow text-sm font-bold leading-relaxed line-clamp-3 opacity-70" style={{ color: INK }}>
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t-[2.5px] pt-4" style={{ borderColor: INK }}>
                    <span className="flex items-center gap-1 text-xs font-black uppercase tracking-wider opacity-60">
                      <Clock size={12} /> {post.readTime}
                    </span>
                    <span className="flex cursor-pointer items-center gap-1 text-sm font-black uppercase transition-transform group-hover:translate-x-1" style={{ color: INK }}>
                      Read <ArrowRight size={14} strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="mx-auto mt-8 max-w-md rounded-[2rem] border-[2.5px] px-8 py-14 text-center" style={{ background: CREAM, borderColor: INK, boxShadow: `8px 8px 0 0 ${INK}` }}>
              <div className="mx-auto mb-5 flex h-16 w-16 rotate-[-8deg] items-center justify-center rounded-full border-[2.5px]" style={{ background: LILAC, borderColor: INK, color: INK, boxShadow: `4px 4px 0 0 ${INK}` }}>
                <Search size={26} />
              </div>
              <p className="font-dozo text-2xl font-black italic" style={{ color: INK }}>Nothing here yet</p>
              <p className="mt-2 text-sm font-bold opacity-60">No articles found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- POPUP KONFIRMASI LOGOUT --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1917]/50 p-4 animate-in fade-in duration-300" onClick={() => setShowLogoutConfirm(false)}>
          <div
            className="relative w-full max-w-sm rounded-[2rem] border-[2.5px] p-8 text-center animate-in zoom-in-95 duration-300"
            style={{ background: CREAM, borderColor: INK, boxShadow: `10px 10px 0 0 ${INK}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-4 -right-3 rotate-[12deg] rounded-2xl border-[2.5px] px-3 py-1 text-[10px] font-black uppercase tracking-widest" style={{ background: YELLOW, borderColor: INK, color: INK, boxShadow: `3px 3px 0 0 ${INK}` }}>
              Bye-bye!
            </div>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-[2.5px]" style={{ background: PINK, borderColor: INK, color: INK, boxShadow: `4px 4px 0 0 ${INK}` }}>
              <LogOut size={26} strokeWidth={2.5} />
            </div>
            <h3 className="font-dozo mb-3 text-2xl font-black italic uppercase" style={{ color: INK }}>Sign Out?</h3>
            <p className="mb-8 px-2 text-sm font-bold leading-relaxed opacity-70" style={{ color: INK }}>
              Are you sure you want to sign out? You will need to log in again to access your saved templates.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full rounded-full border-[2.5px] py-3.5 font-black uppercase tracking-wide transition-all active:translate-y-0.5"
                style={{ background: CORAL, color: INK, borderColor: INK, boxShadow: `5px 5px 0 0 ${INK}` }}
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full rounded-full border-[2.5px] py-3.5 font-black uppercase tracking-wide transition-all active:translate-y-0.5"
                style={{ background: CREAM, color: INK, borderColor: INK, boxShadow: `5px 5px 0 0 ${INK}` }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER (UPDATED: Match Home & Privacy) --- */}
      <footer
        className="relative isolate w-full border-t-[2.5px] px-6 py-12 overflow-hidden"
        style={{ background: MINT, borderColor: INK }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4">

            {/* Brand */}
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
              <p className="text-sm font-medium leading-relaxed" style={{ color: INK }}>
                The modern way to celebrate. Digital moments that last forever.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-widest" style={{ color: INK }}>Product</h4>
              <ul className="space-y-2 text-sm font-bold">
                <li><a href="/templates" className="transition-opacity hover:opacity-60" style={{ color: INK }}>Templates</a></li>
                <li><a href="/showcase" className="transition-opacity hover:opacity-60" style={{ color: INK }}>Showcase</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-widest" style={{ color: INK }}>Company</h4>
              <ul className="space-y-2 text-sm font-bold">
                <li><a href="/about" className="hover:opacity-60" style={{ color: INK }}>About</a></li>
                <li><a href="/careers" className="hover:opacity-60" style={{ color: INK }}>Careers</a></li>
                <li><a href="/blog" className="hover:opacity-60" style={{ color: "#FFFFFF" }}>Blog</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-widest" style={{ color: INK }}>Connect</h4>
              <div className="flex flex-col gap-3">
                <a href="https://instagram.com/alfinnsptr" target="_blank" className="flex items-center gap-3 hover:opacity-60" style={{ color: INK }}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2" style={{ background: CREAM, borderColor: INK }}>
                    <Instagram size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold">Instagram</span>
                </a>
                <a href="https://wa.me/6289501847804" target="_blank" className="flex items-center gap-3 hover:opacity-60" style={{ color: INK }}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2" style={{ background: CREAM, borderColor: INK }}>
                    <MessageCircle size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col items-center justify-between gap-4 border-t-[2.5px] pt-6 md:flex-row" style={{ borderColor: INK }}>
            <p
  className="text-xs font-black uppercase tracking-wider"
  style={{ color: "#1C1917" }}
>
  © 2025 Cardify · Made with love
</p>
            <div className="flex gap-6 text-xs font-black uppercase tracking-wider" style={{ color: INK }}>
              <a href="/privacy-policy" className="hover:opacity-60">Privacy</a>
              <a href="/terms" className="hover:opacity-60">Terms</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
