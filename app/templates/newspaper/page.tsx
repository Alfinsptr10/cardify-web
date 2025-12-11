"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link"; 
import { toPng } from "html-to-image";
import { Playfair_Display, Lora, Oswald } from "next/font/google"; 
import { 
  ArrowLeft, Download, Loader2, Upload, Type, Image as ImageIcon,
  AlignLeft, Newspaper, Calendar, ZoomIn, Move, X, Palette // Menambahkan Palette
} from "lucide-react";

// --- KONFIGURASI FONT KORAN ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"] });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] });
const oswald = Oswald({ subsets: ["latin"], weight: ["500"] });

// --- KOMPONEN IMAGE CROPPER (MODAL) ---
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
    // Auto fit logic
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

    // Set resolusi tinggi untuk hasil tajam
    const baseWidth = 1200;
    canvas.width = baseWidth;
    canvas.height = baseWidth / aspectRatio; 

    ctx.fillStyle = "#e5e5e5"; // Background abu-abu koran jika kosong
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
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0 bg-white z-10">
          <h3 className="font-bold text-lg flex items-center gap-2"><ImageIcon size={18}/> Adjust Photo</h3>
          <button onClick={onCancel}><X size={20} className="text-gray-400 hover:text-black" /></button>
        </div>
        
        <div className="flex-grow bg-gray-900 flex items-center justify-center p-8 overflow-hidden relative">
            {/* CONTAINER CROP UTAMA */}
            <div 
              ref={containerRef}
              className="relative overflow-hidden cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.8)] ring-2 ring-white" 
              style={{ 
                  width: '100%', 
                  aspectRatio: aspectRatio, // Rasio dikunci sesuai layout koran
                  maxWidth: '500px'
              }}
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
                style={{ 
                  ...imgStyle,
                  transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                }}
                draggable={false}
              />
              
              {/* Grid Lines Helper */}
              <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 opacity-30">
                <div className="border-r border-b border-white/50"></div>
                <div className="border-r border-b border-white/50"></div>
                <div className="border-b border-white/50"></div>
                <div className="border-r border-b border-white/50"></div>
                <div className="border-r border-b border-white/50"></div>
                <div className="border-b border-white/50"></div>
                <div className="border-r border-white/50"></div>
                <div className="border-r border-white/50"></div>
                <div></div>
              </div>
            </div>
        </div>

        <div className="p-6 space-y-4 flex-shrink-0 bg-white z-20 border-t border-gray-100">
          <div className="flex items-center gap-4">
             <ZoomIn size={18} className="text-gray-400" />
             <input 
               type="range" 
               min="1" 
               max="3" 
               step="0.1" 
               value={zoom} 
               onChange={(e) => setZoom(parseFloat(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
             />
          </div>
          
          <div className="flex gap-2 text-xs text-gray-400 justify-center">
             <Move size={12} /> Drag image to adjust position
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 py-3 rounded-lg border border-gray-200 font-bold text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={performCrop} className="flex-1 py-3 rounded-lg bg-black text-white font-bold text-sm hover:bg-gray-800 shadow-lg">Apply Crop</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NewspaperEditor() {
  // --- STATE ---
  const [paperName, setPaperName] = useState("THE DAILY TIMES");
  const [headline, setHeadline] = useState("BREAKING NEWS: LEGEND IS BORN");
  const [subheadline, setSubheadline] = useState("Local Hero Celebrates Another Year of Being Awesome");
  const [articleBody, setArticleBody] = useState("JAKARTA - In a surprising turn of events, sources confirm that today marks a very special occasion. The atmosphere is filled with joy and laughter as friends and family gather to celebrate. Experts say this level of awesomeness increases with age.");
  const [date, setDate] = useState("Sunday, October 25, 2025");
  const [volNo, setVolNo] = useState("VOL. 01 • NO. 365");
  
  const [image, setImage] = useState<string | null>(null);
  const [isGrayscale, setIsGrayscale] = useState(true); // Efek koran jadul
  const [isDownloading, setIsDownloading] = useState(false);
  
  // State Warna (Baru)
  const [fontColor, setFontColor] = useState("#1a1a1a"); // Default Hitam Tinta
  const [paperColor, setPaperColor] = useState("#F4F1EA"); // Default Krem Koran

  // State Cropping
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // --- HANDLERS ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    
    // Buka modal crop
    setTempImageSrc(localUrl);
    setCropModalOpen(true);
    e.target.value = "";
  };

  const handleCropComplete = (croppedUrl: string) => {
    setImage(croppedUrl);
    setCropModalOpen(false);
    setTempImageSrc(null);
  };

  const handleDownload = useCallback(async () => {
    if (cardRef.current === null) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = `newspaper-${headline.slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan gambar.");
    } finally {
      setIsDownloading(false);
    }
  }, [headline]);

  return (
    <div className={`h-screen w-full bg-[#E5E5E5] text-[#1a1a1a] flex flex-col lg:flex-row font-sans selection:bg-black selection:text-white overflow-hidden`}>
      
      {/* CROP MODAL */}
      {cropModalOpen && tempImageSrc && (
        <ImageCropper 
            src={tempImageSrc} 
            aspectRatio={4/3} // Rasio dikunci ke 4:3 sesuai layout koran
            onCrop={handleCropComplete} 
            onCancel={() => setCropModalOpen(false)} 
        />
      )}

      {/* --- LEFT PANEL: EDITOR --- */}
      <div className="w-full lg:w-[420px] flex-shrink-0 bg-white border-r border-gray-300 flex flex-col h-full shadow-xl z-20">
        
        {/* Header Editor */}
        <div className="p-6 border-b border-gray-200 bg-white/95 backdrop-blur z-10 space-y-4 flex-shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white shadow-lg">
                <Newspaper size={20} />
             </div>
             <div>
                <h1 className={`text-xl font-bold text-black ${playfair.className}`}>Newsroom Editor</h1>
                <p className="text-xs text-gray-500 font-medium">Create your own headline.</p>
             </div>
          </div>
        </div>

        {/* Scrollable Form Controls */}
        <div className="p-6 space-y-8 flex-grow overflow-y-auto custom-scrollbar bg-white">
          
          {/* 1. Header Info */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><Calendar size={14} /> Publication Details</div>
             <div className="space-y-3">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-600 ml-1">Newspaper Name</label>
                   <input value={paperName} onChange={(e) => setPaperName(e.target.value.toUpperCase())} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-black focus:outline-none uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 ml-1">Date</label>
                      <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 ml-1">Vol / No</label>
                      <input value={volNo} onChange={(e) => setVolNo(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none" />
                   </div>
                </div>
             </div>
          </div>

          <div className="w-full h-px bg-gray-100" />

          {/* 2. Headlines */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><Type size={14} /> Headlines</div>
             <div className="space-y-3">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-600 ml-1">Main Headline</label>
                   <textarea value={headline} onChange={(e) => setHeadline(e.target.value.toUpperCase())} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold h-20 resize-none focus:ring-2 focus:ring-black focus:outline-none uppercase leading-tight" />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-600 ml-1">Sub-Headline</label>
                   <input value={subheadline} onChange={(e) => setSubheadline(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
             </div>
          </div>

          <div className="w-full h-px bg-gray-100" />

          {/* 3. Image & Body */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><ImageIcon size={14} /> Media & Story</div>
             
             <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition cursor-pointer relative group" onClick={() => document.getElementById("uploadNewsImg")?.click()}>
                <input type="file" id="uploadNewsImg" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <div className="flex flex-col items-center justify-center text-gray-400">
                   <Upload size={24} className="mb-2" />
                   <span className="text-xs font-bold uppercase">Upload Main Photo</span>
                </div>
             </div>

             <div className="flex items-center gap-2">
                <input type="checkbox" id="grayscale" checked={isGrayscale} onChange={(e) => setIsGrayscale(e.target.checked)} className="w-4 h-4 accent-black cursor-pointer" />
                <label htmlFor="grayscale" className="text-sm font-medium cursor-pointer">Black & White Filter (Vintage Look)</label>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1 flex items-center gap-1"><AlignLeft size={12}/> Article Body</label>
                <textarea value={articleBody} onChange={(e) => setArticleBody(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm h-32 resize-none focus:ring-2 focus:ring-black focus:outline-none" />
             </div>
          </div>

          <div className="w-full h-px bg-gray-100" />

          {/* 4. Color Settings (BARU) */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><Palette size={14} /> Colors</div>
             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-600 ml-1">Ink Color</label>
                   <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                      <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="h-6 w-6 cursor-pointer rounded border border-gray-300" />
                      <span className="text-xs text-gray-500 font-mono uppercase">{fontColor}</span>
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-600 ml-1">Paper Color</label>
                   <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                      <input type="color" value={paperColor} onChange={(e) => setPaperColor(e.target.value)} className="h-6 w-6 cursor-pointer rounded border border-gray-300" />
                      <span className="text-xs text-gray-500 font-mono uppercase">{paperColor}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="h-20 lg:hidden"></div>
        </div>

        {/* Save Button */}
        <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0 z-20">
          <button onClick={handleDownload} disabled={isDownloading} className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-full font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]">
            {isDownloading ? <><Loader2 size={18} className="animate-spin" /> Printing...</> : <><Download size={18} /> Publish Newspaper</>}
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW STAGE --- */}
      <div className="flex-grow h-full bg-[#E5E5E5] relative flex flex-col items-center justify-start p-8 lg:p-12 overflow-y-auto overflow-x-hidden">
        
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-50 pointer-events-none mix-blend-multiply fixed" />

        <div className="w-full flex flex-col items-center my-auto min-h-min">
            
            {/* THE NEWSPAPER CARD */}
            <div 
            ref={cardRef}
            className="relative w-full max-w-[500px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden"
            style={{
                aspectRatio: '3/4.5',
                backgroundColor: paperColor, // Warna Kertas Dinamis
                backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
                color: fontColor // Warna Tinta Dinamis (Mewarisi ke anak)
            }}
            >
                <div className="w-full h-full p-6 flex flex-col border-r border-b" style={{ borderColor: `${fontColor}20` }}> {/* Border container halus */}
                
                {/* 1. NEWSPAPER HEADER */}
                <div className="border-b-[3px] pb-1 mb-1 text-center" style={{ borderColor: fontColor }}>
                    <h1 className={`text-5xl md:text-6xl tracking-tighter leading-none ${playfair.className} font-black`}>
                        {paperName || "THE NEWS"}
                    </h1>
                </div>

                {/* 2. META ROW */}
                <div 
                  className={`flex justify-between border-b border-t py-1.5 mb-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${oswald.className}`}
                  style={{ borderColor: fontColor }}
                >
                    <span>{volNo}</span>
                    <span>{date}</span>
                    <span>$1.00</span>
                </div>

                {/* 3. HEADLINE SECTION */}
                <div className="text-center mb-5 px-2">
                    <h2 className={`text-3xl md:text-4xl leading-[1.1] mb-2 font-bold ${playfair.className}`}>
                        {headline}
                    </h2>
                    {/* Subheadline opacity-80 agar sedikit lebih pudar dari tinta utama */}
                    <p className={`text-sm md:text-base italic ${lora.className} opacity-80`}>
                        {subheadline}
                    </p>
                </div>

                {/* 4. MAIN IMAGE */}
                <div className="relative w-full aspect-[4/3] bg-gray-200/20 mb-5 border overflow-hidden" style={{ borderColor: `${fontColor}40` }}>
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                        src={image} 
                        alt="News" 
                        className={`w-full h-full object-cover ${isGrayscale ? 'grayscale contrast-125 sepia-[.2]' : ''}`} 
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center" style={{ color: fontColor, opacity: 0.4 }}>
                            <ImageIcon size={40} className="mb-2" />
                            <span className={`text-xs uppercase tracking-widest ${oswald.className}`}>No Image</span>
                        </div>
                    )}
                </div>

                {/* 5. ARTICLE COLUMNS */}
                <div className={`flex-grow columns-2 gap-4 text-justify text-[10px] md:text-[11px] leading-relaxed ${lora.className} opacity-90`}>
                    <p className="first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:mt-[-6px]">
                        {articleBody || "Lorem ipsum dolor sit amet."}
                    </p>
                </div>

                {/* 6. FOOTER BARCODE */}
                <div className="mt-auto pt-4 border-t-2 flex justify-between items-end" style={{ borderColor: fontColor }}>
                    <div className="flex flex-col">
                        <span className={`text-[8px] font-bold uppercase ${oswald.className}`}>Cardify Press Ltd.</span>
                        <span className="text-[8px] opacity-60">Printed in Jakarta</span>
                    </div>
                    {/* Fake Barcode (Warna Tinta) */}
                    <div className="h-6 flex items-end gap-[2px]">
                        {[...Array(20)].map((_,i) => (
                            <div key={i} style={{ width: Math.random() > 0.5 ? 2 : 1, height: '100%', backgroundColor: fontColor }} />
                        ))}
                    </div>
                </div>

                </div>
            </div>

            <div className="mt-8 text-gray-500 text-xs font-bold tracking-widest uppercase opacity-70">
                Preview Mode: Vintage Press
            </div>
        </div>

      </div>
    </div>
  );
}