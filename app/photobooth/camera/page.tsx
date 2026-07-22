import { Suspense } from "react";
import CameraClient from "@/components/photobooth/CameraClient";

export default function PhotoboothCameraPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF9]" />}>
      <CameraClient />
    </Suspense>
  );
}