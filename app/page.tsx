"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react"; 
import { useRouter } from "next/navigation";
import { Playfair_Display, DM_Sans, Press_Start_2P } from "next/font/google"; 
import { 
  ArrowRight, Sparkles, Gift, Heart, Phone, Star, PenTool, Play, 
  Instagram, MessageCircle, LogIn, Quote, UserPlus, 
  Flower2, Bird, Cloud, Music,
  User, LogOut, Settings, ChevronDown, Layout, CheckCircle2,
  Newspaper, Stamp 
} from "lucide-react";

// --- KONFIGURASI FONT ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: ["400"] }); 

// --- WRAPPER SESSION ---
export default function Home() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  );
}

// --- KONTEN UTAMA ---
function HomeContent() {
  const { data: session } = useSession(); 
  const router = useRouter();
  
  // State
  const [decorations, setDecorations] = useState<any[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // State User Data
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Efek Samping: Cek Login, Animasi Background, & Scroll Listener
  useEffect(() => {
    // Set Judul Halaman
    document.title = "Cardify";

    // 1. Cek Login Google/GitHub
    if (session?.user) {
      setUserData({
        name: session.user.name || "Pengguna",
        email: session.user.email || "user@cardify.id",
        image: session.user.image || null,
      });
    } 
    // 2. Cek Login Manual
    else if (typeof window !== "undefined") {
      const isManualLogin = localStorage.getItem("isLoggedIn");
      if (isManualLogin === "true") {
        setUserData({
          name: localStorage.getItem("userName") || "Pengguna",
          email: localStorage.getItem("userEmail") || "user@cardify.id", 
          image: null, 
        });
      }
    }

    // Generate Hiasan dengan WARNA 10% (ACCENT) & 30% (SECONDARY) yang LEMBUT
    const items = [];
    const types = ['flower', 'bird', 'gift', 'heart', 'sparkle', 'cloud', 'music'];
    // Palet warna hiasan disesuaikan dengan tema (Warm/Gold/Stone)
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
  }, [session]);

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
    await signOut({ redirect: false });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    
    setUserData(null);
    setShowLogoutConfirm(false);
    window.location.reload();
  };

  return (
    // 60% DOMINANT COLOR: Stone-50 (Warm White)
    <div className={`min-h-screen w-full bg-[#FAFAF9] text-[#1C1917] selection:bg-[#D97706] selection:text-white flex flex-col relative overflow-hidden ${dmSans.className}`}>
      
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

      {/* --- TOP ANNOUNCEMENT (30% Secondary Color) --- */}
      <div className="relative z-50 bg-[#1C1917] text-white text-[10px] md:text-xs font-medium py-2.5 text-center tracking-widest uppercase transition-transform">
        <span className="opacity-80">🎉 Special Offer: </span> 
        {/* 10% ACCENT COLOR: Amber/Gold */}
        <span className="font-bold text-amber-400 ml-1">HELLO2025</span> 
        <span className="opacity-80 ml-1">- Unlock Premium Templates</span>
      </div>

      {/* --- PREMIUM NAVBAR --- */}
      <nav className={`relative z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-[#FAFAF9]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3" : "bg-transparent border-transparent py-5"}`}>
        {/* Tambahkan class 'relative' di container navbar */}
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {/* 30% Secondary Color: Dark Icon Background */}
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
               {/* 10% Accent Color: Icon itself could be Gold, but White is cleaner on Dark */}
               <Gift size={18} strokeWidth={2.5} className="text-amber-400" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${playfair.className} italic text-[#1C1917]`}>Cardify.</span>
          </div>
          
          {/* Navigation Links - Positioned ABSOLUTELY to Center */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            
            {/* 1. Templates (Updated from Collections) */}
            <Link href="#templates" className="hover:text-[#1C1917] transition-colors relative group">
              Templates
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
            </Link>
            
            {/* 2. Features */}
            <Link href="#features" className="hover:text-[#1C1917] transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
            </Link>

            {/* 3. About */}
            <Link href="/about" className="hover:text-[#1C1917] transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
            </Link>
            
            {/* 4. Contact (Updated from Pricing) */}
            <Link href="mailto:cardify.official.id@gmail.com" className="hover:text-[#1C1917] transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
            </Link>
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
                    <Image src={userData.image} alt={userData.name} width={34} height={34} className="rounded-full border border-stone-100" />
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
                <Link href="/login" className="hidden md:flex text-sm font-bold text-stone-600 hover:text-black transition-colors">
                   Log in
                </Link>
                <Link href="/register" className="hidden md:flex text-sm font-bold text-stone-600 hover:text-black transition-colors">
                   Sign Up
                </Link>
              </div>
            )}

            {/* CTA Button (30% Secondary + 10% Accent) */}
            <Link href="#templates" className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-sm font-bold hover:bg-black hover:scale-105 hover:shadow-xl hover:shadow-amber-900/10 transition-all flex items-center gap-2">
              Start Creating
              {/* 10% Accent on Icon */}
              <ArrowRight size={16} strokeWidth={2.5} className="text-amber-400" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-grow relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-20 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
             {/* Badge with Accent Color */}
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 bg-white/60 backdrop-blur-sm text-xs font-bold text-stone-600 uppercase tracking-widest shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                No. #1 Card Generator
             </div>

             <h1 className={`text-5xl md:text-7xl font-medium leading-[1.1] text-[#1C1917] ${playfair.className}`}>
               Sampaikan Rasa, <br />
               <span className="italic text-stone-500 relative">
                 Tanpa Jarak.
                 {/* 10% Accent: Underline Decoration */}
                 <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" /></svg>
               </span>
             </h1>
             
             <p className="text-lg md:text-xl text-stone-500 leading-relaxed max-w-lg font-light">
               Buat kartu ucapan digital yang personal dan estetik dalam hitungan detik. 
               Pilih template, kustomisasi, dan kirim ke orang tersayang.
             </p>

             <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link href={userData ? "#templates" : "/register"} className="px-8 py-4 rounded-full bg-[#1C1917] text-white font-bold tracking-wide hover:bg-black transition-all shadow-xl shadow-stone-200 hover:-translate-y-1 flex items-center gap-3">
                   {userData ? <Sparkles size={20} className="text-amber-400" /> : <UserPlus size={20} className="text-amber-400" />}
                   {userData ? "Buat Kartu Sekarang" : "Daftar Gratis"}
                </Link>
                <Link href="#templates" className="px-8 py-4 rounded-full bg-white border border-stone-200 text-stone-700 font-bold hover:border-amber-400 transition-all flex items-center gap-2 hover:shadow-md">
                   <Play size={18} fill="currentColor" className="opacity-40 text-amber-600"/> Lihat Demo
                </Link>
             </div>
             
             <div className="pt-8 flex items-center gap-6 border-t border-stone-200/60 w-full max-w-md">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-stone-200 border-2 border-[#FAFAF9] shadow-sm" />
                   ))}
                </div>
                <div className="text-sm">
                   <p className="font-bold text-stone-900">10,000+ Happy Users</p>
                   <div className="flex items-center gap-1 text-amber-500 text-xs">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <span className="text-stone-400 ml-1">(4.9/5)</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Visual Illustration */}
          <div className="lg:col-span-5 relative h-[500px] md:h-[600px] flex items-center justify-center">
             <div className="relative z-10 w-80 md:w-96 aspect-[9/16] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-white overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-all duration-700 hover:scale-105 ring-1 ring-stone-100">
                <Image 
                   src="/retro-gameboy-2.png" 
                   alt="App Preview"
                   fill
                   className="object-contain bg-stone-50"
                />
                
                {/* Floating Elements */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full flex items-center justify-center gap-3 px-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-stone-700"></div>
                   <div className="w-8 h-1.5 rounded-full bg-stone-700"></div>
                </div>
             </div>

             {/* Background Blobs (10% Accent Usage) */}
             <div className="absolute top-10 right-0 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-40 mix-blend-multiply animate-pulse" />
             <div className="absolute bottom-10 left-10 w-72 h-72 bg-stone-200 rounded-full blur-3xl opacity-40 mix-blend-multiply animate-pulse delay-1000" />
             
             {/* Floating Badges - DIBUAT Z-INDEX LEBIH TINGGI */}
             <div className="absolute top-1/4 -right-6 z-20 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl animate-bounce duration-[4000ms] border border-white/50">
                <Heart className="text-amber-500 fill-amber-500 drop-shadow-md" size={32} />
             </div>
             <div className="absolute bottom-1/4 -left-6 z-20 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl shadow-xl animate-bounce duration-[5000ms] border border-white/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle2 size={18} /></div>
                <div>
                   <p className="text-xs font-bold text-stone-900">Sent!</p>
                   <p className="text-[10px] text-stone-500">Just now</p>
                </div>
             </div>
          </div>
        </section>

        {/* --- TEMPLATE GALLERY --- */}
        <section id="templates" className="bg-white py-32 border-t border-stone-100">
           <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20 max-w-2xl mx-auto">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 block">Premium Collections</span>
                <h2 className={`text-4xl md:text-5xl font-medium mb-6 text-[#1C1917] ${playfair.className}`}>
                   Temukan Gaya Anda
                </h2>
                <p className="text-stone-500 text-lg font-light leading-relaxed">
                   Setiap template dirancang dengan detail pixel-perfect untuk memberikan kesan mendalam bagi penerimanya.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 
                 {/* CARD 1: RETRO (Portrait 2:3) */}
                 <Link href="/templates/retro-gameboy" className="group cursor-pointer block">
                    <div className="relative aspect-[2/3] bg-[#F5F5F4] rounded-[2rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-stone-100 group-hover:-translate-y-2">
                       <Image src="/retro-gameboy.png" alt="Retro Gameboy" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute top-5 right-5 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-stone-900 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                          <Star size={12} fill="orange" className="text-amber-400"/> Best Seller
                       </div>
                       
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-amber-100">
                             Edit Template
                          </span>
                       </div>
                    </div>
                    <div className="px-2">
                       <h3 className={`text-2xl font-medium mb-2 group-hover:text-amber-700 transition-colors ${playfair.className}`}>Retro 8-Bit</h3>
                       <p className="text-stone-500 text-sm leading-relaxed">Nostalgia konsol klasik, interaktif & seru.</p>
                    </div>
                 </Link>

                 {/* KOLOM TENGAH: GABUNGAN CARD LANDSCAPE (Minimalist + Postcard) */}
                 <div className="flex flex-col gap-10">
                     
                     {/* CARD 2: MINIMALIST (Landscape 3:2) */}
                     <Link href="/templates/minimalist" className="group cursor-pointer block">
                        <div className="relative aspect-[3/2] bg-[#F5F5F4] rounded-[2rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-stone-100 group-hover:-translate-y-2 flex items-center justify-center bg-white">
                           <Image 
                             src="/minimalist.png" 
                             alt="Minimalist" 
                             fill 
                             className="object-cover group-hover:scale-105 transition-transform duration-700" 
                           />
                           <div className="absolute top-5 right-5 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-stone-900 uppercase tracking-widest shadow-sm">
                              Popular
                           </div>
                           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-amber-100">
                                 Edit Template
                              </span>
                           </div>
                        </div>
                        <div className="px-2">
                           <h3 className={`text-2xl font-medium mb-2 group-hover:text-amber-700 transition-colors ${playfair.className}`}>Modern Minimalist</h3>
                           <p className="text-stone-500 text-sm leading-relaxed">Elegan, bersih, dan fokus pada tipografi.</p>
                        </div>
                     </Link>

                     {/* CARD 4: CLASSIC POSTCARD (Landscape 3:2) - Tepat di bawah Minimalist */}
                     <Link href="/templates/postcard" className="group cursor-pointer block">
                        <div className="relative aspect-[3/2] bg-[#F5F5F4] rounded-[2rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-stone-100 group-hover:-translate-y-2 flex items-center justify-center bg-white">
                           
                           {/* Menggunakan Image Component */}
                           <Image 
                             src="/postcard.png" 
                             alt="Classic Postcard" 
                             fill 
                             className="object-cover group-hover:scale-105 transition-transform duration-700" 
                           />

                           <div className="absolute top-5 right-5 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-stone-900 uppercase tracking-widest shadow-sm z-10">
                              Classic
                           </div>

                           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                              <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-amber-100">
                                 Edit Template
                              </span>
                           </div>
                        </div>
                        <div className="px-2">
                           <h3 className={`text-2xl font-medium mb-2 group-hover:text-amber-700 transition-colors ${playfair.className}`}>Classic Postcard</h3>
                           <p className="text-stone-500 text-sm leading-relaxed">Kirim salam hangat dengan gaya kartu pos klasik.</p>
                        </div>
                     </Link>

                 </div>

                 {/* CARD 3: NEWSPAPER (Portrait 2:3) */}
                 <Link href="/templates/newspaper" className="group cursor-pointer block">
                    <div className="relative aspect-[2/3] bg-[#F5F5F4] rounded-[2rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-stone-100 group-hover:-translate-y-2 flex items-center justify-center bg-white">
                       <Image 
                         src="/newspaper.png" 
                         alt="Vintage Newspaper" 
                         fill 
                         className="object-cover group-hover:scale-105 transition-transform duration-700" 
                       />
                       <div className="absolute top-5 right-5 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-stone-900 uppercase tracking-widest shadow-sm">
                          New
                       </div>
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-amber-100">
                             Edit Template
                          </span>
                       </div>
                    </div>
                    <div className="px-2">
                       <h3 className={`text-2xl font-medium mb-2 group-hover:text-amber-700 transition-colors ${playfair.className}`}>Vintage Press</h3>
                       <p className="text-stone-500 text-sm leading-relaxed">Gaya koran klasik untuk berita heboh.</p>
                    </div>
                 </Link>

              </div>
           </div>
        </section>

        {/* --- FEATURE HIGHLIGHTS --- */}
        <section id="features" className="bg-[#1C1917] text-white py-32 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
           
           <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                 
                 <div className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors backdrop-blur-md">
                       <PenTool size={32} className="text-amber-300" />
                    </div>
                    <h3 className={`text-2xl font-medium mb-4 ${playfair.className}`}>Editor Intuitif</h3>
                    <p className="text-stone-400 leading-relaxed font-light">
                       Ubah teks, ganti foto, dan atur warna semudah drag-and-drop. Tidak butuh skill coding.
                    </p>
                 </div>

                 <div className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors backdrop-blur-md">
                       <Phone size={32} className="text-orange-300" />
                    </div>
                    <h3 className={`text-2xl font-medium mb-4 ${playfair.className}`}>Responsif Total</h3>
                    <p className="text-stone-400 leading-relaxed font-light">
                       Kartu digital Anda akan terlihat sempurna di iPhone, Android, Tablet, maupun Desktop.
                    </p>
                 </div>

                 <div className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors backdrop-blur-md">
                       <Cloud size={32} className="text-yellow-200" />
                    </div>
                    <h3 className={`text-2xl font-medium mb-4 ${playfair.className}`}>Berbagi Instan</h3>
                    <p className="text-stone-400 leading-relaxed font-light">
                       Dapatkan tautan unik atau unduh sebagai gambar berkualitas tinggi siap kirim via WhatsApp.
                    </p>
                 </div>

              </div>
           </div>
        </section>

        {/* --- BOTTOM CTA --- */}
        <section className="bg-white py-32 text-[#1C1917] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-stone-50 to-white -z-10" />
           <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className={`text-5xl md:text-6xl font-medium mb-8 text-[#1C1917] ${playfair.className} leading-tight`}>
                 Momen Spesial Butuh <br/> Kartu yang Spesial.
              </h2>
              <p className="text-xl text-stone-500 mb-12 max-w-xl mx-auto font-light">
                 Bergabunglah dengan ribuan orang yang telah membuat momen mereka lebih berkesan dengan Cardify.
              </p>
              
              <Link href={userData ? "#templates" : "/register"} className="inline-flex px-12 py-5 rounded-full bg-[#1C1917] text-white font-bold tracking-wide hover:bg-black hover:scale-105 hover:shadow-2xl transition-all items-center gap-3">
                   {userData ? <Sparkles size={20} className="text-amber-400" /> : <Gift size={20} className="text-amber-400" />}
                   {userData ? "Pilih Template Favorit" : "Buat Akun Gratis"}
              </Link>
           </div>
        </section>

      </main>

      {/* --- PREMIUM FOOTER --- */}
      <footer className="w-full bg-[#FAFAF9] border-t border-stone-200 pt-20 pb-10 relative z-20">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
               <div className="md:col-span-1 space-y-4">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-[#1C1917] rounded-lg flex items-center justify-center text-white">
                        <Gift size={16} className="text-amber-400" />
                     </div>
                     <span className={`text-2xl font-bold ${playfair.className} italic`}>Cardify.</span>
                  </div>
                  <p className="text-sm text-stone-500 leading-relaxed font-medium">
                     The modern way to celebrate. Creating digital moments that last forever.
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-widest">Product</h4>
                  <ul className="space-y-4 text-sm text-stone-500 font-medium">
                     <li className="hover:text-black cursor-pointer transition-colors">Templates</li>
                     {/* Removed Pricing */}
                     <li className="hover:text-black cursor-pointer transition-colors">Showcase</li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-widest">Company</h4>
                  <ul className="space-y-4 text-sm text-stone-500 font-medium">
                     <li>
                       <Link href="/about" className="hover:text-black cursor-pointer transition-colors">About</Link>
                     </li>
                     <li className="hover:text-black cursor-pointer transition-colors">Careers</li>
                     <li className="hover:text-black cursor-pointer transition-colors">Blog</li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-widest">Connect</h4>
                  <div className="flex flex-col gap-4">
                     <Link href="https://instagram.com/alfinnsptr" target="_blank" className="flex items-center gap-3 text-sm text-stone-500 hover:text-[#E1306C] transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center group-hover:border-[#E1306C] transition-colors"><Instagram size={16} /></div>
                        <span className="font-medium">Instagram</span>
                     </Link>
                     <Link href="https://wa.me/6289501847804" target="_blank" className="flex items-center gap-3 text-sm text-stone-500 hover:text-[#25D366] transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center group-hover:border-[#25D366] transition-colors"><MessageCircle size={16} /></div>
                        <span className="font-medium">WhatsApp</span>
                     </Link>
                  </div>
               </div>
            </div>
            <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-xs text-stone-400 font-medium">© 2025 Cardify Inc. All rights reserved.</p>
               <div className="flex gap-8 text-xs text-stone-500 font-bold">
                  {/* UPDATE LINK PRIVACY POLICY DI SINI */}
                  <Link href="/privacy-policy" className="cursor-pointer hover:text-black transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="cursor-pointer hover:text-black transition-colors">Terms of Service</Link>
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
            <h3 className={`text-2xl font-bold text-stone-900 mb-3 ${playfair.className}`}>Sign Out?</h3>
            <p className="text-sm text-stone-500 mb-8 leading-relaxed px-4">
              Apakah Anda yakin ingin keluar? Anda harus masuk kembali untuk mengakses template yang tersimpan.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleLogout} className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100 active:scale-[0.98]">
                Ya, Keluar
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className="w-full py-3.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors active:scale-[0.98]">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}