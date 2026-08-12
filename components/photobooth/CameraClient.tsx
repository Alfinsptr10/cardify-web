"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Countdown from "@/components/photobooth/Countdown";
import PhotoGrid from "@/components/photobooth/PhotoGrid";
import type { PhotoboothLayout } from "@/lib/photobooth/layouts";
import { photoboothLayouts } from "@/lib/photobooth/layouts";
import { Camera, ArrowLeft, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

function getLayoutById(id: string | null): PhotoboothLayout | undefined {
  if (!id) return undefined;
  return photoboothLayouts.find((layout) => layout.id === id);
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export default function CameraClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const frameId = searchParams.get("frame");
  const layoutId = searchParams.get("layout");
  const layout = useMemo(() => getLayoutById(layoutId), [layoutId]);

  const [countdown, setCountdown] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isRetakeMode, setIsRetakeMode] = useState(false);
  const [selectedRetakeIndex, setSelectedRetakeIndex] = useState(0);
  const [retakeRemaining, setRetakeRemaining] = useState(5);
  const [retakeTimer, setRetakeTimer] = useState(120);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const hasFilledAllSlots = layout ? capturedPhotos.length >= layout.photos : false;
  const nextSlot = layout ? Math.min(capturedPhotos.length + 1, layout.photos) : 1;

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraReady(false);
  };

  useEffect(() => {
    if (!layout) return;

    const startCamera = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: "user",
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsCameraReady(true);
        }
      } catch (error) {
        console.error("Failed to start camera:", error);
        setIsCameraReady(false);
      }
    };

    startCamera();
    return () => stopCamera();
  }, [layout]);

  useEffect(() => {
    if (!layout) return;
    if (hasFilledAllSlots && !isRetakeMode) {
      setIsRetakeMode(true);
      setSelectedRetakeIndex(0);
    }
  }, [hasFilledAllSlots, isRetakeMode, layout]);

  useEffect(() => {
    if (!isRetakeMode || retakeTimer <= 0) return;

    const interval = window.setInterval(() => {
      setRetakeTimer((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRetakeMode, retakeTimer]);

  useEffect(() => {
    if (!layout) return;
    sessionStorage.setItem("photobooth-photos", JSON.stringify(capturedPhotos));
  }, [capturedPhotos, layout]);

  useEffect(() => {
    if (!isCapturing) return;

    if (countdown <= 0) {
      const capturePhoto = async () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL("image/png");

        setCapturedPhotos((previous) => {
          if (isRetakeMode) {
            const next = [...previous];
            next[selectedRetakeIndex] = photoData;
            return next;
          }
          return [...previous, photoData];
        });

        if (isRetakeMode) {
          setRetakeRemaining((previous) => Math.max(previous - 1, 0));
        }

        setIsCapturing(false);
        setCountdown(0);
      };

      capturePhoto();
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, isCapturing, isRetakeMode, selectedRetakeIndex]);

  const handleStartCapture = () => {
    if (!layout) return;
    if (isCapturing) return;
    if (!isCameraReady) return;
    if (isRetakeMode && (retakeRemaining <= 0 || retakeTimer <= 0)) return;

    setCountdown(5);
    setIsCapturing(true);
  };

  const handleFinishSession = () => {
    if (!layout) return;

    sessionStorage.setItem(
      "photobooth-photos",
      JSON.stringify(capturedPhotos)
    );

    router.push(
      `/photobooth/editor?layout=${layout.id}&frame=${frameId}`
    );
  };

  if (!layout) {
    return (
      <div className="min-h-screen bg-[#FDFBF3] text-[#1C1917] py-24 px-6 font-sans">
        <div className="mx-auto max-w-3xl rounded-[2rem] border-2 border-[#1C1917] bg-white p-10 text-center shadow-[6px_6px_0_0_#1C1917]">
          <p className="text-xl font-bold font-boldonse">Layout tidak ditemukan.</p>
          <p className="mt-2 text-sm text-stone-500 font-medium">Kembali ke halaman Photobooth dan pilih layout terlebih dahulu.</p>
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
    <div className="min-h-screen bg-[#FDFBF3] text-[#1C1917] font-sans selection:bg-[#F6C445] selection:text-[#1C1917]">
      
      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Boldonse&family=DM+Sans:opsz,wght@9..40,400;500;700;800&display=swap');
          .font-sans { font-family: 'DM Sans', sans-serif; }
          .font-boldonse { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
      `}} />

      {/* HEADER KUSTOM */}
      <header className="relative flex h-20 items-center justify-between border-b-2 border-[#1C1917] bg-white px-8 z-20">
        <button
          onClick={() => router.push("/photobooth")}
          className="flex items-center gap-2 rounded-full border-2 border-[#1C1917] bg-[#FDFBF3] px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0_0_#1C1917] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#1C1917] transition-all cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Layouts
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F6C445] border border-[#1C1917]"></span>
          <h1 className="text-sm font-bold uppercase tracking-[0.25em] text-[#1C1917] font-boldonse">
            Photobooth Studio
          </h1>
        </div>

        <div className="text-xs font-bold bg-[#BFE0F5] border-2 border-[#1C1917] px-4 py-2 rounded-full shadow-[2px_2px_0_0_#1C1917]">
          {isRetakeMode ? "Mode: Retake" : `Shot ${nextSlot} of ${layout.photos}`}
        </div>
      </header>

      <div className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-6 py-10">
        <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(#1C1917_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 flex w-full max-w-6xl flex-col gap-8">
          
          {/* Header Info Banner */}
          <div className="rounded-[2rem] border-2 border-[#1C1917] bg-white p-6 shadow-[6px_6px_0_0_#1C1917] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-[#D9A400]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Active Template</span>
              </div>
              <h2 className="text-2xl font-black text-[#1C1917] font-boldonse">{layout.name}</h2>
            </div>
            <p className="text-sm text-stone-600 font-medium max-w-md text-center md:text-right">
              {isRetakeMode
                ? "Pilih slot foto di sebelah kanan jika ingin mengulang tangkapan."
                : `Tekan tombol shutter di bawah untuk memulai hitung mundur ${layout.photos} kali.`}
            </p>
          </div>

          {/* Grid Konten Kamera & Panel Kontrol */}
          <div className="grid gap-8 xl:grid-cols-[1fr_1fr] max-w-6xl mx-auto w-full items-start">
            
            {/* Sisi Kiri: Tampilan Kamera */}
            <div className="mx-auto w-full max-w-md flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] max-h-[520px] rounded-[2rem] border-2 border-[#1C1917] bg-[#1C1917] overflow-hidden shadow-[8px_8px_0_0_#1C1917]">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                  muted
                  playsInline
                />
                
                {/* Panduan Frame / Guideline di dalam video */}
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                  <div className="h-[70%] w-[65%] border-2 border-white/40 rounded-2xl border-dashed" />
                </div>

                {/* Tombol Shutter Mengambang di Bawah Video */}
                {!isCapturing && (
                  <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleStartCapture}
                      disabled={!isCameraReady || (isRetakeMode && (retakeRemaining <= 0 || retakeTimer <= 0))}
                      className="flex items-center gap-3 rounded-full bg-[#F6C445] px-8 py-4 font-bold text-[#1C1917] border-2 border-[#1C1917] shadow-[4px_4px_0_0_#1C1917] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#1C1917] active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      <Camera size={22} strokeWidth={2.5} />
                      <span>{isRetakeMode ? "Retake Photo" : `Capture Shot ${nextSlot}`}</span>
                    </button>
                  </div>
                )}

                {/* Overlay Hitung Mundur */}
                {isCapturing && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                    <Countdown value={countdown} />
                  </div>
                )}
              </div>
            </div>

            {/* Sisi Kanan: Panel Kontrol & Progress Slot */}
            <div className="space-y-6 rounded-[2rem] border-2 border-[#1C1917] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#1C1917]">
              
              {/* Status Info Box */}
              <div className="rounded-2xl border-2 border-stone-200 bg-[#FDFBF3] p-4 text-sm text-stone-700 font-medium">
                {isRetakeMode
                  ? "Sesi pengambilan foto selesai! Anda dapat memilih slot foto tertentu untuk di-retake (maksimal 5 kali dalam waktu 2 menit)."
                  : "Siapkan pose terbaikmu! Setiap sesi foto dilengkapi hitung mundur 5 detik."}
              </div>

              {/* Progress Bar */}
              <div className="rounded-2xl border-2 border-stone-200 bg-white p-5">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold text-[#1C1917] font-boldonse">Progress Sesi</p>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {capturedPhotos.length} / {layout.photos} Terisi
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border-2 border-[#1C1917] bg-stone-100">
                  <div
                    className="h-full bg-[#F6C445] transition-all duration-300"
                    style={{ width: `${(capturedPhotos.length / layout.photos) * 100}%` }}
                  />
                </div>
                
                {isRetakeMode && (
                  <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs font-bold">
                    <div className="rounded-xl bg-[#FFFDF5] border border-stone-200 px-3 py-2 text-stone-700 flex items-center gap-2">
                      <RefreshCw size={14} className="text-amber-600" />
                      <span>Retake tersisa: {retakeRemaining}</span>
                    </div>
                    <div className="rounded-xl bg-[#FFFDF5] border border-stone-200 px-3 py-2 text-stone-700 flex items-center justify-between">
                      <span>Waktu:</span>
                      <span className="font-mono">{formatTimer(retakeTimer)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid Slot Foto yang Sudah Diambil */}
              <div className="rounded-2xl border-2 border-stone-200 bg-white p-5">
                <p className="text-sm font-bold text-[#1C1917] font-boldonse mb-3">Photo Slots</p>
                <PhotoGrid
                  photos={capturedPhotos}
                  totalPhotos={layout.photos}
                  selectedIndex={isRetakeMode ? selectedRetakeIndex : undefined}
                  isRetakeMode={isRetakeMode}
                  onSelect={(index) => {
                    if (isRetakeMode) setSelectedRetakeIndex(index);
                  }}
                />
              </div>

              {/* Tombol Navigasi Bawah */}
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                <button
                  type="button"
                  onClick={handleStartCapture}
                  disabled={!isCameraReady || isCapturing || (isRetakeMode && (retakeRemaining <= 0 || retakeTimer <= 0))}
                  className="rounded-2xl bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#1C1917] border-2 border-[#1C1917] shadow-[3px_3px_0_0_#1C1917] hover:bg-stone-50 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isRetakeMode ? "Retake Selected" : "Take Photo"}
                </button>

                {hasFilledAllSlots && (
                  <button
                    type="button"
                    onClick={handleFinishSession}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#1C1917] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#F6C445] border-2 border-[#1C1917] shadow-[3px_3px_0_0_#F6C445] hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Finish & Edit</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}