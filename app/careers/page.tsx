"use client";

import { useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
// MOCK IMPORTS REPLACEMENT: Use standard HTML/React components to avoid Next.js specific errors
import { 
  ArrowRight, Gift, User, LogOut, Settings, ChevronDown, 
  Briefcase, MapPin, Clock, DollarSign, Heart, Zap, Globe, 
  Instagram, MessageCircle, Mail, Smartphone, Image as ImageIcon,
  Menu, X, Coffee, Sparkles
} from "lucide-react";

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

// --- MOCK DATA JOBS ---
const JOBS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote (Indonesia)",
    type: "Full-time",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    id: 2,
    title: "UI/UX Designer",
    department: "Design",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    tags: ["Figma", "Prototyping", "Visual Design"],
  },
  {
    id: 3,
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    tags: ["Strategy", "Content", "Growth"],
  },
  {
    id: 4,
    title: "Community Manager",
    department: "Community",
    location: "Remote",
    type: "Part-time",
    tags: ["Social Media", "Engagement", "Events"],
  }
];

// --- MAIN COMPONENT ---
export default function CareersPage() {
  // State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Efek Samping: Auth Check & Scroll
  useEffect(() => {
    document.title = "Careers - Cardify";

    // Check Manual Login from LocalStorage
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

  const handleLogout = async () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUserData(null);
    window.location.href = "/";
  };

  return (
    <div className={`min-h-screen w-full bg-[#FDFBF3] text-[#1C1917] flex flex-col font-sans`}>
      
      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
          .font-sans { font-family: 'DM Sans', sans-serif; }
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
          <a href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center text-[#F6C445] shadow-[3px_3px_0_0_#F6C445] group-hover:rotate-12 group-hover:shadow-[4px_4px_0_0_#F6C445] transition-all duration-300">
               <Gift size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">A card with a story</span>
              <span className="text-xl font-bold tracking-tight font-playfair italic text-[#1C1917]">cardify</span>
            </div>
          </a>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wide text-stone-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Templates Dropdown */}
            <div className="relative group h-full flex items-center cursor-pointer">
                <a href="/templates" className="hover:text-[#1C1917] transition-colors relative py-2 flex items-center gap-1 text-[#1C1917]">
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

            <a href="/features" className="hover:text-[#1C1917] transition-colors">Features</a>
            <a href="/about" className="hover:text-[#1C1917] transition-colors">About</a>
            <a href="/contact" className="hover:text-[#1C1917] transition-colors">Contact</a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {userData ? (
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border-2 border-[#1C1917] shadow-sm hover:shadow-md transition-all duration-300 group">
                  {userData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userData.image} alt={userData.name} width={34} height={34} className="rounded-full border border-stone-100" />
                  ) : (
                    <div className="w-[34px] h-[34px] bg-[#F6C445] rounded-full flex items-center justify-center border border-white text-[#1C1917] shadow-inner"><User size={16} /></div>
                  )}
                  <div className="hidden sm:block text-left">
                      <span className="text-xs font-bold text-stone-800 block max-w-[80px] truncate">{userData.name}</span>
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Free Plan</span>
                  </div>
                  <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border-2 border-[#1C1917] p-2 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                    <div className="p-4 bg-stone-50/50 rounded-xl mb-2 border border-stone-100">
                      <p className="text-sm font-bold text-stone-900 truncate">{userData.name}</p>
                      <p className="text-xs text-stone-500 truncate font-medium">{userData.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-stone-50 rounded-xl transition-all font-medium"><User size={16} /> Profile</button>
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-stone-50 rounded-xl transition-all font-medium"><Settings size={16} /> Preferences</button>
                      <div className="h-px bg-stone-100 my-1 mx-2"></div>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"><LogOut size={16} /> Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <a href="/login" className="hidden md:flex text-sm font-bold uppercase tracking-wide text-stone-600 hover:text-black">Log in</a>
                <a href="/register" className="hidden md:flex text-sm font-bold uppercase tracking-wide text-stone-600 hover:text-black">Sign Up</a>
              </div>
            )}
            <a href="/templates" className="px-5 py-2.5 rounded-full bg-[#1C1917] text-[#FDFBF3] text-sm font-bold hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#F6C445] transition-all flex items-center gap-2 border-2 border-[#1C1917]">
              Start Creating <ArrowRight size={16} strokeWidth={2.5} className="text-[#F6C445]" />
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO HEADER (Marigold paper) --- */}
      <header className="pt-44 pb-24 px-6 bg-[#F6C445] border-t-4 border-b-4 border-[#111111] relative overflow-hidden">
         <motion.div
            className="max-w-4xl mx-auto text-center space-y-6"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
         >
            <motion.span variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#F6C445] text-[11px] font-black uppercase tracking-widest shadow-sm -rotate-2 font-sans">
                <Briefcase size={12} />
                Join Us

            </motion.span>
            <motion.h1 variants={staggerItem} className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic leading-tight" style={{ letterSpacing: "-0.02em" }}>
               Build the Future of Digital Gifting
            </motion.h1>
            <motion.p variants={staggerItem} className="text-[14px] font-bold font-sans text-[#1C1917]/60">私たちと一緒に働きませんか</motion.p>
            <motion.p variants={staggerItem} className="text-lg text-[#1C1917]/70 max-w-2xl mx-auto leading-relaxed font-medium pt-2">
               We're looking for passionate individuals to help us connect hearts around the world. Join our remote-first team and make a global impact.
            </motion.p>
         </motion.div>
      </header>

      {/* --- VALUES SECTION (Cream) --- */}
      <section className="py-24 px-6 bg-[#FDFBF3]">
         <div className="max-w-7xl mx-auto">
            <motion.div
               className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
               initial="hidden"
               whileInView="show"
               viewport={{ once: true, margin: "-100px" }}
               variants={staggerContainer}
            >
               <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                  <div className="w-14 h-14 bg-[#F6C445] rounded-2xl flex items-center justify-center text-[#1C1917] mb-6 border-2 border-[#1C1917]">
                     <Globe size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2 font-playfair">Remote First</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">Work from anywhere. We believe in output over hours and trust our team to manage their time.</p>
               </motion.div>
               <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                  <div className="w-14 h-14 bg-[#F3B8CC] rounded-2xl flex items-center justify-center text-[#1C1917] mb-6 border-2 border-[#1C1917]">
                     <Heart size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2 font-playfair">Creative Freedom</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">We encourage experimentation. Your ideas matter, and we give you the space to bring them to life.</p>
               </motion.div>
               <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                  <div className="w-14 h-14 bg-[#BFE0F5] rounded-2xl flex items-center justify-center text-[#1C1917] mb-6 border-2 border-[#1C1917]">
                     <Zap size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2 font-playfair">Fast Growth</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">Grow with us. We support your professional development with budget for courses and conferences.</p>
               </motion.div>
            </motion.div>

            {/* --- OPEN POSITIONS (EMPTY STATE) --- */}
            <motion.div
               initial={{ opacity: 0, y: 24 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="bg-white rounded-[2.5rem] border-2 border-[#1C1917] shadow-[8px_8px_0_0_#1C1917] overflow-hidden p-12 text-center"
            >
                <div className="w-20 h-20 bg-[#D8C9F2] rounded-full flex items-center justify-center mx-auto mb-6 text-[#1C1917] border-2 border-[#1C1917]">
                    <Coffee size={36} />
                </div>
                <h2 className="text-4xl text-[#111111] mb-4 font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>No Open Positions Yet</h2>
                <p className="text-stone-500 max-w-lg mx-auto mb-8 leading-relaxed">
                   Currently, we don't have any open positions. However, we're always growing! Check back soon for future updates.
                </p>
                
                <div className="p-6 bg-[#FDFBF3] rounded-2xl inline-block border-2 border-stone-200">
                    <p className="text-sm text-stone-600 font-medium mb-3">Interested in joining us in the future?</p>
                    <a href="mailto:cardify.official.id@gmail.com" className="inline-flex items-center gap-2 text-[#1C1917] font-bold border-b-2 border-[#1C1917] pb-1 hover:text-[#D9A400] hover:border-[#D9A400] transition-colors">
                      Send us your resume <ArrowRight size={16} />
                   </a>
                </div>
            </motion.div>

         </div>
      </section>

      {/* --- FOOTER (sama seperti halaman lain) --- */}
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
                     <li><a href="/templates" className="hover:text-white cursor-pointer transition-colors">Templates</a></li>
                     <li><a href="/showcase" className="hover:text-white cursor-pointer transition-colors">Showcase</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
                  <ul className="space-y-4 text-sm text-stone-500 font-medium">
                     <li><a href="/about" className="hover:text-white cursor-pointer transition-colors">About</a></li>
                     <li><a href="/careers" className="text-white font-bold cursor-pointer transition-colors">Careers</a></li>
                     <li><a href="/blog" className="hover:text-white cursor-pointer transition-colors">Blog</a></li>
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
                  <a href="/privacy-policy" className="cursor-pointer hover:text-white transition-colors">Privacy Policy</a>
                  <a href="/terms" className="cursor-pointer hover:text-white transition-colors">Terms of Service</a>
               </div>
            </div>
         </div>
      </footer>

    </div>
  );
}