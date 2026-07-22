import { Suspense } from "react";
import PhotoboothEditorClient from "@/components/photobooth/PhotoboothEditorClient";

export default function PhotoboothEditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF9]" />}>
      <PhotoboothEditorClient />
    </Suspense>
  );
}