"use client";

type ToolbarProps = {
  onDownloadPNG: () => void;
  onDownloadJPG: () => void;
  onReset: () => void;
};

export default function Toolbar({ onDownloadPNG, onDownloadJPG, onReset }: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onDownloadPNG}
        className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-stone-200 transition hover:bg-black"
      >
        Download PNG
      </button>
      <button
        type="button"
        onClick={onDownloadJPG}
        className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 border border-stone-200 shadow-sm transition hover:bg-stone-100"
      >
        Download JPG
      </button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center rounded-full bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-700 border border-amber-200 shadow-sm transition hover:bg-amber-100"
      >
        Reset
      </button>
    </div>
  );
}
