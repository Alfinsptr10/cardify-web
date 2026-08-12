"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LogIn, X } from "lucide-react";
import Link from "next/link";

export default function FavoriteSticker({ cardId }: { cardId: number | string }) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Mendapatkan key unik berdasarkan email user login
  const getStorageKey = () => {
    if (session?.user?.email) {
      return `user_favorites_${session.user.email}`;
    }
    if (typeof window !== "undefined") {
      const manualEmail = localStorage.getItem("userEmail");
      if (manualEmail) return `user_favorites_${manualEmail}`;
    }
    return null;
  };

  useEffect(() => {
    const storageKey = getStorageKey();
    if (storageKey) {
      const favorites = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setIsFavorited(favorites.includes(cardId));
    } else {
      setIsFavorited(false);
    }
  }, [cardId, session]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Cek apakah user sudah login (baik via NextAuth maupun manual localStorage)
    const isManualLogin = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
    const isLoggedIn = !!session?.user || isManualLogin;

    if (!isLoggedIn) {
      // Jika belum login, tampilkan popup peringatan
      setShowLoginModal(true);
      return;
    }

    const storageKey = getStorageKey();
    if (!storageKey) return;

    let favorites = JSON.parse(localStorage.getItem(storageKey) || "[]");
    
    if (isFavorited) {
      favorites = favorites.filter((id: string | number) => id !== cardId);
      setIsFavorited(false);
    } else {
      favorites.push(cardId);
      setIsFavorited(true);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  };

  return (
    <>
      <button
        onClick={toggleFavorite}
        className="absolute -top-9.5 -right-10 z-0 w-25 h-25 rotate-[15deg] focus:outline-none cursor-pointer bg-transparent border-none p-0 transition-transform duration-150 active:scale-125"
        title={isFavorited ? "Hapus dari Favorit" : "Tambah ke Favorit"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={isFavorited ? "/morty-hati-merah.svg" : "/morty-hati-putih.svg"} 
          alt="Favorite Sticker" 
          className="w-full h-full object-contain filter transform rotate-[15deg] pointer-events-none"
        />
      </button>

      {/* --- POPUP SURUH LOGIN --- */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1917]/40 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowLoginModal(false)}
        >
          <div 
            className="relative w-full max-w-sm rounded-[2rem] bg-[#FFFDF5] border-[2.5px] border-[#111111] p-8 text-center shadow-[6px_6px_0_0_#111111] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close */}
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 border-2 border-[#111111] flex items-center justify-center text-[#111111] hover:bg-stone-200 transition-colors"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            {/* Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3B8CC] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111]">
              <LogIn size={26} strokeWidth={2.5} className="text-[#111111]" />
            </div>

            <h3 className="mb-2 text-2xl font-black uppercase tracking-tight text-[#111111] font-boldonse">
              Login Required
            </h3>

            <p className="mb-8 text-sm font-bold text-stone-600 leading-relaxed">
              Kamu harus masuk terlebih dahulu untuk menyimpan template ke daftar favoritmu.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-3.5 rounded-2xl bg-[#F6C445] text-[#111111] font-black border-[2.5px] border-[#111111] shadow-[3px_3px_0_0_#111111] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#111111] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center block"
              >
                Gas Login
              </Link>

              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3 rounded-2xl bg-white text-stone-500 font-bold border-2 border-stone-200 hover:border-[#111111] hover:text-[#111111] transition-all text-center"
              >
                Nanti aja deh
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}