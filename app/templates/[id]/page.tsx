"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Layout, AlertCircle } from "lucide-react";

export default function DynamicTemplatePage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF9] text-[#1C1917] p-6 font-sans">
      <div className="text-center space-y-6 max-w-md w-full">
        
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Template Tidak Ditemukan</h1>
            <p className="text-stone-500 mb-6 text-sm leading-relaxed">
              Template dengan ID <span className="font-mono bg-stone-100 px-1 rounded text-stone-700">"{id}"</span> belum tersedia atau sedang dalam pengembangan.
            </p>
            
            <div className="w-full h-px bg-stone-100 my-6" />

            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Template Tersedia</p>
            
            <div className="flex flex-col gap-3">
              <Link 
                  href="/templates/retro-gameboy" 
                  className="w-full py-3.5 bg-[#1C1917] text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                  <Layout size={16} /> Retro Gameboy
              </Link>
              <Link 
                  href="/templates/minimalist" 
                  className="w-full py-3.5 bg-white border border-stone-200 text-stone-700 rounded-xl font-bold text-sm hover:border-amber-400 transition-all shadow-sm active:scale-[0.98]"
              >
                  Minimalist
              </Link>
            </div>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-[#1C1917] transition-colors uppercase tracking-widest">
           <ArrowLeft size={14} /> Kembali ke Beranda
        </Link>

      </div>
    </div>
  );
}