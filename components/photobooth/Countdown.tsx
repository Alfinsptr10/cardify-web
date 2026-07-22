"use client";

type CountdownProps = {
  value: number;
};

export default function Countdown({ value }: CountdownProps) {
  if (value <= 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
      {/* background blur */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />

      {/* lingkaran countdown */}
      <div className="relative flex h-40 w-40 animate-pulse items-center justify-center rounded-full border-4 border-white bg-white/95 shadow-2xl">
        <span className="text-7xl font-black text-stone-900">
          {value}
        </span>
      </div>
    </div>
  );
}