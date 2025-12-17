"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react"; 
import { useRouter } from "next/navigation";
import { Playfair_Display, DM_Sans } from "next/font/google"; 
import { 
  ArrowRight, Sparkles, Gift, Heart, User, LogOut, Settings, ChevronDown, 
  Users, Globe, ShieldCheck, Zap, Mail, MapPin, Instagram, MessageCircle
} from "lucide-react";

// --- KONFIGURASI FONT ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

// --- WRAPPER SESSION ---
export default function AboutPage() {
  return (
    <SessionProvider>
      <AboutContent />
    </SessionProvider>
  );
}

// --- KONTEN UTAMA ---
function AboutContent() {
  const { data: session } = useSession(); 
  const router = useRouter();
  
  // State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // State User Data
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Efek Samping: Cek Login & Scroll
  useEffect(() => {
    document.title = "About - Cardify";

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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUserData(null);
    window.location.href = "/";
  };

  return (
    <div className={`min-h-screen w-full bg-[#FAFAF9] text-[#1C1917] selection:bg-[#D97706] selection:text-white flex flex-col relative overflow-hidden ${dmSans.className}`}>
      
      {/* --- NAVBAR (Konsisten dengan Home) --- */}
      <nav className={`fixed z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-[#FAFAF9]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3" : "bg-transparent border-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
               <Gift size={18} strokeWidth={2.5} className="text-amber-400" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${playfair.className} italic text-[#1C1917]`}>Cardify.</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/#templates" className="hover:text-[#1C1917] transition-colors">Collections</Link>
            <Link href="/about" className="text-[#1C1917] font-bold">About</Link>
            <Link href="/#features" className="hover:text-[#1C1917] transition-colors">Features</Link>
            <Link href="/#pricing" className="hover:text-[#1C1917] transition-colors">Pricing</Link>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {userData ? (
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
                <Link href="/login" className="hidden md:flex text-sm font-bold text-stone-600 hover:text-black transition-colors">Log in</Link>
                <Link href="/register" className="hidden md:flex text-sm font-bold text-stone-600 hover:text-black transition-colors">Sign Up</Link>
              </div>
            )}
            <Link href="/#templates" className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-sm font-bold hover:bg-black hover:scale-105 hover:shadow-xl hover:shadow-amber-900/10 transition-all flex items-center gap-2">
              Start Creating <ArrowRight size={16} strokeWidth={2.5} className="text-amber-400" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative z-10">
         <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase mb-2">Our Story</span>
            <h1 className={`text-5xl md:text-7xl text-[#1C1917] leading-tight ${playfair.className}`}>
               We believe every moment <br/> <span className="italic text-stone-500">deserves to be celebrated.</span>
            </h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
               Cardify was born from a simple idea: to create digital greeting cards that are personal, aesthetic, and easy for anyone to make. We combine modern technology with a touch of classic design.
            </p>
         </div>

         {/* Hero Image Grid */}
         <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-[4/5] bg-stone-200 rounded-3xl overflow-hidden relative shadow-lg transform md:translate-y-12">
               <Image src="/retro-gameboy.png" alt="Retro 8-bit" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="aspect-[4/5] bg-stone-200 rounded-3xl overflow-hidden relative shadow-2xl z-10">
               <Image src="/newspaper.png" alt="Newspaper" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="aspect-[4/5] bg-stone-200 rounded-3xl overflow-hidden relative shadow-lg transform md:translate-y-12">
               <Image src="/retro-gameboy-2.png" alt="Retro" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
         </div>
      </section>

      {/* --- VISION & VALUES --- */}
      <section className="py-24 bg-white border-t border-stone-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
               <div className="space-y-4 p-6 hover:bg-stone-50 rounded-2xl transition-colors">
                  <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 mb-4">
                     <Zap size={28} />
                  </div>
                  <h3 className={`text-2xl font-bold text-[#1C1917] ${playfair.className}`}>Fast & Easy</h3>
                  <p className="text-stone-500 leading-relaxed text-sm">
                     No design skills required. Just pick a template, write your message, and send it in seconds.
                  </p>
               </div>
               <div className="space-y-4 p-6 hover:bg-stone-50 rounded-2xl transition-colors">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 mb-4">
                     <Globe size={28} />
                  </div>
                  <h3 className={`text-2xl font-bold text-[#1C1917] ${playfair.className}`}>Without Limits</h3>
                  <p className="text-stone-500 leading-relaxed text-sm">
                     Send greeting cards to friends across the city or family across the globe. Digital brings us closer.
                  </p>
               </div>
               <div className="space-y-4 p-6 hover:bg-stone-50 rounded-2xl transition-colors">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto text-green-600 mb-4">
                     <ShieldCheck size={28} />
                  </div>
                  <h3 className={`text-2xl font-bold text-[#1C1917] ${playfair.className}`}>Secure Privacy</h3>
                  <p className="text-stone-500 leading-relaxed text-sm">
                     Your data and messages are our priority. We ensure the security of every user's information.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* --- THE TEAM --- */}
      <section className="py-24 bg-[#FAFAF9]">
         <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className={`text-4xl font-bold text-[#1C1917] mb-12 ${playfair.className}`}>Meet the Creator</h2>
            
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center gap-10 text-left border border-stone-100">
               <div className="w-48 h-48 md:w-64 md:h-64 bg-stone-200 rounded-2xl overflow-hidden flex-shrink-0 relative border-4 border-white shadow-lg transform md:-rotate-3 hover:rotate-0 transition-transform duration-300">
                  {/* Foto Creator */}
                  <Image 
                    src="/alfin.jpg" 
                    fill 
                    className="object-cover" 
                    alt="Alfin Saputra" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      // Fallback visual jika gambar tidak ditemukan
                      const parent = e.currentTarget.parentElement;
                      if(parent) parent.classList.add('bg-stone-300');
                    }}
                  />
                  {/* Fallback Icon di belakang gambar */}
                  <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-400 -z-10">
                     <User size={64} />
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div>
                     <h3 className={`text-3xl font-bold text-[#1C1917] ${playfair.className}`}>Alfin Saputra</h3>
                     <p className="text-amber-600 font-bold text-sm tracking-wide uppercase mt-1">Founder & Developer</p>
                  </div>
                  <p className="text-stone-500 leading-relaxed">
                     "I built Cardify with one goal: to help people express their feelings in a unique and meaningful way in this digital era. Thank you for being part of our journey."
                  </p>
                  <div className="flex gap-4 pt-2">
                     <Link href="https://instagram.com/alfinnsptr" target="_blank" className="p-3 bg-stone-50 rounded-full text-stone-600 hover:bg-[#E1306C] hover:text-white transition-all"><Instagram size={20}/></Link>
                     <Link href="mailto:hello@cardify.id" className="p-3 bg-stone-50 rounded-full text-stone-600 hover:bg-stone-900 hover:text-white transition-all"><Mail size={20}/></Link>
                     <Link href="#" className="p-3 bg-stone-50 rounded-full text-stone-600 hover:bg-blue-600 hover:text-white transition-all"><Globe size={20}/></Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-[#1C1917] text-stone-400 py-12 border-t border-stone-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <Gift size={20} className="text-white" />
               <span className={`text-2xl font-bold text-white ${playfair.className} italic`}>Cardify.</span>
            </div>
            <p className="text-sm">© 2025 Cardify Inc. Built with passion in Jakarta.</p>
            <div className="flex gap-6 text-sm font-bold text-white">
               <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
               <Link href="/about" className="text-amber-400">About</Link>
               <Link href="/templates" className="hover:text-amber-400 transition-colors">Templates</Link>
            </div>
         </div>
      </footer>

    </div>
  );
}