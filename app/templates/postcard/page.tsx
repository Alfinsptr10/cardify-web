"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { 
  Playfair_Display, 
  DM_Sans, 
  Caveat, 
  Courier_Prime, 
  Homemade_Apple 
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
  Stamp,
  MapPin,
  Mail,
  X,
  ZoomIn,
  Move
} from "lucide-react";

// --- KONFIGURASI FONT VINTAGE ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] }); // Handwriting 1
const homemade = Homemade_Apple({ subsets: ["latin"], weight: ["400"] }); // Handwriting 2
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"] }); // Typewriter

// --- KOMPONEN IMAGE CROPPER (Sama seperti Minimalist) ---
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

    const baseWidth = 1200;
    canvas.width = baseWidth;
    canvas.height = baseWidth / aspectRatio; 

    ctx.fillStyle = "#F3F2ED"; 
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
        <div className="flex-grow bg-[#F3F2ED] flex items-center justify-center p-8 overflow-hidden relative">
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

export default function PostcardEditor() {
  // --- STATE ---
  const [recipient, setRecipient] = useState("Dear Sarah,");
  const [message, setMessage] = useState("Sending you lots of love and sunshine from my favorite place! Wish you were here to see this view.");
  const [addressName, setAddressName] = useState("Sarah Jenkins");
  const [addressLine1, setAddressLine1] = useState("123 Maple Street");
  const [addressLine2, setAddressLine2] = useState("New York, NY 10001");
  const [date, setDate] = useState("14 FEB 2025");
  
  const [inkColor, setInkColor] = useState("#1e293b"); // Slate 800
  const [fontStyle, setFontStyle] = useState("hand1"); // hand1 | hand2 | type
  const [paperTexture, setPaperTexture] = useState("clean"); // clean | vintage
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Crop State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const fontMap: any = {
    hand1: { class: caveat.className, name: "Casual" },
    hand2: { class: homemade.className, name: "Script" },
    type: { class: courier.className, name: "Typewriter" },
  };

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
      link.download = `postcard-${addressName.split(" ")[0].toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh gambar.");
    } finally {
      setIsDownloading(false);
    }
  }, [addressName]);

  return (
    <div className={`h-screen w-full bg-[#E8E6E1] text-[#1C1917] flex flex-col xl:flex-row relative selection:bg-amber-200 selection:text-black overflow-hidden ${dmSans.className}`}>
      
      {/* CROP MODAL */}
      {cropModalOpen && tempImageSrc && (
        <ImageCropper 
            src={tempImageSrc} 
            // Rasio gambar di kiri adalah setengah dari 3:2 landscape -> roughly 3:4 portrait if half? 
            // Wait, card is 3:2. Left half is roughly square-ish or portrait depending on layout.
            // Let's assume Left Half is full cover. Since card is 600x400, left half is 300x400 (3:4 ratio).
            aspectRatio={0.75} 
            onCrop={handleCropComplete} 
            onCancel={() => setCropModalOpen(false)} 
        />
      )}

      {/* --- LEFT PANEL: EDITOR --- */}
      <div className="w-full xl:w-[420px] bg-white border-r border-stone-300 flex flex-col h-full z-20 shadow-xl flex-shrink-0">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-white/95 backdrop-blur z-10 flex-shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-widest mb-4">
             <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center border border-amber-200 text-amber-700">
                <Mail size={20} />
             </div>
             <div>
                <h2 className={`text-xl font-bold text-stone-900 ${playfair.className}`}>Postcard Editor</h2>
                <p className="text-xs text-stone-500 font-medium">Send a warm hello.</p>
             </div>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8 bg-white"> 
          
          {/* 1. Message Section */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
               <MessageSquare size={14} /> Message
            </h3>
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 ml-1">Greeting</label>
                  <input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all placeholder:text-stone-400" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 ml-1">Your Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all min-h-[120px] resize-none leading-relaxed" />
               </div>
            </div>
          </div>

          <div className="w-full h-px bg-stone-100" />

          {/* 2. Recipient Address */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
               <MapPin size={14} /> Recipient Address
            </h3>
            <div className="space-y-3">
               <input value={addressName} onChange={(e) => setAddressName(e.target.value)} placeholder="Full Name" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400" />
               <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Street Address" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400" />
               <input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="City, State, Zip" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400" />
            </div>
            
            <div className="flex items-center gap-4 mt-2">
                <div className="space-y-1 flex-1">
                   <label className="text-xs font-bold text-stone-600 ml-1">Postmark Date</label>
                   <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-3 text-stone-400" />
                      <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-amber-400" />
                   </div>
                </div>
            </div>
          </div>

          <div className="w-full h-px bg-stone-100" />

          {/* 3. Visuals */}
          <div className="space-y-5">
             <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
               <Palette size={14} /> Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
               {/* Image Upload */}
               <div className="p-4 rounded-xl border-2 border-dashed border-stone-300 hover:bg-stone-50 hover:border-amber-400 transition-all bg-white relative group overflow-hidden cursor-pointer h-full flex flex-col items-center justify-center text-center gap-3" onClick={() => document.getElementById("uploadPostcardImg")?.click()}>
                  <input type="file" id="uploadPostcardImg" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-all">
                     <Upload size={18} />
                  </div>
                  <span className="text-xs font-bold text-stone-500 group-hover:text-stone-900 transition-colors uppercase tracking-wide">Photo (Left)</span>
               </div>

               <div className="space-y-3">
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-stone-600 ml-1">Handwriting Style</label>
                     <div className="flex flex-col gap-1.5">
                        {['hand1', 'hand2', 'type'].map((f) => (
                           <button
                              key={f}
                              onClick={() => setFontStyle(f)}
                              className={`w-full py-1.5 px-3 text-xs text-left rounded-md border transition-all flex items-center justify-between ${fontStyle === f ? "bg-stone-800 text-white border-stone-800" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"}`}
                           >
                              <span className={fontMap[f].class}>{fontMap[f].name}</span>
                              {fontStyle === f && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
                <label className="text-xs font-bold text-stone-600">Ink Color:</label>
                <div className="flex gap-2">
                   {['#1e293b', '#1d4ed8', '#047857', '#b91c1c'].map(c => (
                      <button 
                        key={c} 
                        onClick={() => setInkColor(c)}
                        className={`w-6 h-6 rounded-full border border-stone-200 shadow-sm ${inkColor === c ? 'ring-2 ring-offset-2 ring-stone-400' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                   ))}
                </div>
            </div>
          </div>
          <div className="h-20 xl:hidden"></div> 
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-stone-100 bg-white flex-shrink-0 z-20">
          <button onClick={handleDownload} disabled={isDownloading} className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3.5 rounded-full font-bold text-sm hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-stone-200">
            {isDownloading ? <><Loader2 size={18} className="animate-spin" /> Stamping...</> : <><Download size={18} /> Send Postcard</>}
          </button>
        </div>
      </div>

      {/* ================== RIGHT PANEL: PREVIEW STAGE ================== */}
      <div className="flex-1 h-full bg-[#E8E6E1] relative flex flex-col items-center justify-center p-8 xl:p-16 overflow-y-auto overflow-x-hidden">
        
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none mix-blend-multiply fixed" />
        
        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 my-auto drop-shadow-2xl">
            
            {/* --- CARD CONTAINER (HORIZONTAL 3:2 RATIO) --- */}
            <div 
              ref={cardRef} 
              className={`relative w-full max-w-[700px] bg-[#FDFCF0] overflow-hidden flex flex-row`} 
              style={{
                 aspectRatio: '3/2',
                 backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`, // Tekstur Kertas
                 boxShadow: "0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1)"
              }}
            >
                {/* 1. LEFT SIDE: PHOTO (50%) */}
                <div className="w-1/2 h-full bg-stone-200 overflow-hidden relative border-r border-stone-300/50">
                    {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagePreview} alt="Preview" className="object-cover w-full h-full grayscale-[0.2] sepia-[0.3] contrast-[1.1]" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-3 bg-[#f0eee5]">
                           <div className="p-4 rounded-full border-2 border-dashed border-stone-300">
                              <ImageIcon size={32} />
                           </div>
                           <span className="text-xs uppercase tracking-widest font-bold opacity-50">Place Photo Here</span>
                        </div>
                    )}
                    {/* Vignette effect on photo */}
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none"></div>
                </div>

                {/* 2. RIGHT SIDE: MESSAGE & ADDRESS (50%) */}
                <div className="w-1/2 h-full relative p-6 flex flex-col">
                    
                    {/* Divider Vertical Center (Decor) */}
                    <div className="absolute left-[55%] top-[15%] bottom-[15%] w-[1px] bg-stone-300/50"></div>

                    {/* Header Row: Stamp & Postmark */}
                    <div className="h-[25%] w-full relative mb-2">
                       {/* Postmark */}
                       <div className="absolute top-0 right-16 opacity-70 transform -rotate-12">
                          <div className={`w-16 h-16 rounded-full border-2 border-stone-800 flex items-center justify-center text-[8px] font-bold text-stone-800 text-center leading-tight ${courier.className}`}>
                             {date}<br/>AIR MAIL
                          </div>
                          <div className="w-24 h-4 border-t-2 border-b-2 border-stone-800 absolute top-6 left-12 -z-10 wave-lines"></div>
                       </div>
                       
                       {/* Stamp Box */}
                       <div className="absolute top-0 right-0 w-12 h-14 bg-amber-50 border border-stone-300 shadow-sm flex items-center justify-center p-1">
                          <div className="w-full h-full border border-dashed border-stone-300 flex items-center justify-center bg-white/50">
                             <Stamp size={16} className="text-amber-700 opacity-50" />
                          </div>
                       </div>
                    </div>

                    {/* Content Row */}
                    <div className="flex-grow flex flex-row relative z-10">
                        {/* Message Area (Left side of right panel) */}
                        <div className="w-[55%] pr-4 flex flex-col">
                           <div className={`${fontMap[fontStyle].class} text-lg leading-snug`} style={{ color: inkColor }}>
                              <p className="mb-2">{recipient}</p>
                              <p className="text-base leading-snug opacity-90">{message}</p>
                           </div>
                        </div>

                        {/* Address Area (Right side of right panel) */}
                        <div className="w-[45%] pl-4 flex flex-col justify-center space-y-6 pt-8">
                           <div className="border-b border-stone-300 pb-1">
                              <p className={`text-xs ${courier.className} text-stone-800`}>{addressName}</p>
                           </div>
                           <div className="border-b border-stone-300 pb-1">
                              <p className={`text-xs ${courier.className} text-stone-800`}>{addressLine1}</p>
                           </div>
                           <div className="border-b border-stone-300 pb-1">
                              <p className={`text-xs ${courier.className} text-stone-800`}>{addressLine2}</p>
                           </div>
                        </div>
                    </div>

                    {/* Footer / Branding */}
                    <div className="mt-auto pt-2 text-center opacity-40">
                       <p className={`text-[8px] uppercase tracking-[0.2em] ${dmSans.className}`}>Cardify Post • Via Air Mail</p>
                    </div>

                </div>
            </div>

            <div className="mt-8 text-stone-500 text-xs font-bold tracking-widest uppercase opacity-70">
                Preview Mode: Classic Postcard
            </div>

        </div>
      </div>
    </div>
  );
}