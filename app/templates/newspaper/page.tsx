"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link"; 
import { toPng } from "html-to-image";
import { Playfair_Display, Lora, Oswald, Courier_Prime } from "next/font/google"; 
import { 
  ArrowLeft, Download, Loader2, Upload, Type, Image as ImageIcon,
  AlignLeft, Newspaper, Calendar, ZoomIn, Move, X, Palette, LayoutTemplate
} from "lucide-react";

// --- KONFIGURASI FONT BERKARAKTER ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-playfair" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ['normal', 'italic'], variable: "--font-lora" });
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-oswald" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-courier" });

// --- KOMPONEN IMAGE CROPPER (Vintage Style) ---
const ImageCropper = ({ src, aspectRatio, onCrop, onCancel }: { src: string, aspectRatio: number, onCrop: (croppedUrl: string) => void, onCancel: () => void }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Auto fit logic omitted for brevity
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

  const performCrop = () => {
    if (!imageRef.current) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const baseWidth = 1200;
    canvas.width = baseWidth;
    canvas.height = baseWidth / aspectRatio; 

    // Newspaper background filler
    ctx.fillStyle = "#F4F1EA"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = imageRef.current;
    const scale = zoom; 
    
    // Draw centered for demo
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    const offsetX = (canvas.width - drawWidth) / 2 + (position.x * 2);
    const offsetY = (canvas.height - drawHeight) / 2 + (position.y * 2);

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    onCrop(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[#F4F1EA] border-2 border-stone-800 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b-2 border-stone-800 flex justify-between items-center bg-[#Eae8e0]">
          <h3 className={`font-bold text-lg flex items-center gap-2 text-stone-800 ${courier.className} tracking-tighter uppercase`}>
            <ImageIcon size={18}/> Darkroom Crop
          </h3>
          <button onClick={onCancel}><X size={20} className="text-stone-500 hover:text-red-600 transition-colors" /></button>
        </div>
        
        <div className="flex-grow bg-stone-800 flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] pointer-events-none" />
            <div 
              className="relative overflow-hidden cursor-move ring-2 ring-[#F4F1EA]/50 shadow-2xl" 
              style={{ width: '100%', aspectRatio: aspectRatio, maxWidth: '500px' }}
              onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                ref={imageRef}
                src={src} 
                alt="Crop" 
                onLoad={onImageLoad}
                className="absolute top-1/2 left-1/2 origin-center transition-transform duration-75 select-none grayscale sepia-[0.3]"
                style={{ transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
                draggable={false}
              />
              <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 opacity-40">
                 {[...Array(9)].map((_,i) => <div key={i} className="border border-[#F4F1EA]" />)}
              </div>
            </div>
        </div>

        <div className="p-6 space-y-4 bg-[#F4F1EA] border-t-2 border-stone-800">
          <div className="flex items-center gap-4">
             <ZoomIn size={18} className="text-stone-600" />
             <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-stone-900" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className={`flex-1 py-3 border-2 border-stone-800 text-stone-800 font-bold text-xs uppercase hover:bg-stone-200 transition-colors ${courier.className}`}>Discard</button>
            <button onClick={performCrop} className={`flex-1 py-3 bg-stone-900 text-[#F4F1EA] font-bold text-xs uppercase hover:bg-black shadow-md transition-colors ${courier.className}`}>Develop Photo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NewspaperEditor() {
  // --- STATE ---
  const [paperName, setPaperName] = useState("THE DAILY TIMES");
  const [headline, setHeadline] = useState("LEGEND IS BORN");
  const [subheadline, setSubheadline] = useState("Local Hero Celebrates Another Year of Being Absolutely Awesome");
  // Updated default article body to include the second paragraph
  const [articleBody, setArticleBody] = useState("JAKARTA - In a surprising turn of events, sources confirm that today marks a very special occasion. The atmosphere is filled with joy and laughter as friends and family gather to celebrate. Experts say this level of awesomeness only increases with age. Witnesses reported seeing cake and confetti everywhere.\n\nThe celebration continues throughout the week as more well-wishers arrive. It is truly a moment to remember for everyone involved in this historic event.");
  const [date, setDate] = useState("Sunday, October 25, 2025");
  const [volNo, setVolNo] = useState("VOL. 01 • NO. 365");
  
  const [image, setImage] = useState<string | null>(null);
  const [isGrayscale, setIsGrayscale] = useState(true); 
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [fontColor, setFontColor] = useState("#1a1a1a"); 
  const [paperColor, setPaperColor] = useState("#F4F1EA"); 
  const [layoutStyle, setLayoutStyle] = useState<"classic" | "modern">("classic"); 

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  
  const [barcodeWidths, setBarcodeWidths] = useState<number[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const widths = Array.from({ length: 24 }, () => Math.random() > 0.5 ? 3 : 1);
    setBarcodeWidths(widths);
  }, []);

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
      alert("Failed to print newspaper.");
    } finally {
      setIsDownloading(false);
    }
  }, [headline]);

  return (
    <div className={`h-screen w-full bg-[#EAE8E0] text-[#1a1a1a] flex flex-col lg:flex-row font-sans selection:bg-stone-900 selection:text-[#F4F1EA] overflow-hidden`}>
      
      {cropModalOpen && tempImageSrc && (
        <ImageCropper 
            src={tempImageSrc} 
            aspectRatio={4/3} 
            onCrop={handleCropComplete} 
            onCancel={() => setCropModalOpen(false)} 
        />
      )}

      {/* --- LEFT PANEL: NEWSROOM EDITOR --- */}
      <div className="w-full lg:w-[450px] flex-shrink-0 bg-[#F9F8F4] border-r border-stone-300 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.05)] z-20">
        
        {/* Header Editor */}
        <div className="p-6 border-b border-stone-300 bg-[#F9F8F4] z-10 space-y-4 flex-shrink-0">
          <Link href="/" className={`inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-widest group ${courier.className}`}>
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-stone-900 rounded-none border-2 border-stone-900 flex items-center justify-center text-[#F4F1EA] shadow-sm">
                <Newspaper size={24} />
             </div>
             <div>
                <h1 className={`text-2xl font-bold text-stone-900 ${playfair.className} tracking-tight`}>The Newsroom</h1>
                <p className={`text-[10px] text-stone-500 font-bold uppercase tracking-widest ${courier.className}`}>Editor-in-Chief Mode</p>
             </div>
          </div>
        </div>

        {/* Scrollable Form Controls */}
        <div className="p-6 space-y-8 flex-grow overflow-y-auto custom-scrollbar">
          
          {/* 1. Header & Style Info */}
          <div className="space-y-4">
             <div className={`flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-widest ${courier.className}`}>
                <span className="flex items-center gap-2"><LayoutTemplate size={14} /> Style</span>
             </div>

             {/* STYLE SELECTOR */}
             <div className="bg-stone-200 p-1 rounded-lg flex gap-1 mb-4">
                <button 
                  onClick={() => setLayoutStyle("classic")}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${layoutStyle === "classic" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                >
                  Classic
                </button>
                <button 
                  onClick={() => setLayoutStyle("modern")}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${layoutStyle === "modern" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                >
                  Modern Bold
                </button>
             </div>

             <div className={`flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest ${courier.className}`}><Calendar size={14} /> Details</div>
             <div className="space-y-3">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-stone-600 ml-1 uppercase tracking-wider">Masthead Name</label>
                   <input value={paperName} onChange={(e) => setPaperName(e.target.value.toUpperCase())} className={`w-full bg-white border border-stone-300 px-3 py-2.5 text-sm font-bold focus:ring-1 focus:ring-stone-900 focus:border-stone-900 focus:outline-none uppercase placeholder:text-stone-300 ${playfair.className}`} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 ml-1 uppercase tracking-wider">Issue Date</label>
                      <input value={date} onChange={(e) => setDate(e.target.value)} className={`w-full bg-white border border-stone-300 px-3 py-2.5 text-xs font-medium focus:ring-1 focus:ring-stone-900 focus:border-stone-900 focus:outline-none ${courier.className}`} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 ml-1 uppercase tracking-wider">Vol / No</label>
                      <input value={volNo} onChange={(e) => setVolNo(e.target.value)} className={`w-full bg-white border border-stone-300 px-3 py-2.5 text-xs font-medium focus:ring-1 focus:ring-stone-900 focus:border-stone-900 focus:outline-none ${courier.className}`} />
                   </div>
                </div>
             </div>
          </div>

          <div className="w-full h-px bg-stone-200" />

          {/* 2. Headlines */}
          <div className="space-y-4">
             <div className={`flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest ${courier.className}`}><Type size={14} /> Headlines</div>
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-stone-600 ml-1 uppercase tracking-wider">Main Headline</label>
                   <textarea value={headline} onChange={(e) => setHeadline(e.target.value.toUpperCase())} className={`w-full bg-white border-l-4 border-stone-900 px-4 py-3 text-lg font-black h-24 resize-none focus:outline-none uppercase leading-tight shadow-sm ${playfair.className}`} />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-stone-600 ml-1 uppercase tracking-wider">Sub-Deck</label>
                   <input value={subheadline} onChange={(e) => setSubheadline(e.target.value)} className={`w-full bg-white border border-stone-300 px-3 py-2.5 text-sm italic text-stone-600 focus:ring-1 focus:ring-stone-900 focus:border-stone-900 focus:outline-none ${lora.className}`} />
                </div>
             </div>
          </div>

          <div className="w-full h-px bg-stone-200" />

          {/* 3. Image & Body */}
          <div className="space-y-4">
             <div className={`flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest ${courier.className}`}><ImageIcon size={14} /> Media & Story</div>
             
             <div className="p-4 border-2 border-dashed border-stone-300 hover:bg-stone-100 hover:border-stone-400 transition-all cursor-pointer relative group flex flex-col items-center justify-center gap-2" onClick={() => document.getElementById("uploadNewsImg")?.click()}>
                <input type="file" id="uploadNewsImg" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <Upload size={24} className="text-stone-400 group-hover:text-stone-900" />
                <span className={`text-xs font-bold uppercase text-stone-500 group-hover:text-stone-900 ${courier.className}`}>Insert Photograph</span>
             </div>

             <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border-2 border-stone-400 flex items-center justify-center transition-colors ${isGrayscale ? 'bg-stone-800 border-stone-800' : 'bg-white'}`}>
                   <input type="checkbox" checked={isGrayscale} onChange={(e) => setIsGrayscale(e.target.checked)} className="hidden" />
                   {isGrayscale && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide text-stone-600 group-hover:text-stone-900 ${courier.className}`}>Apply Vintage Grayscale</span>
             </label>

             <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 ml-1 uppercase tracking-wider flex items-center gap-1"><AlignLeft size={12}/> The Story</label>
                <textarea value={articleBody} onChange={(e) => setArticleBody(e.target.value)} className={`w-full bg-white border border-stone-300 px-4 py-3 text-sm h-40 resize-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 focus:outline-none leading-relaxed text-justify ${lora.className}`} />
             </div>
          </div>

          <div className="w-full h-px bg-stone-200" />

          {/* 4. Color Settings */}
          <div className="space-y-4">
             <div className={`flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest ${courier.className}`}><Palette size={14} /> Ink & Paper</div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-stone-600 ml-1 uppercase tracking-wider">Ink Tone</label>
                   <div className="flex items-center gap-2 p-1.5 border border-stone-300 bg-white">
                      <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="h-8 w-full cursor-pointer p-0 border-0" />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-stone-600 ml-1 uppercase tracking-wider">Paper Tone</label>
                   <div className="flex items-center gap-2 p-1.5 border border-stone-300 bg-white">
                      <input type="color" value={paperColor} onChange={(e) => setPaperColor(e.target.value)} className="h-8 w-full cursor-pointer p-0 border-0" />
                   </div>
                </div>
             </div>
          </div>

          <div className="h-20 lg:hidden"></div>
        </div>

        {/* Save Button */}
        <div className="p-6 border-t border-stone-300 bg-[#F9F8F4] flex-shrink-0 z-20">
          <button onClick={handleDownload} disabled={isDownloading} className={`w-full flex items-center justify-center gap-2 bg-stone-900 text-[#F4F1EA] py-4 font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-stone-900/20 active:translate-y-0.5 ${courier.className} tracking-widest uppercase`}>
            {isDownloading ? <><Loader2 size={16} className="animate-spin" /> Printing Press...</> : <><Download size={16} /> Publish Edition</>}
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW STAGE --- */}
      <div className="flex-grow h-full bg-[#3d3a36] relative flex flex-col items-center justify-start p-8 lg:p-12 overflow-y-auto overflow-x-hidden">
        
        {/* Desk Texture */}
        <div className="absolute inset-0 opacity-40 pointer-events-none fixed" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`, backgroundSize: '300px' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40 pointer-events-none fixed" />

        <div className="w-full flex flex-col items-center my-auto min-h-min relative z-10">
            
            {/* THE NEWSPAPER CARD */}
            <div 
            ref={cardRef}
            className="relative w-full max-w-[520px] transition-all duration-300 overflow-hidden"
            style={{
                aspectRatio: '3/4.5',
                backgroundColor: paperColor, 
                backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
                color: fontColor,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.3)" 
            }}
            >
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-50 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/rough-cloth.png")` }}></div>

                <div className="w-full h-full p-6 sm:p-8 flex flex-col relative z-10">
                
                {/* --- HEADER --- */}
                {layoutStyle === 'classic' ? (
                  // CLASSIC STYLE
                  <>
                    <div className="border-b-[3px] border-double pb-3 mb-2 text-center" style={{ borderColor: fontColor }}>
                        <h1 className={`text-5xl sm:text-7xl tracking-tighter leading-[0.8] ${playfair.className} font-black uppercase`}>
                            {paperName || "THE NEWS"}
                        </h1>
                    </div>
                    <div 
                      className={`flex justify-between border-b border-t py-1.5 mb-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] ${oswald.className}`}
                      style={{ borderColor: fontColor, opacity: 0.9 }}
                    >
                        <span>{volNo}</span>
                        <span>{date}</span>
                        <span>$1.00</span>
                    </div>
                  </>
                ) : (
                  // MODERN STYLE (Bold Block)
                  <div className="mb-6 pt-2">
                     <div className="w-full py-4 text-center mb-1" style={{ backgroundColor: fontColor, color: paperColor }}>
                        <h1 className={`text-5xl sm:text-7xl tracking-tight leading-none ${oswald.className} font-bold uppercase`}>
                            {paperName || "THE NEWS"}
                        </h1>
                     </div>
                     <div className="flex justify-between border-b-2 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ borderColor: fontColor }}>
                        <span>{date}</span>
                        <span>{volNo}</span>
                        <span>PRICELESS</span>
                     </div>
                  </div>
                )}

                {/* --- HEADLINE --- */}
                <div className={`mb-6 px-1 ${layoutStyle === 'modern' ? 'text-left pl-4 border-l-4' : 'text-center'}`} style={{ borderColor: fontColor }}>
                    <h2 className={`text-4xl sm:text-5xl leading-[0.95] mb-3 font-bold uppercase ${layoutStyle === 'modern' ? oswald.className : playfair.className}`}>
                        {headline}
                    </h2>
                    <p className={`text-sm sm:text-base italic font-medium leading-tight ${lora.className} opacity-80 ${layoutStyle === 'classic' ? 'px-4' : ''}`}>
                        {layoutStyle === 'classic' && "—"} {subheadline}
                    </p>
                </div>

                {/* --- MAIN IMAGE --- */}
                <div className={`relative w-full aspect-[4/3] bg-black/5 mb-6 overflow-hidden group ${layoutStyle === 'modern' ? 'border-y-4' : 'border'}`} style={{ borderColor: fontColor }}>
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                        src={image} 
                        alt="News" 
                        className={`w-full h-full object-cover ${isGrayscale ? 'grayscale contrast-125 sepia-[.15] brightness-95' : ''}`} 
                        style={isGrayscale ? { filter: 'grayscale(100%) contrast(1.2) brightness(0.9) sepia(0.2)' } : {}}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ color: fontColor, opacity: 0.3 }}>
                            <ImageIcon size={48} strokeWidth={1} />
                            <span className={`text-xs uppercase tracking-widest ${oswald.className}`}>Photo Placeholder</span>
                        </div>
                    )}
                    <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                </div>

                {/* --- ARTICLE COLUMNS --- */}
                <div className={`flex-grow columns-2 gap-6 text-justify text-[10px] sm:text-[11px] leading-[1.6] ${lora.className} opacity-90`} style={{ columnRule: `1px solid ${fontColor}30` }}>
                    {/* Render paragraphs dynamically based on newlines */}
                    {layoutStyle === 'modern' ? (
                       // Modern: First paragraph is bold
                       articleBody.split('\n').filter(p => p.trim() !== '').map((para, i) => (
                           <p key={i} className={i === 0 ? "font-bold mb-4" : "mb-4 indent-4"}>
                              {para}
                           </p>
                       ))
                    ) : (
                       // Classic: First paragraph has Drop Cap
                       articleBody.split('\n').filter(p => p.trim() !== '').map((para, i) => {
                           if (i === 0) {
                               return (
                                   <p key={i} className="mb-4">
                                      <span className={`float-left text-5xl line-[0.7] mr-2 mt-[-6px] font-bold ${playfair.className}`}>
                                        {para.charAt(0)}
                                      </span>
                                      {para.slice(1)}
                                   </p>
                               )
                           }
                           return (
                               <p key={i} className="mb-4 indent-4">
                                  {para}
                               </p>
                           )
                       })
                    )}
                </div>

                {/* --- FOOTER --- */}
                <div className="mt-auto pt-4 border-t-4 flex justify-between items-end" style={{ borderColor: fontColor }}>
                    <div className="flex flex-col">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${oswald.className}`}>Cardify Press Ltd.</span>
                        <span className={`text-[8px] opacity-60 ${courier.className}`}>Est. 2025 • Jakarta Edition</span>
                    </div>
                    {/* Fake Barcode */}
                    <div className="h-8 flex items-end gap-[3px]">
                        {barcodeWidths.map((w, i) => (
                            <div key={i} style={{ width: w, height: '100%', backgroundColor: fontColor }} />
                        ))}
                    </div>
                </div>

                </div>
            </div>

            <div className="mt-8 text-[#Eae8e0] text-xs font-bold tracking-widest uppercase opacity-50 font-mono">
                Running Press...
            </div>
        </div>

      </div>
    </div>
  );
}