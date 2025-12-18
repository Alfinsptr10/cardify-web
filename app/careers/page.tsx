"use client";

import { useState, useEffect, useRef } from "react";
// MOCK IMPORTS REPLACEMENT: Use standard HTML/React components to avoid Next.js specific errors
import { 
  ArrowRight, Gift, User, LogOut, Settings, ChevronDown, 
  Briefcase, MapPin, Clock, DollarSign, Heart, Zap, Globe, 
  Instagram, MessageCircle, Mail, Smartphone, Image as ImageIcon,
  Menu, X, Coffee
} from "lucide-react";

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
    <div className={`min-h-screen w-full bg-[#FAFAF9] text-[#1C1917] flex flex-col font-sans`}>
      
      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'DM Sans', sans-serif; }
      `}} />

      {/* --- NAVBAR --- */}
      <nav className={`fixed z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-[#FAFAF9]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3" : "bg-transparent border-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          {/* Logo Brand */}
          <a href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
               <Gift size={18} strokeWidth={2.5} className="text-amber-400" />
            </div>
            <span className={`text-2xl font-bold tracking-tight font-playfair italic text-[#1C1917]`}>Cardify.</span>
          </a>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Templates Dropdown */}
            <div className="relative group h-full flex items-center cursor-pointer">
                <a href="/templates" className="hover:text-[#1C1917] transition-colors relative py-2 flex items-center gap-1 text-[#1C1917]">
                  Templates
                  <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-transform duration-300 group-hover:rotate-180 text-amber-600" />
                </a>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white rounded-2xl shadow-xl border border-stone-100 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
                   <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-stone-100 transform rotate-45"></div>
                   <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">Create New</p>

                   <a href="/web-story" className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors group/item relative z-10 mb-1">
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex-shrink-0 flex items-center justify-center text-rose-500 group-hover/item:bg-rose-500 group-hover/item:text-white transition-all shadow-sm">
                         <Smartphone size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-stone-800 group-hover/item:text-rose-600 transition-colors">Web Story</p>
                         <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5">Interactive, Music, Animations</p>
                      </div>
                   </a>

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

            <a href="/features" className="hover:text-[#1C1917] transition-colors">Features</a>
            <a href="/about" className="hover:text-[#1C1917] transition-colors">About</a>
            <a href="/contact" className="hover:text-[#1C1917] transition-colors">Contact</a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {userData ? (
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                  {userData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userData.image} alt={userData.name} width={34} height={34} className="rounded-full border border-stone-100" />
                  ) : (
                    <div className="w-[34px] h-[34px] bg-gradient-to-tr from-amber-100 to-orange-50 rounded-full flex items-center justify-center border border-white text-[#1C1917] shadow-inner"><User size={16} /></div>
                  )}
                  <div className="hidden sm:block text-left">
                      <span className="text-xs font-bold text-stone-800 block max-w-[80px] truncate">{userData.name}</span>
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Free Plan</span>
                  </div>
                  <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 group-hover:text-amber-600 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-100 p-2 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
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
                <a href="/login" className="hidden md:flex text-sm font-bold text-stone-600 hover:text-black">Log in</a>
                <a href="/register" className="hidden md:flex text-sm font-bold text-stone-600 hover:text-black">Sign Up</a>
              </div>
            )}
            <a href="/templates" className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-sm font-bold hover:bg-black hover:scale-105 hover:shadow-xl hover:shadow-amber-900/10 transition-all flex items-center gap-2">
              Start Creating <ArrowRight size={16} strokeWidth={2.5} className="text-amber-400" />
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO HEADER --- */}
      <header className="pt-40 pb-20 px-6 bg-white border-b border-stone-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50/50 rounded-full blur-[100px] -z-10 pointer-events-none" />
         
         <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-widest shadow-sm">
                <Briefcase size={12} className="text-amber-500" />
                Join Us
            </span>
            <h1 className={`text-4xl md:text-6xl font-bold text-[#1C1917] leading-tight font-playfair`}>
               Build the Future of <br/> <span className="italic text-stone-500">Digital Gifting</span>
            </h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
               We're looking for passionate individuals to help us connect hearts around the world. Join our remote-first team and make a global impact.
            </p>
         </div>
      </header>

      {/* --- VALUES SECTION --- */}
      <section className="py-16 px-6 bg-[#FAFAF9]">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
               <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-6">
                     <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Remote First</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">Work from anywhere. We believe in output over hours and trust our team to manage their time.</p>
               </div>
               <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm">
                  <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-6">
                     <Heart size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Creative Freedom</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">We encourage experimentation. Your ideas matter, and we give you the space to bring them to life.</p>
               </div>
               <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
                     <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Fast Growth</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">Grow with us. We support your professional development with budget for courses and conferences.</p>
               </div>
            </div>

            {/* --- OPEN POSITIONS (EMPTY STATE) --- */}
            <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
                    <Coffee size={40} />
                </div>
                <h2 className={`text-3xl font-bold text-[#1C1917] mb-4 font-playfair`}>No Open Positions Yet</h2>
                <p className="text-stone-500 max-w-lg mx-auto mb-8 leading-relaxed">
                   Currently, we don't have any open positions. However, we're always growing! Check back soon for future updates.
                </p>
                
                <div className="p-6 bg-stone-50 rounded-2xl inline-block border border-stone-100">
                    <p className="text-sm text-stone-600 font-medium mb-3">Interested in joining us in the future?</p>
                    <a href="mailto:cardify.official.id@gmail.com" className="inline-flex items-center gap-2 text-[#1C1917] font-bold border-b-2 border-[#1C1917] pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors">
                      Send us your resume <ArrowRight size={16} />
                   </a>
                </div>
            </div>

         </div>
      </section>

      {/* --- FOOTER (UPDATED: Matches Home/Blog/About) --- */}
      <footer className="w-full bg-[#1C1917] text-stone-400 py-12 border-t border-stone-800">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
               <div className="md:col-span-1 space-y-4">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1C1917]">
                        <Gift size={16} className="text-amber-500" />
                     </div>
                     <span className={`text-2xl font-bold text-white font-playfair italic`}>Cardify.</span>
                  </div>
                  <p className="text-sm text-stone-500 leading-relaxed font-medium">
                     The modern way to celebrate. Creating digital moments that last forever.
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