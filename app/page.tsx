"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef, type MouseEvent } from "react";
import image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
// MOCK IMPORTS REPLACEMENT
import { 
  ArrowRight, Sparkles, Gift, Heart, Phone, Star, PenTool, Play, 
  Instagram, MessageCircle, LogIn, Quote, UserPlus, 
  Flower2, Bird, Cloud, Music,
  User, LogOut, Settings, ChevronDown, Layout, CheckCircle2,
  Newspaper, Stamp, Smartphone, Zap, Share2, Palette, Image as ImageIcon,
  Gamepad2
} from "lucide-react";

// --- REUSABLE MOTION VARIANTS ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

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
  const { data: session, status } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Mouse parallax buat hero — murni visual, tidak menyentuh state/logic lain
  const heroMouseX = useMotionValue(0);
  const heroMouseY = useMotionValue(0);
  const heroSpringX = useSpring(heroMouseX, { stiffness: 120, damping: 20, mass: 0.5 });
  const heroSpringY = useSpring(heroMouseY, { stiffness: 120, damping: 20, mass: 0.5 });

  const handleHeroMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    heroMouseX.set(relX);
    heroMouseY.set(relY);
  };

  const handleHeroMouseLeave = () => {
    heroMouseX.set(0);
    heroMouseY.set(0);
  };

  // Layer depth: elemen beda kedalaman gerak beda jauh (parallax)
  const phoneX = useTransform(heroSpringX, (v) => v * 18);
  const phoneY = useTransform(heroSpringY, (v) => v * 18);
  const badgeFarX = useTransform(heroSpringX, (v) => v * 34);
  const badgeFarY = useTransform(heroSpringY, (v) => v * 34);
  const badgeNearX = useTransform(heroSpringX, (v) => v * -22);
  const badgeNearY = useTransform(heroSpringY, (v) => v * -22);

  // Konten FAQ — copy statis, tidak terhubung ke logic/route manapun
  const faqs = [
    { q: "Is Cardify free to use?", a: "Yes — most templates are free. Premium templates and export options come with paid plans." },
    { q: "Can I add my own photos?", a: "Absolutely. Every template lets you drop in your own photos, or snap a new one with Photobooth." },
    { q: "How do I share my card?", a: "Send it as a link, download it as an image, or print it as a real postcard — whichever fits the moment." },
    { q: "Does it work on mobile?", a: "Yes, Cardify is fully responsive and works great on phones, tablets, and desktop." },
    { q: "Can I collaborate with someone?", a: "You can share the editing link with a friend so you can put a card together, together." },
  ];
  
  
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Efek Samping: Cek Login, Animasi Background, & Scroll Listener
  useEffect(() => {
    // Set Judul Halaman
    document.title = "Cardify - Share Feelings Beautifully";

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
    const handleClickOutside = (event: globalThis.MouseEvent) => {
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
  setShowLogoutConfirm(false);
  await signOut({ callbackUrl: "/" });
};


  return (
    // CARDIFY DESIGN TOKENS — Cream paper base, ink text, marigold/mint/sky/lilac/sage as section "pages"
    <div className={`min-h-screen w-full bg-[#FDFBF3] text-[#1C1917] selection:bg-[#F6C445] selection:text-[#1C1917] flex flex-col relative overflow-hidden font-sans`}>
      
      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,600;1,700&family=Press+Start+2P&display=swap');
          .font-display { font-family: 'Archivo Black', 'DM Sans', sans-serif; }
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-press-start { font-family: 'Press Start 2P', cursive; }
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
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center text-[#F6C445] shadow-[3px_3px_0_0_#F6C445] group-hover:rotate-12 group-hover:shadow-[4px_4px_0_0_#F6C445] transition-all duration-300">
               <Gift size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">A card with a story</span>
              <span className={`text-xl font-bold tracking-tight font-playfair italic text-[#1C1917]`}>cardify</span>
            </div>
          </div>
          
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
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-100 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5">
                    <div className="p-4 bg-stone-50/50 rounded-xl mb-2 border border-stone-100">
                      <p className="text-sm font-bold text-stone-900 truncate">{session?.user?.name}</p>
                      <p className="text-xs text-stone-500 truncate font-medium">{session?.user?.email}</p>
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
                <a href="/login" className="hidden md:flex text-sm font-bold uppercase tracking-wide text-stone-600 hover:text-black transition-colors">
                   Log in
                </a>
                <a href="/register" className="hidden md:flex text-sm font-bold uppercase tracking-wide text-stone-600 hover:text-black transition-colors">
                   Sign Up
                </a>
              </div>
            )}

            {/* CTA Button */}
            <a href="/templates" className="px-5 py-2.5 rounded-full bg-[#1C1917] text-[#FDFBF3] text-sm font-bold hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#F6C445] transition-all flex items-center gap-2 border-2 border-[#1C1917]">
              Start Creating
              <ArrowRight size={16} strokeWidth={2.5} className="text-[#F6C445]" />
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Marigold paper) --- */}
      <main className="flex-grow relative z-10">
        <section
          className="relative bg-[#F6C445] overflow-hidden border-t-3 border-[#111111]"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left: Text Content */}
            <motion.div
               className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
               variants={staggerContainer}
               initial="hidden"
               animate="show"
            >
               {/* Badge — "FOR YOU": DM Sans, font-black, uppercase, tracking-widest, text-xs */}
               <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#F6C445] text-xs font-black uppercase tracking-widest shadow-sm -rotate-2 font-sans">
                  <Sparkles size={12} />
                  For You
               </motion.div>

               <motion.h1
                  variants={staggerItem}
                  className="text-[18vw] md:text-[7rem] lg:text-[9rem] text-[#111111] font-boldonse font-black uppercase"
                  style={{ lineHeight: 0.85, letterSpacing: "-0.03em" }}
               >
                 Greet-
                 <br />
                 ings
               </motion.h1>

               {/* Emotion chips */}
               <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 rounded-full bg-[#F3B8CC] text-[#1C1917] text-xs font-black uppercase tracking-widest border-2 border-[#1C1917] rotate-[-2deg] font-sans">Happy</span>
                  <span className="px-4 py-1.5 rounded-full bg-[#BFE0F5] text-[#1C1917] text-xs font-black uppercase tracking-widest border-2 border-[#1C1917] rotate-[1deg] font-sans">Thank You</span>
                  <span className="px-4 py-1.5 rounded-full bg-[#FDFBF3] text-[#1C1917] text-xs font-black uppercase tracking-widest border-2 border-[#1C1917] rotate-[-1deg] font-sans">Miss You</span>
               </motion.div>
               
               <motion.p variants={staggerItem} className="text-lg md:text-xl text-[#1C1917]/70 leading-relaxed max-w-lg font-medium">
                 Cardify makes beautiful, personal, aesthetic digital greeting cards. Choose a template, add photos, share the memory — in seconds.
               </motion.p>

               {/* UPDATED CTA BUTTONS LOGIC (unchanged) */}
               <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-4 pt-2">
                  <motion.a 
                     href={session ? "/templates" : "/register"} 
                     whileHover={{ y: -4, boxShadow: "6px 6px 0 0 rgba(28,25,23,0.3)" }}
                     whileTap={{ scale: 0.97 }}
                     className="px-8 py-4 rounded-full bg-[#1C1917] text-[#FDFBF3] font-bold tracking-wide shadow-[4px_4px_0_0_rgba(28,25,23,0.2)] flex items-center gap-3 border-2 border-[#1C1917]"
                  >
                     {session ? (
                        // IF LOGGED IN: "Start Creating"
                        <>
                          <Sparkles size={20} className="text-[#F6C445]" />
                          Start Creating
                        </>
                     ) : (
                        // IF LOGGED OUT: "Sign Up Free"
                        <>
                          <UserPlus size={20} className="text-[#F6C445]" />
                          Sign Up Free
                        </>
                     )}
                  </motion.a>
                  <motion.button
                     type="button"
                     whileHover={{ y: -4 }}
                     whileTap={{ scale: 0.97 }}
                     onClick={() => document.getElementById('what-is-cardify')?.scrollIntoView({ behavior: 'smooth' })}
                     className="px-6 py-4 rounded-full bg-transparent text-[#1C1917] font-bold tracking-wide border-2 border-[#1C1917]/20 hover:border-[#1C1917] transition-colors flex items-center gap-2"
                  >
                     What is Cardify?
                     <ChevronDown size={16} />
                  </motion.button>
               </motion.div>
            </motion.div>

            {/* Right: Visual Illustration */}
            <motion.div
               className="lg:col-span-5 relative h-[480px] md:h-[560px] flex items-center justify-center"
               initial={{ opacity: 0, scale: 0.85 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
               <motion.div style={{ x: phoneX, y: phoneY }}>
                 <motion.div
                    className="relative z-10 w-72 md:w-80 aspect-[9/16] bg-[#FDFBF3] rounded-[2.5rem] shadow-2xl border-[8px] border-[#1C1917] overflow-hidden"
                    animate={{ rotate: [-4, -1, -4], y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ rotate: 0, scale: 1.05 }}
                 >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                       src="/gameboy-greetings.png" 
                       alt="App Preview"
                       className="w-full h-full object-cover"
                    />
                    
                    {/* Dynamic Island style element */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full flex items-center justify-center gap-2 px-3 shadow-lg">
                       <div className="w-1.5 h-1.5 rounded-full bg-stone-800"></div>
                       <div className="w-10 h-1.5 rounded-full bg-stone-800/50"></div>
                    </div>
                 </motion.div>
               </motion.div>

               {/* Floating Badges — parallax depth layers: "far" drifts more, "near" drifts opposite */}
               <motion.div
                  style={{ x: badgeFarX, y: badgeFarY }}
                  className="absolute top-4 -right-2 md:-right-6 z-20"
               >
                 <motion.div
                    className="w-16 h-16 rounded-full bg-[#1C1917] text-[#F6C445] flex flex-col items-center justify-center shadow-xl text-[9px] font-bold uppercase leading-tight text-center rotate-6 border-2 border-[#FDFBF3]"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 >
                    Find Your<br/>Card
                 </motion.div>
               </motion.div>
               <motion.div
                  style={{ x: badgeFarX, y: badgeFarY }}
                  className="absolute top-1/3 -right-4 md:-right-10 z-20"
               >
                 <motion.div
                    className="bg-[#FDFBF3] backdrop-blur px-4 py-2 rounded-full shadow-xl border-2 border-[#1C1917] text-[10px] font-bold uppercase tracking-wide"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                 >
                    ✦ 12,340 sent today
                 </motion.div>
               </motion.div>
               <motion.div
                  style={{ x: badgeNearX, y: badgeNearY }}
                  className="absolute bottom-1/3 -left-4 md:-left-10 z-20"
               >
                 <motion.div
                    className="bg-[#FDFBF3] backdrop-blur px-4 py-2 rounded-full shadow-xl border-2 border-[#1C1917] text-[10px] font-bold uppercase tracking-wide"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                 >
                    ♦ 200+ Templates
                 </motion.div>
               </motion.div>
               <motion.div
                  style={{ x: badgeNearX, y: badgeNearY }}
                  className="absolute bottom-6 -left-2 md:-left-6 z-20"
               >
                 <motion.div
                    className="bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl border-2 border-[#1C1917] flex items-center gap-2"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                 >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 border border-green-200"><CheckCircle2 size={16} /></div>
                    <div>
                       <p className="text-[10px] font-bold text-stone-900">Message Sent!</p>
                       <p className="text-[9px] text-stone-500 font-medium">Just now to Sarah</p>
                    </div>
                 </motion.div>
               </motion.div>
            </motion.div>
          </div>

          {/* Decorative bottom scallop edge */}
          <svg className="absolute bottom-0 left-0 w-full h-6 text-[#FDFBF3]" viewBox="0 0 400 20" preserveAspectRatio="none">
            <path d="M0 20 Q 10 0 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20 T 220 20 T 240 20 T 260 20 T 280 20 T 300 20 T 320 20 T 340 20 T 360 20 T 380 20 T 400 20 V20 H0 Z" fill="currentColor" />
          </svg>
        </section>

        <div id="what-is-cardify" className="scroll-mt-24" />

        {/* --- WHAT'S NEW (Mint paper) --- */}
<section className="py-24 bg-[#B8E3C9] overflow-hidden border-t-3 border-[#111111]">
   <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-14 max-w-2xl mx-auto">
         <span className="text-[11px] font-black text-[#1C1917]/50 uppercase tracking-[0.3em] mb-3 block font-sans">— A gift with a story —</span>
         <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic"
            style={{ letterSpacing: "-0.02em" }}
         >
            What's new?
         </motion.h2>
         <p className="mt-3 text-[14px] font-bold font-sans text-[#1C1917]/60">最新ニュース &amp; トピックス</p>
      </div>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
         {[
            { 
              tag: "New", 
              title: "Photobooth has arrived — Capture every smile with aesthetic frames inspired by vintage memories.", 
              image: "/photobooth-arrived.png", 
              bg: "bg-[#F6C445]", 
              icon: <ImageIcon size={28} /> 
            },
            { tag: "Frames", title: "Discover your favorite style — Choose from postcard, film strip, retro game, magazine, and more.", image: "/frames.png", icon: <ImageIcon size={28} /> },
            { tag: "Create", title: "Make every greeting personal — Customize cards with photos, colors, and heartfelt messages.", image: "/create.png", icon: <ImageIcon size={28} /> },
            { tag: "Share", title: "Download & share instantly — Save high-quality images for social media or print them as keepsakes.", bg: "bg-[#D8C9F2]", icon: <Newspaper size={28} /> },
         ].map((item) => (
            <div key={item.title} className="p-6 rounded-[1.75rem] bg-white border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
               {/* Kondisi jika item memiliki properti image */}
               {item.image ? (
                  <div className="w-full aspect-square rounded-2xl overflow-hidden mb-5 border-2 border-[#1C1917] relative">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                     />
                  </div>
               ) : (
                  <div className={`w-full aspect-square rounded-2xl ${item.bg} flex items-center justify-center mb-5 text-[#1C1917] border-2 border-[#1C1917]`}>
                     {item.icon}
                  </div>
               )}
               <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{item.tag}</span>
               <p className="text-sm font-bold text-stone-800 leading-snug mt-1">{item.title}</p>
            </div>
         ))}
      </motion.div>
   </div>
</section>

        {/* --- FEATURES SECTION (Lilac paper) --- */}
        <section id="features" className="py-24 bg-[#D8C9F2] relative overflow-hidden scroll-mt-24 border-t-3 border-[#111111]">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-xs font-bold text-[#1C1917]/50 uppercase tracking-[0.3em] mb-3 block">— Why Cardify —</span>
                    <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>Features that sparkle</motion.h2>
                    <p className="mt-3 text-[14px] font-bold font-sans text-[#1C1917]/60">きらめく機能</p>
                </div>

                <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}>
                    {/* Feature 1 */}
                    <div className="group p-7 rounded-[1.75rem] bg-[#FDFBF3] border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-[#F6C445] text-[#1C1917] flex items-center justify-center mb-6 shadow-sm">
                            <Zap size={26} />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800 mb-2">Instant & Easy</h3>
                        <p className="text-stone-500 text-sm leading-relaxed">No design skills needed. Fill in the blanks, hit send.</p>
                    </div>

                    {/* Feature 2 — NEW: Photobooth */}
                    <div className="group p-7 rounded-[1.75rem] bg-[#FDFBF3] border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-[#F3B8CC] text-[#1C1917] flex items-center justify-center mb-6 shadow-sm">
                            <ImageIcon size={26} />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800 mb-2">Photobooth</h3>
                        <p className="text-stone-500 text-sm leading-relaxed">Snap a picture inside the app and tape it onto any card.</p>
                    </div>

                    {/* Feature 3 (was "Interactive Web Story") */}
                    <div className="group p-7 rounded-[1.75rem] bg-[#FDFBF3] border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-[#BFE0F5] text-[#1C1917] flex items-center justify-center mb-6 shadow-sm">
                            <Smartphone size={26} />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800 mb-2">Interactive Web Story</h3>
                        <p className="text-stone-500 text-sm leading-relaxed">Add music, animations, and page-turn stories to any greeting.</p>
                    </div>

                    {/* Feature 4 (was "Unique Templates") */}
                    <div className="group p-7 rounded-[1.75rem] bg-[#FDFBF3] border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-[#A9D6BC] text-[#1C1917] flex items-center justify-center mb-6 shadow-sm">
                            <Palette size={26} />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800 mb-2">Unique Templates</h3>
                        <p className="text-stone-500 text-sm leading-relaxed">From Retro, Minimalist, to Classic Postcard — 200+ styles.</p>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* --- HOW IT WORKS (Cream paper) --- */}
        <section className="py-24 bg-[#FDFBF3] relative overflow-hidden border-t-3 border-[#111111]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-[0.3em] mb-3 block">— How it works —</span>
                    <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>Three little steps</motion.h2>
                    <p className="mt-3 text-[14px] font-bold font-sans text-[#1C1917]/60">かんたん3ステップ</p>
                </div>
                <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}>
                    {[
                       { n: "01", title: "Choose a template", desc: "Pick from 200+ curated designs, from retro to hand-drawn.", bg: "bg-[#F6C445]" },
                       { n: "02", title: "Customize", desc: "Add your message, photos, music, stickers — even snap a Photobooth pic.", bg: "bg-[#F3B8CC]" },
                       { n: "03", title: "Share", desc: "Send as a link, download as an image, or print a real postcard.", bg: "bg-[#A9D6BC]" },
                    ].map((step) => (
                       <div key={step.n} className="relative p-8 rounded-[1.75rem] bg-white border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]">
                          <span className={`absolute -top-4 -right-4 w-10 h-10 rounded-full ${step.bg} border-2 border-[#1C1917] flex items-center justify-center text-xs font-bold`}>{step.n}</span>
                          <h3 className="text-2xl font-bold text-[#1C1917] mb-2 font-playfair">{step.title}</h3>
                          <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
                       </div>
                    ))}
                </motion.div>
            </div>
        </section>

        {/* --- TEMPLATE GALLERY SECTION (Sky paper) --- */}
        <section className="bg-[#BFE0F5] py-24 scroll-mt-20 border-t-3 border-[#111111]">
           <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                  <div className="max-w-xl">
                    <span className="text-xs font-bold text-[#1C1917]/50 uppercase tracking-[0.3em] block mb-3">— Our Collections —</span>
                    <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>
                       Find Your Style
                    </motion.h2>
                    <p className="mt-3 text-[14px] font-bold font-sans text-[#1C1917]/60">お気に入りを見つけよう</p>
                  </div>
                  {/* CHANGED: Link to /templates */}
                  <a href="/templates" className="flex items-center gap-2 text-sm font-bold text-[#1C1917] bg-[#FDFBF3] border-2 border-[#1C1917] px-5 py-2.5 rounded-full hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#1C1917] transition-all group">
                      View All Templates <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
              </div>
              
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}>
                  
                  {/* CARD 1: GAMEBOY APP (MENGGUNAKAN GAMBAR gameboy-journey.png) */}
                  <a href="/gameboy-app" className="group cursor-pointer block h-full">
                     <div className="relative aspect-[9/16] bg-stone-900 rounded-[1.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border-2 border-[#1C1917] group-hover:-translate-y-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                           src="/gameboy-journey.png" 
                           alt="Gameboy Journey" 
                           className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-30">
                           <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-white/20 flex items-center gap-2">
                              Create Story <ArrowRight size={14} />
                           </span>
                        </div>
                        <div className="absolute top-5 right-5 bg-purple-500/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-sm z-20">Hot</div>
                     </div>
                     <div className="px-1">
                        <h3 className={`text-2xl font-medium mb-2 group-hover:text-purple-700 transition-colors font-playfair`}>Gameboy Journey</h3>
                        <p className="text-stone-600 text-sm leading-relaxed">Interactive handheld story with 8-bit charm.</p>
                     </div>
                  </a>
                  {/* CARD 2: WEB STORY */}
                  <a href="/web-story" className="group cursor-pointer block h-full">
                     <div className="relative aspect-[9/16] bg-stone-900 rounded-[1.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border-2 border-[#1C1917] group-hover:-translate-y-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                           src="/web-story.png" 
                           alt="Web Story" 
                           className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-30">
                           <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-white/20 flex items-center gap-2">
                              Create Story <ArrowRight size={14} />
                           </span>
                        </div>
                         <div className="absolute top-5 right-5 bg-sky-500/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-sm z-20">New</div>
                     </div>
                     <div className="px-1">
                        <h3 className={`text-2xl font-medium mb-2 group-hover:text-amber-700 transition-colors font-playfair`}>Web Story</h3>
                        <p className="text-stone-600 text-sm leading-relaxed">Interactive story with music.</p>
                     </div>
                  </a>

                  {/* CENTER COLUMN GROUP */}
                  <div className="flex flex-col gap-8">
                      <a href="/templates/minimalist" className="group cursor-pointer block">
                         <div className="relative aspect-[3/2] bg-white rounded-[1.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border-2 border-[#1C1917] group-hover:-translate-y-2 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/minimalist.png" alt="Minimalist" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-widest shadow-sm">Popular</div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                               <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-white/20 flex items-center gap-2">Use Template <ArrowRight size={14} /></span>
                            </div>
                         </div>
                         <div className="px-1">
                            <h3 className="text-xl font-medium mb-1 group-hover:text-stone-600 transition-colors font-serif">Modern Minimalist</h3>
                            <p className="text-stone-600 text-sm leading-relaxed font-light">Clean typography focus.</p>
                         </div>
                      </a>

                      <a href="/templates/postcard" className="group cursor-pointer block">
                         <div className="relative aspect-[3/2] bg-white rounded-[1.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border-2 border-[#1C1917] group-hover:-translate-y-2 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/postcard.png" alt="Classic Postcard" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-widest shadow-sm z-10">Classic</div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-[2px]">
                               <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-white/20 flex items-center gap-2">Use Template <ArrowRight size={14} /></span>
                            </div>
                         </div>
                         <div className="px-1">
                            <h3 className="text-xl font-medium mb-1 group-hover:text-stone-600 transition-colors font-serif">Classic Postcard</h3>
                            <p className="text-stone-600 text-sm leading-relaxed font-light">Warm greetings, old style.</p>
                         </div>
                      </a>
                  </div>

                  {/* CARD 5: NEWSPAPER */}
                  <a href="/templates/newspaper" className="group cursor-pointer block h-full">
                     <div className="relative aspect-[2/3] bg-white rounded-[1.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 border-2 border-[#1C1917] group-hover:-translate-y-2 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/newspaper.png" alt="Vintage Newspaper" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-widest shadow-sm">New</div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                           <span className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-white/20 flex items-center gap-2">Use Template <ArrowRight size={14} /></span>
                        </div>
                     </div>
                     <div className="px-1">
                        <h3 className="text-xl font-medium mb-1 group-hover:text-stone-600 transition-colors font-serif">Vintage Press</h3>
                        <p className="text-stone-600 text-sm leading-relaxed font-light">Headline news aesthetic.</p>
                     </div>
                  </a>

              </motion.div>
           </div>
        </section>

        {/* --- TESTIMONIALS (Cream paper) --- */}
        <section className="py-24 bg-[#FDFBF3] overflow-hidden border-t-3 border-[#111111]">
           <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-14 max-w-2xl mx-auto">
                 <span className="text-xs font-bold text-stone-400 uppercase tracking-[0.3em] mb-3 block">— Fan Mail —</span>
                 <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>Loved by detail people</motion.h2>
                 <p className="mt-3 text-[14px] font-bold font-sans text-[#1C1917]/60">こだわり派に愛される</p>
              </div>
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
                 {[
                    { quote: "Made my best friend cry — the good kind.", name: "Amelia R.", role: "Student", bg: "bg-[#F3B8CC]" },
                    { quote: "Finally a card maker that looks designed on purpose.", name: "Jonas P.", role: "Designer", bg: "bg-[#BFE0F5]" },
                    { quote: "Every thank-you I sent came out feeling like a little studio piece.", name: "Priya K.", role: "Newlywed", bg: "bg-[#F6C445]" },
                 ].map((t) => (
                    <div key={t.name} className="p-7 rounded-[1.75rem] bg-white border-2 border-[#1C1917] hover:-translate-y-1 transition-transform">
                       <div className="flex items-center gap-1 mb-4 text-[#F6C445]">
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                       </div>
                       <p className="text-stone-700 font-medium leading-relaxed mb-6">"{t.quote}"</p>
                       <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${t.bg} border-2 border-[#1C1917] flex items-center justify-center text-xs font-bold`}>{t.name[0]}</div>
                          <div>
                             <p className="text-sm font-bold text-stone-900 leading-none">{t.name}</p>
                             <p className="text-[11px] text-stone-500">{t.role}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </motion.div>
           </div>
        </section>

        {/* --- FAQ (Sage paper) --- */}
        <section className="py-24 bg-[#A9D6BC] overflow-hidden border-t-3 border-[#111111]">
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                 <span className="text-xs font-bold text-[#1C1917]/50 uppercase tracking-[0.3em] mb-3 block">— FAQ —</span>
                 <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>Little answers</motion.h2>
                 <p className="mt-3 mb-4 text-[14px] font-bold font-sans text-[#1C1917]/60">ちょっとした疑問に</p>
                 <p className="text-[#1C1917]/70 leading-relaxed">Still curious? Message us on Instagram and we'll reply with a card.</p>
              </div>
              <div className="lg:col-span-8 flex flex-col gap-3">
                 {faqs.map((faq, i) => (
                    <div key={faq.q} className="rounded-2xl border-2 border-[#1C1917] bg-[#FDFBF3] overflow-hidden">
                       <button
                          type="button"
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-bold text-[#1C1917]"
                       >
                          {faq.q}
                          <ChevronDown size={18} className={`flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                       </button>
                       {openFaq === i && (
                          <div className="px-6 pb-5 text-sm text-stone-600 leading-relaxed">
                             {faq.a}
                          </div>
                       )}
                    </div>
                 ))}
              </div>
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
              <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-4xl md:text-6xl font-bold text-white font-playfair leading-tight mb-10">
                 Make someone's day <br />
                 in <span className="italic text-[#F6C445]">two minutes.</span>
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

      </main>

      {/* --- FOOTER (konsisten dengan halaman lain: Ink dark) --- */}
      <footer className="relative isolate w-full bg-[#1C1917] text-stone-400 py-16 border-t-4 border-[#111111] overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
               <div className="md:col-span-1 space-y-4">
                  <div className="flex items-center gap-2">
                     <div className="w-9 h-9 bg-[#F6C445] rounded-xl flex items-center justify-center text-[#1C1917] shadow-[3px_3px_0_0_#F6C445]">
                        <Gift size={18} strokeWidth={2.5} />
                     </div>
                     <span className="text-2xl font-bold text-white font-playfair italic">cardify</span>
                  </div>
                  <p className="text-sm text-stone-500 leading-relaxed font-medium">
                     The modern way to <span className="font-boldonse text-stone-300">celebrate</span>. Digital moments that last forever.
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest font-boldonse">Product</h4>
                  <ul className="space-y-4 text-sm text-stone-500 font-medium">
                     <li><a href="/templates" className="hover:text-white cursor-pointer transition-colors">Templates</a></li>
                     <li><a href="/showcase" className="hover:text-white cursor-pointer transition-colors">Showcase</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest font-boldonse">Company</h4>
                  <ul className="space-y-4 text-sm text-stone-500 font-medium">
                     <li><a href="/about" className="hover:text-white cursor-pointer transition-colors">About</a></li>
                     <li><a href="/careers" className="hover:text-white cursor-pointer transition-colors">Careers</a></li>
                     <li><a href="/blog" className="hover:text-white cursor-pointer transition-colors">Blog</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest font-boldonse">Connect</h4>
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
                  <a href="/privacy-policy" className="cursor-pointer hover:text-white transition-colors">Privacy Policy</a>
                  <a href="/terms" className="cursor-pointer hover:text-white transition-colors">Terms of Service</a>
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