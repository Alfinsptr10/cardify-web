"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { photoboothFrames } from "@/lib/photobooth/frames";

export default function FrameSelection() {
  const [selectedFrame, setSelectedFrame] = useState(photoboothFrames[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(photoboothFrames.map((frame) => frame.category)),
  ];

  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedLayout = searchParams.get("layout") ?? "layout4";

  const filteredFrames = photoboothFrames.filter((frame) => {
    const matchLayout = frame.layout === selectedLayout;

    const matchCategory =
      selectedCategory === "All"
        ? true
        : frame.category === selectedCategory;

    return matchLayout && matchCategory;
  });

  useEffect(() => {
    if (filteredFrames.length > 0) {
      setSelectedFrame(filteredFrames[0]);
    }
  }, [selectedLayout, selectedCategory]);

  const chipColors = [
    "bg-[#BFE7DA]",
    "bg-[#FFD9C7]",
    "bg-[#D6D2F5]",
    "bg-[#CDE6F7]",
    "bg-[#F6C445]",
  ];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#BFE7DA] font-[DM_Sans,sans-serif] text-[#1a1a1a]">

      {/* ================= HEADER ================= */}
      <header className="relative flex h-16 shrink-0 items-center justify-center border-b-[2.5px] border-black bg-[#F6C445]">
        <button
          onClick={() => router.push("/photobooth")}
          className="absolute left-5 flex items-center gap-2 rounded-full border-[2.5px] border-black bg-white px-4 py-2 text-sm font-bold shadow-[4px_4px_0_0_#000] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000] hover:bg-[#FFD9C7]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1
          className="text-sm font-black uppercase tracking-[0.35em]"
          style={{ fontFamily: "Boldonse, 'Archivo Black', sans-serif" }}
        >
          Select Frame
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="flex h-full w-[380px] flex-col border-r-[2.5px] border-black bg-[#F6C445]">
          {/* CATEGORY */}
          <div className="border-b-[2.5px] border-dashed border-black/25 px-6 pt-5 pb-5">
            <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} />
              Browse Frames
            </p>

            <div className="flex gap-2 overflow-x-auto pt-1 pb-1 scrollbar-hide">
              {categories.map((category, i) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full border-[2.5px] border-black px-4 py-1.5 text-xs font-bold transition
                  ${
                    selectedCategory === category
                      ? "bg-[#FF8B6B] text-black shadow-[3px_3px_0_0_#000]"
                      : `${chipColors[i % chipColors.length]} shadow-[2px_2px_0_0_#000] hover:-translate-y-[2px] hover:shadow-[4px_4px_0_0_#000]`
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* SELECTED FRAME */}
          <div className="px-6 py-5">
            <div className="relative rounded-2xl border-[2.5px] border-black bg-[#D6D2F5] px-4 py-3 shadow-[5px_5px_0_0_#000]">
              <span className="absolute -top-3 -right-2 -rotate-6 rounded-full border-[2px] border-black bg-[#F6C445] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                Selected ✿
              </span>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">
                Your pick
              </p>

              <div className="mt-1.5 flex items-center justify-between gap-3">
                <h2
                  className="text-lg leading-tight font-black"
                  style={{ fontFamily: "Boldonse, 'Archivo Black', sans-serif" }}
                >
                  {selectedFrame.name}
                </h2>

                <span className="shrink-0 rounded-md border-[2px] border-black bg-white px-2 py-1 text-[10px] font-black uppercase">
                  {selectedFrame.rarity}
                </span>
              </div>
            </div>
          </div>

          {/* FRAME LIST */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {filteredFrames.length === 0 ? (
              <div className="mt-6 rounded-2xl border-[2.5px] border-dashed border-black/40 bg-white/60 px-6 py-10 text-center">
                <p className="text-3xl">🖼️</p>
                <p className="mt-2 text-sm font-bold">No frames here yet</p>
                <p className="mt-1 text-xs text-black/60">
                  Try another category ✿
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredFrames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`group relative overflow-hidden rounded-2xl border-[2.5px] border-black bg-white transition
                    ${
                      selectedFrame.id === frame.id
                        ? "-translate-y-[0px] shadow-[5px_5px_0_0_#000]"
                        : "shadow-[3px_3px_0_0_#000] hover:-translate-y-[3px] hover:rotate-[-1deg] hover:shadow-[6px_6px_0_0_#000]"
                    }`}
                  >
                    {selectedFrame.id === frame.id && (
                      <span className="absolute top-1.5 left-1.5 z-10 rounded-full border-[2px] border-black bg-[#F6C445] px-1.5 text-[9px] font-black">
                        ✓
                      </span>
                    )}

                    <Image
                      src={frame.preview}
                      alt={frame.name}
                      width={170}
                      height={250}
                      className="w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BUTTON */}
          <div className="border-t-[2.5px] border-black bg-[#F6C445] p-5">
            <button
              onClick={() =>
                router.push(
                  `/photobooth/camera?layout=${selectedLayout}&frame=${selectedFrame.id}`
                )
              }
              className="w-full rounded-full border-[2.5px] border-black bg-[#1a1a1a] py-4 text-base font-black uppercase tracking-wide text-[#FFFDF5] shadow-[5px_5px_0_0_#000] transition hover:-translate-y-[2px] hover:bg-[#FF8B6B] hover:text-black hover:shadow-[7px_7px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000]"
            >
            Use frame
            </button>
          </div>
        </aside>

        {/* ================= RIGHT ================= */}
        <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#CDE6F7]">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full border-[2.5px] border-black bg-[#BFE7DA]/70" />
          <div className="pointer-events-none absolute -bottom-16 right-10 h-56 w-56 rounded-full border-[2.5px] border-black bg-[#D6D2F5]/70" />
          <span className="pointer-events-none absolute top-8 right-10 rotate-6 rounded-full border-[2.5px] border-black bg-[#F6C445] px-3 py-1 text-[11px] font-black uppercase tracking-widest shadow-[4px_4px_0_0_#000]">
            Preview ✿
          </span>

          <div className="relative z-10 rounded-3xl">
            <Image
              src={selectedFrame.preview}
              alt={selectedFrame.name}
              width={360}
              height={1080}
              priority
              className="max-h-[75vh] w-auto rounded-xl object-contain"
            />
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
