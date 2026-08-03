"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
// MOCK IMPORTS REPLACEMENT: Use standard HTML/React components
import {
  ArrowRight, Gift, User, LogOut, Settings, ChevronDown, Sparkles,
  Scale, CheckCircle, AlertTriangle, FileText, Ban, Mail, Smartphone, Image as ImageIcon,
  Menu, X, Instagram, MessageCircle, Heart, Twitter, Facebook, Linkedin, Youtube, Globe,
} from "lucide-react";

/* ============ DŌZO STYLE TOKENS ============ */
const INK = "#1C1917";
const CREAM = "#FFFDF5";
const MINT = "#84D4A4";
const SKY = "#BFE0F5";
const YELLOW = "#F6C445";
const CORAL = "#F3B8CC";
const LILAC = "#CFC4F0";

// --- MAIN CONTENT ---
export default function TermsPage() {
  // State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("acceptance");
  const [userData, setUserData] = useState<{ name: string; email: string; image: string | null } | null>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [decorations, setDecorations] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [galleryPage, setGalleryPage] = useState(0);

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

  const initiateLogout = () => {
    setShowProfileMenu(false);
    setShowLogoutConfirm(true);
  };

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
    <div className="flex min-h-screen w-full flex-col font-sans" style={{ background: CREAM, color: INK }}>

      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-sans { font-family: 'DM Sans', sans-serif; }
          .font-display { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
          .font-serif-it { font-family: 'Instrument Serif', serif; font-style: italic; }
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

      {/* --- NAVBAR --- */}
      <nav
        className={`relative z-50 w-full border-b-[2.5px] transition-all duration-300 ${scrolled ? "py-3 shadow-[0_5px_0_0_#1C1917]" : "py-5"}`}
        style={{ background: CREAM, borderColor: INK }}
      >
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6">

          {/* Logo Brand */}
          <Link href="/" className="group flex cursor-pointer items-center gap-2.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl border-[2.5px] p-1.5 shadow-[3px_3px_0_0_#F6C445] transition-all duration-300 group-hover:rotate-12 group-hover:shadow-[5px_5px_0_0_#F6C445]"
              style={{ background: INK, borderColor: INK }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-cardify.svg" alt="Cardify" className="h-full w-full object-contain" />
            </div>
            <div className="leading-none">
              <div className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: INK }}>
                A CARD WITH A STORY
              </div>
              <div className="font-display text-2xl font-black italic tracking-[-0.02em]" style={{ color: INK }}>
                cardify
              </div>
            </div>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="absolute left-1/2 top-1/2 hidden h-full -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-black uppercase tracking-wide md:flex" style={{ color: INK }}>

            {/* 1. Templates Dropdown */}
            <div className="group relative flex h-full cursor-pointer items-center">
              <Link href="/templates" className="flex items-center gap-1 py-2 transition-transform group-hover:-translate-y-0.5">
                Templates
                <ChevronDown size={14} strokeWidth={3} className="transition-transform duration-300 group-hover:rotate-180" />
              </Link>

              {/* Dropdown Menu */}
              <div
                className="invisible absolute left-1/2 top-full z-50 mt-4 w-72 origin-top -translate-x-1/2 translate-y-2 rounded-3xl border-[2.5px] p-3 normal-case opacity-0 shadow-[6px_6px_0_0_#1C1917] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                style={{ background: CREAM, borderColor: INK }}
              >
                <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-wider opacity-60">Create New</p>

                <Link href="/web-story" className="group/item relative z-10 mb-1 flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-[#F3B8CC]/40">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[2.5px] shadow-[2px_2px_0_0_#1C1917]"
                    style={{ background: CORAL, borderColor: INK, color: INK }}
                  >
                    <Smartphone size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Web Story</p>
                    <p className="mt-0.5 text-[10px] font-bold normal-case leading-tight opacity-70">Interactive, Music, Animations</p>
                  </div>
                </Link>

                <Link href="/templates?filter=card-image" className="group/item relative z-10 flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-[#F6C445]/40">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[2.5px] shadow-[2px_2px_0_0_#1C1917]"
                    style={{ background: YELLOW, borderColor: INK, color: INK }}
                  >
                    <ImageIcon size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Card Image</p>
                    <p className="mt-0.5 text-[10px] font-bold normal-case leading-tight opacity-70">Static, Printable, Classic</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* 2. Features */}
            <Link href="/features" className="group relative transition-transform hover:-translate-y-0.5">
              Features
              <span className="absolute -bottom-1 left-0 h-[3px] w-0 transition-all group-hover:w-full" style={{ background: INK }}></span>
            </Link>

            {/* 3. About */}
            <Link href="/about" className="group relative transition-transform hover:-translate-y-0.5">
              About
              <span className="absolute -bottom-1 left-0 h-[3px] w-0 transition-all group-hover:w-full" style={{ background: INK }}></span>
            </Link>

            {/* 4. Contact */}
            <Link href="/contact" className="group relative transition-transform hover:-translate-y-0.5">
              Contact
              <span className="absolute -bottom-1 left-0 h-[3px] w-0 transition-all group-hover:w-full" style={{ background: INK }}></span>
            </Link>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">

            {session ? (
              // --- LOGGED IN STATE ---
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="group flex items-center gap-3 rounded-full border-[2.5px] py-1 pl-1 pr-4 shadow-[3px_3px_0_0_#1C1917] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#1C1917]"
                  style={{ background: CREAM, borderColor: INK }}
                >
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={34}
                      height={34}
                      className="rounded-full border-2"
                      style={{ borderColor: INK }}
                    />
                  ) : (
                    <div
                      className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-2"
                      style={{ background: YELLOW, borderColor: INK, color: INK }}
                    >
                      <User size={16} strokeWidth={2.5} />
                    </div>
                  )}
                  <div className="hidden text-left sm:block">
                    <span className="block max-w-[80px] truncate text-xs font-black leading-tight">
                      {session?.user?.name || "User"}
                    </span>
                    <span className="text-[9px] font-black uppercase leading-none tracking-wider opacity-60">Free Plan</span>
                  </div>
                  <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div
                    className="absolute right-0 top-full mt-3 w-72 origin-top-right overflow-hidden rounded-3xl border-[2.5px] p-2 shadow-[6px_6px_0_0_#1C1917] duration-200 animate-in fade-in zoom-in-95"
                    style={{ background: CREAM, borderColor: INK }}
                  >
                    <div className="mb-2 rounded-2xl border-[2.5px] p-4" style={{ background: SKY, borderColor: INK }}>
                      <p className="truncate text-sm font-black">{session?.user?.name}</p>
                      <p className="truncate text-xs font-bold opacity-70">{session?.user?.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link href="/account" className="group flex w-full items-center gap-3 rounded-2xl p-2.5 text-sm font-bold transition-all hover:bg-[#F6C445]/40">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 transition-all group-hover:shadow-[2px_2px_0_0_#1C1917]" style={{ background: YELLOW, borderColor: INK, color: INK }}><User size={16} strokeWidth={2.5} /></div>
                        Profile &amp; Account
                      </Link>
                      <button className="group flex w-full items-center gap-3 rounded-2xl p-2.5 text-sm font-bold transition-all hover:bg-[#BFE0F5]/50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 transition-all group-hover:shadow-[2px_2px_0_0_#1C1917]" style={{ background: SKY, borderColor: INK, color: INK }}><Settings size={16} strokeWidth={2.5} /></div>
                        Preferences
                      </button>
                      <div className="mx-2 my-1 h-[2px]" style={{ background: INK, opacity: 0.15 }}></div>
                      <button onClick={initiateLogout} className="group flex w-full items-center gap-3 rounded-2xl p-2.5 text-sm font-bold transition-all hover:bg-[#F3B8CC]/50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 transition-all group-hover:shadow-[2px_2px_0_0_#1C1917]" style={{ background: CORAL, borderColor: INK, color: INK }}><LogOut size={16} strokeWidth={2.5} /></div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // --- LOGGED OUT STATE ---
              <div className="flex items-center gap-6">
                <Link href="/login" className="hidden text-sm font-black uppercase tracking-wide transition-transform hover:-translate-y-0.5 md:flex" style={{ color: INK }}>
                  Log in
                </Link>
                <Link href="/register" className="hidden text-sm font-black uppercase tracking-wide transition-transform hover:-translate-y-0.5 md:flex" style={{ color: INK }}>
                  Sign Up
                </Link>
              </div>
            )}

            {/* CTA Button */}
            <Link
              href="/templates"
              className="flex items-center gap-2 rounded-full border-[2.5px] px-5 py-2.5 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_#1C1917] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#1C1917]"
              style={{ background: INK, borderColor: INK, color: CREAM }}
            >
              Start Creating
              <ArrowRight size={16} strokeWidth={3} style={{ color: YELLOW }} />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO HEADER --- */}
      <header
        className="relative z-10 overflow-hidden border-b-[2.5px] px-6 pb-20 pt-20"
        style={{ background: MINT, borderColor: INK }}
      >
        {/* chunky blobs */}
        <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full border-[2.5px] opacity-70" style={{ background: LILAC, borderColor: INK }} />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-48 w-48 rounded-full border-[2.5px] opacity-70" style={{ background: SKY, borderColor: INK }} />

        <div className="relative mx-auto max-w-4xl space-y-6 text-center">
          <div className="relative mx-auto inline-flex items-center justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-3xl border-[2.5px] shadow-[5px_5px_0_0_#1C1917]"
              style={{ background: YELLOW, borderColor: INK, color: INK }}
            >
              <Scale size={34} strokeWidth={2.5} />
            </div>
            <span
              className="absolute -right-16 -top-3 rotate-[8deg] rounded-full border-[2.5px] px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_#1C1917]"
              style={{ background: CREAM, borderColor: INK, color: INK }}
            >
              Legal ✿
            </span>
          </div>

          <h1 className="font-display text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] md:text-6xl" style={{ color: INK }}>
            Terms of Service
          </h1>

          <p className="mx-auto max-w-2xl text-lg font-bold leading-relaxed" style={{ color: INK }}>
            Please read these terms and conditions carefully before using{" "}
            <span className="font-serif-it">Cardify&apos;s</span> services.
          </p>

          <p
            className="mx-auto inline-block rounded-full border-[2.5px] px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_0_#1C1917]"
            style={{ background: CREAM, borderColor: INK, color: INK }}
          >
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-grow" style={{ background: CREAM }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-12">

          {/* SIDEBAR NAVIGATION */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-32 space-y-2">
              <p className="mb-4 pl-2 text-xs font-black uppercase tracking-widest opacity-60">On this page</p>
              {[
                { id: 'acceptance', label: '1. Acceptance of Terms', tint: YELLOW },
                { id: 'usage', label: '2. Acceptable Use', tint: SKY },
                { id: 'content', label: '3. User Content', tint: MINT },
                { id: 'termination', label: '4. Termination', tint: CORAL },
                { id: 'disclaimer', label: '5. Disclaimer', tint: LILAC },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full rounded-2xl border-[2.5px] px-4 py-2.5 text-left text-sm font-black transition-all ${
                    activeSection === item.id
                      ? "shadow-[4px_4px_0_0_#1C1917] -translate-y-0.5"
                      : "shadow-[2px_2px_0_0_#1C1917] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#1C1917]"
                  }`}
                  style={{
                    background: activeSection === item.id ? item.tint : CREAM,
                    borderColor: INK,
                    color: INK,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* CONTENT BODY */}
          <div className="space-y-10 lg:col-span-8 lg:col-start-5">

            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-32">
              <div
                className="rounded-[2rem] border-[2.5px] p-8 shadow-[6px_6px_0_0_#1C1917] transition-all hover:-translate-y-1 hover:shadow-[9px_9px_0_0_#1C1917]"
                style={{ background: CREAM, borderColor: INK }}
              >
                <div className="mb-6 flex items-center gap-4 border-b-[2.5px] pb-6" style={{ borderColor: INK }}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] shadow-[3px_3px_0_0_#1C1917]" style={{ background: YELLOW, borderColor: INK, color: INK }}><CheckCircle size={20} strokeWidth={2.5} /></div>
                  <h2 className="font-display text-xl font-black uppercase tracking-tight md:text-2xl">1. Acceptance of Terms</h2>
                </div>
                <p className="font-medium leading-relaxed">
                  By accessing or using <strong>Cardify</strong>, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="usage" className="scroll-mt-32">
              <div
                className="rounded-[2rem] border-[2.5px] p-8 shadow-[6px_6px_0_0_#1C1917] transition-all hover:-translate-y-1 hover:shadow-[9px_9px_0_0_#1C1917]"
                style={{ background: CREAM, borderColor: INK }}
              >
                <div className="mb-6 flex items-center gap-4 border-b-[2.5px] pb-6" style={{ borderColor: INK }}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] shadow-[3px_3px_0_0_#1C1917]" style={{ background: SKY, borderColor: INK, color: INK }}><FileText size={20} strokeWidth={2.5} /></div>
                  <h2 className="font-display text-xl font-black uppercase tracking-tight md:text-2xl">2. Acceptable Use</h2>
                </div>
                <p className="mb-4 font-bold">You agree not to use the service to:</p>
                <ul className="list-none space-y-3 pl-0">
                  {[
                    "Upload content that is illegal, harmful, or violates any third-party rights.",
                    "Attempt to gain unauthorized access to our systems or user accounts.",
                    "Use the service for spamming or any commercial solicitation without consent.",
                  ].map((text) => (
                    <li
                      key={text}
                      className="flex items-start gap-3 rounded-2xl border-[2.5px] p-3"
                      style={{ background: "#FFF", borderColor: INK }}
                    >
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2" style={{ background: CORAL, borderColor: INK, color: INK }}>
                        <Ban size={14} strokeWidth={2.8} />
                      </div>
                      <span className="font-medium">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="content" className="scroll-mt-32">
              <div
                className="rounded-[2rem] border-[2.5px] p-8 shadow-[6px_6px_0_0_#1C1917] transition-all hover:-translate-y-1 hover:shadow-[9px_9px_0_0_#1C1917]"
                style={{ background: CREAM, borderColor: INK }}
              >
                <div className="mb-6 flex items-center gap-4 border-b-[2.5px] pb-6" style={{ borderColor: INK }}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] shadow-[3px_3px_0_0_#1C1917]" style={{ background: MINT, borderColor: INK, color: INK }}><Settings size={20} strokeWidth={2.5} /></div>
                  <h2 className="font-display text-xl font-black uppercase tracking-tight md:text-2xl">3. User Content</h2>
                </div>
                <p className="font-medium leading-relaxed">
                  You retain ownership of any content (text, images) you upload to Cardify. However, by uploading, you grant us a license to use, store, and display your content solely for the purpose of providing the service to you (e.g., generating your card).
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="termination" className="scroll-mt-32">
              <div
                className="rounded-[2rem] border-[2.5px] p-8 shadow-[6px_6px_0_0_#1C1917] transition-all hover:-translate-y-1 hover:shadow-[9px_9px_0_0_#1C1917]"
                style={{ background: CREAM, borderColor: INK }}
              >
                <div className="mb-6 flex items-center gap-4 border-b-[2.5px] pb-6" style={{ borderColor: INK }}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] shadow-[3px_3px_0_0_#1C1917]" style={{ background: CORAL, borderColor: INK, color: INK }}><AlertTriangle size={20} strokeWidth={2.5} /></div>
                  <h2 className="font-display text-xl font-black uppercase tracking-tight md:text-2xl">4. Termination</h2>
                </div>
                <p className="font-medium leading-relaxed">
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="disclaimer" className="scroll-mt-32">
              <div
                className="relative overflow-hidden rounded-[2rem] border-[2.5px] p-10 text-center shadow-[8px_8px_0_0_#1C1917]"
                style={{ background: LILAC, borderColor: INK }}
              >
                <span
                  className="absolute right-5 top-5 rotate-[10deg] rounded-full border-[2.5px] px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_#1C1917]"
                  style={{ background: YELLOW, borderColor: INK, color: INK }}
                >
                  As is ✿
                </span>
                <h2 className="font-display mb-4 text-2xl font-black uppercase md:text-3xl" style={{ color: INK }}>5. Disclaimer</h2>
                <p className="mx-auto mb-8 max-w-lg font-bold leading-relaxed" style={{ color: INK }}>
                  The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. Cardify makes no warranties, expressed or implied, regarding the reliability or availability of the service.
                </p>
                <a
                  href="mailto:cardify.official.id@gmail.com"
                  className="inline-flex items-center gap-3 rounded-full border-[2.5px] px-8 py-4 font-black uppercase tracking-wide shadow-[5px_5px_0_0_#1C1917] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#1C1917]"
                  style={{ background: INK, borderColor: INK, color: CREAM }}
                >
                  <Mail size={20} strokeWidth={2.5} style={{ color: YELLOW }} />
                  Contact Support
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* --- POPUP KONFIRMASI LOGOUT --- */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: "rgba(28,25,23,0.55)" }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-sm rounded-[2rem] border-[2.5px] p-8 text-center shadow-[8px_8px_0_0_#1C1917]"
            style={{ background: CREAM, borderColor: INK }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="absolute -right-3 -top-3 rotate-[10deg] rounded-full border-[2.5px] px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_#1C1917]"
              style={{ background: YELLOW, borderColor: INK, color: INK }}
            >
              Bye-bye!
            </span>

            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-[2.5px] shadow-[4px_4px_0_0_#1C1917]"
              style={{ background: CORAL, borderColor: INK, color: INK }}
            >
              <LogOut size={26} strokeWidth={2.5} />
            </div>

            <h3 className="font-display mb-2 text-xl font-black uppercase" style={{ color: INK }}>Sign out?</h3>
            <p className="mb-7 text-sm font-bold leading-relaxed opacity-70" style={{ color: INK }}>
              You&apos;ll need to log in again to keep making cards.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-full border-[2.5px] px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_#1C1917] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#1C1917]"
                style={{ background: CREAM, borderColor: INK, color: INK }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-full border-[2.5px] px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_#1C1917] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#1C1917]"
                style={{ background: INK, borderColor: INK, color: CREAM }}
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- FOOTER (UPDATED: Match Home & Privacy) --- */}
      <footer
        className="relative isolate w-full overflow-hidden border-t-[2.5px] px-6 py-12"
        style={{
          background: MINT, // MINT
          borderColor: INK, // INK
        }}
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">

              <div className="mb-4 flex items-center gap-3">

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px]"
                  style={{ background: INK, borderColor: INK }}
                >
                  <img src="/logo-cardify.svg" alt="Cardify" className="h-8 w-8 object-contain" />
                </div>

                <div className="leading-none">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: INK }}>
                    A CARD WITH A STORY
                  </div>

                  <div className="font-display text-2xl font-black italic tracking-[-0.02em]" style={{ color: INK }}>
                    cardify
                  </div>
                </div>

              </div>

              <p className="text-sm font-medium leading-relaxed" style={{ color: INK }}>
                The modern way to celebrate.
                Digital moments that last forever.
              </p>

            </div>

            {/* Product */}
            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-widest" style={{ color: INK }}>
                Product
              </h4>
              <ul className="space-y-2 text-sm font-bold">
                <li>
                  <Link href="/templates" className="transition-opacity hover:opacity-60" style={{ color: INK }}>
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/showcase" className="transition-opacity hover:opacity-60" style={{ color: INK }}>
                    Showcase
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-widest" style={{ color: INK }}>
                Company
              </h4>
              <ul className="space-y-2 text-sm font-bold">
                <li>
                  <Link href="/about" className="hover:opacity-60" style={{ color: INK }}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:opacity-60" style={{ color: INK }}>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:opacity-60" style={{ color: INK }}>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-widest" style={{ color: INK }}>
                Connect
              </h4>
              <div className="flex flex-col gap-3">
                <a
                  href="https://instagram.com/alfinnsptr"
                  target="_blank"
                  className="flex items-center gap-3 hover:opacity-60"
                  style={{ color: INK }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2"
                    style={{ background: CREAM, borderColor: INK }}
                  >
                    <Instagram size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold">Instagram</span>
                </a>

                <a
                  href="https://wa.me/6289501847804"
                  target="_blank"
                  className="flex items-center gap-3 hover:opacity-60"
                  style={{ color: INK }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2"
                    style={{ background: CREAM, borderColor: INK }}
                  >
                    <MessageCircle size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold">WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom */}
          <div
            className="flex flex-col items-center justify-between gap-3 border-t-[2.5px] pt-6 md:flex-row"
            style={{ borderColor: INK }}
          >
           <p
  className="text-xs font-black uppercase tracking-wider"
  style={{ color: INK }}
>
  © 2025 Cardify · Made with love
</p>

            <div className="flex gap-6 text-xs font-black uppercase tracking-wider" style={{ color: INK }}>
              <Link href="/privacy-policy" className="hover:opacity-60">
                Privacy
              </Link>
              <Link href="/terms" className="hover:opacity-60" style={{ color: "#FFFFFF" }}>
                Terms
              </Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
