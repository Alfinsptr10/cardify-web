"use client";

import { useState, useEffect, useRef } from "react";
// MOCK IMPORTS REPLACEMENT
import { 
  ArrowRight, Sparkles, Gift, Heart, Phone, Star, PenTool, Play, 
  Instagram, MessageCircle, LogIn, Quote, UserPlus, 
  Flower2, Bird, Cloud, Music,
  User, LogOut, Settings, ChevronDown, Layout, CheckCircle2,
  Newspaper, Stamp, Smartphone, Zap, Share2, Palette, Image as ImageIcon
} from "lucide-react";

// --- WRAPPER SESSION (Mock) ---
export default function Home() {
  return (
    <HomeContent />
  );
}

// --- KONTEN UTAMA ---
function HomeContent() {
  // State
  const [decorations, setDecorations] = useState<any[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // State User Data (Simulasi Session)
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Efek Samping: Cek Login, Animasi Background, & Scroll Listener
  useEffect(() => {
    // Set Judul Halaman
    document.title = "Cardify - Share Feelings Beautifully";

    // Cek Login Manual dari LocalStorage (Simulasi NextAuth)
    if (typeof window !== "undefined") {
      const isManualLogin = localStorage.getItem("isLoggedIn");
      if (isManualLogin === "true") {
        setUserData({
          name: localStorage.getItem("userName") || "User", // Translated "Pengguna"
          email: localStorage.getItem("userEmail") || "user@cardify.id", 
          image: null, 
        });
      }
    }

    // Generate Hiasan dengan WARNA 10% (ACCENT) & 30% (SECONDARY) yang LEMBUT
    const items = [];
    const types = ['flower', 'bird', 'gift', 'heart', 'sparkle', 'cloud', 'music'];
    const colors = [
      'text-amber-300',   // Gold Accent
      'text-stone-300',   // Secondary
      'text-orange-200',  // Warmth
      'text-yellow-400',  // Celebration
      'text-stone-400',   // Depth
    ];

    for (let i = 0; i < 35; i++) {
      items.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 16 + Math.random() * 24,
        rotation: Math.random() * 360,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setDecorations(items);

    // Event Listeners
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

  const initiateLogout = () => {
    setShowProfileMenu(false);
    setShowLogoutConfirm(true);
  };

  const handleLogout = async () => {
    // Simulasi Logout
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    
    setUserData(null);
    setShowLogoutConfirm(false);
    window.location.reload();
  };

  return (
    // 60% DOMINANT COLOR: Stone-50 (Warm White)
    <div className={`min-h-screen w-full bg-[#FAFAF9] text-[#1C1917] selection:bg-[#D97706] selection:text-white flex flex-col relative overflow-hidden font-dm-sans`}>
      
      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Press+Start+2P&display=swap');
          
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-press-start { font-family: 'Press Start 2P', cursive; }
      `}} />

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

      {/* --- TOP ANNOUNCEMENT REMOVED --- */}

      {/* --- PREMIUM NAVBAR --- */}
      <nav className={`relative z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-[#FAFAF9]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3" : "bg-transparent border-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
               <Gift size={18} strokeWidth={2.5} className="text-amber-400" />
            </div>
            <span className={`text-2xl font-bold tracking-tight font-playfair italic text-[#1C1917]`}>Cardify.</span>
          </div>
          
          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full">
            
            {/* 1. Templates Dropdown */}
            <div className="relative group h-full flex items-center cursor-pointer">
                <a href="/templates" className="hover:text-[#1C1917] transition-colors relative py-2 flex items-center gap-1 group-hover:text-amber-600">
                  Templates
                  <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-transform duration-300 group-hover:rotate-180 text-amber-600" />
                </a>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white rounded-2xl shadow-xl border border-stone-100 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
                   <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-stone-100 transform rotate-45"></div>
                   
                   <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">Create New</p>

                   {/* Web Story Option - Direct Link to Filter */}
                   <a href="/web-story" className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors group/item relative z-10 mb-1">
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex-shrink-0 flex items-center justify-center text-rose-500 group-hover/item:bg-rose-500 group-hover/item:text-white transition-all shadow-sm">
                         <Smartphone size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-stone-800 group-hover/item:text-rose-600 transition-colors">Web Story</p>
                         <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5">Interactive, Music, Animations</p>
                      </div>
                   </a>

                   {/* Card Image Option - Direct Link to Filter */}
                   <a href="/templates?filter=card-image" className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors group/item relative z-10">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex-shrink-0 flex items-center justify-center text-amber-500 group-hover/item:bg-amber-500 group-hover/item:text-white transition-all shadow-sm">
                         <ImageIcon size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-stone-800 group-hover/item:text-amber-600 transition-colors">Card Image</p>
                         <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5">Static, Printable, Classic</p>
                      </div>
                   </a>
                </div>
            </div>
            
            {/* 2. Features */}
            <a href="#features" className="hover:text-[#1C1917] transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
            </a>

            {/* 3. About */}
            <a href="/about" className="hover:text-[#1C1917] transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
            </a>
            
            {/* 4. Contact */}
            <a href="mailto:cardify.official.id@gmail.com" className="hover:text-[#1C1917] transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
            </a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            
            {userData ? (
              // --- LOGGED IN STATE ---
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 group"
                >
                  {userData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userData.image} alt={userData.name} width={34} height={34} className="rounded-full border border-stone-100" />
                  ) : (
                    <div className="w-[34px] h-[34px] bg-gradient-to-tr from-amber-100 to-orange-50 rounded-full flex items-center justify-center border border-white text-[#1C1917] shadow-inner">
                      <User size={16} />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                      <span className="text-xs font-bold text-stone-800 block max-w-[80px] truncate leading-tight">{userData.name}</span>
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider leading-none">Free Plan</span>
                  </div>
                  <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 group-hover:text-amber-600 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-100 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5">
                    <div className="p-4 bg-stone-50/50 rounded-xl mb-2 border border-stone-100">
                      <p className="text-sm font-bold text-stone-900 truncate">{userData.name}</p>
                      <p className="text-xs text-stone-500 truncate font-medium">{userData.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-black rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all"><User size={16} /></div>
                        Profile & Account
                      </button>
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-black rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all"><Settings size={16} /></div>
                        Preferences
                      </button>
                      <div className="h-px bg-stone-100 my-1 mx-2"></div>
                      <button onClick={initiateLogout} className="flex items-center gap-3 w-full p-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all"><LogOut size={16} /></div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // --- LOGGED OUT STATE ---
              <div className="flex items-center gap-6">
                <a href="#" className="hidden md:flex text-sm font-bold text-stone-600 hover:text-black transition-colors">
                   Log in
                </a>
                <a href="#" className="hidden md:flex text-sm font-bold text-stone-600 hover:text-black transition-colors">
                   Sign Up
                </a>
              </div>
            )}

            {/* CTA Button */}
            <a href="/templates" className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-sm font-bold hover:bg-black hover:scale-105 hover:shadow-xl hover:shadow-amber-900/10 transition-all flex items-center gap-2">
              Start Creating
              <ArrowRight size={16} strokeWidth={2.5} className="text-amber-400" />
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-grow relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8 animate-in slide-in-from-bottom-5 duration-1000">
             {/* Badge */}
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 bg-white/60 backdrop-blur-sm text-xs font-bold text-stone-600 uppercase tracking-widest shadow-sm hover:shadow-md transition-all cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                No. #1 Card Generator
             </div>

             <h1 className={`text-5xl md:text-7xl font-medium leading-[1.1] text-[#1C1917] font-playfair`}>
               Express Feelings, <br />
               <span className="italic text-stone-500 relative inline-block mt-2">
                 Beyond Distance.
                 <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" /></svg>
               </span>
             </h1>
             
             <p className="text-lg md:text-xl text-stone-500 leading-relaxed max-w-lg font-light">
               Create personal and aesthetic digital greeting cards in seconds. 
               Choose a template, customize, and send to your loved ones.
             </p>

             <div className="flex flex-wrap items-center gap-4 pt-4">
                <a href={userData ? "/templates" : "/register"} className="px-8 py-4 rounded-full bg-[#1C1917] text-white font-bold tracking-wide hover:bg-black transition-all shadow-xl shadow-stone-200 hover:-translate-y-1 flex items-center gap-3">
                   {userData ? <Sparkles size={20} className="text-amber-400" /> : <UserPlus size={20} className="text-amber-400" />}
                   {userData ? "Create Card Now" : "Sign Up Free"}
                </a>
             </div>
             
             {/* --- REMOVED HAPPY USERS SECTION --- */}
          </div>

          {/* Right: Visual Illustration */}
          <div className="lg:col-span-5 relative h-[500px] md:h-[600px] flex items-center justify-center animate-in zoom-in duration-1000 delay-200">
             <div className="relative z-10 w-80 md:w-96 aspect-[9/16] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-white overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-all duration-700 hover:scale-105 ring-1 ring-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                   src="/retro-gameboy-2.png" 
                   alt="App Preview"
                   className="object-contain bg-stone-50 w-full h-full"
                />
                
                {/* Dynamic Island style element */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full flex items-center justify-center gap-2 px-3 shadow-lg">
                   <div className="w-1.5 h-1.5 rounded-full bg-stone-800"></div>
                   <div className="w-10 h-1.5 rounded-full bg-stone-800/50"></div>
                </div>
             </div>

             {/* Background Blobs */}
             <div className="absolute top-10 right-0 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-40 mix-blend-multiply animate-pulse" />
             <div className="absolute bottom-10 left-10 w-72 h-72 bg-stone-200 rounded-full blur-3xl opacity-40 mix-blend-multiply animate-pulse delay-1000" />
             
             {/* Floating Badges */}
             <div className="absolute top-1/4 -right-4 md:-right-8 z-20 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl animate-bounce duration-[4000ms] border border-white/50">
                <Heart className="text-rose-500 fill-rose-500 drop-shadow-md" size={32} />
             </div>
             <div className="absolute bottom-1/4 -left-4 md:-left-8 z-20 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl shadow-xl animate-bounce duration-[5000ms] border border-white/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 border border-green-200"><CheckCircle2 size={20} /></div>
                <div>
                   <p className="text-xs font-bold text-stone-900">Message Sent!</p>
                   <p className="text-[10px] text-stone-500 font-medium">Just now to Sarah</p>
                </div>
             </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section id="features" className="py-24 bg-white relative overflow-hidden scroll-mt-24 border-t border-stone-100">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] mb-3 block">Why Choose Us</span>
                    <h2 className={`text-3xl md:text-4xl font-medium text-[#1C1917] font-playfair mb-6`}>Features that Sparkle</h2>
                    <p className="text-stone-500 text-lg font-light leading-relaxed">
                        We provide the best tools to make your special moments even more memorable and unforgettable.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="group p-8 rounded-3xl bg-[#FAFAF9] border border-stone-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">Instant & Easy</h3>
                        <p className="text-stone-500 leading-relaxed font-light">No design skills needed. Just choose a template, fill in the message, and send in seconds.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group p-8 rounded-3xl bg-[#FAFAF9] border border-stone-100 hover:border-rose-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <Smartphone size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">Interactive Web Story</h3>
                        <p className="text-stone-500 leading-relaxed font-light">More than just an image. Create interactive stories with background music and stunning animations.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group p-8 rounded-3xl bg-[#FAFAF9] border border-stone-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <Palette size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">Unique Templates</h3>
                        <p className="text-stone-500 leading-relaxed font-light">A variety of aesthetic templates ranging from Retro, Minimalist, to Classic Postcard.</p>
                    </div>
                </div>
            </div>
            
            {/* Background Decoration for Features */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-stone-50 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute -right-20 top-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-30 -z-10" />
        </section>

        {/* --- TEMPLATE GALLERY SECTION (PREVIEW ONLY) --- */}
        <section className="bg-[#FAFAF9] py-32 border-t border-stone-200/60 scroll-mt-20">
           <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                  <div className="max-w-xl">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] block mb-3">Our Collections</span>
                    <h2 className={`text-4xl md:text-5xl font-medium text-[#1C1917] font-playfair`}>
                       Find Your Style
                    </h2>
                  </div>
                  {/* CHANGED: Link to /templates */}
                  <a href="/templates" className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-black transition-colors group">
                      View All Templates <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  
                  {/* CARD 1: RETRO */}
                  <a href="/templates/retro-gameboy" className="group cursor-pointer block h-full">
                     <div className="relative aspect-[2/3] bg-white rounded-[1.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-stone-100 group-hover:-translate-y-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/retro-gameboy.png" alt="Retro Gameboy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-widest shadow-sm">Best Seller</div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                           <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-white/20 flex items-center gap-2">Use Template <ArrowRight size={14} /></span>
                        </div>
                     </div>
                     <div className="px-1">
                        <h3 className="text-xl font-medium mb-1 group-hover:text-stone-600 transition-colors font-serif">Retro 8-Bit</h3>
                        <p className="text-stone-400 text-sm leading-relaxed font-light">Nostalgic console aesthetic.</p>
                     </div>
                  </a>

                  {/* CARD 2: WEB STORY */}
                  <a href="/web-story" className="group cursor-pointer block h-full">
                     <div className="relative aspect-[9/16] bg-stone-900 rounded-[1.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-stone-800 group-hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-b from-stone-800 to-black opacity-80" />
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform shadow-lg text-sky-300">
                               <Smartphone size={32} />
                            </div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-2">Interactive</span>
                            <h4 className={`text-white text-2xl font-medium font-playfair`}>Web Story</h4>
                        </div>
                        <div className="absolute top-5 right-5 bg-sky-500/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-sm z-20">New</div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-30">
                           <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-white/20 flex items-center gap-2">
                              Create Story <ArrowRight size={14} />
                           </span>
                        </div>
                     </div>
                     <div className="px-1">
                        <h3 className={`text-2xl font-medium mb-2 group-hover:text-amber-700 transition-colors font-playfair`}>Web Story</h3>
                        <p className="text-stone-500 text-sm leading-relaxed">Interactive story with music.</p>
                     </div>
                  </a>

                  {/* CENTER COLUMN GROUP */}
                  <div className="flex flex-col gap-8">
                      <a href="/templates/minimalist" className="group cursor-pointer block">
                         <div className="relative aspect-[3/2] bg-white rounded-[1.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-stone-100 group-hover:-translate-y-2 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/minimalist.png" alt="Minimalist" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-widest shadow-sm">Popular</div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                               <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-white/20 flex items-center gap-2">Use Template <ArrowRight size={14} /></span>
                            </div>
                         </div>
                         <div className="px-1">
                            <h3 className="text-xl font-medium mb-1 group-hover:text-stone-600 transition-colors font-serif">Modern Minimalist</h3>
                            <p className="text-stone-400 text-sm leading-relaxed font-light">Clean typography focus.</p>
                         </div>
                      </a>

                      <a href="/templates/postcard" className="group cursor-pointer block">
                         <div className="relative aspect-[3/2] bg-white rounded-[1.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-stone-100 group-hover:-translate-y-2 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/postcard.png" alt="Classic Postcard" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-widest shadow-sm z-10">Classic</div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-[2px]">
                               <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-white/20 flex items-center gap-2">Use Template <ArrowRight size={14} /></span>
                            </div>
                         </div>
                         <div className="px-1">
                            <h3 className="text-xl font-medium mb-1 group-hover:text-stone-600 transition-colors font-serif">Classic Postcard</h3>
                            <p className="text-stone-400 text-sm leading-relaxed font-light">Warm greetings, old style.</p>
                         </div>
                      </a>
                  </div>

                  {/* CARD 5: NEWSPAPER */}
                  <a href="/templates/newspaper" className="group cursor-pointer block h-full">
                     <div className="relative aspect-[2/3] bg-white rounded-[1.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-stone-100 group-hover:-translate-y-2 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/newspaper.png" alt="Vintage Newspaper" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-widest shadow-sm">New</div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                           <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-white/20 flex items-center gap-2">Use Template <ArrowRight size={14} /></span>
                        </div>
                     </div>
                     <div className="px-1">
                        <h3 className="text-xl font-medium mb-1 group-hover:text-stone-600 transition-colors font-serif">Vintage Press</h3>
                        <p className="text-stone-400 text-sm leading-relaxed font-light">Headline news aesthetic.</p>
                     </div>
                  </a>

              </div>
           </div>
        </section>

      </main>

      {/* --- PREMIUM FOOTER --- */}
      {/* Changed bg from stone-100 to #1C1917 (Dark Theme) as requested for better contrast */}
      <footer className="w-full bg-[#1C1917] border-t border-stone-800 pt-20 pb-10 relative z-20 text-stone-400">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
               <div className="md:col-span-1 space-y-4">
                  <div className="flex items-center gap-2">
                     {/* Logo Icon Container - Darker Theme */}
                     <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1C1917]">
                        <Gift size={16} className="text-amber-500" />
                     </div>
                     <span className={`text-2xl font-bold font-playfair italic text-white`}>Cardify.</span>
                  </div>
                  <p className="text-sm text-stone-500 leading-relaxed font-medium">
                     The modern way to celebrate. Creating digital moments that last forever.
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Product</h4>
                  <ul className="space-y-4 text-sm text-stone-500 font-medium">
                     <li className="hover:text-white cursor-pointer transition-colors">Templates</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Showcase</li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
                  <ul className="space-y-4 text-sm text-stone-500 font-medium">
                     {/* UPDATED: Link to /about */}
                     <li><a href="/about" className="hover:text-white cursor-pointer transition-colors">About</a></li>
                     <li><a href="#" className="hover:text-white cursor-pointer transition-colors">Careers</a></li>
                     <li><a href="#" className="hover:text-white cursor-pointer transition-colors">Blog</a></li>
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
                  <a href="privacy-policy" className="cursor-pointer hover:text-white transition-colors">Privacy Policy</a>
                  <a href="terms" className="cursor-pointer hover:text-white transition-colors">Terms of Service</a>
               </div>
            </div>
         </div>
      </footer>

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

    </div>
  );
}