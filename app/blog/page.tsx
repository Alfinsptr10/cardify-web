"use client";

import { useState, useEffect, useRef } from "react";
// MOCK IMPORTS REPLACEMENT: Use standard HTML/React components
import { 
  ArrowRight, Gift, User, LogOut, Settings, ChevronDown, 
  Search, Calendar, Clock, ArrowUpRight, Tag, BookOpen,
  Instagram, MessageCircle, Mail, Smartphone, Image as ImageIcon
} from "lucide-react";

// --- FONT CONFIG (Manual CSS Injection used in render) ---
const playfair = { className: "font-playfair" };
const dmSans = { className: "font-dm-sans" };

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

// --- MAIN CONTENT ---
export default function BlogPage() {
  // State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  const handleLogout = async () => {
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

      {/* --- FOOTER (UPDATED: Match Home & Privacy) --- */}
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
                     <li><a href="/careers" className="hover:text-white cursor-pointer transition-colors">Careers</a></li>
                     <li><a href="/blog" className="text-white font-bold cursor-pointer transition-colors">Blog</a></li>
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