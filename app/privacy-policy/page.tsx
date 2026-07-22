"use client";

import { useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
// MOCK IMPORTS REPLACEMENT: Use standard HTML/React components
import { 
  ArrowRight, Gift, User, LogOut, Settings, ChevronDown, 
  Shield, Lock, Eye, FileText, Server, Mail, Smartphone, Image as ImageIcon,
  Menu, X, Instagram, MessageCircle, Sparkles, Heart
} from "lucide-react";

// --- REUSABLE MOTION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

// --- MAIN CONTENT ---
export default function PrivacyPage() {
  // State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("info");
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Efek Samping: Cek Login & Scroll
  useEffect(() => {
    document.title = "Privacy Policy - Cardify";

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
      
      // Simple Scroll Spy logic
      const sections = ['info', 'usage', 'security', 'third-party', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Adjust for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
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
            
            <a href="/#features" className="hover:text-[#1C1917] transition-colors">Features</a>
            <a href="/about" className="hover:text-[#1C1917] transition-colors">About</a>
            <a href="mailto:cardify.official.id@gmail.com" className="hover:text-[#1C1917] transition-colors">Contact</a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {userData ? (
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border-2 border-[#1C1917] shadow-sm hover:shadow-md transition-all duration-300 group">
                  {userData.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
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

      {/* --- HERO HEADER (Sage paper) --- */}
      <header className="pt-44 pb-24 px-6 relative z-10 bg-[#A9D6BC] border-t-4 border-b-4 border-[#111111]">
         <motion.div
            className="max-w-4xl mx-auto text-center space-y-6"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
         >
            <motion.div variants={fadeUp} className="inline-flex items-center justify-center w-16 h-16 bg-[#1C1917] rounded-2xl mb-2 text-[#F6C445] shadow-[3px_3px_0_0_#F6C445]">
               <Shield size={32} />
            </motion.div>
            <motion.h1
               variants={fadeUp}
               className="text-6xl md:text-7xl text-[#111111] font-boldonse font-black italic"
               style={{ letterSpacing: "-0.02em" }}
            >
               Privacy Policy
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[14px] font-bold font-sans text-[#1C1917]/60">プライバシーポリシー</motion.p>
            <motion.p variants={fadeUp} className="text-lg text-[#1C1917]/70 max-w-2xl mx-auto leading-relaxed font-medium pt-2">
               We value your privacy as much as we value your special moments. Here's how we protect and manage your data.
            </motion.p>
            <motion.p variants={fadeUp} className="text-xs font-black text-[#1C1917]/50 uppercase tracking-widest pt-4 font-sans">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</motion.p>
         </motion.div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-grow bg-[#FDFBF3]">
         <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* SIDEBAR NAVIGATION (Sticky) */}
            <aside className="hidden lg:block lg:col-span-3">
               <div className="sticky top-32 space-y-1">
                  <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4 pl-4 font-sans">On this page</p>
                  {[
                    { id: 'info', label: '1. Information We Collect' },
                    { id: 'usage', label: '2. How We Use Information' },
                    { id: 'security', label: '3. Data Security' },
                    { id: 'third-party', label: '4. Third-Party Services' },
                    { id: 'contact', label: '5. Contact Us' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-all border-2 ${
                        activeSection === item.id 
                          ? "bg-[#F6C445] text-[#1C1917] border-[#1C1917] shadow-[3px_3px_0_0_#1C1917]" 
                          : "text-stone-500 border-transparent hover:text-stone-900 hover:bg-white hover:border-stone-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
               </div>
            </aside>

            {/* CONTENT BODY */}
            <div className="lg:col-span-8 lg:col-start-5 space-y-12">
               
               {/* Section 1 */}
               <section id="info" className="scroll-mt-32">
                  <div className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-stone-100">
                       <div className="w-10 h-10 rounded-full bg-[#F6C445] flex items-center justify-center text-[#1C1917] border-2 border-[#1C1917]"><Eye size={20} /></div>
                       <h2 className="text-2xl font-bold font-playfair">1. Information We Collect</h2>
                    </div>
                    <div className="prose prose-stone text-stone-600 leading-relaxed">
                       <p className="mb-4">
                         When you use <strong>Cardify</strong>, we collect specific information to provide the best experience in creating greeting cards. This information includes:
                       </p>
                       <ul className="space-y-3 list-none pl-0">
                         <li className="flex items-start gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#1C1917] mt-2 flex-shrink-0" />
                           <span><strong className="text-stone-900">Account Information:</strong> Name, email address, and profile picture provided via Google, GitHub, or manual registration.</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#1C1917] mt-2 flex-shrink-0" />
                           <span><strong className="text-stone-900">User Content:</strong> Text, photos, stickers, and design preferences you input while creating cards.</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#1C1917] mt-2 flex-shrink-0" />
                           <span><strong className="text-stone-900">Technical Data:</strong> IP address, browser type, and usage data for analytics.</span>
                         </li>
                       </ul>
                    </div>
                  </div>
               </section>

               {/* Section 2 */}
               <section id="usage" className="scroll-mt-32">
                  <div className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-stone-100">
                       <div className="w-10 h-10 rounded-full bg-[#BFE0F5] flex items-center justify-center text-[#1C1917] border-2 border-[#1C1917]"><FileText size={20} /></div>
                       <h2 className="text-2xl font-bold font-playfair">2. How We Use Information</h2>
                    </div>
                    <p className="text-stone-600 mb-4">We use your information solely to:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                       {['Provide and operate services', 'Improve user experience', 'Analyze usage trends', 'Send account updates'].map((item, i) => (
                         <div key={i} className="flex items-center gap-3 p-3 bg-[#FDFBF3] rounded-xl border-2 border-stone-100">
                           <div className="w-2 h-2 bg-[#1C1917] rounded-full" />
                           <span className="text-sm font-medium text-stone-700">{item}</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </section>

               {/* Section 3 */}
               <section id="security" className="scroll-mt-32">
                  <div className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-stone-100">
                       <div className="w-10 h-10 rounded-full bg-[#A9D6BC] flex items-center justify-center text-[#1C1917] border-2 border-[#1C1917]"><Lock size={20} /></div>
                       <h2 className="text-2xl font-bold font-playfair">3. Data Security</h2>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                       Your data security is our priority. We use industry-standard encryption to protect your personal information. Your password is <strong>hashed</strong> (one-way encrypted) and cannot be seen by anyone, including our team. We utilize secure HTTPS connections for all data transmission.
                    </p>
                  </div>
               </section>

               {/* Section 4 */}
               <section id="third-party" className="scroll-mt-32">
                  <div className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] hover:shadow-[5px_5px_0_0_#1C1917] transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-stone-100">
                       <div className="w-10 h-10 rounded-full bg-[#D8C9F2] flex items-center justify-center text-[#1C1917] border-2 border-[#1C1917]"><Server size={20} /></div>
                       <h2 className="text-2xl font-bold font-playfair">4. Third-Party Services</h2>
                    </div>
                    <p className="text-stone-600 mb-6">We rely on trusted third-party services to keep Cardify running smoothly:</p>
                    <div className="grid gap-4">
                       <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-stone-100 bg-[#FDFBF3]">
                          <div className="font-bold text-stone-900 min-w-[80px]">Vercel</div>
                          <div className="text-sm text-stone-600">Hosting infrastructure and website analytics.</div>
                       </div>
                       <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-stone-100 bg-[#FDFBF3]">
                          <div className="font-bold text-stone-900 min-w-[80px]">Auth</div>
                          <div className="text-sm text-stone-600">Google & GitHub for secure authentication services.</div>
                       </div>
                       <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-stone-100 bg-[#FDFBF3]">
                          <div className="font-bold text-stone-900 min-w-[80px]">Firebase</div>
                          <div className="text-sm text-stone-600">Secure database storage for user profiles and data.</div>
                       </div>
                    </div>
                    <p className="text-stone-400 text-xs italic mt-6 text-center">
                       *We never sell your personal data to any third party for marketing purposes.*
                    </p>
                  </div>
               </section>

               {/* Section 5 - UPDATED EMAIL */}
               <section id="contact" className="scroll-mt-32">
                  <div className="bg-[#1C1917] text-white p-10 rounded-[2rem] border-2 border-[#1C1917] text-center relative overflow-hidden">
                     <div className="absolute top-6 left-8 text-[#F6C445] rotate-[-12deg]"><Sparkles size={24} /></div>
                     <h2 className="text-3xl font-bold mb-4 font-playfair">Have Questions?</h2>
                     <p className="text-stone-400 mb-8 max-w-lg mx-auto">
                        If you have any questions about this Privacy Policy or how we handle your data, please do not hesitate to contact us.
                     </p>
                     <a href="mailto:cardify.official.id@gmail.com" className="inline-flex items-center gap-3 px-8 py-4 bg-[#F6C445] text-[#1C1917] rounded-full font-bold border-2 border-[#F6C445] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] transition-all">
                        <Mail size={20} />
                        Contact Support
                     </a>
                  </div>
               </section>

            </div>
         </div>
      </div>

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
                  <a href="/privacy-policy" className="cursor-pointer text-white font-bold transition-colors">Privacy Policy</a>
                  <a href="/terms" className="cursor-pointer hover:text-white transition-colors">Terms of Service</a>
               </div>
            </div>
         </div>
      </footer>

    </div>
  );
}