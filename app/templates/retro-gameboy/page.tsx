"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { toPng } from "html-to-image";
import { Press_Start_2P } from "next/font/google"; // Hanya pakai font ini untuk totalitas
import { 
  Upload, 
  ArrowLeft, 
  Download, 
  Loader2,
  X,
  ZoomIn,
  Move,
  Trash2,
  Gamepad2,
  Maximize,
  BatteryMedium,
  Image as ImageIcon, 
  Music 
} from "lucide-react";

// --- FONT 8-BIT ---
const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: ["400"] });

// --- TYPE DEFINITIONS ---
type StickerData = {
  id: number;
  content: string;
  x: number;
  y: number;
  scale: number;
};

// --- PIXEL COMPONENT UTILS ---
const PixelBox = ({ children, className = "", active = false }: { children: React.ReactNode, className?: string, active?: boolean }) => (
  <div className={`
    relative border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    ${active ? "bg-[#e0f8cf]" : ""}
    ${className}
  `}>
    {/* Dekorasi Sudut Pixel */}
    <div className="absolute top-0 left-0 w-2 h-2 bg-white -mt-1 -ml-1"></div>
    <div className="absolute top-0 right-0 w-2 h-2 bg-white -mt-1 -mr-1"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 bg-white -mb-1 -ml-1"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 bg-white -mb-1 -mr-1"></div>
    {children}
  </div>
);

