"use client";
import type { PhotoboothFilter } from "@/lib/photobooth/filters";

type TonePickerProps = {
  filters: PhotoboothFilter[];
  selected: string;
  onSelect: (id: string) => void;
};

export default function TonePicker({ filters, selected, onSelect }: TonePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onSelect(filter.id)}
          className={`group rounded-3xl border p-4 text-left transition ${selected === filter.id ? "border-amber-400 bg-amber-50" : "border-stone-200 bg-white"}`}
        >
          <div className="h-24 overflow-hidden rounded-3xl bg-stone-100" style={{ filter: filter.css }} />
          <p className="mt-3 text-sm font-semibold text-stone-900">{filter.name}</p>
        </button>
      ))}
    </div>
  );
}
