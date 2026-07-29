type SpeechBubbleProps = {
  children: React.ReactNode;
  color: string;
  rotate?: number;
};

export default function SpeechBubble({
  children,
  color,
  rotate = 0,
}: SpeechBubbleProps) {
  return (
    <div
      className="relative inline-flex items-center justify-center rounded-full border-2 border-[#1C1917] px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#1C1917] shadow-[3px_3px_0_0_#1C1917]"
      style={{
        backgroundColor: color,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}

      {/* ekor bubble */}
      <div
        className="absolute -bottom-2 left-5 h-3 w-3 rotate-45 border-b-2 border-r-2 border-[#1C1917]"
        style={{
          backgroundColor: color,
        }}
      />
    </div>
  );
}