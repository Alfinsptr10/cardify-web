import { Suspense } from "react";
import FrameSelection from "@/components/photobooth/FrameSelection";

export default function FramePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF9]" />}>
      <FrameSelection />
    </Suspense>
  );
}