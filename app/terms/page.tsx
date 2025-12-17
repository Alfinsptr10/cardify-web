"use client";

import { useState, useEffect, useRef } from "react";
// MOCK IMPORTS REPLACEMENT: Use standard HTML/React components
import { 
  ArrowRight, Gift, User, LogOut, Settings, ChevronDown, 
  Scale, CheckCircle, AlertTriangle, FileText, Ban, Mail, Smartphone, Image as ImageIcon,
  Menu, X, Instagram, MessageCircle
} from "lucide-react";

// --- MAIN CONTENT ---
export default function TermsPage() {
  // State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("acceptance");
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Efek Samping: Cek Login & Scroll
  useEffect(() => {
    document.title = "Terms of Service - Cardify";

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
      
      const sections = ['acceptance', 'usage', 'content', 'termination', 'disclaimer'];
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
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
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

      {/* --- NAVBAR (UPDATED: Match Home & Privacy) --- */}
      <nav className={`fixed z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-[#FAFAF9]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3" : "bg-transparent border-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          {/* Logo Brand */}
          <a href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
               <Gift size={18} strokeWidth={2.5} className="text-amber-400" />
            </div>
            <span className={`text-2xl font-bold tracking-tight font-playfair italic text-[#1C1917]`}>Cardify.</span>
          </a>
          
          {/* Navigation Links - Centered */}
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
            
            <a href="/#features" className="hover:text-[#1C1917] transition-colors">Features</a>
            <a href="/about" className="hover:text-[#1C1917] transition-colors">About</a>
            <a href="mailto:cardify.official.id@gmail.com" className="hover:text-[#1C1917] transition-colors">Contact</a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {userData ? (
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                  {userData.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
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
                <a href="/login" className="hidden md:flex text-sm font-bold text-stone-600 hover:text-black transition-colors">Log in</a>
                <a href="/register" className="hidden md:flex text-sm font-bold text-stone-600 hover:text-black transition-colors">Sign Up</a>
              </div>
            )}
            <a href="/templates" className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-sm font-bold hover:bg-black hover:scale-105 hover:shadow-xl hover:shadow-amber-900/10 transition-all flex items-center gap-2">
              Start Creating <ArrowRight size={16} strokeWidth={2.5} className="text-amber-400" />
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO HEADER --- */}
      <header className="pt-40 pb-20 px-6 relative z-10 bg-white border-b border-stone-100">
         <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-50 rounded-2xl mb-2 text-stone-800 shadow-sm border border-stone-100">
               <Scale size={32} />
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold text-[#1C1917] font-playfair`}>Terms of Service</h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
               Please read these terms and conditions carefully before using Cardify's services.
            </p>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest pt-4">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
         </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-grow bg-[#FAFAF9]">
         <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="hidden lg:block lg:col-span-3">
               <div className="sticky top-32 space-y-1">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 pl-4">On this page</p>
                  {[
                    { id: 'acceptance', label: '1. Acceptance of Terms' },
                    { id: 'usage', label: '2. Acceptable Use' },
                    { id: 'content', label: '3. User Content' },
                    { id: 'termination', label: '4. Termination' },
                    { id: 'disclaimer', label: '5. Disclaimer' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                        activeSection === item.id 
                          ? "bg-white text-amber-700 shadow-sm border border-stone-100" 
                          : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
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
               <section id="acceptance" className="scroll-mt-32">
                  <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                       <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><CheckCircle size={20} /></div>
                       <h2 className={`text-2xl font-bold font-playfair`}>1. Acceptance of Terms</h2>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                       By accessing or using <strong>Cardify</strong>, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
                    </p>
                  </div>
               </section>

               {/* Section 2 */}
               <section id="usage" className="scroll-mt-32">
                  <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                       <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><FileText size={20} /></div>
                       <h2 className={`text-2xl font-bold font-playfair`}>2. Acceptable Use</h2>
                    </div>
                    <p className="text-stone-600 mb-4">You agree not to use the service to:</p>
                    <ul className="list-none pl-0 space-y-3">
                       <li className="flex items-start gap-3">
                          <Ban size={18} className="text-red-500 mt-1 flex-shrink-0" />
                          <span className="text-stone-600">Upload content that is illegal, harmful, or violates any third-party rights.</span>
                       </li>
                       <li className="flex items-start gap-3">
                          <Ban size={18} className="text-red-500 mt-1 flex-shrink-0" />
                          <span className="text-stone-600">Attempt to gain unauthorized access to our systems or user accounts.</span>
                       </li>
                       <li className="flex items-start gap-3">
                          <Ban size={18} className="text-red-500 mt-1 flex-shrink-0" />
                          <span className="text-stone-600">Use the service for spamming or any commercial solicitation without consent.</span>
                       </li>
                    </ul>
                  </div>
               </section>

               {/* Section 3 */}
               <section id="content" className="scroll-mt-32">
                  <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                       <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><Settings size={20} /></div>
                       <h2 className={`text-2xl font-bold font-playfair`}>3. User Content</h2>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                       You retain ownership of any content (text, images) you upload to Cardify. However, by uploading, you grant us a license to use, store, and display your content solely for the purpose of providing the service to you (e.g., generating your card).
                    </p>
                  </div>
               </section>

               {/* Section 4 */}
               <section id="termination" className="scroll-mt-32">
                  <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                       <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600"><AlertTriangle size={20} /></div>
                       <h2 className={`text-2xl font-bold font-playfair`}>4. Termination</h2>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                       We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
                    </p>
                  </div>
               </section>

               {/* Section 5 */}
               <section id="disclaimer" className="scroll-mt-32">
                  <div className="bg-[#1C1917] text-white p-10 rounded-[2rem] shadow-xl text-center">
                     <h2 className={`text-3xl font-bold mb-4 font-playfair`}>5. Disclaimer</h2>
                     <p className="text-stone-400 mb-8 max-w-lg mx-auto">
                        The service is provided on an "AS IS" and "AS AVAILABLE" basis. Cardify makes no warranties, expressed or implied, regarding the reliability or availability of the service.
                     </p>
                     <a href="mailto:cardify.official.id@gmail.com" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-400/20 hover:-translate-y-1">
                        <Mail size={20} />
                        Contact Support
                     </a>
                  </div>
               </section>

            </div>
         </div>
      </div>

      {/* --- FOOTER (UPDATED: Match Home & Privacy) --- */}
      <footer className="w-full bg-[#1C1917] text-stone-400 py-12 border-t border-stone-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <Gift size={20} className="text-white" />
               <span className={`text-2xl font-bold text-white font-playfair italic`}>Cardify.</span>
            </div>
            <p className="text-sm">© 2025 Cardify Inc. Built with passion in Jakarta.</p>
            <div className="flex gap-6 text-sm font-bold text-white">
               <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
               <a href="/about" className="hover:text-amber-400 transition-colors">About</a>
               <a href="/#templates" className="hover:text-amber-400 transition-colors">Templates</a>
            </div>
         </div>
      </footer>

    </div>
  );
}