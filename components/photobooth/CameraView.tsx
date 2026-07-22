"use client";

export default function CameraView() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[2rem] border border-stone-200 bg-stone-100/60 p-8 text-center text-stone-700 shadow-sm">
      <div>
        <p className="text-lg font-semibold">Camera will be available here.</p>
        <p className="mt-2 text-sm text-stone-500">This screen will show the live preview and automatic countdown.</p>
      </div>
    </div>
  );
}
