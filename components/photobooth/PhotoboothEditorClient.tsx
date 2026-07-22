"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toJpeg, toPng } from "html-to-image";
import TonePicker from "@/components/photobooth/TonePicker";
import Toolbar from "@/components/photobooth/Toolbar";
import { photoboothFilters } from "@/lib/photobooth/filters";
import { photoboothLayouts } from "@/lib/photobooth/layouts";
import { photoboothFrames } from "@/lib/photobooth/frames";


function getLayoutById(id: string | null) {
  return photoboothLayouts.find((layout) => layout.id === id);
}

function getFrameById(id: string | null) {
  return photoboothFrames.find((frame) => frame.id === id);
}

function getFilterById(id: string | null) {
  return photoboothFilters.find((filter) => filter.id === id) || photoboothFilters[0];
}

export default function PhotoboothEditorClient() {
const router = useRouter();
const searchParams = useSearchParams();

const layoutId = searchParams.get("layout");
const frameId = searchParams.get("frame");
const filterId = "original";

const layout = useMemo(
  () => getLayoutById(layoutId),
  [layoutId]
);

const frame = useMemo(
  () => getFrameById(frameId),
  [frameId]
);
console.log(frame);

const initialPhotos = useMemo(() => {
  if (typeof window === "undefined") return [];

  const data = sessionStorage.getItem("photobooth-photos");

  if (!data) return [];

  try {
    return JSON.parse(data) as string[];
  } catch {
    return [];
  }
}, []);

  const [selectedTone, setSelectedTone] = useState(filterId);
  const [customText, setCustomText] = useState("");
  const [frameBgColor, setFrameBgColor] = useState<string>("#111827");
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  const filter = getFilterById(selectedTone);

  const toneStyle = `${filter.css}`;
  const grainOverlay = "none";

  const handleDownload = async (type: "png" | "jpg") => {
    const collageElement = document.getElementById("photobooth-collage");
    if (!collageElement) return;
    const rect = collageElement.getBoundingClientRect();

    // Create a temporary wrapper sized to the visible bounding box
    const wrapper = document.createElement("div");
    wrapper.style.width = `${Math.round(rect.width)}px`;
    wrapper.style.height = `${Math.round(rect.height)}px`;
    wrapper.style.overflow = "hidden";
    wrapper.style.display = "inline-block";
    wrapper.style.background = frameBgColor;
    wrapper.style.boxSizing = "border-box";

    const clone = collageElement.cloneNode(true) as HTMLElement;
    // Reset potential transforms that affect layout in the clone
    clone.style.margin = "0";
    clone.style.display = "block";

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const options: any = {
      pixelRatio: 4,
      backgroundColor: frameBgColor,
      cacheBust: true,
    };

    try {
  const dataUrl =
    type === "jpg"
      ? await toJpeg(wrapper, options)
      : await toPng(wrapper, options);

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `photobooth.${type}`;
  link.click();

  setDownloadComplete(true);
} catch (error) {
  console.error("Download failed:", error);
  alert("Download gagal, cek Console (F12).");
} finally {
  document.body.removeChild(wrapper);
}
  };

  if (!layout || initialPhotos.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] py-24 px-6">
        <div className="mx-auto max-w-3xl rounded-4xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold">Editor tidak tersedia.</p>
          <p className="mt-2 text-sm text-stone-500">Silakan kembali ke pengambilan foto dan coba lagi.</p>
          <button
            type="button"
            onClick={() => router.push("/photobooth")}
            className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-black"
          >
            Kembali ke Photobooth
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] py-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Editor</p>
                <h1 className="mt-2 text-3xl font-semibold text-stone-900">{layout.name} Photobooth</h1>
              </div>
              <p className="rounded-full bg-stone-50 px-4 py-2 text-sm text-stone-600 shadow-sm">{layout.photos} photos</p>
            </div>
          </div>
          

<div
  id="photobooth-collage"
  className="relative mx-auto overflow-hidden shadow-2xl"
  style={{
    width: "420px",
    aspectRatio: `${frame.canvasWidth} / ${frame.canvasHeight}`,
    filter: toneStyle,
  }}
>
{frame?.slots.map((slot, index) => (
  <div
    key={index}
    className={`absolute overflow-hidden ${
      frame.shape === "circle" ? "rounded-full" : ""
    }`}
    style={{
      left: `${(slot.left / frame.canvasWidth) * 100}%`,
      top: `${(slot.top / frame.canvasHeight) * 100}%`,
      width: `${(slot.width / frame.canvasWidth) * 100}%`,
      height: `${(slot.height / frame.canvasHeight) * 100}%`,
    }}
  >
    {initialPhotos[index] && (
      <img
        src={initialPhotos[index]}
        className="h-full w-full object-cover"
        style={{
          objectPosition:"center",
        }}
      />
    )}
  </div>
))}

  <img
    src={frame?.preview}
    className="pointer-events-none absolute inset-0 h-full w-full"
    alt=""
  />

  {customText && (
    <div className="absolute bottom-6 left-4 right-4 text-center text-white">
      <div className="rounded-3xl bg-black/60 px-3 py-2">
        {customText}
      </div>
    </div>
  )}
</div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">Frame</h2>
            <p className="mt-2 text-sm text-stone-500">Change the frame fill color.</p>
            
            <div className="mt-4">
              <p className="text-xs text-stone-500">Frame fill</p>
              <div className="mt-2 flex items-center gap-2">
                {['#111827', '#A6713B', '#F3F4F6', '#27272A', '#F59E0B'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFrameBgColor(c)}
                    className={`h-8 w-8 rounded-full border-2 ${frameBgColor === c ? 'ring-2 ring-amber-400' : 'border-white/30'}`}
                    style={{ backgroundColor: c }}
                    aria-label={`Select ${c}`}
                  />
                ))}

                <input
                  type="color"
                  value={frameBgColor}
                  onChange={(e) => setFrameBgColor(e.target.value)}
                  className="h-8 w-8 rounded-full border-0 p-0"
                  aria-label="Custom frame fill color"
                />
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">Tone</h2>
            <p className="mt-2 text-sm text-stone-500">Pick a color tone or filter for your photos.</p>
            <TonePicker filters={photoboothFilters.filter(f => f.id === 'original' || f.id === 'bw' || f.id === 'vintage')} selected={selectedTone} onSelect={setSelectedTone} />
          </div>
 

          <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">Text</h2>
            <p className="mt-2 text-sm text-stone-500">Add a date, time or short message.</p>
            <div className="space-y-4">
              <input
                type="text"
                value={customText}
                onChange={(event) => setCustomText(event.target.value)}
                placeholder="Best Day Ever"
                className="w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">Export</h2>
            <Toolbar
              onDownloadPNG={() => handleDownload("png")}
              onDownloadJPG={() => handleDownload("jpg")}
              onReset={() => router.push("/photobooth")}
            />
          </div>
          {downloadComplete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-lg rounded-3xl border border-amber-200 bg-white p-8 shadow-2xl">
                <p className="text-lg font-semibold text-amber-700">Download selesai</p>
                <p className="mt-3 text-sm text-stone-600">Pilih salah satu opsi berikut untuk melanjutkan.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-black sm:w-auto"
                  >
                    Kembali ke awal
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/photobooth")}
                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 border border-stone-200 shadow-sm hover:bg-stone-100 sm:w-auto"
                  >
                    Foto lagi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}