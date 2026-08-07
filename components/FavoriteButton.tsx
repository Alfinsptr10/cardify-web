"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function FavoriteSticker({ cardId }: { cardId: number | string }) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);

  // Mendapatkan key unik berdasarkan email user login atau manual localStorage
  const getStorageKey = () => {
    if (session?.user?.email) {
      return `user_favorites_${session.user.email}`;
    }
    if (typeof window !== "undefined") {
      const manualEmail = localStorage.getItem("userEmail");
      if (manualEmail) return `user_favorites_${manualEmail}`;
    }
    return "user_favorites_guest";
  };

  useEffect(() => {
    const storageKey = getStorageKey();
    const favorites = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setIsFavorited(favorites.includes(cardId));
  }, [cardId, session]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const storageKey = getStorageKey();
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
  );
}