const PixelButton = ({ onClick, disabled, children, className = "", variant = "primary" }: any) => {
  const baseStyle = "relative border-2 border-black px-4 py-3 font-bold text-[10px] uppercase transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#8bac0f] text-[#0f380f] hover:bg-[#9bbc0f]",
    danger: "bg-[#ff3030] text-white hover:bg-[#ff5050]",
    neutral: "bg-white text-black hover:bg-gray-100"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className} ${pixelFont.className}`}
    >
      {children}
    </button>
  );
};

// --- CROPPER (RETRO STYLE) ---
const ImageCropper = ({ src, onCrop, onCancel }: { src: string, onCrop: (val: string) => void, onCancel: () => void }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [imgStyle, setImgStyle] = useState({});
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    // Target ratio 1:1 for Gameboy Photo vibe
    const aspectRatio = 1; 
    if (naturalWidth / naturalHeight > aspectRatio) {
      setImgStyle({ height: '100%', width: 'auto' });
    } else {
      setImgStyle({ width: '100%', height: 'auto' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setPosition(p => ({ x: p.x + dx, y: p.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const performCrop = () => {
    if (!imageRef.current) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Output Resolution: 1:1 Ratio (Square Gameboy Photo)
    const size = 600;
    canvas.width = size;
    canvas.height = size;

    // GB Palette Background
    ctx.fillStyle = "#0f380f";
    ctx.fillRect(0, 0, size, size);

    const img = imageRef.current;
    
    // Simple visual mapping
    // We assume the user has adjusted it visually in the container
    // This is a simplified crop logic focusing on visual center
    const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight) * zoom;
    const x = (size - img.naturalWidth * scale) / 2 + (position.x * 1.5);
    const y = (size - img.naturalHeight * scale) / 2 + (position.y * 1.5);

    ctx.imageSmoothingEnabled = false; // PIXELATED SCALING
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);

    onCrop(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f380f]/90 p-4">
      <div className="w-full max-w-md bg-[#9bbc0f] border-4 border-[#0f380f] p-1 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="bg-[#8bac0f] border-b-4 border-[#0f380f] p-3 flex justify-between items-center mb-4">
          <span className={`text-[#0f380f] text-xs ${pixelFont.className}`}>CROP SPRITE</span>
          <button onClick={onCancel}><X size={20} className="text-[#0f380f]" /></button>
        </div>
        
        <div 
          className="relative w-full aspect-square bg-[#0f380f] overflow-hidden cursor-move border-4 border-[#306230]"
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            ref={imageRef}
            src={src} 
            onLoad={onImageLoad}
            className="absolute top-1/2 left-1/2 origin-center select-none grayscale contrast-150"
            style={{ 
              ...imgStyle, 
              transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              imageRendering: 'pixelated'
            }}
            draggable={false}
            alt="Crop Target"
          />
          {/* Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 grid grid-cols-3 grid-rows-3">
             {[...Array(9)].map((_, i) => <div key={i} className="border border-[#9bbc0f]" />)}
          </div>
        </div>

        <div className="p-4 space-y-4">
           <div className="flex items-center gap-4 bg-[#8bac0f] p-2 border-2 border-[#306230]">
              <ZoomIn size={16} className="text-[#0f380f]" />
              <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-[#0f380f] h-2 bg-[#306230] appearance-none" />
           </div>
           <div className="flex gap-2">
              <PixelButton onClick={onCancel} variant="danger" className="flex-1">CANCEL</PixelButton>
              <PixelButton onClick={performCrop} className="flex-1">OK</PixelButton>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function RetroGameboyOverhaul() {
  const [charName, setCharName] = useState("PLAYER 1");
  const [message, setMessage] = useState("IT'S DANGEROUS TO GO ALONE!");
  const [level, setLevel] = useState("LVL 25");
  const [hp, setHp] = useState("❤️❤️❤️");
  
  const [image, setImage] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
   // Chassis color state
   const [chassisColor, setChassisColor] = useState<string>("#c0c0c0");
  
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sticker Inventory (Emojis Only for True Retro Feel)
  const inventory = ["⚔️", "🛡️", "🍄", "⭐", "💎", "👾", "💀", "🗝️", "❤️", "👑", "🔥", "🧊"];

  // --- HANDLERS ---
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempImage(URL.createObjectURL(file));
      setCropModalOpen(true);
      e.target.value = "";
    }
  };

  const addSticker = (emoji: string) => {
    setStickers([...stickers, { id: Date.now(), content: emoji, x: 50, y: 50, scale: 1 }]);
  };

  const removeSticker = (id: number) => {
    setStickers(stickers.filter(s => s.id !== id));
  };

  const handleDragStart = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDraggingId(id);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (draggingId === null || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Calculate relative position within the 300x300 screen area
    // This requires some visual estimation or strict bounds
    // For now simple delta
    setStickers(prev => prev.map(s => {
       if (s.id !== draggingId) return s;
       return { ...s, x: s.x + e.movementX, y: s.y + e.movementY };
    }));
  };

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 4 });
      const link = document.createElement("a");
      link.download = `8BIT-${charName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert("ERR: SAVE_FAILED");
    } finally {
      setIsDownloading(false);
    }
  }, [charName]);

  return (
    <div className={`h-screen w-full bg-[#202020] flex flex-col lg:flex-row overflow-hidden text-[#e0f8cf] ${pixelFont.className} selection:bg-[#306230] selection:text-[#9bbc0f]`}>
      
      {/* --- CROPPER MODAL --- */}
      {cropModalOpen && tempImage && (
        <ImageCropper 
          src={tempImage} 
          onCrop={(url) => { setImage(url); setCropModalOpen(false); }} 
          onCancel={() => setCropModalOpen(false)} 
        />
      )}

      {/* === LEFT PANEL: CONTROL DECK === */}
      <div className="w-full lg:w-[450px] bg-[#2d2d2d] border-r-4 border-black flex flex-col h-full shadow-[10px_0_20px_rgba(0,0,0,0.5)] z-20 relative">
        
        {/* Decorative Screw Holes */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-[#111] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]" />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#111] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]" />
        
        {/* Header */}
        <div className="p-8 pb-4 border-b-4 border-black bg-[#333]">
           <Link href="/" className="inline-flex items-center gap-2 text-[10px] text-[#8bac0f] hover:text-[#9bbc0f] mb-4 group">
             <ArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" /> EJECT
           </Link>
           <h1 className="text-2xl text-[#9bbc0f] text-shadow-retro mb-1">CARD MAKER</h1>
           <p className="text-[10px] text-gray-400">VER 2.0 // BUILD YOUR HERO</p>
        </div>

         {/* Chassis Color Selector (always visible above controls) */}
         <div className="px-6 py-4 border-b-2 border-black bg-[#2b2b2b] flex items-center gap-4">
             <div className="text-[10px] text-[#9bbc0f] font-bold">CHASSIS</div>
             <div className="flex items-center gap-2">
                {[
                   { name: 'Gray', color: '#c0c0c0' },
                   { name: 'Black', color: '#1f1f1f' },
                   { name: 'Olive', color: '#9bbc0f' },
                   { name: 'Beige', color: '#e0d7b0' },
                   { name: 'Purple', color: '#8b5cf6' }
                ].map((c) => (
                   <button
                      key={c.color}
                      onClick={() => setChassisColor(c.color)}
                      aria-label={c.name}
                      className={`w-6 h-6 border-2 ${chassisColor === c.color ? 'ring-2 ring-[#9bbc0f]' : 'border-black'} rounded-sm`}
                      style={{ background: c.color }}
                   />
                ))}

                <button onClick={() => setChassisColor('#c0c0c0')} className="ml-3 text-[10px] text-[#9bbc0f] border-2 border-black px-2 py-1">Reset</button>
             </div>
         </div>

      {/* Scrollable Controls */}
      <div className="flex-grow overflow-y-auto p-6 space-y-8 retro-scrollbar bg-[#2d2d2d]">
          
          {/* 1. CHARACTER STATS */}
          <section>
             <div className="flex items-center gap-2 mb-4 text-[#9bbc0f] text-xs border-b-2 border-[#9bbc0f] pb-1 w-fit">
                <span className="animate-pulse">►</span> CHARACTER STATS
             </div>
             
             <div className="space-y-4">
                <div className="bg-black p-1">
                   <label className="block text-[8px] text-[#8bac0f] mb-1 pl-1">NAME</label>
                   <input 
                      value={charName}
                      onChange={(e) => setCharName(e.target.value.toUpperCase())}
                      className="w-full bg-[#0f380f] text-[#9bbc0f] p-3 border-2 border-[#306230] focus:border-[#9bbc0f] outline-none placeholder:text-[#306230]"
                      maxLength={12}
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-black p-1">
                      <label className="block text-[8px] text-[#8bac0f] mb-1 pl-1">LEVEL</label>
                      <input 
                         value={level}
                         onChange={(e) => setLevel(e.target.value.toUpperCase())}
                         className="w-full bg-[#0f380f] text-[#9bbc0f] p-3 border-2 border-[#306230] focus:border-[#9bbc0f] outline-none"
                      />
                   </div>
                   <div className="bg-black p-1">
                      <label className="block text-[8px] text-[#8bac0f] mb-1 pl-1">HP</label>
                      <input 
                         value={hp}
                         onChange={(e) => setHp(e.target.value)}
                         className="w-full bg-[#0f380f] text-[#9bbc0f] p-3 border-2 border-[#306230] focus:border-[#9bbc0f] outline-none"
                      />
                   </div>
                </div>

                <div className="bg-black p-1">
                   <label className="block text-[8px] text-[#8bac0f] mb-1 pl-1">QUEST LOG</label>
                   <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value.toUpperCase())}
                      className="w-full bg-[#0f380f] text-[#9bbc0f] p-3 border-2 border-[#306230] focus:border-[#9bbc0f] outline-none h-24 resize-none leading-loose"
                      maxLength={60}
                   />
                </div>
             </div>
          </section>

          {/* 2. AVATAR UPLOAD */}
          <section>
             <div className="flex items-center gap-2 mb-4 text-[#9bbc0f] text-xs border-b-2 border-[#9bbc0f] pb-1 w-fit">
                <span className="animate-pulse">►</span> AVATAR SOURCE
             </div>
             
             <button 
                onClick={() => document.getElementById("hiddenUpload")?.click()}
                className="w-full border-4 border-dashed border-[#555] p-6 hover:bg-[#333] hover:border-[#9bbc0f] transition-all group flex flex-col items-center gap-2"
             >
                <Upload size={24} className="text-gray-500 group-hover:text-[#9bbc0f]" />
                <span className="text-[10px] text-gray-400 group-hover:text-white">INSERT CARTRIDGE (UPLOAD PHOTO)</span>
             </button>
             <input type="file" id="hiddenUpload" hidden accept="image/*" onChange={handleUpload} />
          </section>

          {/* 3. INVENTORY (STICKERS) */}
          <section>
             <div className="flex items-center gap-2 mb-4 text-[#9bbc0f] text-xs border-b-2 border-[#9bbc0f] pb-1 w-fit">
                <span className="animate-pulse">►</span> INVENTORY
             </div>
             
             <div className="grid grid-cols-6 gap-2 bg-black p-2 border-2 border-[#555]">
                {inventory.map((item, idx) => (
                   <button 
                      key={idx} 
                      onClick={() => addSticker(item)}
                      className="aspect-square bg-[#222] border border-[#444] hover:bg-[#9bbc0f] hover:text-[#0f380f] hover:border-white transition-colors flex items-center justify-center text-lg"
                   >
                      {item}
                   </button>
                ))}
             </div>
             <p className="text-[8px] text-gray-500 mt-2 text-center">* DRAG ITEMS TO EQUIP</p>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#222] border-t-4 border-black">
           <PixelButton onClick={handleDownload} className="w-full py-4 text-xs">
              <Download size={14} /> SAVE GAME (DOWNLOAD)
           </PixelButton>
        </div>
      </div>

         {/* Page-scoped retro scrollbar styles (only for this template's left panel) */}
         <style jsx>{`
            :global(.retro-scrollbar) {
               scrollbar-width: thin;
               scrollbar-color: #9bbc0f #2d2d2d;
            }
            :global(.retro-scrollbar::-webkit-scrollbar) {
               width: 14px;
               height: 14px;
            }
            :global(.retro-scrollbar::-webkit-scrollbar-track) {
               background: #2d2d2d;
               border-left: 4px solid #111;
               box-shadow: inset -4px 0 0 #141414;
            }
            :global(.retro-scrollbar::-webkit-scrollbar-thumb) {
               background: repeating-linear-gradient(
                  0deg,
                  #9bbc0f 0 6px,
                  #8bac0f 6px 12px
               );
               border: 3px solid #000;
               border-radius: 0;
               box-shadow: 2px 2px 0 rgba(0,0,0,0.8) inset;
               image-rendering: pixelated;
            }
            :global(.retro-scrollbar::-webkit-scrollbar-thumb:hover) {
               filter: brightness(1.05);
            }
         `}</style>


      {/* === RIGHT PANEL: GAME SCREEN PREVIEW === */}
      <div className="flex-grow bg-[#111] relative flex items-center justify-center p-8 overflow-hidden">
         
         {/* CRT Background Effects */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none" />
         <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10" />

         {/* --- THE GAMEBOY CHASSIS (CSS ART) --- */}
         {/* WRAPPER untuk scaling visual, tidak ikut ter-download */}
         <div className="relative z-20 transform scale-[0.85] origin-center">
            
            {/* THE ACTUAL CHASSIS (REFFED HERE FOR DOWNLOAD) */}
            <div 
               ref={cardRef} // <--- SEKARANG DOWNLOAD MENCAKUP SEMUA INI
               style={{ background: chassisColor }}
               className="p-6 pb-12 rounded-t-[20px] rounded-b-[40px] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_-5px_-5px_10px_rgba(0,0,0,0.2),inset_2px_2px_5px_rgba(255,255,255,0.5)] w-[380px] flex flex-col items-center select-none"
            >
               {/* Screen Bezel */}
               <div className="bg-[#555] w-full p-8 rounded-t-[10px] rounded-b-[30px] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)] relative">
                  
                  {/* Power LED */}
                  <div className="absolute top-2 left-4 flex flex-col items-center gap-1 z-50"> 
                     <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_red] animate-pulse" />
                     <span className="text-[6px] text-gray-400 font-sans tracking-widest font-bold">BATTERY</span>
                  </div>
                  
                  {/* THE SCREEN */}
                  {/* HAPUS ref={cardRef} DARI SINI AGAR TIDAK CUMA LAYAR YG TER-DOWNLOAD */}
                  <div className="w-[280px] h-[280px] bg-[#9bbc0f] border-4 border-[#0f380f] shadow-[inset_4px_4px_0_rgba(0,0,0,0.2)] overflow-hidden relative mx-auto"
                       onMouseMove={handleDragMove}
                       onMouseUp={() => setDraggingId(null)}
                       onMouseLeave={() => setDraggingId(null)}
                  >
                     {/* Scanlines inside screen */}
                     <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-30" />
                     
                     {/* Content Wrapper */}
                     <div className="w-full h-full relative flex flex-col text-[#0f380f]">
                         
                         {/* Top Bar */}
                         <div className="bg-[#0f380f] text-[#9bbc0f] px-2 py-1 flex justify-between items-center text-[8px]">
                            <span>{charName}</span>
                            <span>{level}</span>
                            <span>{hp}</span>
                         </div>

                         {/* Main Image Area (Takes most space) */}
                         <div className="flex-grow relative border-b-4 border-[#0f380f] bg-[#8bac0f] overflow-hidden">
                            {image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                 src={image} 
                                 alt="Avatar" 
                                 className="w-full h-full object-cover grayscale contrast-[1.2] brightness-90 mix-blend-multiply" 
                                 style={{ imageRendering: 'pixelated' }}
                                 draggable={false}
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center opacity-40 gap-2">
                                 <ImageIcon size={32} />
                                 <span className="text-[8px] animate-pulse">NO CARTRIDGE</span>
                              </div>
                            )}

                            {/* STICKERS LAYER */}
                            {stickers.map(s => (
                               <div 
                                 key={s.id}
                                 className="absolute cursor-move group z-20"
                                 style={{ left: s.x, top: s.y, transform: 'translate(-50%, -50%)', fontSize: '32px' }}
                                 onMouseDown={(e) => handleDragStart(e, s.id)}
                               >
                                  <span className="drop-shadow-[2px_2px_0_rgba(15,56,15,0.5)] filter grayscale contrast-150">{s.content}</span>
                                  <button 
                                     onClick={(e) => { e.stopPropagation(); removeSticker(s.id); }}
                                     className="absolute -top-3 -right-3 bg-[#0f380f] text-[#9bbc0f] p-0.5 rounded-full opacity-0 group-hover:opacity-100"
                                  >
                                     <X size={8} />
                                  </button>
                               </div>
                            ))}
                         </div>

                         {/* Dialog Box */}
                         <div className="h-[80px] p-2 bg-[#9bbc0f] relative">
                            <div className="w-full h-full border-2 border-[#0f380f] p-2 relative bg-[#9bbc0f] shadow-[4px_4px_0_rgba(15,56,15,0.4)]">
                               {/* Animated Arrow */}
                               <div className="absolute bottom-1 right-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#0f380f] animate-bounce" />
                               <p className="text-[8px] leading-relaxed break-words">{message}</p>
                            </div>
                         </div>

                     </div>
                  </div>

                  {/* Nintendo Logo area */}
                  <div className="mt-4 flex items-center gap-1">
                     <span className="text-[#888] text-[10px] font-bold italic font-sans tracking-wide">Nintendo</span>
                     <span className="text-[#888] text-[12px] font-sans">GAME BOY</span>
                  </div>
               </div>

               {/* Controls Area */}
               <div className="w-full mt-12 px-4 relative">
                  {/* D-Pad */}
                  <div className="absolute left-4 top-0 w-24 h-24">
                     <div className="w-8 h-24 bg-black absolute left-8 rounded-sm shadow-md" />
                     <div className="w-24 h-8 bg-black absolute top-8 rounded-sm shadow-md" />
                     <div className="w-8 h-8 bg-[#222] absolute top-8 left-8 rounded-full inset-shadow" />
                  </div>

                  {/* A/B Buttons */}
                  <div className="absolute right-4 top-4 flex gap-4 transform -rotate-12">
                      <div className="flex flex-col items-center gap-1">
                         <div className="w-10 h-10 bg-[#9f2040] rounded-full shadow-[2px_2px_0_#5a1020] active:translate-y-1 active:shadow-none transition-transform" />
                         <span className="text-[#888] font-bold text-xs font-sans">B</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 mt-4">
                         <div className="w-10 h-10 bg-[#9f2040] rounded-full shadow-[2px_2px_0_#5a1020] active:translate-y-1 active:shadow-none transition-all" />
                         <span className="text-[#888] font-bold text-xs font-sans">A</span>
                      </div>
                  </div>

                  {/* Select/Start */}
                  <div className="flex justify-center gap-4 mt-32">
                     <div className="flex flex-col items-center gap-1 transform rotate-12">
                        <div className="w-12 h-3 bg-black rounded-full border border-gray-600 shadow-sm" />
                        <span className="text-[8px] text-[#888] font-sans tracking-widest font-bold">SELECT</span>
                     </div>
                     <div className="flex flex-col items-center gap-1 transform rotate-12">
                        <div className="w-12 h-3 bg-black rounded-full border border-gray-600 shadow-sm" />
                        <span className="text-[8px] text-[#888] font-sans tracking-widest font-bold">START</span>
                     </div>
                  </div>
               </div>

               {/* Speaker Grills */}
               <div className="absolute bottom-8 right-8 flex gap-2 transform -rotate-12">
                  {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="w-1.5 h-16 bg-black/20 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]" />
                  ))}
               </div>

            </div>
         </div>
      </div>

    </div>
  );
}