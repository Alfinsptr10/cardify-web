"use client";

import Link from "next/link";
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
// MOCK IMPORTS REPLACEMENT: Use standard HTML/React components
import { 
  ArrowRight, Sparkles, Gift, Heart, Phone, Star, PenTool, Play, 
  Instagram, MessageCircle, LogIn, Quote, UserPlus, 
  Flower2, Bird, Cloud, Music, BookOpen, Search, Clock, Calendar, Tag, ArrowUpRight,
  User, LogOut, Settings, ChevronDown, Layout, CheckCircle2,
  Newspaper, Stamp, Smartphone, Zap, Share2, Palette, Image as ImageIcon,
  Gamepad2
} from "lucide-react";

// --- FONT CONFIG (Manual CSS Injection used in render) ---
const playfair = { className: "font-playfair" };
const dmSans = { className: "font-dm-sans" };

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

  const filteredPosts = activeCategory === "All" 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  return (
    <div className={`min-h-screen w-full bg-[#FAFAF9] text-[#1C1917] flex flex-col font-sans`}>
      
      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'DM Sans', sans-serif; }
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
        {/* Soft Gradients using Warm Tones */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-amber-100/30 rounded-full blur-[120px] -z-10 mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-stone-200/40 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`relative z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-[#FDFBF3]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3" : "bg-transparent border-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center shadow-[3px_3px_0_0_#F6C445] group-hover:rotate-12 group-hover:shadow-[4px_4px_0_0_#F6C445] transition-all duration-300 p-1.5">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src="/logo.svg" alt="Cardify" className="w-full h-full object-contain" />
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
          
          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wide text-stone-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full">
            
            {/* 1. Templates Dropdown */}
            <div className="relative group h-full flex items-center cursor-pointer">
                <a href="/templates" className="hover:text-[#1C1917] transition-colors relative py-2 flex items-center gap-1 group-hover:text-[#D9A400]">
                  Templates
                  <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-transform duration-300 group-hover:rotate-180 text-[#D9A400]" />
                </a>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white rounded-2xl shadow-xl border-2 border-[#1C1917] p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50 normal-case">
                   <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">Create New</p>

                   <a href="/web-story" className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F3B8CC]/20 transition-colors group/item relative z-10 mb-1">
                      <div className="w-10 h-10 rounded-full bg-[#F3B8CC] flex-shrink-0 flex items-center justify-center text-[#1C1917] border-2 border-[#1C1917] shadow-sm">
                         <Smartphone size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-stone-800">Web Story</p>
                         <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5 normal-case">Interactive, Music, Animations</p>
                      </div>
                   </a>

                   <a href="/templates?filter=card-image" className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F6C445]/20 transition-colors group/item relative z-10">
                      <div className="w-10 h-10 rounded-full bg-[#F6C445] flex-shrink-0 flex items-center justify-center text-[#1C1917] border-2 border-[#1C1917] shadow-sm">
                         <ImageIcon size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-stone-800">Card Image</p>
                         <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5 normal-case">Static, Printable, Classic</p>
                      </div>
                   </a>
                </div>
            </div>
            
            {/* 2. Features */}
            <a href="/features" className="hover:text-[#1C1917] transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F6C445] transition-all group-hover:w-full"></span>
            </a>

            {/* 3. About */}
            <a href="/about" className="hover:text-[#1C1917] transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F6C445] transition-all group-hover:w-full"></span>
            </a>
            
            {/* 4. Contact */}
            <a href="/contact" className="hover:text-[#1C1917] transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F6C445] transition-all group-hover:w-full"></span>
            </a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            
            {session ? (
              // --- LOGGED IN STATE ---
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 group"
                >
{session?.user?.image ? (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={session.user.image}
    alt={session.user.name || "User"}
    width={34}
    height={34}
    className="rounded-full border border-stone-100"
  />
) : (

                    <div className="w-[34px] h-[34px] bg-gradient-to-tr from-amber-100 to-orange-50 rounded-full flex items-center justify-center border border-white text-[#1C1917] shadow-inner">
                      <User size={16} />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                      <span className="text-xs font-bold text-stone-800 block max-w-[80px] truncate leading-tight">
                       {session?.user?.name || "User"}
                      </span>
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider leading-none">Free Plan</span>
                  </div>
                  <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 group-hover:text-amber-600 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl border-2 border-[#1C1917] shadow-[6px_6px_0_0_#1C1917] p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 bg-[#FDFBF3] rounded-xl mb-2 border-2 border-stone-100">
                      <p className="text-sm font-bold text-stone-900 truncate">{session?.user?.name}</p>
                      <p className="text-xs text-stone-500 truncate font-medium">{session?.user?.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <a href="/account" className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-[#F6C445]/15 hover:text-[#1C1917] rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-[#F6C445] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917] group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all"><User size={16} /></div>
                        Profile & Account
                      </a>
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-[#BFE0F5]/25 hover:text-[#1C1917] rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-[#BFE0F5] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917] group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all"><Settings size={16} /></div>
                        Preferences
                      </button>
                      <div className="h-px bg-stone-100 my-1 mx-2"></div>
                      <button onClick={initiateLogout} className="flex items-center gap-3 w-full p-2.5 text-sm text-red-600 hover:bg-[#F3B8CC]/25 rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-[#F3B8CC] border-2 border-[#1C1917] flex items-center justify-center text-red-600 group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all"><LogOut size={16} /></div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // --- LOGGED OUT STATE ---
              <div className="flex items-center gap-6">
                <a href="/login" className="hidden md:flex text-sm font-bold uppercase tracking-wide text-stone-600 hover:text-black transition-colors">
                   Log in
                </a>
                <a href="/register" className="hidden md:flex text-sm font-bold uppercase tracking-wide text-stone-600 hover:text-black transition-colors">
                   Sign Up
                </a>
              </div>
            )}
            <a href="/templates" className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-sm font-bold hover:bg-black hover:scale-105 hover:shadow-xl hover:shadow-amber-900/10 transition-all flex items-center gap-2">
              Start Creating <ArrowRight size={16} strokeWidth={2.5} className="text-amber-400" />
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO HEADER --- */}
      <header className="pt-40 pb-16 px-6 bg-white border-b border-stone-100 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-50/50 rounded-full blur-[120px] -z-10 pointer-events-none" />
         
         <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-widest shadow-sm">
                <BookOpen size={12} className="text-amber-500" />
                Our Blog
            </span>
            <h1 className={`text-4xl md:text-6xl font-bold text-[#1C1917] leading-tight font-playfair`}>
               Stories & Inspiration
            </h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
               Tips, tutorials, and stories to help you express your feelings beautifully in the digital age.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mt-8 relative">
               <input 
                 type="text" 
                 placeholder="Search articles..." 
                 className="w-full pl-12 pr-4 py-3.5 rounded-full border border-stone-200 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-200 shadow-sm transition-all"
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            </div>
         </div>
      </header>

      {/* --- BLOG CONTENT --- */}
      <div className="flex-grow bg-[#FAFAF9] py-16 px-6">
         <div className="max-w-7xl mx-auto">
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
               {['All', 'Lifestyle', 'Tutorial', 'Design', 'Stories', 'Tech'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                       activeCategory === cat 
                         ? 'bg-[#1C1917] text-white shadow-md' 
                         : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {cat}
                  </button>
               ))}
            </div>

            {/* Featured Post (Only show if All or Lifestyle) */}
            {activeCategory === 'All' && (
              <div className="mb-16">
                 <div className="group relative rounded-[2.5rem] overflow-hidden bg-white border border-stone-200 shadow-md hover:shadow-xl transition-all duration-500">
                    <div className="grid md:grid-cols-2 gap-0 h-full">
                       <div className="relative h-64 md:h-auto overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                             src={BLOG_POSTS[0].image} 
                             alt={BLOG_POSTS[0].title}
                             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-6 left-6">
                             <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider text-[#1C1917] shadow-sm">
                               Featured
                             </span>
                          </div>
                       </div>
                       <div className="p-8 md:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-3 text-xs font-bold text-amber-600 uppercase tracking-widest mb-4">
                             <span className="flex items-center gap-1"><Tag size={12}/> {BLOG_POSTS[0].category}</span>
                             <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                             <span>{BLOG_POSTS[0].date}</span>
                          </div>
                          <h2 className={`text-3xl md:text-4xl font-bold text-[#1C1917] mb-4 leading-tight group-hover:text-amber-700 transition-colors font-playfair`}>
                             {BLOG_POSTS[0].title}
                          </h2>
                          <p className="text-stone-500 text-lg mb-8 leading-relaxed">
                             {BLOG_POSTS[0].excerpt}
                          </p>
                          <div className="flex items-center gap-4">
                             <button className="flex items-center gap-2 text-sm font-bold text-[#1C1917] border-b-2 border-[#1C1917] pb-1 hover:text-amber-600 hover:border-amber-600 transition-all">
                                Read Article <ArrowUpRight size={16} />
                             </button>
                             <span className="flex items-center gap-1 text-xs text-stone-400 font-medium">
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
               {filteredPosts.filter(post => !post.featured || activeCategory !== 'All').map((post) => (
                  <article key={post.id} className="group bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col">
                     <div className="relative aspect-[4/3] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                           src={post.image} 
                           alt={post.title}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-widest shadow-sm">
                           {post.category}
                        </div>
                     </div>
                     <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">
                           <Calendar size={12} />
                           <span>{post.date}</span>
                        </div>
                        <h3 className={`text-xl font-bold text-[#1C1917] mb-3 leading-snug group-hover:text-amber-700 transition-colors font-playfair`}>
                           {post.title}
                        </h3>
                        <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                           {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
                           <span className="flex items-center gap-1 text-xs text-stone-400 font-medium">
                              <Clock size={12} /> {post.readTime}
                           </span>
                           <span className="text-sm font-bold text-[#1C1917] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
                              Read <ArrowRight size={14} />
                           </span>
                        </div>
                     </div>
                  </article>
               ))}
            </div>

            {filteredPosts.length === 0 && (
               <div className="text-center py-20">
                  <p className="text-stone-400 italic">No articles found in this category.</p>
               </div>
            )}
         </div>
      </div>

      {/* --- POPUP KONFIRMASI LOGOUT --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1917]/40 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center transform scale-100 animate-in zoom-in-95 duration-300 ring-1 ring-black/5" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 shadow-sm">
              <LogOut size={28} strokeWidth={1.5} />
            </div>
            <h3 className={`text-2xl font-bold text-stone-900 mb-3 font-playfair`}>Sign Out?</h3>
            <p className="text-sm text-stone-500 mb-8 leading-relaxed px-4">
              Are you sure you want to sign out? You will need to log in again to access your saved templates.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleLogout} className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100 active:scale-[0.98]">
                Yes, Sign Out
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className="w-full py-3.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors active:scale-[0.98]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER (UPDATED: Match Home & Privacy) --- */}
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
              src="/logo.svg"
              alt="Cardify"
              className="h-5 w-5 object-contain"
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
            <a href="/blog" className="hover:opacity-60" style={{ color: "#FFFFFF" }}>
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
        © {new Date().getFullYear()} Cardify · Made with love
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