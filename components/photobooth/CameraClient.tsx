"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Countdown from "@/components/photobooth/Countdown";
import PhotoGrid from "@/components/photobooth/PhotoGrid";
import type { PhotoboothLayout } from "@/lib/photobooth/layouts";
import { photoboothLayouts } from "@/lib/photobooth/layouts";
import { Camera } from "lucide-react";

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
      <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] py-24 px-6">
        <div className="mx-auto max-w-3xl rounded-4xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold">Layout tidak ditemukan.</p>
          <p className="mt-2 text-sm text-stone-500">Kembali ke halaman Photobooth dan pilih layout terlebih dahulu.</p>
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
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917]">
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.1),transparent_35%)]" />
        <div className="relative z-10 flex w-full max-w-6xl flex-col gap-8">
          <div className="rounded-4xl border border-stone-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Photobooth Camera</p>
            <h1 className="mt-3 text-3xl font-semibold text-stone-900">{layout.name}</h1>
            <p className="mt-2 text-sm text-stone-500">
              {isRetakeMode
                ? "Select a slot to retake and capture again before you finish."
                : `Use the shutter button to begin a ${layout.photos}-shot session with countdown.`}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-3xl bg-stone-100 px-4 py-3 text-sm text-stone-600 shadow-sm">
                {isRetakeMode ? `Retake mode — slot ${selectedRetakeIndex + 1}` : `Photo ${nextSlot} / ${layout.photos}`}
              </div>
              <div className="rounded-3xl bg-stone-100 px-4 py-3 text-sm text-stone-600 shadow-sm">
                {isRetakeMode ? `${formatTimer(retakeTimer)} remaining` : "Ready to capture"}
              </div>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[0.95fr_0.85fr] max-w-6xl mx-auto">
            <div
  className="mx-auto overflow-hidden"
  style={{
    width: 340,
  }}
>
              <div className="relative h-[560px] overflow-hidden">
                <video
  ref={videoRef}
  className="absolute inset-0 h-full w-full object-cover rounded-none"
  muted
  playsInline
/>
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">

  <div className="h-[62%] w-[38%] border-[3px] border-white" />

</div>
                {!isCapturing && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-transparent">
                    <button
                      type="button"
                      onClick={handleStartCapture}
                      disabled={!isCameraReady || (isRetakeMode && (retakeRemaining <= 0 || retakeTimer <= 0))}
                      className="rounded-full bg-white p-6 shadow-2xl transition hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Camera size={42} className="text-black" />
                    </button>
                  </div>
                )}
                <div className="absolute inset-0 bg-transparent" />
                {isCapturing && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <Countdown value={countdown} />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 rounded-4xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="rounded-3xl bg-stone-50 p-5 text-sm text-stone-600">
                {isRetakeMode
                  ? "After all photos are captured, choose a slot and retake if needed. You can use up to 5 retakes within 2 minutes."
                  : "Press the shutter button to trigger a 5-second countdown and capture the next slot."}
              </div>

              <div className="rounded-3xl border border-stone-100 bg-stone-50 p-5">
                <p className="text-sm font-semibold text-stone-900">Capture Progress</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${(capturedPhotos.length / layout.photos) * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-stone-500">
                  {capturedPhotos.length} / {layout.photos} captured
                </p>
                {isRetakeMode && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <span className="rounded-3xl bg-white px-3 py-2 text-sm text-stone-600">
                      Retakes left: {retakeRemaining}
                    </span>
                    <span className="rounded-3xl bg-white px-3 py-2 text-sm text-stone-600">
                      Timer: {formatTimer(retakeTimer)}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-stone-100 bg-stone-50 p-5">
                <p className="text-sm font-semibold text-stone-900">Photo Slots</p>
                <div className="mt-4">
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
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleStartCapture}
                  disabled={!isCameraReady || isCapturing || (isRetakeMode && (retakeRemaining <= 0 || retakeTimer <= 0))}
                  className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRetakeMode ? "Retake selected photo" : "Start capture"}
                </button>

                {hasFilledAllSlots && (
                  <button
                    type="button"
                    onClick={handleFinishSession}
                    className="rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm hover:bg-stone-100"
                  >
                    Finish and edit
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
