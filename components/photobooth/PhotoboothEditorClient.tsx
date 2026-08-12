"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toJpeg, toPng } from "html-to-image";
import TonePicker from "@/components/photobooth/TonePicker";
import Toolbar from "@/components/photobooth/Toolbar";
import { photoboothFilters } from "@/lib/photobooth/filters";
import { photoboothLayouts } from "@/lib/photobooth/layouts";
import { photoboothFrames } from "@/lib/photobooth/frames";
import { saveUserCard } from "@/app/lib/saveCardAction";
import { ArrowLeft, Sparkles, X, CheckCircle2 } from "lucide-react";

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

  if (!frame) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF3] font-sans">
        Frame tidak ditemukan.
      </div>
    );
  }

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

  const handleDownload = async (type: "png" | "jpg") => {
    const collageElement = document.getElementById("photobooth-collage");
    if (!collageElement) return;
    const rect = collageElement.getBoundingClientRect();

    const wrapper = document.createElement("div");
    wrapper.style.width = `${Math.round(rect.width)}px`;
    wrapper.style.height = `${Math.round(rect.height)}px`;
    wrapper.style.overflow = "hidden";
    wrapper.style.display = "inline-block";
    wrapper.style.background = frameBgColor;
    wrapper.style.boxSizing = "border-box";

    const clone = collageElement.cloneNode(true) as HTMLElement;
    clone.style.margin = "0";
    clone.style.display = "block";

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // OPSI DIPERBARUI: Menambahkan skipFonts & fontEmbedCSS
    const options: any = {
      pixelRatio: 4,
      backgroundColor: frameBgColor,
      cacheBust: true,
      skipFonts: true,     // Bawaan library: lewati proses pencarian/embed font remote
      fontEmbedCSS: "",    // Mencegah parseWebFontRules memicu "TypeError: Failed to fetch"
      filter: (node: HTMLElement) => {
        // Abaikan tag LINK stylesheet eksternal
        if (node.tagName === "LINK" && node.getAttribute("rel") === "stylesheet") {
          return false;
        }
        return true;
      },
    };

    try {
      const dataUrl =
        type === "jpg"
          ? await toJpeg(wrapper, options)
          : await toPng(wrapper, options);

      // Unduh file gambar ke perangkat user
      const link = document.createElement("a");
      link.href = dataUrl;
      
      // Menamai file secara dinamis berdasarkan nama layout dan waktu (misal: cardify-polaroid-2026-08-09.png)
      const formattedLayoutName = (frame?.name || "photobooth").toLowerCase().replace(/\s+/g, "-");
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      link.download = `cardify-${formattedLayoutName}-${currentDate}.${type}`;
      
      link.click();

      // Cek sesi login sebelum menyimpan ke database
      const isManualLogin = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
      if (isManualLogin || document.cookie.includes("next-auth.session-token")) {
        try {
          await saveUserCard({
            title: customText || `${frame?.name || "Photobooth"} Creation`,
            template: "photobooth",
            bg: frameBgColor,
            status: "saved",
          });
        } catch (dbError) {
          console.warn("Gagal menyimpan ke database:", dbError);
        }
      }

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
      <div className="min-h-screen bg-[#FDFBF3] text-[#1C1917] py-24 px-6 font-sans">
        <div className="mx-auto max-w-3xl rounded-[2rem] border-2 border-[#1C1917] bg-white p-10 text-center shadow-[6px_6px_0_0_#1C1917]">
          <p className="text-xl font-bold font-boldonse">Editor tidak tersedia.</p>
          <p className="mt-2 text-sm text-stone-500 font-medium">Silakan kembali ke pengambilan foto dan coba lagi.</p>
          <button
            type="button"
            onClick={() => router.push("/photobooth")}
            className="mt-8 inline-flex rounded-full bg-[#1C1917] px-8 py-3.5 text-sm font-bold text-[#F6C445] border-2 border-[#1C1917] shadow-[3px_3px_0_0_#F6C445] hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Kembali ke Photobooth
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#84D4A4] text-[#1C1917] font-sans selection:bg-[#F6C445] selection:text-[#1C1917]">
      
      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800&display=swap');
          .font-sans { font-family: 'DM Sans', sans-serif; }
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
      `}} />

      {/* HEADER KUSTOM */}
      <header className="relative flex h-20 items-center justify-between border-b-2 border-[#1C1917] bg-[#F6C445] px-8 z-20">
        <button
          onClick={() => router.push("/photobooth")}
          className="flex items-center gap-2 rounded-full border-2 border-[#1C1917] bg-[#FDFBF3] px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0_0_#1C1917] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#1C1917] transition-all cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-sm font-black uppercase tracking-[0.25em] text-[#1C1917] font-boldonse">
            Photobooth Editor
          </h1>
        </div>

        <div className="text-xs font-bold bg-[#F3B8CC] border-2 border-[#1C1917] px-4 py-2 rounded-full shadow-[2px_2px_0_0_#1C1917]">
          {layout.photos} Photos Studio
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.35fr_0.85fr]">
        
        {/* Kolom Kiri: Canvas Preview Kolase */}
        <div className="space-y-6">
          <div className="rounded-[2rem] border-2 border-[#1C1917] bg-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-[#D9A400]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Workspace</span>
              </div>
              <h2 className="text-2xl font-black text-[#1C1917] font-boldonse">{layout.name} Photobooth</h2>
            </div>
            <span className="rounded-full bg-[#FFFDF5] border-2 border-[#1C1917] px-4 py-1.5 text-xs font-bold text-stone-700 shadow-[2px_2px_0_0_#1C1917]">
              {layout.photos} Shots Collage
            </span>
          </div>
          
          <div className="flex justify-center p-6 bg-white rounded-[2rem] overflow-hidden">
            <div
              id="photobooth-collage"
              className="relative mx-auto overflow-hidden shadow-lg"
              style={{
                width: "420px",
                aspectRatio: `${frame.canvasWidth} / ${frame.canvasHeight}`,
                filter: toneStyle,
                backgroundColor: frameBgColor,
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
                      style={{ objectPosition: "center" }}
                    />
                  )}
                </div>
              ))}

              <img
                src={frame?.preview}
                className="pointer-events-none absolute inset-0 h-full w-full z-10"
                alt=""
              />

              {customText && (
                <div className="absolute bottom-6 left-4 right-4 text-center text-white z-20">
                  <div className="rounded-2xl bg-black/75 backdrop-blur-xs px-4 py-2.5 text-xs font-bold tracking-wider border border-white/20 shadow-md">
                    {customText}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Panel Kontrol (Frame, Tone, Text, Export) */}
        <div className="space-y-6">
        
          {/* Pengaturan Tone/Filter */}
          <div className="rounded-[2rem] border-2 border-[#1C1917] bg-white p-6 shadow-[6px_6px_0_0_#1C1917]">
            <h3 className="text-lg font-bold text-[#1C1917] font-boldonse">Color Tone</h3>
            <p className="mt-1 text-xs text-stone-500 font-medium">Pilih filter warna estetik untuk hasil fotomu.</p>
            <div className="mt-4">
              <TonePicker filters={photoboothFilters.filter(f => f.id === 'original' || f.id === 'bw' || f.id === 'vintage')} selected={selectedTone} onSelect={setSelectedTone} />
            </div>
          </div>

          {/* Input Teks Kustom */}
          <div className="rounded-[2rem] border-2 border-[#1C1917] bg-white p-6 shadow-[6px_6px_0_0_#1C1917]">
            <h3 className="text-lg font-bold text-[#1C1917] font-boldonse">Custom Text</h3>
            <p className="mt-1 text-xs text-stone-500 font-medium">Tambahkan tanggal, waktu, atau pesan singkat di bawah kolase.</p>
            <div className="mt-4">
              <input
                type="text"
                value={customText}
                onChange={(event) => setCustomText(event.target.value)}
                placeholder="Best Day Ever ✦ 2026"
                className="w-full rounded-2xl border-2 border-stone-200 bg-[#FDFBF3] px-4 py-3 text-sm font-medium text-stone-900 outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-[#F6C445]/30 transition-all"
              />
            </div>
          </div>

          {/* Tombol Ekspor/Download */}
          <div className="rounded-[2rem] border-2 border-[#1C1917] bg-white p-6 shadow-[6px_6px_0_0_#1C1917]">
            <h3 className="text-lg font-bold text-[#1C1917] font-boldonse mb-2">Export & Save</h3>
            <Toolbar
              onDownloadPNG={() => handleDownload("png")}
              onDownloadJPG={() => handleDownload("jpg")}
              onReset={() => router.push("/photobooth")}
            />
          </div>

          {/* POPUP KONFIRMASI SETELAH DOWNLOAD */}
          {downloadComplete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/40 p-4 backdrop-blur-xs animate-in fade-in duration-200">
              <div className="relative w-full max-w-md rounded-[2rem] border-[2.5px] border-[#111111] bg-[#FFFDF5] p-8 text-center shadow-[8px_8px_0_0_#111111] animate-in zoom-in-95 duration-200">
                
                {/* Tombol Silang (X) untuk tetap di halaman editor */}
                <button
                  type="button"
                  onClick={() => setDownloadComplete(false)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 border-2 border-[#111111] flex items-center justify-center text-[#111111] hover:bg-stone-200 transition-colors cursor-pointer"
                  aria-label="Tutup popup"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#A9D6BC] border-[2.5px] border-[#111111] shadow-[3px_3px_0_0_#111111]">
                  <CheckCircle2 size={30} strokeWidth={2.5} className="text-[#111111]" />
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight text-[#111111] font-boldonse mb-2">
                  Download Selesai!
                </h3>
                
                <p className="text-sm font-bold text-stone-600 leading-relaxed mb-8">
                  Foto photobooth kamu berhasil diunduh dan otomatis disimpan ke dashboard akunmu.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full sm:flex-1 rounded-2xl bg-[#1C1917] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#F6C445] border-2 border-[#1C1917] shadow-[3px_3px_0_0_#F6C445] hover:-translate-y-0.5 transition-all cursor-pointer text-center"
                  >
                    Kembali ke Beranda
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/photobooth")}
                    className="w-full sm:flex-1 rounded-2xl bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0_0_#111111] hover:bg-stone-50 transition-all cursor-pointer text-center"
                  >
                    Foto Lagi
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