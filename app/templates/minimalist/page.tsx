"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { toPng } from "html-to-image";
import { 
  Type, 
  Calendar, 
  MessageSquare, 
  Palette, 
  Upload, 
  Image as ImageIcon,
  CaseSensitive,
  Download,
  Loader2,
  ArrowLeft,
  Layout
} from "lucide-react";

// Konfigurasi Font
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function MinimalistEditor() {
  // --- STATE (Tidak Berubah) ---
  const [name, setName] = useState("Your Name");
  const [title, setTitle] = useState("Birthday Invitation");
  const [message, setMessage] = useState("You are invited to my special day!");
  const [date, setDate] = useState("Saturday, 10 January 2026");
  const [color, setColor] = useState("#1a1a1a");
  const [font, setFont] = useState("font-serif");
  const [imagePreview, setImagePreview] = useState("/minimalist.png");
  const [isDownloading, setIsDownloading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const fontOptions = [
    { name: "Serif", value: "font-serif", label: "Classic" },
    { name: "Sans", value: "font-sans", label: "Modern" },
    { name: "Mono", value: "font-mono", label: "Technical" },
  ];

  const colorPresets = [
    "#1a1a1a", "#57534e", "#7f1d1d", "#1e3a8a", "#065f46",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleDownload = useCallback(async () => {
    if (cardRef.current === null) return;
    setIsDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = `invitation-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err); 
      alert("Gagal mengunduh gambar. Cobalah mengganti gambar atau refresh halaman.");
    } finally {
      setIsDownloading(false);
    }
  }, [name]);

  return (
    // PERBAIKAN LAYOUT UTAMA:
    // Gunakan h-screen (tinggi layar pas) dan overflow-hidden untuk mencegah scroll body browser
    <div className={`h-screen w-full bg-[#F9F9F8] text-[#1a1a1a] flex flex-col xl:flex-row relative selection:bg-gray-200 selection:text-black overflow-hidden ${dmSans.className}`}>
      
      {/* ================== LEFT PANEL: EDITOR SIDEBAR ================== */}
      {/* Sidebar tetap full height, tapi area form-nya yang bisa di-scroll */}
      <div className="w-full xl:w-[420px] bg-white border-r border-gray-200 flex flex-col h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0">
        
        {/* Header (Fixed di atas sidebar) */}
        <div className="p-6 border-b border-gray-100 bg-white/90 backdrop-blur z-10 flex-shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest mb-4">
             <ArrowLeft size={14} /> Back to Home
          </Link>
          
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                <Layout size={20} className="text-gray-600" />
             </div>
             <div>
                <h2 className={`text-xl font-bold text-[#1a1a1a] ${playfair.className}`}>Minimalist Editor</h2>
                <p className="text-xs text-gray-500 mt-0.5">Craft elegance in seconds.</p>
             </div>
          </div>
        </div>

        {/* Scrollable Form Area */}
        {/* PERBAIKAN: Gunakan flex-grow dan overflow-y-auto disini agar cuma form yang scroll */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8 bg-white"> 
          
          {/* Group: Content Details */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <Type size={14} /> Content Details
            </h3>

            <div className="space-y-4">
               {/* Name Input */}
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 ml-1">Recipient Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all placeholder:text-gray-400"
                    placeholder="Ex: John Doe"
                  />
               </div>

               {/* Title Input */}
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 ml-1">Event Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all placeholder:text-gray-400"
                    placeholder="Ex: Birthday Bash"
                  />
               </div>

               {/* Date Input */}
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 ml-1">Date & Time</label>
                  <div className="relative">
                     <Calendar size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                     <input
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                     />
                  </div>
               </div>

               {/* Message Input */}
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 ml-1">Personal Message</label>
                  <div className="relative">
                     <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                     <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all min-h-[100px] resize-none leading-relaxed"
                     />
                  </div>
               </div>
            </div>
          </div>

          {/* Group: Visual Style */}
          <div className="space-y-5">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <Palette size={14} /> Visual Style
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
               {/* Image Upload */}
               <div className="p-4 rounded-xl border border-dashed border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all bg-white relative group overflow-hidden cursor-pointer h-full flex flex-col justify-center">
                  <input
                     type="file"
                     accept="image/*"
                     onChange={handleImageUpload}
                     className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 text-center h-full">
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Upload size={14} />
                     </div>
                     <span className="text-xs font-bold text-gray-500 group-hover:text-black transition-colors">Change Photo</span>
                  </div>
               </div>

               {/* Color & Font */}
               <div className="space-y-4">
                  {/* Color Presets */}
                  <div className="flex items-center gap-2 flex-wrap">
                     {colorPresets.map((c) => (
                        <button
                           key={c}
                           onClick={() => setColor(c)}
                           className={`w-6 h-6 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110 ${color === c ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                           style={{ backgroundColor: c }}
                        />
                     ))}
                     <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 bg-gradient-to-br from-red-500 via-green-500 to-blue-500">
                        <input
                           type="color"
                           value={color}
                           onChange={(e) => setColor(e.target.value)}
                           className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                     </div>
                  </div>

                  {/* Font Selector */}
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                     {fontOptions.map((opt) => (
                        <button
                           key={opt.value}
                           onClick={() => setFont(opt.value)}
                           className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                              font === opt.value 
                              ? "bg-white text-black shadow-sm" 
                              : "text-gray-400 hover:text-gray-600"
                           }`}
                        >
                           {opt.name}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Spacer di bawah form agar tombol di mobile tidak menutupi input terakhir */}
          <div className="h-20 xl:hidden"></div> 
        </div>

        {/* Footer: Export Action (Fixed di bawah sidebar) */}
        <div className="p-6 border-t border-gray-100 bg-white flex-shrink-0 z-20">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-4 rounded-full font-medium text-sm hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
          >
            {isDownloading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Export Card</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* ================== RIGHT PANEL: PREVIEW STAGE ================== */}
      {/* PERBAIKAN: Gunakan flex-1, h-full, dan overflow-y-auto disini agar area ini scroll independen */}
      <div className="flex-1 h-full bg-[#F3F4F6] relative flex flex-col items-center justify-center p-8 xl:p-16 overflow-y-auto overflow-x-hidden">
        
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.4] pointer-events-none mix-blend-multiply fixed" />
        
        {/* Live Preview Label (Fixed saat scroll area preview) */}
        <div className="absolute top-8 right-8 flex items-center gap-2 bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-white/50 shadow-sm z-30">
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
           </span>
           <span className="text-xs font-bold text-gray-500 tracking-wide uppercase">Live Preview</span>
        </div>

        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 my-auto">
            
            {/* CARD CONTAINER */}
            <div 
              ref={cardRef} 
              className={`relative w-full max-w-md bg-white shadow-2xl overflow-hidden transition-all duration-300 ${font}`}
              style={{
                 borderRadius: "0px", 
                 boxShadow: "0 30px 60px -12px rgba(0,0,0,0.1)"
              }}
            >
                {/* Image Area */}
                <div className="relative w-full h-80 bg-gray-50 overflow-hidden">
                    {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="object-cover w-full h-full"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                           <ImageIcon size={32} />
                           <span className="text-xs uppercase tracking-widest">No Image Selected</span>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-10 flex flex-col gap-6 text-center">
                    <div>
                       <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">
                           {date}
                       </span>
                       <h1 className={`text-4xl leading-tight ${font === 'font-serif' ? 'italic' : 'font-bold'}`} style={{ color: color }}>
                           {title}
                       </h1>
                    </div>
                    <div className="w-8 h-[1px] bg-gray-200 mx-auto" />
                    <div>
                       <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                           Dear {name},
                       </h2>
                       <p className="text-gray-500 leading-relaxed font-light text-sm mx-auto max-w-[80%]">
                           {message}
                       </p>
                    </div>
                    <div className="pt-4 opacity-30">
                       <CaseSensitive size={16} className="mx-auto" />
                    </div>
                </div>
            </div>

            {/* Reflection Shadow */}
            <div className="w-[90%] h-4 bg-black/10 blur-xl rounded-[100%] mt-8 mx-auto" />

        </div>
      </div>
    </div>
  );
}