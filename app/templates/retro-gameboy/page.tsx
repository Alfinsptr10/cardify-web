"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { toPng } from "html-to-image";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { 
  Pencil, 
  Upload, 
  Music, 
  Smartphone, 
  Type, 
  Image as ImageIcon,
  LayoutTemplate,
  ArrowLeft, 
  Download, 
  Loader2,
  Check,
  ZoomIn,
  Move,
  X,
  Smile,
  // --- New Sticker Icons ---
  Ghost, 
  Zap, 
  Crown, 
  Rocket, 
  Skull, 
  Trophy, 
  Star, 
  Heart, 
  Gamepad2,
  PartyPopper,
  Flame,
  Sun,
  Moon,
  CloudRain,
  Snowflake,
  Camera,
  Headphones,
  ThumbsUp,
  Coffee,
  Pizza,
  Anchor,
  Bike,
  Car,
  Plane
} from "lucide-react";

// --- KONFIGURASI FONT ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

// --- MAP ICON HELPER ---
const STICKER_ICONS: Record<string, React.ElementType> = {
  Ghost, Zap, Crown, Rocket, Skull, Trophy, Star, Heart, Gamepad2, PartyPopper, Flame, Sun,
  Moon, CloudRain, Snowflake, Camera, Headphones, ThumbsUp, Coffee, Pizza, Anchor, Bike, Car, Plane
};

