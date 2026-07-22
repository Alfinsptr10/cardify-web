"use client";

import { useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { 
  ArrowLeft, Search, Smartphone, Image as ImageIcon, ArrowRight, Sparkles, Filter,
  Gift, User, LogOut, Settings, ChevronDown, // Ditambahkan icon yang dibutuhkan navbar
  Instagram,
  MessageCircle,
  Heart
} from "lucide-react";

// --- REUSABLE MOTION VARIANTS (sama seperti homepage) ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'web-story' | 'card-image'>('all');

  // --- STATE UNTUK HEADER (SAMA SEPERTI HOME) ---
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Efek: Auth Check & Scroll Listener
  useEffect(() => {
    // 1. Cek Login Manual
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

    // 2. Event Listeners
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

    // 3. Filter Logic dari URL
    const searchParams = new URLSearchParams(window.location.search);
    const filter = searchParams.get('filter');
    if (filter === 'web-story') setActiveTab('web-story');
    else if (filter === 'card-image') setActiveTab('card-image');

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
    window.location.reload();
  };

  // MOCK DATA TEMPLATES
  const templates = [
    {
      id: 1,
      href: "/templates/retro-gameboy",
      title: "Retro 8-Bit",
      category: "card-image",
      description: "Nostalgic console aesthetic for gamers.",
      image: "/retro-gameboy.png",
      tag: "Best Seller",
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 2,
      href: "/web-story",
      title: "Our Story",
      category: "web-story",
      description: "Interactive story with music and animations.",
      image: "/field.jpeg", 
      tag: "New",
      color: "bg-sky-100 text-sky-600"
    },
    {
      id: 3,
      href: "/templates/minimalist",
      title: "Modern Minimalist",
      category: "card-image",
      description: "Clean typography focused design.",
      image: "/minimalist.png",
      tag: "Popular",
      color: "bg-stone-100 text-stone-600"
    },
    {
      id: 4,
      href: "/templates/postcard",
      title: "Classic Postcard",
      category: "card-image",
      description: "Warm vintage greeting style.",
      image: "/postcard.png",
      tag: "Classic",
      color: "bg-amber-100 text-amber-600"
    },
    {
      id: 5,
      href: "/templates/newspaper",
      title: "Vintage Press",
      category: "card-image",
      description: "Headline news aesthetic.",
      image: "/newspaper.png",
      tag: "Unique",
      color: "bg-slate-100 text-slate-600"
    },
   {
      id: 6,
      href: "/gameboy-app",
      title: "Gameboy Journey",
      category: "web-story",
      description: "Relive the adventure with pixel art and chiptune music.",
      image: "/gameboy-story.jpg",
      tag: "Featured",
      color: "bg-green-100 text-green-600"
   },
   {
      id: 7,
      href: "/scrapbook",
      title: "Scrapbook Memories",
      category: "web-story",
      description: "A nostalgic scrapbook with interactive elements.",
      image: "/scrapbook-story.jpg",
      tag: "Creative",
      color: "bg-pink-100 text-pink-600"
   },
   {
      id: 8,
      href: "/photobooth",
      title: "Photobooth Studio",
      category: "card-image",
      description: "Live photo capture with custom frames, tones, and text.",
      image: "/template/camera.png",
      tag: "Interactive",
      color: "bg-amber-100 text-amber-600"
   }
  ];

  const filteredTemplates = activeTab === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeTab);

  return (
    <div className="min-h-screen bg-[#FDFBF3] font-dm-sans text-[#1C1917]">
      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,600;1,700&display=swap');
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
          @keyframes marquee-t { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}} />

      {/* --- ANNOUNCEMENT TICKER (fixed — navbar halaman ini juga fixed, jadi ticker ikut fixed di atasnya) --- */}
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

      {/* --- NAVBAR (fixed, digeser top-9 karena ada ticker fixed di atasnya) --- */}
      <nav className={`fixed top-9 z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-[#FDFBF3]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3" : "bg-[#FDFBF3] border-transparent py-5"}`}>
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
          
          {/* Navigation Links - Centered */}
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
                      <div className="w-10 h-10 rounded-full bg-[#F3B8CC] flex-shrink-0 flex items-center justify-center text-[#1C1917] border-2 border-[#1C1917] transition-all shadow-sm">
                         <Smartphone size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-stone-800 transition-colors">Web Story</p>
                         <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5 normal-case">Interactive, Music, Animations</p>
                      </div>
                   </a>

                   <a href="/templates?filter=card-image" className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F6C445]/20 transition-colors group/item relative z-10">
                      <div className="w-10 h-10 rounded-full bg-[#F6C445] flex-shrink-0 flex items-center justify-center text-[#1C1917] border-2 border-[#1C1917] transition-all shadow-sm">
                         <ImageIcon size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-stone-800 transition-colors">Card Image</p>
                         <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5 normal-case">Static, Printable, Classic</p>
                      </div>
                   </a>
                </div>
            </div>
            
            <a href="/#features" className="hover:text-[#1C1917] transition-colors">Features</a>
            <a href="/about" className="hover:text-[#1C1917] transition-colors">About</a>
            <a href="mailto:cardify.official.id@gmail.com" className="hover:text-[#1C1917] transition-colors">Contact</a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {userData ? (
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border-2 border-[#1C1917] shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  {userData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userData.image} alt={userData.name} width={34} height={34} className="rounded-full border border-stone-100" />
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
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border-2 border-[#1C1917] p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
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
                <a href="/login" className="hidden md:flex text-sm font-bold uppercase tracking-wide text-stone-600 hover:text-black transition-colors">Log in</a>
                <a href="/register" className="hidden md:flex text-sm font-bold uppercase tracking-wide text-stone-600 hover:text-black transition-colors">Sign Up</a>
              </div>
            )}
            <a href="/templates" className="px-5 py-2.5 rounded-full bg-[#1C1917] text-[#FDFBF3] text-sm font-bold hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#F6C445] transition-all flex items-center gap-2 border-2 border-[#1C1917]">
              Start Creating <ArrowRight size={16} strokeWidth={2.5} className="text-[#F6C445]" />
            </a>
          </div>
        </div>
      </nav>

      {/* --- HEADER (Sky paper, hero-style) --- */}
      <header className="relative pt-44 pb-24 px-6 text-center overflow-hidden bg-[#BFE0F5] border-t-4 border-b-4 border-[#111111]">
         <motion.div
            className="max-w-4xl mx-auto relative z-10"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
         >
             <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#F6C445] text-[11px] font-black uppercase tracking-widest mb-8 shadow-sm -rotate-2 font-sans">
                <Sparkles size={12} />
                Curated Library
             </motion.div>
             
             <motion.h1
                variants={staggerItem}
                className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic mb-4"
                style={{ letterSpacing: "-0.02em" }}
             >
                Craft Your Moment.
             </motion.h1>
             <motion.p variants={staggerItem} className="text-[14px] font-bold font-sans text-[#1C1917]/60 mb-8">
                あなたの瞬間をデザインしよう
             </motion.p>
             
             <motion.p variants={staggerItem} className="text-[#1C1917]/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
                Explore our collection of interactive stories and timeless cards. <br className="hidden md:block"/> Designed to make every feeling unforgettable.
             </motion.p>
         </motion.div>
      </header>

      {/* --- FILTERS --- */}
      <div className="max-w-7xl mx-auto px-6 mb-12 -mt-7 relative z-20">
         <div className="flex justify-center">
            <div className="bg-white p-1.5 rounded-full border-2 border-[#1C1917] shadow-[4px_4px_0_0_#1C1917] inline-flex items-center gap-1">
               <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${activeTab === 'all' ? 'bg-[#1C1917] text-[#F6C445] shadow-md' : 'text-stone-500 hover:bg-stone-50'}`}
               >
                  All Templates
               </button>
               <button 
                  onClick={() => setActiveTab('web-story')}
                  className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${activeTab === 'web-story' ? 'bg-[#F3B8CC] text-[#1C1917] shadow-md' : 'text-stone-500 hover:bg-stone-50'}`}
               >
                  <Smartphone size={16} /> Web Story
               </button>
               <button 
                  onClick={() => setActiveTab('card-image')}
                  className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${activeTab === 'card-image' ? 'bg-[#F6C445] text-[#1C1917] shadow-md' : 'text-stone-500 hover:bg-stone-50'}`}
               >
                  <ImageIcon size={16} /> Card Image
               </button>
            </div>
         </div>
      </div>

      {/* --- GRID --- */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
         <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
         >
            {filteredTemplates.map((template) => (
<a
  href={template.href}
  key={template.id}
  className="group block h-full"
>

                  <motion.div variants={staggerItem} className="bg-white rounded-[1.75rem] border-2 border-[#1C1917] overflow-hidden hover:-translate-y-1.5 hover:shadow-[6px_6px_0_0_#1C1917] transition-all duration-300 h-full flex flex-col">
                     {/* Image Container */}
                     <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden border-b-2 border-[#1C1917]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                           src={template.image} 
                           alt={template.title} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border-2 border-[#1C1917] ${template.color} bg-white/90 backdrop-blur font-sans`}>
                           {template.tag}
                        </div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                           <span className="bg-[#F6C445] text-[#1C1917] px-6 py-3 rounded-full font-bold text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl flex items-center gap-2 border-2 border-[#1C1917]">
                              Use Template <ArrowRight size={14} />
                           </span>
                        </div>
                     </div>

                     {/* Content */}
                     <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="text-xl font-bold text-stone-800 font-playfair transition-colors">{template.title}</h3>
                           <div className={`p-1.5 rounded-full border-2 border-[#1C1917] ${template.category === 'web-story' ? 'bg-[#F3B8CC] text-[#1C1917]' : 'bg-[#F6C445] text-[#1C1917]'}`}>
                             {template.category === 'web-story' ? <Smartphone size={14} /> : <ImageIcon size={14} />}
                           </div>
                        </div>
                        <p className="text-stone-500 text-sm leading-relaxed mb-4 flex-grow font-light">
                           {template.description}
                        </p>
                        
                        <div className="flex items-center gap-2 pt-4 border-t-2 border-stone-100">
                           <div className="flex -space-x-2">
                              {[1,2,3].map(i => (
                                 <div key={i} className="w-6 h-6 rounded-full bg-stone-200 border-2 border-white"></div>
                              ))}
                           </div>
                           <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wide ml-2">2k+ Users</span>
                        </div>
                     </div>
                  </motion.div>
               </a>
            ))}
         </motion.div>
      </main>

      {/* --- FOOTER (sama seperti homepage) --- */}
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
                     <li><a href="/templates" className="text-white font-bold cursor-pointer transition-colors">Templates</a></li>
                     <li><a href="/showcase" className="hover:text-white cursor-pointer transition-colors">Showcase</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
                  <ul className="space-y-4 text-sm text-stone-500 font-medium">
                     <li><a href="/about" className="hover:text-white cursor-pointer transition-colors">About</a></li>
                     <li><a href="/careers" className="hover:text-white cursor-pointer transition-colors">Careers</a></li>
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