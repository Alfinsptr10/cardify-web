"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight, Sparkles, Gift, Heart, User, LogOut, Settings, ChevronDown,
  Bell, Globe, ShieldCheck, Link2, Check, Instagram, MessageCircle,
  Mail, Palette, Moon, Sun
} from "lucide-react";

// --- REUSABLE MOTION VARIANTS ---
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// --- TOGGLE SWITCH (komponen kecil, style konsisten dgn design system) ---
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full border-2 border-[#1C1917] transition-colors duration-300 flex-shrink-0 ${
        checked ? "bg-[#F6C445]" : "bg-stone-200"
      }`}
    >
      <motion.div
        className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-[#1C1917] shadow-sm"
        style={{ width: 18, height: 18 }}
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

// --- WRAPPER SESSION ---
export default function PreferencesPage() {
  return (
    <SessionProvider>
      <PreferencesContent />
    </SessionProvider>
  );
}

// --- KONTEN UTAMA ---
function PreferencesContent() {
  const { data: session } = useSession();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);
  const [saved, setSaved] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // --- STATE PREFERENCES (belum tersambung ke backend, tersimpan di state lokal dulu) ---
  const [notifCardOpened, setNotifCardOpened] = useState(true);
  const [notifProductUpdates, setNotifProductUpdates] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [allowAnalytics, setAllowAnalytics] = useState(true);
  const [language, setLanguage] = useState<"en" | "id">("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.title = "Preferences - Cardify";

    if (session?.user) {
      setUserData({
        name: session.user.name || "Pengguna",
        email: session.user.email || "user@cardify.id",
        image: session.user.image || null,
      });
    } else if (typeof window !== "undefined") {
      const isManualLogin = localStorage.getItem("isLoggedIn");
      if (isManualLogin === "true") {
        setUserData({
          name: localStorage.getItem("userName") || "Pengguna",
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
    const handleScroll = () => setScrolled(window.scrollY > 20);

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

  const handleSave = () => {
    // TODO: sambungkan ke endpoint update preferences kalau sudah ada
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFBF3] text-[#1C1917] selection:bg-[#F6C445] selection:text-[#1C1917] flex flex-col relative overflow-hidden font-sans">

      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,600;1,700&display=swap');
          .font-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
      `}} />

      {/* --- ANNOUNCEMENT TICKER --- */}
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

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-9 z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-[#FDFBF3]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3" : "bg-[#FDFBF3] border-stone-200 py-4"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center text-[#F6C445] shadow-[3px_3px_0_0_#F6C445] group-hover:rotate-12 group-hover:shadow-[4px_4px_0_0_#F6C445] transition-all duration-300">
              <Gift size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">A card with a story</span>
              <span className="text-xl font-bold tracking-tight font-playfair italic text-[#1C1917]">cardify</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {userData ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border-2 border-[#1C1917] shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  {userData.image ? (
                    <Image src={userData.image} alt={userData.name} width={34} height={34} className="rounded-full border border-stone-100" />
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
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl border-2 border-[#1C1917] shadow-[6px_6px_0_0_#1C1917] p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 bg-[#FDFBF3] rounded-xl mb-2 border-2 border-stone-100">
                      <p className="text-sm font-bold text-stone-900 truncate">{userData.name}</p>
                      <p className="text-xs text-stone-500 truncate font-medium">{userData.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link href="/account" className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-[#F6C445]/15 hover:text-[#1C1917] rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-[#F6C445] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917] group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all"><User size={16} /></div>
                        Profile & Account
                      </Link>
                      <Link href="/preferences" className="flex items-center gap-3 w-full p-2.5 text-sm text-[#1C1917] bg-[#BFE0F5]/25 rounded-xl font-bold group">
                        <div className="w-8 h-8 rounded-lg bg-[#BFE0F5] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917]"><Settings size={16} /></div>
                        Preferences
                      </Link>
                      <div className="h-px bg-stone-100 my-1 mx-2"></div>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2.5 text-sm text-red-600 hover:bg-[#F3B8CC]/25 rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-[#F3B8CC] border-2 border-[#1C1917] flex items-center justify-center text-red-600 group-hover:shadow-[2px_2px_0_0_#1C1917] transition-all"><LogOut size={16} /></div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2.5 rounded-full bg-[#1C1917] text-[#FDFBF3] text-sm font-bold border-2 border-[#1C1917]">Log in</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-28">

        {/* --- HEADER STRIP (Sky paper) --- */}
        <section className="bg-[#BFE0F5] border-t-4 border-b-4 border-[#111111] py-14 px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem} className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#1C1917] flex items-center justify-center text-[#F6C445] border-2 border-[#1C1917] shadow-[3px_3px_0_0_rgba(28,25,23,0.3)]">
              <Settings size={26} />
            </motion.div>
            <motion.h1 variants={staggerItem} className="text-4xl md:text-5xl text-[#111111] font-boldonse font-black italic" style={{ letterSpacing: "-0.02em" }}>
              Preferences
            </motion.h1>
            <motion.p variants={staggerItem} className="text-[13px] font-bold font-sans text-[#1C1917]/50 mt-2">設定</motion.p>
            <motion.p variants={staggerItem} className="text-[#1C1917]/70 font-medium mt-3 max-w-md mx-auto">
              Fine-tune how Cardify talks to you, and what it remembers about you.
            </motion.p>
          </motion.div>
        </section>

        {/* --- PREFERENCES CONTENT --- */}
        <section className="bg-[#FDFBF3] py-16 px-6">
          <motion.div
            className="max-w-2xl mx-auto space-y-6"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >

            {/* Notifications */}
            <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]">
              <h3 className="text-lg font-bold text-[#1C1917] mb-6 font-playfair flex items-center gap-2"><Bell size={18} /> Notifications</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-stone-800">Card opened alerts</p>
                    <p className="text-xs text-stone-500 mt-0.5">Get an email when someone opens a card you sent.</p>
                  </div>
                  <ToggleSwitch checked={notifCardOpened} onChange={() => setNotifCardOpened((v) => !v)} />
                </div>
                <div className="h-px bg-stone-100" />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-stone-800">Product updates</p>
                    <p className="text-xs text-stone-500 mt-0.5">New templates, features, and Cardify news.</p>
                  </div>
                  <ToggleSwitch checked={notifProductUpdates} onChange={() => setNotifProductUpdates((v) => !v)} />
                </div>
                <div className="h-px bg-stone-100" />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-stone-800">Marketing emails</p>
                    <p className="text-xs text-stone-500 mt-0.5">Occasional offers and promotions.</p>
                  </div>
                  <ToggleSwitch checked={notifMarketing} onChange={() => setNotifMarketing((v) => !v)} />
                </div>
              </div>
            </motion.div>

            {/* Language & Appearance */}
            <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]">
              <h3 className="text-lg font-bold text-[#1C1917] mb-6 font-playfair flex items-center gap-2"><Globe size={18} /> Language &amp; Appearance</h3>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-bold text-stone-800 mb-2">Language</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage("en")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        language === "en" ? "bg-[#1C1917] text-[#F6C445] border-[#1C1917]" : "bg-[#FDFBF3] text-stone-500 border-stone-200 hover:border-[#1C1917]"
                      }`}
                    >
                      {language === "en" && <Check size={14} />} English
                    </button>
                    <button
                      onClick={() => setLanguage("id")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        language === "id" ? "bg-[#1C1917] text-[#F6C445] border-[#1C1917]" : "bg-[#FDFBF3] text-stone-500 border-stone-200 hover:border-[#1C1917]"
                      }`}
                    >
                      {language === "id" && <Check size={14} />} Bahasa Indonesia
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-stone-800 mb-2">Theme</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        theme === "light" ? "bg-[#1C1917] text-[#F6C445] border-[#1C1917]" : "bg-[#FDFBF3] text-stone-500 border-stone-200 hover:border-[#1C1917]"
                      }`}
                    >
                      <Sun size={14} /> Light
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        theme === "dark" ? "bg-[#1C1917] text-[#F6C445] border-[#1C1917]" : "bg-[#FDFBF3] text-stone-500 border-stone-200 hover:border-[#1C1917]"
                      }`}
                    >
                      <Moon size={14} /> Dark
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">Dark theme is coming soon — this just saves your preference for later.</p>
                </div>
              </div>
            </motion.div>

            {/* Privacy */}
            <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]">
              <h3 className="text-lg font-bold text-[#1C1917] mb-6 font-playfair flex items-center gap-2"><ShieldCheck size={18} /> Privacy</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-stone-800">Show my activity</p>
                    <p className="text-xs text-stone-500 mt-0.5">Let friends see when you've created a new card.</p>
                  </div>
                  <ToggleSwitch checked={showActivity} onChange={() => setShowActivity((v) => !v)} />
                </div>
                <div className="h-px bg-stone-100" />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-stone-800">Usage analytics</p>
                    <p className="text-xs text-stone-500 mt-0.5">Help us improve Cardify by sharing anonymous usage data.</p>
                  </div>
                  <ToggleSwitch checked={allowAnalytics} onChange={() => setAllowAnalytics((v) => !v)} />
                </div>
              </div>
            </motion.div>

            {/* Connected Accounts */}
            <motion.div variants={staggerItem} className="bg-white p-8 rounded-[1.75rem] border-2 border-[#1C1917] shadow-[5px_5px_0_0_#1C1917]">
              <h3 className="text-lg font-bold text-[#1C1917] mb-6 font-playfair flex items-center gap-2"><Link2 size={18} /> Connected Accounts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-stone-100 bg-[#FDFBF3]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white border-2 border-[#1C1917] flex items-center justify-center text-xs font-black">G</div>
                    <div>
                      <p className="text-sm font-bold text-stone-800">Google</p>
                      <p className="text-xs text-stone-400">{session?.user ? "Connected" : "Not connected"}</p>
                    </div>
                  </div>
                  {session?.user ? (
                    <span className="text-xs font-bold text-[#1C1917] bg-[#B8E3C9] px-3 py-1 rounded-full border-2 border-[#1C1917]">Active</span>
                  ) : (
                    <button className="text-xs font-bold text-[#1C1917] border-b-2 border-[#1C1917]">Connect</button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Save */}
            <motion.div variants={staggerItem} className="flex items-center justify-end gap-3 pt-2">
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-bold text-[#1C1917] flex items-center gap-1.5"
                >
                  <Check size={16} className="text-[#1C1917]" /> Saved!
                </motion.span>
              )}
              <button
                onClick={handleSave}
                className="px-8 py-3.5 rounded-full bg-[#1C1917] text-[#FDFBF3] text-sm font-bold border-2 border-[#1C1917] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#F6C445] transition-all flex items-center gap-2"
              >
                <Check size={16} /> Save Preferences
              </button>
            </motion.div>

          </motion.div>
        </section>
      </main>

      {/* --- FOOTER --- */}
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
                <li><Link href="/templates" className="hover:text-white cursor-pointer transition-colors">Templates</Link></li>
                <li><Link href="/features" className="hover:text-white cursor-pointer transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm text-stone-500 font-medium">
                <li><Link href="/about" className="hover:text-white cursor-pointer transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white cursor-pointer transition-colors">Careers</Link></li>
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
              <Link href="/privacy-policy" className="cursor-pointer hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="cursor-pointer hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}