"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Check, ArrowRight } from "lucide-react";

import { photoboothLayouts } from "@/lib/photobooth/layouts";

export default function PhotoboothPage() {
  const router = useRouter();

  const [selectedLayout, setSelectedLayout] = useState(
    photoboothLayouts[0]
  );

  return (
    <div className="flex h-screen flex-col bg-[#FDFBF3] text-[#1C1917] font-sans selection:bg-[#F6C445] selection:text-[#1C1917] overflow-hidden">

      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800&display=swap');
          .font-sans { font-family: 'DM Sans', sans-serif; }
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
      `}} />

      {/* HEADER */}
      <header className="relative flex h-20 items-center justify-center border-b-2 border-[#1C1917] bg-white px-8 z-20">
        <button
          onClick={() => router.push("/")}
          className="absolute left-6 flex items-center gap-2 rounded-full border-2 border-[#1C1917] bg-[#FDFBF3] px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0_0_#1C1917] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#1C1917] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold uppercase tracking-[0.25em] text-[#1C1917] font-boldonse">
            Select Layout
          </h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="flex w-[380px] flex-col border-r-2 border-[#1C1917] bg-white z-10 shadow-[4px_0_20px_rgba(28,25,23,0.03)]">

          {/* Title Section */}
          <div className="p-8 pb-6 border-b border-stone-100">
            <h2 className="text-2xl font-black font-boldonse text-[#1C1917] tracking-tight">
              Browse Layouts
            </h2>
            <p className="mt-1.5 text-xs font-medium text-stone-500 leading-relaxed">
              Pilih tata letak photobooth yang paling pas untuk merangkai momen spesialmu.
            </p>
          </div>

          {/* Layout List */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {photoboothLayouts.map((layout) => {
              const isSelected = selectedLayout.id === layout.id;
              return (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout)}
                  className={`w-full text-left rounded-2xl border-2 p-5 transition-all relative flex gap-4 items-center cursor-pointer group ${
                    isSelected
                      ? "border-[#1C1917] bg-[#FFFDF5] shadow-[4px_4px_0_0_#1C1917] translate-x-1"
                      : "border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50/50"
                  }`}
                >
                  {/* Thumbnail Preview */}
                  <div className="w-20 h-28 bg-stone-100 rounded-xl border-2 border-[#1C1917] overflow-hidden flex-shrink-0 relative flex items-center justify-center p-1">
                    <Image
                      src={layout.preview}
                      alt={layout.name}
                      width={100}
                      height={180}
                      className="h-full w-auto object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-[#1C1917] truncate font-boldonse">
                        {layout.name}
                      </h3>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#F6C445] border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917] flex-shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 font-medium">
                      {layout.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="border-t-2 border-[#1C1917] p-6 bg-[#FDFBF3]">
            <button
              onClick={() =>
                router.push(
                  `/photobooth/frame?layout=${selectedLayout.id}`
                )
              }
              className="w-full rounded-2xl bg-[#1C1917] py-4 px-6 text-sm font-bold uppercase tracking-wider text-[#F6C445] border-2 border-[#1C1917] shadow-[4px_4px_0_0_#F6C445] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#F6C445] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Use This Layout</span>
            </button>
          </div>

        </aside>

        {/* PREVIEW CONTAINER */}
        <main className="flex flex-1 items-center justify-center bg-[#84a6b1] relative overflow-hidden p-12">
          {/* Subtle background decorative grid/dots pattern */}
          <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#1C1917_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

          {/* Main Preview Card Frame */}
          <div className="relative p-6 max-h-[82vh] flex items-center justify-center">
            <Image
              src={selectedLayout.preview}
              alt={selectedLayout.name}
              width={360}
              height={720}
              priority
              className="max-h-[70vh] w-auto object-contain shadow-sm"
            />
          </div>
        </main>

      </div>

    </div>
  );
}