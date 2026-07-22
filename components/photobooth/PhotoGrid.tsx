"use client";

type PhotoGridProps = {
  photos: string[];
  totalPhotos: number;
  selectedIndex?: number;
  isRetakeMode?: boolean;
  onSelect?: (index: number) => void;
  frameClass?: string;
  filterCss?: string;
  slotAspectRatio?: string;
};

export default function PhotoGrid({
  photos,
  totalPhotos,
  selectedIndex,
  isRetakeMode = false,
  onSelect,
  frameClass = "border-4 border-white",
  filterCss = "none",
  slotAspectRatio = "3 / 4",
}: PhotoGridProps) {
  return (
    <div className="grid gap-3 grid-cols-2">
      {Array.from({ length: totalPhotos }).map((_, index) => {
        const photo = photos[index];
        const isSelected = selectedIndex === index;

        return (
          <button
            key={index}
            type="button"
            disabled={!isRetakeMode}
            onClick={() => onSelect?.(index)}
            aria-label={`Photo slot ${index + 1}${photo ? ", captured" : ", empty"}${isSelected ? ", selected" : ""}`}
            className={
              `relative overflow-hidden bg-stone-900 transition-all ${frameClass} ` +
              `${isRetakeMode ? "cursor-pointer hover:scale-105" : "cursor-default"} ` +
              `${isSelected ? "ring-4 ring-amber-400" : ""}`
            }
            style={{ aspectRatio: slotAspectRatio }}
          >
            {photo ? (
              <img
                src={photo}
                alt={`photo-${index + 1}`}
                className="h-full w-full object-cover"
                style={{ filter: filterCss }}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-stone-800 text-stone-300">
                <div className="text-5xl">＋</div>
                <p className="mt-2 text-sm">Slot {index + 1}</p>
              </div>
            )}

            <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
              Slot {index + 1}
            </div>

            {isRetakeMode && photo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition hover:bg-black/40">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-900 opacity-0 transition hover:opacity-100">
                  Retake
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}