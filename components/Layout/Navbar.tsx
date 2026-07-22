"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Gift,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Smartphone,
  Image as ImageIcon,
  Menu,
  X,
} from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, status, logout } = useAuthUser();

  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTemplatesOpen, setMobileTemplatesOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  // Tutup menu mobile setiap kali pindah halaman
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav
        className={`fixed z-50 w-full transition-all duration-300 border-b ${
          scrolled
            ? "bg-[#FAFAF9]/90 backdrop-blur-xl border-stone-200 shadow-sm py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 bg-[#1C1917] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <Gift size={18} strokeWidth={2.5} className="text-amber-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight italic text-[#1C1917] font-playfair">
              Cardify.
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative group h-full flex items-center cursor-pointer">
              <Link
                href="/templates"
                className={`hover:text-[#1C1917] transition-colors relative py-2 flex items-center gap-1 ${
                  isActive("/templates") ? "text-[#1C1917] font-bold" : ""
                }`}
              >
                Templates
                <ChevronDown
                  size={14}
                  className="opacity-50 group-hover:opacity-100 transition-transform duration-300 group-hover:rotate-180 text-amber-600"
                />
              </Link>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white rounded-2xl shadow-xl border border-stone-100 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-stone-100 transform rotate-45" />
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">
                  Create New
                </p>
                <Link
                  href="/web-story"
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors group/item relative z-10 mb-1"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex-shrink-0 flex items-center justify-center text-rose-500 group-hover/item:bg-rose-500 group-hover/item:text-white transition-all shadow-sm">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800 group-hover/item:text-rose-600 transition-colors">
                      Web Story
                    </p>
                    <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5">
                      Interactive, Music, Animations
                    </p>
                  </div>
                </Link>
                <Link
                  href="/templates?filter=card-image"
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors group/item relative z-10"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex-shrink-0 flex items-center justify-center text-amber-500 group-hover/item:bg-amber-500 group-hover/item:text-white transition-all shadow-sm">
                    <ImageIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800 group-hover/item:text-amber-600 transition-colors">
                      Card Image
                    </p>
                    <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5">
                      Static, Printable, Classic
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`hover:text-[#1C1917] transition-colors relative group ${
                  isActive(l.href) ? "text-[#1C1917] font-bold" : ""
                }`}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 md:gap-4">
            {status === "loading" ? (
              <div className="w-9 h-9 rounded-full bg-stone-200 animate-pulse" />
            ) : user ? (
              <div className="relative hidden sm:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((s) => !s)}
                  className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 group"
                >
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name}
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
                      {user.name}
                    </span>
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider leading-none">
                      Free Plan
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-stone-400 transition-transform duration-300 group-hover:text-amber-600 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-100 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5">
                    <div className="p-4 bg-stone-50/50 rounded-xl mb-2 border border-stone-100">
                      <p className="text-sm font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-xs text-stone-500 truncate font-medium">{user.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-black rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                          <User size={16} />
                        </div>
                        Profile & Account
                      </button>
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-black rounded-xl transition-all font-medium group">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                          <Settings size={16} />
                        </div>
                        Preferences
                      </button>
                      <div className="h-px bg-stone-100 my-1 mx-2" />
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          setConfirmLogout(true);
                        }}
                        className="flex items-center gap-3 w-full p-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                          <LogOut size={16} />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6">
                <Link href="/login" className="text-sm font-bold text-stone-600 hover:text-black transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-bold text-stone-600 hover:text-black transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            <Link
              href="/templates"
              className="hidden sm:flex px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-sm font-bold hover:bg-black hover:scale-105 hover:shadow-xl hover:shadow-amber-900/10 transition-all items-center gap-2"
            >
              Start Creating <ArrowRight size={16} strokeWidth={2.5} className="text-amber-400" />
            </Link>

            {/* Hamburger mobile */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Buka menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Panel mobile */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-[36rem] border-t border-stone-100" : "max-h-0"
          }`}
        >
          <div className="px-6 py-6 bg-[#FAFAF9]/98 backdrop-blur-xl flex flex-col">
            <button
              onClick={() => setMobileTemplatesOpen((o) => !o)}
              className="flex items-center justify-between py-3 text-sm font-bold text-stone-800"
            >
              Templates
              <ChevronDown
                size={16}
                className={`transition-transform ${mobileTemplatesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileTemplatesOpen && (
              <div className="pl-4 pb-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link href="/web-story" className="py-2 text-sm text-stone-600 flex items-center gap-2">
                  <Smartphone size={14} className="text-rose-500" /> Web Story
                </Link>
                <Link href="/templates?filter=card-image" className="py-2 text-sm text-stone-600 flex items-center gap-2">
                  <ImageIcon size={14} className="text-amber-500" /> Card Image
                </Link>
              </div>
            )}

            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="py-3 text-sm font-bold text-stone-800 border-t border-stone-100">
                {l.label}
              </Link>
            ))}

            <div className="pt-4 mt-2 border-t border-stone-100 flex flex-col gap-3">
              {user ? (
                <button
                  onClick={() => setConfirmLogout(true)}
                  className="text-sm font-bold text-red-600 text-left flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-stone-700">Log in</Link>
                  <Link href="/register" className="text-sm font-bold text-stone-700">Sign Up</Link>
                </>
              )}
              <Link
                href="/templates"
                className="mt-2 px-6 py-3 rounded-full bg-[#1C1917] text-white text-sm font-bold text-center flex items-center justify-center gap-2"
              >
                Start Creating <ArrowRight size={16} className="text-amber-400" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal konfirmasi logout — sekarang tersedia di semua halaman */}
      {confirmLogout && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1917]/40 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center transform scale-100 animate-in zoom-in-95 duration-300 ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 shadow-sm">
              <LogOut size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-3 font-playfair">Sign Out?</h3>
            <p className="text-sm text-stone-500 mb-8 leading-relaxed px-4">
              Kamu yakin ingin keluar? Kamu perlu login lagi untuk mengakses template yang tersimpan.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={logout}
                className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100 active:scale-[0.98]"
              >
                Ya, Keluar
              </button>
              <button
                onClick={() => setConfirmLogout(false)}
                className="w-full py-3.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors active:scale-[0.98]"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}