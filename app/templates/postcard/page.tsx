"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  MessageSquare, 
  Palette, 
  Upload, 
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
  Stamp,
  MapPin,
  Mail,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
  ZoomIn,
  Calendar
} from "lucide-react";

// --- FONTS ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] }); 
const homemade = Homemade_Apple({ subsets: ["latin"], weight: ["400"] }); 
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"] }); 

// --- CROPPER ---
const ImageCropper = ({ src, aspectRatio, onCrop, onCancel }: { src: string, aspectRatio: number, onCrop: (croppedUrl: string) => void, onCancel: () => void }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [imgStyle, setImgStyle] = useState({});
  const imageRef = useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth / naturalHeight > aspectRatio) {
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
    if (!imageRef.current) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const baseWidth = 1200;
    canvas.width = baseWidth;
    canvas.height = baseWidth / aspectRatio; 
    ctx.fillStyle = "#F3F2ED"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = imageRef.current;
    const scaleFactor = canvas.width / (img.width || 100); 
    const scale = zoom;
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    const centerX = canvas.width / 2 + position.x * 2;
    const centerY = canvas.height / 2 + position.y * 2;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, centerX - drawWidth/2, centerY - drawHeight/2, drawWidth, drawHeight);
    onCrop(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[#EFEEE9] rounded-sm w-full max-w-lg shadow-2xl border-2 border-stone-400 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b-2 border-stone-300 border-dashed flex justify-between items-center bg-[#E6E4dc]">
          <h3 className={`font-bold text-lg flex items-center gap-2 text-stone-700 ${courier.className}`}>
            <ImageIcon size={18}/> ADJUST PHOTO
          </h3>
          <button onClick={onCancel}><X size={20} className="text-stone-500 hover:text-red-500" /></button>
        </div>
        <div className="flex-grow bg-stone-200 flex items-center justify-center p-8 overflow-hidden relative">
            <div className="relative overflow-hidden cursor-move shadow-xl ring-4 ring-white" style={{ width: '100%', aspectRatio: aspectRatio, maxWidth: '500px' }}
                 onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imageRef} src={src} alt="Crop" onLoad={onImageLoad} className="absolute top-1/2 left-1/2 origin-center select-none sepia-[0.3]" style={{ ...imgStyle, transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})` }} draggable={false} />
            </div>
        </div>
        <div className="p-6 space-y-4 bg-[#EFEEE9] border-t-2 border-stone-300 border-dashed z-20">
          <div className="flex items-center gap-4 bg-white p-2 rounded border border-stone-300">
             <ZoomIn size={18} className="text-stone-400" />
             <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-600" />
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className={`flex-1 py-3 border-2 border-stone-400 text-stone-600 font-bold text-sm uppercase ${courier.className}`}>Discard</button>
            <button onClick={performCrop} className={`flex-1 py-3 bg-[#B45309] text-white font-bold text-sm uppercase ${courier.className}`}>Stamp It</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EnvelopeLetterEditor() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'letter' | 'envelope'>('letter');
  
  // Letter State
  const [recipient, setRecipient] = useState("Dearest Sarah,");
  const [message, setMessage] = useState("I'm writing to you from a place where the sun never stops shining. Wish you were here to share this view.");
  const [sender, setSender] = useState("Love, Alex");
  const [inkColor, setInkColor] = useState("#1e293b");
  const [fontStyle, setFontStyle] = useState("hand1"); 
  const [fontSize, setFontSize] = useState(18); 
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left'); 
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Envelope State
  const [addressName, setAddressName] = useState("Sarah Jenkins");
  const [addressLine1, setAddressLine1] = useState("123 Maple Street");
  const [addressLine2, setAddressLine2] = useState("New York, NY 10001");
  const [date, setDate] = useState("14 FEB 2025");
  const [envColor, setEnvColor] = useState("#d4c5a9"); 

  // System
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);

  // Crop State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

  const fontMap: any = {
    hand1: { class: caveat.className, name: "Casual Pen", family: caveat.style.fontFamily },
    hand2: { class: homemade.className, name: "Script Ink", family: homemade.style.fontFamily },
    type: { class: courier.className, name: "Old Typewriter", family: courier.style.fontFamily },
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempImageSrc(URL.createObjectURL(file));
      setCropModalOpen(true);
      e.target.value = "";
    }
  };

  const handleCropComplete = (url: string) => {
    setImagePreview(url);
    setCropModalOpen(false);
  };

  // --- EASING FUNCTIONS FOR SMOOTH ANIMATION ---
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const easeOutBack = (x: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  };

  // --- VIDEO GENERATION ENGINE ---
  const generateVideo = useCallback(async () => {
    if (!canvasRef.current || !letterRef.current || !envelopeRef.current) return;
    
    setIsGenerating(true);
    setProgress(0);

    try {
      // 1. Capture Elements (DOM to Image)
      const envDataUrl = await toPng(envelopeRef.current, { pixelRatio: 2 });
      const envImg = new Image();
      envImg.src = envDataUrl;
      await envImg.decode(); 

      const letterDataUrl = await toPng(letterRef.current, { pixelRatio: 2 });
      const letterImg = new Image();
      letterImg.src = letterDataUrl;
      await letterImg.decode(); 

      // 2. Setup Canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const W = 1920; 
      const H = 1080; 
      canvas.width = W;
      canvas.height = H;

      // 3. Recorder Setup
      // @ts-ignore
      const stream = canvas.captureStream ? canvas.captureStream(60) : (canvas as any).mozCaptureStream(60); 
      
      const mimeTypes = [
        "video/webm; codecs=vp9",
        "video/webm; codecs=vp8",
        "video/webm",
        "video/mp4", 
      ];
      
      let selectedMimeType = "";
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          break;
        }
      }
      if (!selectedMimeType) selectedMimeType = "video/webm";

      const recorder = new MediaRecorder(stream, { 
          mimeType: selectedMimeType,
          videoBitsPerSecond: 10000000 
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: selectedMimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = selectedMimeType.includes("mp4") ? "mp4" : "webm";
        a.download = `Postcard_For_${addressName.split(' ')[0]}.${ext}`;
        a.click();
        setIsGenerating(false);
      };
      
      recorder.start();

      // 4. Animation Loop
      const FPS = 60;
      const durationSeconds = 15; 
      const totalFrames = durationSeconds * FPS;
      let frame = 0;

      const envW = 900; 
      const envH = 600; 
      const centerX = W / 2;
      const centerY = H / 2;

      const animate = () => {
         if (frame > totalFrames) {
            recorder.stop();
            return;
         }

         // Background (Desk)
         ctx.fillStyle = "#2b221e";
         ctx.fillRect(0, 0, W, H);
         const grad = ctx.createRadialGradient(centerX, centerY, 300, centerX, centerY, 1200);
         grad.addColorStop(0, "rgba(255,255,255,0.05)");
         grad.addColorStop(1, "rgba(0,0,0,0.5)");
         ctx.fillStyle = grad;
         ctx.fillRect(0,0, W, H);

         // --- TIMELINE (in Frames @ 60fps) ---
         const phase1_Wait = 60; 
         const phase2_Flip = 60; 
         const phase3_Open = 40; 
         const phase4_Slide = 90; 
         const phase5_Zoom = 120; 

         const flipProgress = Math.min(1, Math.max(0, (frame - phase1_Wait) / phase2_Flip));
         const flipEase = easeInOutCubic(flipProgress);

         const flapProgress = Math.min(1, Math.max(0, (frame - (phase1_Wait + phase2_Flip)) / phase3_Open));
         const flapEase = easeInOutCubic(flapProgress);

         const slideProgress = Math.min(1, Math.max(0, (frame - (phase1_Wait + phase2_Flip + 20)) / phase4_Slide));
         const slideEase = easeOutBack(slideProgress); 

         const zoomProgress = Math.min(1, Math.max(0, (frame - (phase1_Wait + phase2_Flip + phase3_Open)) / phase5_Zoom));
         const zoomEase = easeInOutCubic(zoomProgress);

         // --- CAMERA LOGIC ---
         const letterSlideDistance = 550; 
         const cameraPanY = slideEase * letterSlideDistance * 0.95; 
         
         const zoomStart = 1.0;
         const zoomEnd = 1.25;
         const camZoom = zoomStart + (zoomEase * (zoomEnd - zoomStart));

         ctx.save();
         // 1. Center Camera
         ctx.translate(centerX, centerY);
         // 2. Zoom Effect
         ctx.scale(camZoom, camZoom);
         // 3. Pan Camera (Move World Down to track letter moving Up)
         ctx.translate(0, cameraPanY); 
         // 4. Reset origin
         ctx.translate(-centerX, -centerY);

         if (flipEase < 0.5) { 
             // --- PHASE 1: FRONT VIEW ---
             const scaleX = 1 - (flipEase * 2); 
             ctx.save();
             ctx.translate(centerX, centerY);
             ctx.scale(Math.abs(scaleX), 1);
             
             ctx.shadowBlur = 30;
             ctx.shadowColor = "rgba(0,0,0,0.4)";
             ctx.shadowOffsetY = 20;
             ctx.drawImage(envImg, -envW/2, -envH/2, envW, envH);
             ctx.restore();

         } else {
             // --- PHASE 2: BACK VIEW & OPENING ---
             const scaleX = (flipEase - 0.5) * 2;

             ctx.save();
             ctx.translate(centerX, centerY);
             
             // Unflip
             if (flipEase < 1) ctx.scale(scaleX, 1);
             
             // 1. Envelope Body (Back Base)
             ctx.fillStyle = envColor;
             ctx.shadowBlur = 30;
             ctx.shadowColor = "rgba(0,0,0,0.4)";
             ctx.shadowOffsetY = 20;
             ctx.fillRect(-envW/2, -envH/2, envW, envH);
             ctx.shadowBlur = 0;
             ctx.shadowOffsetY = 0;

             // 2. Top Flap (Behind Letter when Open)
             const flapScale = 1 - (flapEase * 2); // 1 -> -1
             const isFlapOpen = flapScale < 0; 

             // Draw OPEN FLAP first (so it's behind the letter)
             if (isFlapOpen) {
                 ctx.save();
                 ctx.translate(0, -envH/2);
                 ctx.scale(1, flapScale); // Flipped up (negative scale)
                 ctx.fillStyle = envColor;
                 ctx.beginPath();
                 ctx.moveTo(-envW/2, 0); ctx.lineTo(0, 280); ctx.lineTo(envW/2, 0);
                 ctx.fill();
                 ctx.fillStyle = "rgba(0,0,0,0.05)"; // Shadow
                 ctx.fill();
                 ctx.restore();
             }

             // 3. Letter Sliding (Middle Layer)
             const letterY = slideEase * -letterSlideDistance;
             ctx.save();
             ctx.translate(0, letterY); 
             const cardScale = 0.94; 
             if (letterImg.complete) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = "rgba(0,0,0,0.2)";
                ctx.drawImage(letterImg, (-envW*cardScale)/2, (-envH*cardScale)/2, envW*cardScale, envH*cardScale);
             }
             ctx.restore();

             // 4. Pocket Flaps (Always Front Layer) - FIXED
             ctx.fillStyle = envColor; 
             ctx.beginPath(); 
             // Left
             ctx.moveTo(-envW/2, -envH/2); ctx.lineTo(0, 0); ctx.lineTo(-envW/2, envH/2); 
             // Right
             ctx.moveTo(envW/2, -envH/2); ctx.lineTo(0, 0); ctx.lineTo(envW/2, envH/2); 
             // Bottom
             ctx.moveTo(-envW/2, envH/2); ctx.lineTo(0, 0); ctx.lineTo(envW/2, envH/2); 
             ctx.fill();
             
             ctx.strokeStyle = "rgba(0,0,0,0.15)";
             ctx.lineWidth = 1;
             ctx.stroke();

             // 5. Top Flap (Closed state) - Only draw if not open
             if (!isFlapOpen) {
                 ctx.save();
                 ctx.translate(0, -envH/2);
                 ctx.scale(1, flapScale); 
                 ctx.fillStyle = envColor;
                 ctx.beginPath();
                 ctx.moveTo(-envW/2, 0); ctx.lineTo(0, 280); ctx.lineTo(envW/2, 0);
                 ctx.fill();
                 ctx.fillStyle = "rgba(0,0,0,0.05)";
                 ctx.fill();
                 ctx.restore();
             }

             ctx.restore(); // End Envelope Transform
         }

         ctx.restore(); // End Camera Transform

         setProgress(Math.round((frame/totalFrames) * 100));
         frame++;
         requestAnimationFrame(animate);
      };

      animate();

    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      alert("Failed to create video.");
    }
  }, [recipient, message, addressName, envColor, inkColor, fontStyle, fontSize, textAlign, sender]);

  return (
    <div className={`h-screen w-full bg-[#2a2624] text-[#1C1917] flex flex-col xl:flex-row relative overflow-hidden ${dmSans.className}`}>
      
      {/* HIDDEN CANVAS */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* --- HIDDEN RENDER TARGETS --- */}
      <div className="fixed top-0 left-[-9999px] z-[-50]">
          
          {/* 1. ENVELOPE FRONT */}
          <div ref={envelopeRef} className="w-[800px] h-[533px] relative bg-white overflow-hidden shadow-xl flex" style={{ backgroundColor: envColor }}>
             <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
             <div className="absolute top-8 right-8 border-2 border-dashed border-gray-400 p-2 w-28 h-32 flex flex-col items-center justify-center bg-white/40">
                <Stamp className="text-amber-800/60 w-10 h-10" />
                <span className={`text-xs font-bold mt-2 text-amber-900 ${courier.className}`}>POSTAGE</span>
             </div>
             <div className="absolute top-8 right-32 opacity-70 transform -rotate-12 mix-blend-multiply">
                 <div className={`w-24 h-24 rounded-full border-4 border-stone-800 flex flex-col items-center justify-center text-xs font-bold text-stone-800 text-center leading-tight ${courier.className}`}>
                    <span className="uppercase tracking-widest text-[10px]">Jakarta</span>
                    <span className="text-sm my-1">{date}</span>
                    <span className="uppercase tracking-widest text-[10px]">Post</span>
                 </div>
                 <div className="w-40 h-8 border-t-4 border-b-4 border-stone-800 absolute top-8 left-20 -z-10 opacity-80"></div>
             </div>
             <div className="absolute left-[35%] top-[55%] -translate-y-1/2 w-1/2 space-y-2 text-stone-800">
                <div className={`text-3xl font-bold ${courier.className} border-b border-stone-400/50 pb-1`}>{addressName}</div>
                <div className={`text-2xl ${courier.className} border-b border-stone-400/50 pb-1`}>{addressLine1}</div>
                <div className={`text-2xl ${courier.className} border-b border-stone-400/50 pb-1`}>{addressLine2}</div>
             </div>
             <div className="absolute bottom-6 left-6 text-stone-600 font-mono text-sm opacity-60 tracking-[0.3em] font-bold">AIR MAIL • PAR AVION</div>
          </div>

          {/* 2. LETTER */}
          <div ref={letterRef} className="w-[800px] h-[533px] flex flex-row relative bg-[#FDFCF0] overflow-hidden" >
                <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/rough-cloth.png')]" />
                <div className="w-1/2 h-full bg-[#eae8e0] overflow-hidden relative border-r border-[#d6d3c9]">
                    {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagePreview} className="w-full h-full object-cover grayscale-[0.2] sepia-[0.3] contrast-[1.1]" />
                    ) : <div className="w-full h-full bg-stone-200" />}
                    <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(70,50,30,0.2)]"></div>
                </div>
                <div className="w-1/2 h-full p-10 flex flex-col relative z-10 justify-center">
                    <div className="h-full flex flex-col justify-center space-y-6">
                        <div style={{ color: inkColor, fontSize: `${fontSize}px`, textAlign: textAlign }}>
                           <p className={`${fontMap[fontStyle].class} mb-6 text-2xl`}>{recipient}</p>
                           <p className={`${fontMap[fontStyle].class} leading-relaxed text-xl`}>{message}</p>
                           <p className={`${fontMap[fontStyle].class} mt-10 text-xl`}>{sender}</p>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-20">
                       <Stamp size={40} />
                    </div>
                </div>
          </div>
      </div>

      {/* CROP MODAL */}
      {cropModalOpen && tempImageSrc && (
        <ImageCropper src={tempImageSrc} aspectRatio={0.75} onCrop={handleCropComplete} onCancel={() => setCropModalOpen(false)} />
      )}

      {/* === LEFT PANEL: DUAL TAB EDITOR === */}
      <div className="w-full xl:w-[450px] bg-[#EFEEE9] border-r border-[#d6d3c9] flex flex-col h-full z-20 shadow-2xl relative">
         <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

         {/* Header */}
         <div className="p-6 border-b border-[#d6d3c9] bg-[#E6E4dc]/90 backdrop-blur z-10 flex-shrink-0 relative">
            <Link href="/" className={`inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-900 mb-4 ${courier.className} uppercase tracking-widest`}>
               <ArrowLeft size={14} /> Back
            </Link>
            <div className="flex justify-between items-end">
               <div>
                  <h1 className={`text-2xl font-bold text-stone-800 ${courier.className}`}>Cinema Editor</h1>
                  <p className="text-xs text-stone-500">Create animated greeting.</p>
               </div>
               <div className="w-10 h-10 bg-white border-2 border-stone-300 rounded flex items-center justify-center text-[#B45309] animate-pulse">
                  <Video size={20} />
               </div>
            </div>
         </div>

         {/* Tab Switcher */}
         <div className="flex border-b border-[#d6d3c9] relative z-10 bg-[#EFEEE9]">
            <button 
               onClick={() => setActiveTab('letter')}
               className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === 'letter' ? 'bg-[#d6d3c9] text-stone-900 shadow-inner' : 'text-stone-400 hover:text-stone-600'}`}
            >
               <MessageSquare size={14} /> Letter Content
            </button>
            <button 
               onClick={() => setActiveTab('envelope')}
               className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === 'envelope' ? 'bg-[#d6d3c9] text-stone-900 shadow-inner' : 'text-stone-400 hover:text-stone-600'}`}
            >
               <Mail size={14} /> Envelope Details
            </button>
         </div>

         {/* Scrollable Form */}
         <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10">
            {activeTab === 'letter' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Image Upload */}
                       <button onClick={() => document.getElementById("uImg")?.click()} className="p-4 border-2 border-dashed border-stone-300 bg-white hover:border-[#B45309] text-stone-400 hover:text-[#B45309] flex flex-col items-center justify-center gap-2 transition-all rounded">
                          <Upload size={20} />
                          <span className="text-[10px] font-bold uppercase">Photo</span>
                       </button>
                       <input type="file" id="uImg" hidden accept="image/*" onChange={handleImageUpload} />

                       {/* Font Style */}
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase">Font</label>
                          <div className="flex flex-col gap-1">
                             {Object.keys(fontMap).map(k => (
                                <button key={k} onClick={() => setFontStyle(k)} className={`text-xs text-left px-2 py-1 rounded border ${fontStyle === k ? 'bg-stone-800 text-white border-stone-800' : 'bg-white border-stone-300'}`}>
                                   {fontMap[k].name}
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                    
                    {/* Text Styling */}
                    <div className="flex gap-2">
                         <div className="flex-1 space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase">Size</label>
                            <input type="range" min="12" max="32" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-[#B45309]" />
                         </div>
                         <div className="flex gap-1 items-end">
                            <button onClick={() => setTextAlign('left')} className={`p-2 rounded border ${textAlign === 'left' ? 'bg-stone-300' : 'bg-white'}`}><AlignLeft size={14}/></button>
                            <button onClick={() => setTextAlign('center')} className={`p-2 rounded border ${textAlign === 'center' ? 'bg-stone-300' : 'bg-white'}`}><AlignCenter size={14}/></button>
                            <button onClick={() => setTextAlign('right')} className={`p-2 rounded border ${textAlign === 'right' ? 'bg-stone-300' : 'bg-white'}`}><AlignRight size={14}/></button>
                         </div>
                    </div>

                    {/* Content Inputs */}
                    <div className="space-y-3">
                       <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase">Greeting</label>
                          <input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full bg-white border border-stone-300 p-2 text-sm focus:border-[#B45309] outline-none" />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase">Message Body</label>
                          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-white border border-stone-300 p-2 text-sm focus:border-[#B45309] outline-none resize-none h-24" />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase">Signature</label>
                          <input value={sender} onChange={(e) => setSender(e.target.value)} className="w-full bg-white border border-stone-300 p-2 text-sm focus:border-[#B45309] outline-none" />
                       </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Envelope Color</label>
                       <div className="flex gap-2">
                          {['#d4c5a9', '#f0f0f0', '#9ca3af', '#fca5a5', '#93c5fd'].map(c => (
                             <button key={c} onClick={() => setEnvColor(c)} className={`w-8 h-8 rounded-full border-2 shadow-sm ${envColor === c ? 'border-stone-800 scale-110' : 'border-stone-300'}`} style={{ backgroundColor: c }} />
                          ))}
                       </div>
                    </div>
                    
                    <div className="space-y-3 bg-white p-4 border border-stone-200 shadow-sm">
                       <div className="flex items-center gap-2 mb-2 text-stone-400">
                          <MapPin size={14} />
                          <span className="text-[10px] font-bold uppercase">Recipient Details</span>
                       </div>
                       <input value={addressName} onChange={(e) => setAddressName(e.target.value)} className="w-full border-b border-stone-200 py-1 text-sm focus:outline-none" placeholder="Full Name" />
                       <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="w-full border-b border-stone-200 py-1 text-sm focus:outline-none" placeholder="Street Address" />
                       <input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className="w-full border-b border-stone-200 py-1 text-sm focus:outline-none" placeholder="City, State" />
                    </div>
                    
                    <div className="space-y-1">
                         <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Date</label>
                         <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-2.5 text-stone-400" />
                            <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white border border-stone-200 rounded pl-9 pr-3 py-2 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-[#B45309]" />
                         </div>
                    </div>
                </div>
            )}
         </div>

         {/* Footer */}
         <div className="p-6 border-t-2 border-dashed border-[#d6d3c9] bg-[#E6E4dc] relative z-10">
            <button onClick={generateVideo} disabled={isGenerating} className={`w-full flex items-center justify-center gap-3 bg-[#B45309] text-white py-4 font-bold text-sm hover:bg-[#92400e] transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:translate-y-0.5 uppercase tracking-widest ${courier.className}`}>
               {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Render {progress}%</> : <><Video size={18} /> Export Video</>}
            </button>
         </div>
      </div>

      {/* === RIGHT PANEL: DYNAMIC PREVIEW === */}
      <div className="flex-grow relative flex items-center justify-center p-8 overflow-hidden bg-[#2b221e]">
         <div className="absolute inset-0 opacity-100 pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`, backgroundSize: '400px' }} />
         <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_20%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

         <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
             
             {/* PREVIEW CONTAINER: SWITCHES BASED ON TAB */}
             {activeTab === 'letter' ? (
                // LETTER PREVIEW
                <div className="relative w-[700px] h-[466px] bg-[#FDFCF0] shadow-2xl overflow-hidden flex flex-row transform rotate-1 transition-transform hover:rotate-0 duration-500">
                   <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/rough-cloth.png")` }}></div>
                   
                   {/* Left Photo */}
                   <div className="w-1/2 h-full bg-[#eae8e0] overflow-hidden relative border-r border-[#d6d3c9]">
                      {imagePreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imagePreview} className="w-full h-full object-cover grayscale-[0.2] sepia-[0.3]" alt="prev"/>
                      ) : <div className="w-full h-full flex items-center justify-center text-stone-300"><ImageIcon size={40}/></div>}
                      <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(70,50,30,0.2)] pointer-events-none"></div>
                   </div>

                   {/* Right Text */}
                   <div className="w-1/2 h-full p-8 flex flex-col relative z-10">
                      <div style={{ color: inkColor, textAlign: textAlign }} className="h-full flex flex-col">
                          <p className={`${fontMap[fontStyle].class} mb-4`} style={{ fontSize: `${fontSize}px` }}>{recipient}</p>
                          <p className={`${fontMap[fontStyle].class} leading-relaxed`} style={{ fontSize: `${fontSize}px` }}>{message}</p>
                          <p className={`${fontMap[fontStyle].class} mt-auto`} style={{ fontSize: `${fontSize}px` }}>{sender}</p>
                      </div>
                   </div>
                </div>
             ) : (
                // ENVELOPE PREVIEW
                <div className="relative w-[600px] h-[400px] shadow-2xl flex items-center justify-center" style={{ backgroundColor: envColor }}>
                    <div className="absolute top-4 right-4 border border-dashed border-gray-500/50 p-2 w-20 h-24 flex flex-col items-center justify-center bg-white/20">
                       <Stamp className="text-stone-700/50" />
                    </div>
                    <div className="text-left w-2/3 ml-20 space-y-2 text-[#333]">
                       <p className={`text-2xl font-bold ${courier.className}`}>{addressName}</p>
                       <p className={`text-xl ${courier.className}`}>{addressLine1}</p>
                       <p className={`text-xl ${courier.className}`}>{addressLine2}</p>
                    </div>
                    <div className="absolute bottom-4 left-4 text-[10px] font-mono text-stone-600 opacity-60">
                       PREVIEW MODE: FRONT
                    </div>
                </div>
             )}

             <div className="mt-10 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-stone-300 text-xs font-mono uppercase tracking-widest">
                Editing: {activeTab === 'letter' ? 'Inside Content' : 'Envelope Front'}
             </div>
         </div>
      </div>

    </div>
  );
}