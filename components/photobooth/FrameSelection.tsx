"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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

const selectedLayout =
  searchParams.get("layout") ?? "layout4";

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

return (
  <div className="flex h-screen flex-col overflow-hidden bg-[#111B54]">
    <header className="relative flex h-16 items-center justify-center border-b border-[#24306F] bg-[#091542]">

  <button
    onClick={() => router.push("/photobooth")}
    className="absolute left-6 flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-white"
  >
    <ArrowLeft size={18} />
    Back
  </button>

  <h1 className="text-sm font-bold uppercase tracking-[0.35em] text-[#FFD22E]">
    SELECT FRAME
  </h1>

</header>

<div className="flex flex-1 overflow-hidden">
    {/* ================= LEFT SIDEBAR ================= */}

    <aside className="flex h-full w-[380px] flex-col border-r border-[#24306F] bg-[#091542] text-white">

      {/* CATEGORY */}
      <div className="px-6 pt-3 pb-5">

        <p className="mb-4 text-sm font-bold uppercase tracking-wider">
          Browse Frames
        </p>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition

              ${
                selectedCategory === category
                  ? "bg-red-600 text-white"
                  : "bg-[#1B275E] hover:bg-[#2B397E]"
              }

              `}
            >
              {category}
            </button>

          ))}

        </div>

      </div>

      {/* SELECTED FRAME */}

      <div className="px-6 pb-6">

<div className="rounded-2xl border border-[#24306F] bg-[#16235F] px-4 py-3 shadow-lg">

  <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-300">
  Selected
</p>

<div className="mt-2 flex items-center justify-between">

  <h2 className="text-xl font-black leading-none">
    {selectedFrame.name}
  </h2>

  <span className="rounded bg-yellow-400 px-2 py-1 text-[10px] font-bold text-black">
    {selectedFrame.rarity}
  </span>

  </div>


</div>

        

      </div>

      {/* FRAME LIST */}

      <div className="flex-1 overflow-y-auto p-6">

        <div className="grid grid-cols-2 gap-4">

          {filteredFrames.map((frame) => (

            <button
              key={frame.id}
              onClick={() => setSelectedFrame(frame)}
              className={`overflow-hidden rounded-2xl transition

              ${
                selectedFrame.id === frame.id
                  ? "ring-4 ring-yellow-400"
                  : "hover:scale-105"
              }

              `}
            >

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

      </div>

      {/* BUTTON */}

      <div className="border-t border-[#24306F] p-6">

        <button
          onClick={() =>
            router.push(
  `/photobooth/camera?layout=${selectedLayout}&frame=${selectedFrame.id}`
)
          }
          className="w-full rounded-2xl bg-red-600 py-5 text-lg font-bold transition hover:bg-red-500"
        >
          USE THIS FRAME →
        </button>

      </div>

    </aside>

    {/* ================= RIGHT ================= */}

    <main className="flex flex-1 items-center justify-center bg-[#141B59]">

      <Image
        src={selectedFrame.preview}
        alt={selectedFrame.name}
        width={360}
        height={1080}
        priority
        className="max-h-[80vh] w-auto object-contain"
      />

    </main>

  </div>
  </div>
);
}