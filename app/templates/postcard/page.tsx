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
  Move,
  Plane
} from "lucide-react";

// --- KONFIGURASI FONT VINTAGE ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] }); 
const homemade = Homemade_Apple({ subsets: ["latin"], weight: ["400"] }); 
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"] }); 

// --- KOMPONEN IMAGE CROPPER (Vintage Style) ---
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[#EFEEE9] rounded-sm w-full max-w-lg shadow-[8px_8px_0px_rgba(0,0,0,0.2)] border-2 border-stone-400 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b-2 border-stone-300 border-dashed flex justify-between items-center bg-[#E6E4dc]">
          <h3 className={`font-bold text-lg flex items-center gap-2 text-stone-700 ${courier.className} tracking-wide`}>
            <ImageIcon size={18}/> ADJUST PHOTO
          </h3>
          <button onClick={onCancel}><X size={20} className="text-stone-500 hover:text-red-500 transition-colors" /></button>
        </div>
        
        <div className="flex-grow bg-stone-200 flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] pointer-events-none" />
            
            <div 
              ref={containerRef}
              className="relative overflow-hidden cursor-move shadow-xl ring-4 ring-white" 
              style={{ width: '100%', aspectRatio: aspectRatio, maxWidth: '500px' }}
              onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imageRef} src={src} alt="Crop" onLoad={onImageLoad} className="absolute top-1/2 left-1/2 origin-center transition-transform duration-75 select-none sepia-[0.3]" style={{ ...imgStyle, transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})` }} draggable={false} />
              <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 opacity-30"><div className="border-r border-b border-white/80"></div><div className="border-r border-b border-white/80"></div><div className="border-b border-white/80"></div><div className="border-r border-b border-white/80"></div><div className="border-r border-b border-white/80"></div><div className="border-b border-white/80"></div><div className="border-r border-white/80"></div><div className="border-r border-white/80"></div><div></div></div>
            </div>
        </div>

        <div className="p-6 space-y-4 bg-[#EFEEE9] border-t-2 border-stone-300 border-dashed z-20">
          <div className="flex items-center gap-4 bg-white p-2 rounded border border-stone-300">
             <ZoomIn size={18} className="text-stone-400" />
             <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-600" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className={`flex-1 py-3 border-2 border-stone-400 text-stone-600 font-bold text-sm hover:bg-stone-200 transition-colors uppercase ${courier.className}`}>Discard</button>
            <button onClick={performCrop} className={`flex-1 py-3 bg-[#B45309] text-white font-bold text-sm hover:bg-[#92400e] shadow-md uppercase transition-colors ${courier.className}`}>Stamp It</button>
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
    hand1: { class: caveat.className, name: "Casual Pen" },
    hand2: { class: homemade.className, name: "Script Ink" },
    type: { class: courier.className, name: "Old Typewriter" },
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
    <div className={`h-screen w-full bg-[#3c3836] text-[#1C1917] flex flex-col xl:flex-row relative selection:bg-amber-200 selection:text-black overflow-hidden ${dmSans.className}`}>
      
      {/* STYLE UNTUK SCROLLBAR VINTAGE */}
      <style dangerouslySetInnerHTML={{__html: `
        .vintage-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .vintage-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .vintage-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d6d3c9; /* Stone-300 matches border */
          border-radius: 4px;
          border: 2px solid #EFEEE9; /* Matches Sidebar BG */
        }
        .vintage-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #B45309; /* Amber-700 matches theme accent */
        }
        /* Firefox */
        .vintage-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d6d3c9 #EFEEE9;
        }
      `}} />

      {/* CROP MODAL */}
      {cropModalOpen && tempImageSrc && (
        <ImageCropper 
            src={tempImageSrc} 
            aspectRatio={0.75} 
            onCrop={handleCropComplete} 
            onCancel={() => setCropModalOpen(false)} 
        />
      )}

      {/* --- LEFT PANEL: POST OFFICE COUNTER (EDITOR) --- */}
      <div className="w-full xl:w-[420px] bg-[#EFEEE9] border-r border-[#d6d3c9] flex flex-col h-full z-20 shadow-[10px_0_30px_rgba(0,0,0,0.3)] flex-shrink-0 relative">
        
        {/* Paper Texture Overlay for Sidebar */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

        {/* Header */}
        <div className="p-6 border-b-2 border-dashed border-[#d6d3c9] bg-[#E6E4dc]/80 backdrop-blur z-10 flex-shrink-0 relative">
          <Link href="/" className={`inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-widest mb-4 ${courier.className}`}>
             <ArrowLeft size={14} /> Leave Post Office
          </Link>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded border-2 border-stone-300 flex items-center justify-center text-[#B45309] shadow-sm rotate-3">
                <Stamp size={24} />
             </div>
             <div>
                <h2 className={`text-xl font-bold text-stone-800 ${courier.className} tracking-tight uppercase`}>Postcard Dept.</h2>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Counter #03</p>
             </div>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-grow overflow-y-auto vintage-scrollbar p-6 space-y-8 relative z-10"> 
          
          {/* 1. Message Section */}
          <div className="bg-white p-4 rounded-sm border border-stone-200 shadow-sm relative">
            {/* Paper clip effect */}
            <div className="absolute -top-3 right-4 w-4 h-8 rounded-full border-2 border-stone-400 bg-transparent z-20 rotate-12"></div>

            <h3 className={`text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2 mb-4 ${courier.className}`}>
               <MessageSquare size={14} /> Write Message
            </h3>
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Greeting</label>
                  <input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full bg-[#f9f9f9] border-b-2 border-stone-200 px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#B45309] transition-colors placeholder:text-stone-300" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Body Text</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-[#f9f9f9] border-2 border-stone-200 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#B45309] transition-colors min-h-[100px] resize-none leading-relaxed" />
               </div>
            </div>
          </div>

          {/* 2. Recipient Address */}
          <div className="bg-white p-4 rounded-sm border border-stone-200 shadow-sm relative">
            <h3 className={`text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2 mb-4 ${courier.className}`}>
               <MapPin size={14} /> Destination
            </h3>
            <div className="space-y-3">
               <input value={addressName} onChange={(e) => setAddressName(e.target.value)} placeholder="Full Name" className="w-full bg-[#f9f9f9] border-b border-stone-200 px-2 py-2 text-sm font-medium focus:outline-none focus:border-[#B45309]" />
               <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Street Address" className="w-full bg-[#f9f9f9] border-b border-stone-200 px-2 py-2 text-sm font-medium focus:outline-none focus:border-[#B45309]" />
               <input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="City, State, Zip" className="w-full bg-[#f9f9f9] border-b border-stone-200 px-2 py-2 text-sm font-medium focus:outline-none focus:border-[#B45309]" />
            </div>
            
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-dashed border-stone-200">
                <div className="space-y-1 flex-1">
                   <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Date Stamp</label>
                   <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-2.5 text-stone-400" />
                      <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-stone-100 border border-stone-200 rounded pl-9 pr-3 py-2 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-[#B45309] text-stone-600" />
                   </div>
                </div>
            </div>
          </div>

          {/* 3. Visuals */}
          <div className="space-y-5">
             <h3 className={`text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2 ${courier.className}`}>
               <Palette size={14} /> Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
               {/* Image Upload */}
               <button 
                  onClick={() => document.getElementById("uploadPostcardImg")?.click()}
                  className="p-4 rounded border-2 border-dashed border-stone-400 hover:bg-[#e6e3da] hover:border-[#B45309] transition-all bg-[#f0eee9] relative group flex flex-col items-center justify-center text-center gap-2"
               >
                  <input type="file" id="uploadPostcardImg" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <Upload size={20} className="text-stone-500 group-hover:text-[#B45309]" />
                  <span className="text-[10px] font-bold text-stone-500 group-hover:text-stone-900 uppercase tracking-wide">Add Photo</span>
               </button>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Ink Style</label>
                  <div className="flex flex-col gap-1.5">
                     {['hand1', 'hand2', 'type'].map((f) => (
                        <button
                           key={f}
                           onClick={() => setFontStyle(f)}
                           className={`w-full py-1.5 px-3 text-xs text-left rounded-sm border transition-all flex items-center justify-between ${fontStyle === f ? "bg-stone-800 text-white border-stone-800 shadow-sm" : "bg-white text-stone-600 border-stone-300 hover:bg-stone-50"}`}
                        >
                           <span className={fontMap[f].class}>{fontMap[f].name}</span>
                           {fontStyle === f && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-3 pt-2 bg-white p-3 rounded border border-stone-200">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wide">Ink Color:</label>
                <div className="flex gap-2">
                   {['#1e293b', '#1d4ed8', '#047857', '#b91c1c'].map(c => (
                      <button 
                        key={c} 
                        onClick={() => setInkColor(c)}
                        className={`w-6 h-6 rounded-full border border-stone-200 shadow-sm transition-transform hover:scale-110 ${inkColor === c ? 'ring-2 ring-offset-2 ring-stone-400 scale-110' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                   ))}
                </div>
            </div>
          </div>
          <div className="h-20 xl:hidden"></div> 
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t-2 border-dashed border-stone-300 bg-[#E6E4dc] flex-shrink-0 z-20">
          <button onClick={handleDownload} disabled={isDownloading} className={`w-full flex items-center justify-center gap-2 bg-[#B45309] text-white py-4 font-bold text-sm hover:bg-[#92400e] transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none uppercase tracking-widest ${courier.className}`}>
            {isDownloading ? <><Loader2 size={18} className="animate-spin" /> Stamping...</> : <><Plane size={18} /> Send to Print</>}
          </button>
        </div>
      </div>

      {/* ================== RIGHT PANEL: VINTAGE DESK ================== */}
      <div className="flex-1 h-full relative flex flex-col items-center justify-center p-8 xl:p-16 overflow-y-auto overflow-x-hidden">
        
        {/* Background Desk Texture */}
        <div className="absolute inset-0 opacity-100 pointer-events-none fixed" style={{ 
            backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`, 
            backgroundColor: '#2b221e', // Dark wood color
            backgroundSize: '400px' 
        }} />
        
        {/* Ambient Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_20%,rgba(0,0,0,0.7)_100%)] pointer-events-none fixed" />
        
        <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-700 my-auto drop-shadow-2xl">
            
            {/* --- CARD CONTAINER (HORIZONTAL 3:2 RATIO) --- */}
            <div 
              ref={cardRef} 
              className={`relative w-full max-w-[750px] bg-[#FDFCF0] overflow-hidden flex flex-row`} 
              style={{
                 aspectRatio: '3/2',
                 backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`, // Tekstur Kertas
                 boxShadow: "0 2px 5px rgba(0,0,0,0.1), 0 15px 40px rgba(0,0,0,0.4)" // Realistic shadow
              }}
            >
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/rough-cloth.png")` }}></div>
                
                {/* Vintage Border Frame */}
                <div className="absolute inset-3 border-2 border-[#d6d3c9] pointer-events-none z-20 rounded-sm opacity-50"></div>

                {/* 1. LEFT SIDE: PHOTO (50%) */}
                <div className="w-1/2 h-full bg-[#eae8e0] overflow-hidden relative border-r border-[#d6d3c9]">
                    {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagePreview} alt="Preview" className="object-cover w-full h-full grayscale-[0.2] sepia-[0.3] contrast-[1.1] brightness-[0.95]" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-3 bg-[#f0eee5] p-10 text-center">
                           <div className="p-4 rounded-full border-2 border-dashed border-stone-300">
                              <ImageIcon size={32} />
                           </div>
                           <span className={`text-xs uppercase tracking-widest font-bold opacity-50 ${courier.className}`}>Photo Place</span>
                        </div>
                    )}
                    {/* Vignette effect on photo */}
                    <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(70,50,30,0.2)] pointer-events-none"></div>
                    {/* Texture overlay on photo for realism */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/scratches.png")' }}></div>
                </div>

                {/* 2. RIGHT SIDE: MESSAGE & ADDRESS (50%) */}
                <div className="w-1/2 h-full relative p-8 flex flex-col bg-[#FDFCF0]">
                    
                    {/* Divider Vertical Center (Decor) */}
                    <div className="absolute left-[0] top-[10%] bottom-[10%] w-[1px] bg-stone-300/30 shadow-[1px_0_0_white]"></div>

                    {/* Header Row: Stamp & Postmark */}
                    <div className="h-[30%] w-full relative mb-2">
                       {/* Postmark */}
                       <div className="absolute top-2 right-20 opacity-60 transform -rotate-12 mix-blend-multiply">
                          <div className={`w-20 h-20 rounded-full border-[3px] border-stone-800 flex flex-col items-center justify-center text-[10px] font-bold text-stone-800 text-center leading-tight ${courier.className}`}>
                             <span className="uppercase tracking-widest text-[8px]">Jakarta</span>
                             <span className="text-sm my-0.5">{date.split(' ')[0]}</span>
                             <span className="uppercase tracking-widest text-[8px]">Post</span>
                          </div>
                          <div className="w-32 h-6 border-t-4 border-b-4 border-stone-800 absolute top-7 left-16 -z-10 wave-lines opacity-80"></div>
                       </div>
                       
                       {/* Stamp Box (Realistic) */}
                       <div className="absolute top-0 right-0 w-16 h-20 bg-[#fefefe] shadow-sm flex items-center justify-center p-1.5 transform rotate-1 border-2 border-[#e5e5e5]">
                          {/* Perforated Edges Effect */}
                          <div className="absolute -left-1 top-0 bottom-0 w-2 flex flex-col justify-between py-1">{[...Array(6)].map((_,i)=><div key={i} className="w-2 h-2 rounded-full bg-[#3d3a36]"></div>)}</div>
                          <div className="absolute -right-1 top-0 bottom-0 w-2 flex flex-col justify-between py-1">{[...Array(6)].map((_,i)=><div key={i} className="w-2 h-2 rounded-full bg-[#3d3a36]"></div>)}</div>
                          
                          <div className="w-full h-full border border-stone-200 flex flex-col items-center justify-center bg-amber-50 overflow-hidden relative">
                             <Stamp size={24} className="text-amber-700/50 z-10" />
                             <span className={`text-[8px] font-bold text-amber-800 mt-1 uppercase ${courier.className}`}>Air Mail</span>
                             <div className="absolute bottom-0 right-0 text-[8px] font-bold text-amber-800 p-0.5">50c</div>
                          </div>
                       </div>
                    </div>

                    {/* Content Row */}
                    <div className="flex-grow flex flex-row relative z-10">
                        {/* Message Area (Left side of right panel) */}
                        <div className="w-[55%] pr-6 flex flex-col pt-4">
                           <div className={`${fontMap[fontStyle].class} text-xl leading-snug`} style={{ color: inkColor }}>
                              <p className="mb-4">{recipient}</p>
                              <p className="text-lg leading-snug opacity-90">{message}</p>
                           </div>
                        </div>

                        {/* Address Area (Right side of right panel) */}
                        <div className="w-[45%] pl-4 flex flex-col justify-center space-y-8 pt-10">
                           <div className="border-b border-stone-400 pb-1 relative">
                              <p className={`text-sm ${courier.className} text-stone-800 pl-2`}>{addressName}</p>
                           </div>
                           <div className="border-b border-stone-400 pb-1 relative">
                              <p className={`text-sm ${courier.className} text-stone-800 pl-2`}>{addressLine1}</p>
                           </div>
                           <div className="border-b border-stone-400 pb-1 relative">
                              <p className={`text-sm ${courier.className} text-stone-800 pl-2`}>{addressLine2}</p>
                           </div>
                        </div>
                    </div>

                    {/* Footer / Branding */}
                    <div className="mt-auto pt-4 text-center opacity-40 border-t border-stone-200">
                       <p className={`text-[8px] uppercase tracking-[0.3em] font-bold text-[#B45309] ${courier.className}`}>Cardify Post • Special Delivery</p>
                    </div>

                </div>
            </div>

            <div className="mt-8 text-[#d6d3c9] text-xs font-bold tracking-[0.2em] uppercase opacity-40 font-mono text-shadow">
                Table #4 • Postcard View
            </div>

        </div>
      </div>
    </div>
  );
}