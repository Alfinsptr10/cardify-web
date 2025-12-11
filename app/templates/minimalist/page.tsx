"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { 
  Playfair_Display, 
  DM_Sans, 
  Cormorant_Garamond, 
  Great_Vibes, 
  Montserrat, 
  Cinzel 
} from "next/font/google";
import { toPng } from "html-to-image";
import { 
  Type, 
  Calendar, 
  MessageSquare, 
  Palette, 
  Upload, 
  Image as ImageIcon,
  Download,
  Loader2,
  ArrowLeft,
  Layout,
  X,
  ZoomIn,
  Move,
  Check,
  PaintBucket
} from "lucide-react";

// --- KONFIGURASI FONT PREMIUM ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"] });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600"] });

// Mapping Font untuk State
const fontMap: Record<string, any> = {
  playfair: { name: "Elegant", font: playfair },
  cormorant: { name: "Classic", font: cormorant },
  montserrat: { name: "Modern", font: montserrat },
  greatVibes: { name: "Script", font: greatVibes },
  cinzel: { name: "Royal", font: cinzel },
  dmSans: { name: "Minimal", font: dmSans },
};

// --- KOMPONEN IMAGE CROPPER (Reused) ---
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

    // High Res Output
    const baseWidth = 1200;
    canvas.width = baseWidth;
    canvas.height = baseWidth / aspectRatio; 

    ctx.fillStyle = "#FAFAF9"; 
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0 bg-white z-10">
          <h3 className="font-bold text-lg flex items-center gap-2 text-stone-800"><ImageIcon size={18}/> Adjust Photo</h3>
          <button onClick={onCancel}><X size={20} className="text-gray-400 hover:text-black" /></button>
        </div>
        <div className="flex-grow bg-stone-100 flex items-center justify-center p-8 overflow-hidden relative">
            <div 
              ref={containerRef}
              className="relative overflow-hidden cursor-move shadow-2xl ring-4 ring-white" 
              style={{ width: '100%', aspectRatio: aspectRatio, maxWidth: '500px' }}
              onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imageRef} src={src} alt="Crop" onLoad={onImageLoad} className="absolute top-1/2 left-1/2 origin-center transition-transform duration-75 select-none" style={{ ...imgStyle, transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})` }} draggable={false} />
              <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 opacity-30"><div className="border-r border-b border-white/80"></div><div className="border-r border-b border-white/80"></div><div className="border-b border-white/80"></div><div className="border-r border-b border-white/80"></div><div className="border-r border-b border-white/80"></div><div className="border-b border-white/80"></div><div className="border-r border-white/80"></div><div className="border-r border-white/80"></div><div></div></div>
            </div>
        </div>
        <div className="p-6 space-y-4 flex-shrink-0 bg-white z-20 border-t border-gray-100">
          <div className="flex items-center gap-4">
             <ZoomIn size={18} className="text-gray-400" />
             <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-800" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 py-3 rounded-lg border border-gray-200 font-bold text-sm hover:bg-gray-50 text-stone-600">Cancel</button>
            <button onClick={performCrop} className="flex-1 py-3 rounded-lg bg-stone-900 text-white font-bold text-sm hover:bg-black shadow-lg">Apply Crop</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MinimalistEditor() {
  // --- STATE ---
  const [name, setName] = useState("Alexander Hamilton");
  const [title, setTitle] = useState("You Are Invited");
  const [message, setMessage] = useState("Join us for an evening of cocktails, dinner, and dancing under the stars to celebrate this special moment.");
  const [date, setDate] = useState("SATURDAY, OCT 10 • 5 PM");
  const [location, setLocation] = useState("The Grand Ballroom, Jakarta"); 
  
  const [accentColor, setAccentColor] = useState("#1C1917"); // Default Stone-900 (Text Accent)
  const [cardColor, setCardColor] = useState("#FAFAF9"); // Default Warm White (Background)
  const [selectedFont, setSelectedFont] = useState("playfair"); // Default Font
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Crop State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Palet Warna Aksen (Teks)
  const accentPresets = [
    { name: "Charcoal", value: "#1C1917" },
    { name: "Olive", value: "#57534e" },
    { name: "Rust", value: "#7f1d1d" },
    { name: "Navy", value: "#1e3a8a" },
    { name: "Emerald", value: "#065f46" },
    { name: "Gold", value: "#b45309" },
  ];

  // Palet Warna Kartu (Background)
  const bgPresets = [
    { name: "Cream", value: "#FAFAF9" },
    { name: "White", value: "#FFFFFF" },
    { name: "Mist", value: "#F3F4F6" },
    { name: "Rose", value: "#FFF1F2" },
    { name: "Sky", value: "#F0F9FF" },
    { name: "Dark", value: "#1C1917" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setTempImageSrc(url);
    setCropModalOpen(true);
    e.target.value = "";
  };

  const handleCropComplete = (croppedUrl: string) => {
    setImagePreview(croppedUrl);
    setCropModalOpen(false);
    setTempImageSrc(null);
  };

  const handleDownload = useCallback(async () => {
    if (cardRef.current === null) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = `invitation-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err); 
      alert("Gagal mengunduh gambar.");
    } finally {
      setIsDownloading(false);
    }
  }, [name]);

  // Helper untuk menentukan warna teks dasar berdasarkan background
  const isDarkBg = cardColor === "#1C1917";
  const baseTextColor = isDarkBg ? "text-stone-300" : "text-stone-600";
  const dividerColor = isDarkBg ? "bg-stone-700" : "bg-stone-300";
  const labelColor = isDarkBg ? "text-stone-500" : "text-stone-400";
  const finalAccentColor = isDarkBg && accentColor === "#1C1917" ? "#FFFFFF" : accentColor;

  return (
    <div className={`h-screen w-full bg-[#FAFAF9] text-[#1C1917] flex flex-col xl:flex-row relative selection:bg-stone-200 selection:text-black overflow-hidden ${dmSans.className}`}>
      
      {/* CROP MODAL */}
      {cropModalOpen && tempImageSrc && (
        <ImageCropper 
            src={tempImageSrc} 
            aspectRatio={1.5} 
            onCrop={handleCropComplete} 
            onCancel={() => setCropModalOpen(false)} 
        />
      )}

      {/* ================== LEFT PANEL: EDITOR ================== */}
      <div className="w-full xl:w-[420px] bg-white border-r border-stone-200 flex flex-col h-full z-20 shadow-xl flex-shrink-0">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 bg-white/95 backdrop-blur z-10 flex-shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-widest mb-4">
             <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center border border-stone-200 text-stone-700">
                <Layout size={20} />
             </div>
             <div>
                <h2 className={`text-xl font-bold text-stone-900 ${playfair.className}`}>Minimalist Editor</h2>
                <p className="text-xs text-stone-500 font-medium">Timeless elegance.</p>
             </div>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8 bg-white"> 
          
          {/* Content Inputs */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
               <Type size={14} /> Content Details
            </h3>
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 ml-1">Event Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all placeholder:text-stone-400" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 ml-1">Recipient / Honoree</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all placeholder:text-stone-400" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-stone-600 ml-1">Date & Time</label>
                     <div className="relative">
                        <Calendar size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                        <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all" />
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-stone-600 ml-1">Location</label>
                     <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all" />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 ml-1">Message</label>
                  <div className="relative">
                     <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                     <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all min-h-[100px] resize-none leading-relaxed" />
                  </div>
               </div>
            </div>
          </div>

          <div className="w-full h-px bg-stone-100" />

          {/* Visual Inputs */}
          <div className="space-y-5">
             <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
               <Palette size={14} /> Aesthetic
            </h3>
            
            {/* Image Upload */}
            <div className="p-4 rounded-xl border-2 border-dashed border-stone-200 hover:bg-stone-50 hover:border-stone-400 transition-all bg-white relative group overflow-hidden cursor-pointer flex items-center justify-center gap-3 mb-4" onClick={() => document.getElementById("uploadMinImg")?.click()}>
              <input type="file" id="uploadMinImg" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-white group-hover:shadow-md transition-all">
                  <Upload size={18} />
              </div>
              <span className="text-xs font-bold text-stone-500 group-hover:text-stone-900 transition-colors uppercase tracking-wide">Upload Photo</span>
            </div>

            <div className="space-y-4">
              {/* Card Background Color */}
              <div className="space-y-2">
                 <label className="text-xs font-bold text-stone-600 ml-1 flex items-center gap-1"><PaintBucket size={12}/> Card Background</label>
                 <div className="flex gap-2 flex-wrap">
                    {bgPresets.map((c) => (
                       <button
                          key={c.value}
                          onClick={() => setCardColor(c.value)}
                          className={`w-8 h-8 rounded-full border border-stone-200 shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${cardColor === c.value ? "ring-2 ring-offset-1 ring-stone-400 scale-110" : ""}`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                       >
                          {cardColor === c.value && <Check size={12} className={c.value === '#1C1917' ? "text-white" : "text-black"} />}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Text Accent Color */}
              <div className="space-y-2">
                 <label className="text-xs font-bold text-stone-600 ml-1">Text Accent Color</label>
                 <div className="flex gap-2 flex-wrap">
                    {accentPresets.map((c) => (
                       <button
                          key={c.value}
                          onClick={() => setAccentColor(c.value)}
                          className={`w-6 h-6 rounded-full border border-stone-200 shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${accentColor === c.value ? "ring-2 ring-offset-1 ring-stone-400" : ""}`}
                          style={{ backgroundColor: c.value }}
                       >
                          {accentColor === c.value && <Check size={10} className="text-white" />}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Font Selection Grid */}
              <div className="space-y-2">
                 <label className="text-xs font-bold text-stone-600 ml-1">Typography Style</label>
                 <div className="grid grid-cols-2 gap-2">
                    {Object.keys(fontMap).map((key) => (
                       <button
                          key={key}
                          onClick={() => setSelectedFont(key)}
                          className={`flex items-center justify-between px-3 py-2 text-xs border rounded-lg transition-all ${
                            selectedFont === key 
                            ? "bg-stone-900 text-white border-stone-900" 
                            : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                          }`}
                       >
                          <span className={fontMap[key].font.className}>{fontMap[key].name}</span>
                          {selectedFont === key && <Check size={12} />}
                       </button>
                    ))}
                 </div>
              </div>
            </div>
          </div>
          <div className="h-20 xl:hidden"></div> 
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-stone-100 bg-white flex-shrink-0 z-20">
          <button onClick={handleDownload} disabled={isDownloading} className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3.5 rounded-full font-bold text-sm hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-stone-200">
            {isDownloading ? <><Loader2 size={18} className="animate-spin" /> Generating...</> : <><Download size={18} /> Export Card</>}
          </button>
        </div>
      </div>

      {/* ================== RIGHT PANEL: PREVIEW STAGE ================== */}
      <div className="flex-1 h-full bg-[#E5E5E5] relative flex flex-col items-center justify-center p-8 xl:p-16 overflow-y-auto overflow-x-hidden">
        
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-multiply fixed" />
        
        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 my-auto shadow-2xl">
            
            {/* --- CARD CONTAINER (HORIZONTAL 3:2 RATIO) --- */}
            <div 
              ref={cardRef} 
              className={`relative w-full max-w-[600px] overflow-hidden flex flex-row shadow-2xl`} 
              style={{
                 aspectRatio: '3/2',
                 backgroundColor: cardColor, // Warna Latar Kartu
                 backgroundImage: cardColor === '#1C1917' ? 'none' : `url("https://www.transparenttextures.com/patterns/cream-paper.png")`
              }}
            >
                {/* 1. LEFT IMAGE (Width 45%) */}
                <div className="relative w-[45%] h-full bg-stone-200 overflow-hidden border-r border-white/10">
                    {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagePreview} alt="Preview" className="object-cover w-full h-full grayscale-[0.1] contrast-[1.05]" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-2 bg-black/5">
                           <ImageIcon size={32} />
                           <span className="text-xs uppercase tracking-widest font-bold">No Photo</span>
                        </div>
                    )}
                </div>

                {/* 2. TEXT CONTENT (Width 55%) */}
                <div className="w-[55%] h-full px-8 py-10 flex flex-col items-center text-center justify-between">
                    
                    <div className="space-y-5 w-full">
                       {/* Header */}
                       <div className="space-y-1">
                           <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${labelColor} ${dmSans.className}`}>
                              {title}
                           </p>
                           <h1 
                              className={`text-3xl md:text-4xl leading-tight ${fontMap[selectedFont].font.className} font-medium`} 
                              style={{ color: finalAccentColor }}
                           >
                              {name}
                           </h1>
                       </div>

                       {/* Divider */}
                       <div className={`w-10 h-[1px] mx-auto opacity-50 ${dividerColor}`} />

                       {/* Message */}
                       <p className={`${baseTextColor} text-[10px] md:text-xs leading-relaxed ${dmSans.className}`}>
                           {message}
                       </p>
                    </div>

                    {/* Footer Info */}
                    <div className="space-y-2 w-full mt-auto">
                       <div className={`py-3 border-t border-b ${isDarkBg ? 'border-stone-800' : 'border-stone-200'} w-full flex flex-col justify-center items-center gap-1 text-[10px] font-bold tracking-widest uppercase ${isDarkBg ? 'text-stone-500' : 'text-stone-500'} ${dmSans.className}`}>
                          <span>{date}</span>
                          <span className={`text-[9px] font-normal ${isDarkBg ? 'text-stone-600' : 'text-stone-400'}`}>{location}</span>
                       </div>
                       {/* Signature */}
                       <p className={`text-[8px] uppercase tracking-widest ${isDarkBg ? 'text-stone-700' : 'text-stone-300'} ${dmSans.className} pt-2`}>
                          Invited with Love
                       </p>
                    </div>

                </div>
            </div>

            <div className="mt-8 text-stone-400 text-xs font-bold tracking-widest uppercase opacity-60">
                Preview Mode: Elegant Landscape
            </div>

        </div>
      </div>
    </div>
  );
}