// --- KOMPONEN CROPPER (AUTO FIT) ---
const ImageCropper = ({ src, aspectRatio, onCrop, onCancel }: { src: string, aspectRatio: number, onCrop: (croppedUrl: string) => void, onCancel: () => void }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [imgStyle, setImgStyle] = useState({}); 
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const imgRatio = naturalWidth / naturalHeight;

    if (imgRatio > aspectRatio) {
      setImgStyle({ height: '100%', width: 'auto', maxWidth: 'none' });
    } else {
      setImgStyle({ width: '100%', height: 'auto', maxHeight: 'none' });
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
    setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setDragging(false);

  const performCrop = () => {
    if (!imageRef.current || !containerRef.current) return;
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const baseWidth = 1000;
    canvas.width = baseWidth;
    canvas.height = baseWidth / aspectRatio; 

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = imageRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const scaleFactor = canvas.width / containerRect.width;

    const drawWidth = imgRect.width * scaleFactor;
    const drawHeight = imgRect.height * scaleFactor;
    const drawX = (imgRect.left - containerRect.left) * scaleFactor;
    const drawY = (imgRect.top - containerRect.top) * scaleFactor;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    onCrop(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <h3 className="font-bold text-lg">Adjust Photo Position</h3>
          <button onClick={onCancel}><X size={20} className="text-gray-400 hover:text-black" /></button>
        </div>
        
        <div className="flex-grow bg-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
            <div 
              ref={containerRef}
              className="relative overflow-hidden cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] ring-2 ring-white/50" 
              style={{ width: '100%', aspectRatio: aspectRatio, maxWidth: '400px' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                ref={imageRef}
                src={src} 
                alt="Crop" 
                onLoad={onImageLoad}
                className="absolute top-1/2 left-1/2 origin-center transition-transform duration-75 select-none"
                style={{ ...imgStyle, transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
                draggable={false}
              />
              <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 opacity-20">
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
                <div className="border-r border-white"></div>
                <div className="border-r border-white"></div>
                <div></div>
              </div>
            </div>
        </div>

        <div className="p-6 space-y-4 flex-shrink-0 bg-white z-20">
          <div className="flex items-center gap-4">
             <ZoomIn size={18} className="text-gray-400" />
             <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-stone-900" />
          </div>
          <div className="flex gap-2 text-xs text-gray-400 justify-center"><Move size={12} /> Drag image to adjust position</div>
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={performCrop} className="flex-1 py-3 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-black shadow-lg">Apply Crop</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- UPDATED TYPE DATA STICKER ---
type StickerData = {
  id: number;
  type: 'emoji' | 'icon'; // Bisa emoji text atau icon component
  content: string; // Emoji character atau nama icon
  x: number;
  y: number;
};

export default function RetroMinimalist() {
  // --- STATE ---
  const [name, setName] = useState("Your Name");
  const [message, setMessage] = useState("Happy Birthday!");
  const [header, setHeader] = useState("RETRO CARD");
  const [subheader, setSubheader] = useState("Customizable 8-Bit Greeting Card");
  const [editingHeader, setEditingHeader] = useState(false);
  const [editingSubheader, setEditingSubheader] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState("");
  const [themeBorder, setThemeBorder] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // State Cropping
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  
  // State Sticker
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [draggingSticker, setDraggingSticker] = useState<number | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // --- CONFIG ---
  const themeOptions = [
    { name: "Classic DMG", file: "/borders/dmg.png", id: "dmg", color: "#9ca3af", aspect: "aspect-[3/4]", cropRatio: 1.1 }, 
    { name: "Pocket Red", file: "/borders/pocket.png", id: "pocket", color: "#ef4444", aspect: "aspect-[3/4]", cropRatio: 1.1 }, 
    { name: "Color Purple", file: "/borders/color.png", id: "color", color: "#a855f7", aspect: "aspect-[3/4]", cropRatio: 1.1 }, 
    { name: "Advance Blue", file: "/borders/gba.png", id: "gba", color: "#3b82f6", aspect: "aspect-[3/2]", cropRatio: 1.5 }, 
  ];

  // List Pilihan Sticker (Campuran Emoji & Icon)
  const stickerOptions = [
    // Emojis
    { type: 'emoji', content: "🎂" },
    { type: 'emoji', content: "🎉" },
    { type: 'emoji', content: "🎈" },
    { type: 'emoji', content: "🎁" },
    { type: 'emoji', content: "🍰" },
    { type: 'emoji', content: "🕯️" },
    { type: 'emoji', content: "😎" },
    { type: 'emoji', content: "🤓" },
    { type: 'emoji', content: "🤖" },
    { type: 'emoji', content: "👾" },
    { type: 'emoji', content: "👻" },
    { type: 'emoji', content: "👽" },
    
    // Icons
    { type: 'icon', content: "Ghost" },
    { type: 'icon', content: "Gamepad2" },
    { type: 'icon', content: "Zap" },
    { type: 'icon', content: "Crown" },
    { type: 'icon', content: "Rocket" },
    { type: 'icon', content: "Trophy" },
    { type: 'icon', content: "Skull" },
    { type: 'icon', content: "Star" },
    { type: 'icon', content: "Heart" },
    { type: 'icon', content: "PartyPopper" },
    { type: 'icon', content: "Flame" },
    { type: 'icon', content: "Sun" },
    { type: 'icon', content: "Moon" },
    { type: 'icon', content: "CloudRain" },
    { type: 'icon', content: "Snowflake" },
    { type: 'icon', content: "Camera" },
    { type: 'icon', content: "Headphones" },
    { type: 'icon', content: "ThumbsUp" },
    { type: 'icon', content: "Coffee" },
    { type: 'icon', content: "Pizza" },
  ];

  const activeTheme = themeOptions.find(t => t.file === themeBorder);
  const currentCropRatio = activeTheme ? activeTheme.cropRatio : (16/9); 
  const currentCardAspect = activeTheme ? activeTheme.aspect : "aspect-auto";

  // --- HANDLERS ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setTempImageSrc(localUrl);
    setCropModalOpen(true);
    e.target.value = "";
  };

  const handleCropComplete = (croppedUrl: string) => {
    setImageUrl(croppedUrl);
    setCropModalOpen(false);
    setTempImageSrc(null);
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setMusicUrl(localUrl);
  };

  // --- STICKER LOGIC ---
  const addSticker = (option: { type: string, content: string }) => {
    const newSticker: StickerData = {
      id: Date.now(),
      type: option.type as 'emoji' | 'icon',
      content: option.content,
      x: 100, // Default posisi agar terlihat di tengah
      y: 100, 
    };
    setStickers([...stickers, newSticker]);
  };

  const removeSticker = (id: number) => {
    setStickers(stickers.filter((s) => s.id !== id));
  };

  const handleStickerMouseDown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    setDraggingSticker(id);
  };

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (draggingSticker === null || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;

    setStickers((prevStickers) => 
      prevStickers.map((s) => 
        s.id === draggingSticker ? { ...s, x: x - 20, y: y - 20 } : s 
      )
    );
  };

  const handleCardMouseUp = () => {
    setDraggingSticker(null);
  };

  const handleDownload = useCallback(async () => {
    if (cardRef.current === null) return;
    setIsDownloading(true);
    try {
      // Hapus cacheBust: true
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = `card-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan gambar.");
    } finally {
      setIsDownloading(false);
    }
  }, [name]);

  return (
    <div className={`min-h-screen bg-[#FAFAF9] text-[#1C1917] flex flex-col lg:flex-row font-sans selection:bg-[#D97706] selection:text-white ${dmSans.className}`}
         onMouseUp={handleCardMouseUp} // Global mouse up untuk stop drag
    >
      
      {/* CROP MODAL */}
      {cropModalOpen && tempImageSrc && (
        <ImageCropper 
            src={tempImageSrc} 
            aspectRatio={currentCropRatio} 
            onCrop={handleCropComplete} 
            onCancel={() => setCropModalOpen(false)} 
        />
      )}

      {/* --- LEFT PANEL: EDITOR --- */}
      <div className="w-full lg:w-[420px] flex-shrink-0 bg-white border-r border-stone-200 flex flex-col h-auto lg:h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        
        {/* Header Editor */}
        <div className="p-6 border-b border-stone-100 sticky top-0 bg-white/95 backdrop-blur z-10 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-[#1C1917] transition-colors uppercase tracking-widest group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#1C1917] rounded-xl flex items-center justify-center text-white shadow-lg">
                <LayoutTemplate size={20} className="text-amber-400" />
             </div>
             <div>
                <h1 className={`text-xl font-bold text-[#1C1917] ${playfair.className}`}>Retro Editor</h1>
                <p className="text-xs text-stone-500 font-medium">Customize your 8-bit moment.</p>
             </div>
          </div>
        </div>

        {/* Scrollable Form Controls */}
        <div className="p-6 space-y-8 flex-grow overflow-y-auto custom-scrollbar">
          
          {/* Theme Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest">
               <Smartphone size={14} /> Console Style
            </div>
            <div className="grid grid-cols-1 gap-2">
               <button onClick={() => setThemeBorder(null)} className={`relative px-4 py-3 rounded-xl border-2 transition-all text-left flex items-center gap-3 group ${themeBorder === null ? "bg-[#FAFAF9] border-[#1C1917]" : "bg-white border-stone-100 hover:border-stone-300"}`}>
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center border border-stone-300 shadow-sm">{themeBorder === null && <Check size={14} className="text-[#1C1917]" />}</div>
                  <div><span className={`block text-sm font-bold ${themeBorder === null ? "text-[#1C1917]" : "text-stone-600"}`}>Clean Warm</span><span className="text-[10px] text-stone-400 font-medium">Modern minimalist style</span></div>
               </button>
               <div className="grid grid-cols-2 gap-2">
                   {themeOptions.map((t) => (
                     <button key={t.id} onClick={() => setThemeBorder(t.file)} className={`relative px-3 py-3 rounded-xl border-2 transition-all text-left flex items-center gap-2 group ${themeBorder === t.file ? "bg-[#FAFAF9] border-amber-400 shadow-sm" : "bg-white border-stone-100 hover:border-stone-300"}`}>
                       <div className="w-4 h-4 rounded-full shadow-sm border border-black/10" style={{ backgroundColor: t.color }} />
                       <span className={`text-xs font-bold ${themeBorder === t.file ? "text-[#1C1917]" : "text-stone-500"}`}>{t.name}</span>
                       {themeBorder === t.file && <Check size={12} className="absolute top-2 right-2 text-amber-500" />}
                     </button>
                   ))}
               </div>
            </div>
          </div>

          <div className="w-full h-px bg-stone-100" />

          {/* Text Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest"><Type size={14} /> Personalize Text</div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 ml-1">Recipient Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-stone-400" placeholder="Enter name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 ml-1">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-[#1C1917] font-medium h-24 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-stone-400" placeholder="Write a warm message..." />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-stone-100" />

          {/* Media Assets */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest"><ImageIcon size={14} /> Media & Audio</div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => document.getElementById("uploadImageInput")?.click()} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-stone-300 hover:bg-stone-50 hover:border-amber-400 transition-all group bg-white">
                <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center text-stone-500 group-hover:text-amber-600 transition-colors"><Upload size={18} /></div>
                <span className="text-xs font-bold text-stone-500 group-hover:text-stone-800">Change Photo</span>
              </button>
              <div className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-stone-300 hover:bg-stone-50 hover:border-amber-400 transition-all group overflow-hidden bg-white cursor-pointer">
                <input type="file" accept="audio/*" onChange={handleMusicUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" title="Upload Music" />
                <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center text-stone-500 group-hover:text-amber-600 transition-colors"><Music size={18} /></div>
                <span className="text-xs font-bold text-stone-500 group-hover:text-stone-800">Add BGM</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-stone-100" />

          {/* --- STICKER SELECTOR (UPDATED) --- */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest"><Smile size={14} /> Stickers</div>
             <div className="grid grid-cols-6 gap-2">
                {stickerOptions.map((opt, index) => {
                  // Render preview button based on type
                  const IconComp = opt.type === 'icon' ? STICKER_ICONS[opt.content] : null;

                  return (
                    <button 
                      key={index}
                      onClick={() => addSticker(opt)}
                      className="aspect-square flex items-center justify-center bg-stone-50 rounded-lg hover:bg-amber-100 hover:scale-110 transition-all shadow-sm border border-stone-100"
                    >
                      {opt.type === 'emoji' ? (
                        <span className="text-xl">{opt.content}</span>
                      ) : (
                        // Render icon if exists
                        IconComp ? <IconComp size={20} className="text-stone-600" /> : null
                      )}
                    </button>
                  );
                })}
             </div>
             <p className="text-[10px] text-stone-400 italic">Click to add stickers. Drag them around your card.</p>
          </div>

        </div>

        {/* Save Action */}
        <div className="p-6 border-t border-stone-100 bg-white">
          <button onClick={handleDownload} disabled={isDownloading} className="w-full flex items-center justify-center gap-2 bg-[#1C1917] text-white py-3.5 rounded-full font-bold text-sm hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-stone-200">
            {isDownloading ? <><Loader2 size={18} className="animate-spin text-amber-400" /><span>Processing...</span></> : <><Download size={18} className="text-amber-400" /><span>Save Card</span></>}
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW STAGE --- */}
      <div className="flex-grow bg-[#F3F4F6] relative flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden">
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none mix-blend-multiply" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-stone-200/40 rounded-full blur-[100px] -z-10" />

        <div className="absolute top-8 right-8 flex items-center gap-2 bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-white/50 shadow-sm z-30">
           <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
           <span className="text-xs font-bold text-stone-500 tracking-wide uppercase">Live Preview</span>
        </div>

        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
            
            {/* === MAIN CARD CONTAINER === */}
            <div
                ref={cardRef} 
                onMouseMove={handleCardMouseMove} // Handle drag di area ini
                className={`relative w-full max-w-2xl transition-all duration-500 ${themeBorder ? "drop-shadow-2xl" : "shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl bg-white"} ${currentCardAspect}`}
                style={{
                    backgroundImage: themeBorder ? `url(${themeBorder})` : "none",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    padding: themeBorder ? "12%" : "0", 
                }}
            >
                {/* Content Container */}
                <div className={`w-full h-full overflow-hidden transition-all duration-300 flex flex-col relative ${themeBorder ? "bg-[#9bbc0f] p-4 rounded shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] border-2 border-[#8bac0f]" : "bg-white rounded-2xl p-10 border border-stone-100"}`}>
                    
                    {/* --- RENDER STICKERS HERE (UPDATED) --- */}
                    {stickers.map(s => {
                       const IconComp = s.type === 'icon' ? STICKER_ICONS[s.content] : null;

                       return (
                         <div
                           key={s.id}
                           className="absolute cursor-move select-none z-50 group/sticker hover:scale-105 transition-transform"
                           style={{ 
                              left: s.x, 
                              top: s.y,
                           }}
                           onMouseDown={(e) => handleStickerMouseDown(e, s.id)}
                         >
                            {/* Render Konten Stiker */}
                            {s.type === 'emoji' ? (
                                <span style={{ fontSize: '40px', lineHeight: 1, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{s.content}</span>
                            ) : (
                                IconComp && <IconComp size={48} className="text-stone-800 drop-shadow-md fill-white/20" strokeWidth={1.5} />
                            )}

                            {/* Tombol Hapus Kecil */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeSticker(s.id); }}
                              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md border border-white opacity-0 group-hover/sticker:opacity-100 transition-opacity hover:scale-110"
                            >
                               <X size={10} />
                            </button>
                         </div>
                       );
                    })}

                    {/* Editable Header */}
                    <div className="flex flex-col items-center gap-1 mb-6 flex-shrink-0 z-10 relative">
                        <div className="flex items-center justify-center gap-2 group w-full">
                            {editingHeader ? (
                                <input value={header} onChange={(e) => setHeader(e.target.value)} onBlur={() => setEditingHeader(false)} autoFocus className={`text-center bg-transparent border-b border-black/20 outline-none w-full text-2xl font-bold ${themeBorder ? "text-[#0f380f]" : "text-[#1C1917]"}`} style={{ fontFamily: themeBorder ? "monospace" : "inherit" }} />
                            ) : (
                                <h2 onClick={() => setEditingHeader(true)} className={`text-2xl font-bold cursor-pointer hover:opacity-60 transition flex items-center gap-2 ${themeBorder ? "text-[#0f380f] font-mono tracking-widest" : "text-[#1C1917] tracking-tight"}`}>
                                    {header} <Pencil size={14} className="opacity-0 group-hover:opacity-40 text-stone-400" />
                                </h2>
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-2 group w-full">
                            {editingSubheader ? (
                                <input value={subheader} onChange={(e) => setSubheader(e.target.value)} onBlur={() => setEditingSubheader(false)} autoFocus className={`text-center bg-transparent border-b border-black/20 outline-none w-full text-sm font-medium ${themeBorder ? "text-[#306230]" : "text-stone-500"}`} style={{ fontFamily: themeBorder ? "monospace" : "inherit" }} />
                            ) : (
                                <p onClick={() => setEditingSubheader(true)} className={`text-sm font-medium cursor-pointer hover:opacity-60 transition flex items-center gap-2 ${themeBorder ? "text-[#306230] font-mono uppercase" : "text-stone-500"}`}>
                                    {subheader} <Pencil size={12} className="opacity-0 group-hover:opacity-40 text-stone-400" />
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Image Area */}
                    <div onClick={() => document.getElementById("uploadImageInput")?.click()} className={`relative w-full flex-grow rounded-xl overflow-hidden cursor-pointer group mb-6 transition-all duration-300 ${themeBorder ? "border-4 border-[#0f380f] bg-[#8bac0f]/50 shadow-inner" : "bg-stone-50 border border-stone-100 hover:border-amber-200"}`} style={{ aspectRatio: currentCropRatio }}>
                        {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageUrl} alt="Content" className={`object-cover w-full h-full ${themeBorder ? "grayscale contrast-125 brightness-90 sepia-[.3] pixelated" : ""}`} style={{ imageRendering: themeBorder ? "pixelated" : "auto" }} />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300 gap-3 h-40 md:h-auto"><ImageIcon size={32} className={themeBorder ? "text-[#0f380f] opacity-50" : ""} /><span className={`text-xs font-bold uppercase tracking-widest ${themeBorder ? "text-[#0f380f] opacity-50" : "text-stone-400"}`}>Select Image</span></div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"><span className="text-white text-xs font-bold px-4 py-2 rounded-full border border-white/30 bg-black/20">Crop / Change</span></div>
                    </div>
                    <input type="file" id="uploadImageInput" accept="image/*" onChange={handleImageUpload} className="hidden" />

                    {/* Message Area */}
                    <div className={`p-4 rounded-xl text-center transition-colors flex-shrink-0 relative z-10 ${themeBorder ? "border-2 border-[#0f380f] bg-[#8bac0f]/10" : "bg-stone-50 border border-stone-100"}`}>
                        <h3 className={`text-lg font-bold mb-1 ${themeBorder ? "text-[#0f380f] font-mono tracking-wider" : "text-[#1C1917]"}`}>{name}</h3>
                        <p className={`text-sm font-medium leading-relaxed ${themeBorder ? "text-[#306230] font-mono" : "text-stone-600"}`}>{message}</p>
                    </div>

                    {/* Music Player */}
                    {musicUrl && (
                        <div className={`mt-4 flex items-center justify-center gap-3 p-2.5 rounded-full mx-auto w-fit flex-shrink-0 relative z-10 ${themeBorder ? "bg-[#0f380f]/10 border border-[#0f380f]/20" : "bg-white border border-stone-200 shadow-sm"}`}>
                             <div className={`p-1.5 rounded-full animate-spin-slow ${themeBorder ? "bg-[#0f380f] text-[#9bbc0f]" : "bg-amber-100 text-amber-600"}`}><Music size={14} /></div>
                             <audio controls autoPlay className="h-6 w-32 opacity-60 scale-90 origin-left" style={{ filter: themeBorder ? "sepia(1) hue-rotate(60deg) saturate(5)" : "none" }}><source src={musicUrl} /></audio>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 text-stone-400 text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">{themeBorder ? "RETRO_FRAME_ACTIVE" : "MODERN_CLEAN_ACTIVE"}</div>
        </div>
      </div>
    </div>
  );
}