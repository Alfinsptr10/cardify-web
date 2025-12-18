"use client";

import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Save, Music, Image as ImageIcon, MessageSquare, 
  Play, Pause, Plus, Trash2, Link as LinkIcon, Check,
  Heart, Cake, ChevronLeft, ChevronRight, X, SkipBack, SkipForward, Gamepad2,
  ArrowUp, ArrowDown, ArrowRight as IconArrowRight, ArrowLeft as IconArrowLeft, Disc, Upload, Palette, Loader2
} from "lucide-react";
// REMOVED: import Link from "next/link"; -> Diganti dengan <a> agar kompatibel

// --- FIREBASE IMPORTS ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// --- FIREBASE CONFIG ---
const manualConfig = {
  apiKey: "AIzaSyDdm9H9HcpHEcxLaqsmNqcJ41aOExkU2hk",             
  authDomain: "web-story-51112.firebaseapp.com",         
  projectId: "web-story-51112",          
  storageBucket: "web-story-51112.firebasestorage.app",
  messagingSenderId: "61476471738",
  appId: "1:61476471738:web:2ce7c42a9b08e9fb0f9383"
};

declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;

let firebaseConfig = manualConfig;
try {
    const envConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
    const envConfig = JSON.parse(envConfigStr);
    if (envConfig && envConfig.apiKey) {
        firebaseConfig = envConfig;
    }
} catch (e) {
    console.log("Using manual config");
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'cardify-app';

let app: any = null;
let auth: any = null;
let db: any = null;

if (firebaseConfig && firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase Init Error:", e);
  }
}

// --- DATA & CONFIG ---
const SONGS_LIBRARY = [
  { title: "Happy Birthday", artist: "Traditional", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "/cat.jpg" },
];

const GAMEBOY_COLORS = [
  { id: 'white', label: 'Classic White', bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-400' },
  { id: 'grey', label: 'Retro Grey', bg: 'bg-gray-300', border: 'border-gray-400', text: 'text-gray-600' },
  { id: 'purple', label: 'Atomic Purple', bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-purple-200' },
  { id: 'teal', label: 'Teal', bg: 'bg-teal-400', border: 'border-teal-600', text: 'text-teal-800' },
  { id: 'yellow', label: 'Dandelion', bg: 'bg-yellow-400', border: 'border-yellow-600', text: 'text-yellow-800' },
  { id: 'pink', label: 'Berry', bg: 'bg-rose-400', border: 'border-rose-500', text: 'text-rose-200' },
];

// --- GAMEBOY COMPONENT (PREVIEW ONLY) ---
const GameboyPreview = ({ data, songs }: { data: any, songs: any[] }) => {
  const [screenView, setScreenView] = useState<'intro' | 'menu'>('intro');
  const [activePopup, setActivePopup] = useState<'none' | 'message' | 'music' | 'gallery'>('none');
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0); 
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs.find(s => s.title === data.music) || songs[0];
  const displayCover = data.musicCover || currentSong.cover;
  const activeColor = GAMEBOY_COLORS.find(c => c.id === data.color) || GAMEBOY_COLORS[0];

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) audioRef.current.play().catch(e => console.log("Audio preview blocked", e));
        else audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const nextPhoto = () => {
    if (data.gallery.length > 0) setPhotoIndex(prev => (prev + 1) % data.gallery.length);
  };
  const prevPhoto = () => {
    if (data.gallery.length > 0) setPhotoIndex(prev => (prev - 1 + data.gallery.length) % data.gallery.length);
  };

  // Interactive Buttons
  const handleStart = () => {
    // Tombol Start bisa untuk masuk menu ATAU kembali ke intro jika sudah di menu
    setScreenView(prev => prev === 'intro' ? 'menu' : 'intro');
  };

  const handleButtonB = () => {
    if (activePopup !== 'none') {
        setActivePopup('none');
    } else if (screenView === 'menu') {
        setScreenView('intro');
    }
  };

  const handleButtonA = () => {
     if (screenView === 'intro') {
         // Tombol A TIDAK LAGI membuka menu dari intro. Hanya Start.
         return; 
     } else if (screenView === 'menu' && activePopup === 'none') {
         if (selectedMenuIndex === 0) setActivePopup('message');
         else if (selectedMenuIndex === 1) setActivePopup('music');
         else if (selectedMenuIndex === 2) setActivePopup('gallery');
     } else if (activePopup === 'music') {
         setIsPlaying(!isPlaying);
     }
  };

  const handleDpad = (dir: string) => {
      // D-Pad tidak boleh berfungsi di intro
      if (screenView === 'intro') return;

      if (screenView === 'menu' && activePopup === 'none') {
          if (dir === 'UP') setSelectedMenuIndex(prev => (prev > 0 ? prev - 1 : 2));
          else if (dir === 'DOWN') setSelectedMenuIndex(prev => (prev < 2 ? prev + 1 : 0));
      }
      if (activePopup === 'gallery') {
          if (dir === 'LEFT') prevPhoto();
          if (dir === 'RIGHT') nextPhoto();
      }
  };

  return (
    <div className={`relative ${activeColor.bg} rounded-[2rem] w-[340px] h-[600px] p-5 flex flex-col shadow-2xl border-4 ${activeColor.border} transform scale-90 sm:scale-100 origin-top select-none sticky top-10 transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="flex flex-col items-center">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]"></div>
             <span className={`text-[6px] font-bold ${activeColor.text} mt-0.5 font-sans`}>BATTERY</span>
        </div>
        <div className={`font-serif font-bold text-xs ${activeColor.text} italic opacity-80`}>CARDIFY</div>
      </div>
      
      {/* Screen */}
      <div className="bg-[#788a82] p-2.5 rounded-md border-2 border-gray-400 relative mb-4 shadow-inner">
         <div className="flex justify-between items-center px-1 mb-0.5">
             <div className="flex gap-0.5">
                <div className="w-1 h-1 rounded-full bg-red-500/80"></div>
                <div className="w-1 h-1 rounded-full bg-red-500/80"></div>
             </div>
             <span className="text-[6px] text-gray-700 font-bold font-sans opacity-60">DOT MATRIX WITH STEREO SOUND</span>
         </div>
         <div className="bg-[#0f380f] w-full h-[200px] border-4 border-[#0f380f] relative overflow-hidden flex flex-col items-center justify-center font-pixel shadow-inner">
            {screenView === 'intro' && (
                <div className="text-center w-full animate-in fade-in duration-300">
                    <div className="text-[#9bbc0f] text-[16px] leading-tight mb-4 drop-shadow-md uppercase pixel-font px-2 break-words">
                        {data.title || "HAPPY BIRTHDAY"}
                    </div>
                    <div className="text-[#8bac0f] text-[8px] mb-6 animate-pulse uppercase pixel-font">
                        {data.subtitle || "PRESS START"}
                    </div>
                    <div className="flex justify-center gap-3 text-[#306230]">
                        <Heart size={16} fill="currentColor" />
                        <Cake size={16} />
                        <Heart size={16} fill="currentColor" />
                    </div>
                </div>
            )}
            {screenView === 'menu' && activePopup === 'none' && (
                <div className="w-full h-full p-2 animate-in slide-in-from-bottom duration-200">
                    <div className="text-[#9bbc0f] text-[10px] mb-2 text-center border-b border-[#306230] pb-1 pixel-font">MAIN MENU</div>
                    <div className="grid grid-cols-1 gap-1.5">
                        <div className={`text-[8px] p-1.5 text-left flex items-center gap-2 transition-colors pixel-font ${selectedMenuIndex === 0 ? 'bg-[#8bac0f] text-[#0f380f]' : 'bg-[#306230] text-[#9bbc0f]'}`}>
                            {selectedMenuIndex === 0 && <span className="animate-pulse">▶</span>} <MessageSquare size={10} /> 1. MESSAGE
                        </div>
                        <div className={`text-[8px] p-1.5 text-left flex items-center gap-2 transition-colors pixel-font ${selectedMenuIndex === 1 ? 'bg-[#8bac0f] text-[#0f380f]' : 'bg-[#306230] text-[#9bbc0f]'}`}>
                            {selectedMenuIndex === 1 && <span className="animate-pulse">▶</span>} <Music size={10} /> 2. MUSIC
                        </div>
                        <div className={`text-[8px] p-1.5 text-left flex items-center gap-2 transition-colors pixel-font ${selectedMenuIndex === 2 ? 'bg-[#8bac0f] text-[#0f380f]' : 'bg-[#306230] text-[#9bbc0f]'}`}>
                            {selectedMenuIndex === 2 && <span className="animate-pulse">▶</span>} <ImageIcon size={10} /> 3. GALLERY
                        </div>
                    </div>
                </div>
            )}
            {activePopup === 'message' && (
                <div className="absolute inset-0 bg-[#f0f0f0] z-20 flex flex-col p-1">
                    <div className="bg-white border-2 border-black p-2 h-full overflow-y-auto">
                        <div className="text-center border-b-2 border-black border-dashed pb-1 mb-2 font-bold text-[10px] pixel-font">💌 MESSAGE</div>
                        <p className="text-[10px] leading-4 text-gray-800 whitespace-pre-wrap pixel-font">{data.message}</p>
                        <p className="text-[8px] text-gray-500 mt-4 text-right pixel-font">- {data.sender}</p>
                    </div>
                    <button onClick={() => setActivePopup('none')} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-[8px] border border-black">X</button>
                </div>
            )}
{activePopup === 'music' && (
  <div className="absolute inset-0 bg-[#1a1a1a] z-20 flex flex-col items-center justify-between p-2 text-white">
    
    {/* HEADER */}
    <div className="text-[#f0b230] text-[8px] pixel-font mt-1">
      --- MUSIC PLAYER ---
    </div>

    {/* CENTER CONTENT */}
    <div className="flex flex-col items-center justify-center flex-1 gap-2">
      
      {/* COVER */}
      <div className="w-16 h-16 bg-gray-700 border border-gray-500 flex items-center justify-center overflow-hidden relative group">
        {displayCover ? (
          <img
            src={displayCover}
            className={`w-full h-full object-cover ${isPlaying ? 'opacity-90' : 'opacity-100'}`}
            alt="art"
          />
        ) : (
          isPlaying
            ? <div className="animate-spin-slow"><Disc size={24} className="text-[#f0b230]" /></div>
            : <Music size={24} className="text-gray-400" />
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          {isPlaying
            ? <Pause className="text-white drop-shadow-md animate-pulse" size={32} />
            : <Play className="text-white drop-shadow-md" size={32} />
          }
        </div>
      </div>

      {/* SONG TITLE */}
      <div className="text-[#8fdb7f] text-[8px] text-center pixel-font max-w-[120px] truncate">
        {currentSong.title}
      </div>

      {/* ARTIST */}
      <div className="text-gray-400 text-[6px] text-center pixel-font">
        {currentSong.artist}
      </div>
    </div>

    {/* FOOTER */}
    <div className="text-[6px] text-gray-600 pixel-font mb-1">
      A: Play/Pause • B: Back
    </div>

    <audio ref={audioRef} src={currentSong.src} loop />
  </div>
)}

            {activePopup === 'gallery' && (
                <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-2">
                     {data.gallery.length > 0 ? (
                         <>
                            <div className="w-full h-[140px] bg-gray-100 mb-2 border border-black relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={data.gallery[photoIndex]} className="w-full h-full object-cover" alt="Gallery" />
                                <button onClick={prevPhoto} className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-1 rounded-full"><ChevronLeft size={12}/></button>
                                <button onClick={nextPhoto} className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-1 rounded-full"><ChevronRight size={12}/></button>
                            </div>
                            <div className="text-[8px] font-bold pixel-font">PHOTO {photoIndex + 1}/{data.gallery.length}</div>
                         </>
                     ) : <div className="text-[8px] text-gray-500 pixel-font">NO PHOTOS ADDED</div>}
                     <button onClick={() => setActivePopup('none')} className="mt-1 text-[8px] text-red-500 hover:underline pixel-font">CLOSE</button>
                </div>
            )}
         </div>
      </div>
      <div className="relative h-[220px]">
          <div className="absolute top-4 left-4 w-[110px] h-[110px]">
               <div className="relative w-full h-full">
                   <div className="absolute top-0 left-1/3 w-1/3 h-full bg-[#333] rounded-sm"></div>
                   <div className="absolute top-1/3 left-0 w-full h-1/3 bg-[#333] rounded-sm"></div>
                   <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-[#2a2a2a] rounded-full"></div>
                   <button onClick={() => handleDpad('UP')} className="absolute top-0 left-1/3 w-1/3 h-1/3 z-10 active:bg-white/10 rounded-t-sm" />
                   <button onClick={() => handleDpad('DOWN')} className="absolute bottom-0 left-1/3 w-1/3 h-1/3 z-10 active:bg-white/10 rounded-b-sm" />
                   <button onClick={() => handleDpad('LEFT')} className="absolute top-1/3 left-0 w-1/3 h-1/3 z-10 active:bg-white/10 rounded-l-sm" />
                   <button onClick={() => handleDpad('RIGHT')} className="absolute top-1/3 right-0 w-1/3 h-1/3 z-10 active:bg-white/10 rounded-r-sm" />
               </div>
          </div>
          <div className="absolute top-6 right-1 flex gap-5 transform -rotate-12">
               <div className="flex flex-col items-center gap-1 mt-6">
                   <button onClick={handleButtonB} className="w-12 h-12 rounded-full bg-[#d33c3c] border-b-4 border-[#8f2121] active:border-b-0 active:translate-y-1 transition-all shadow-lg text-[#5e1616] font-bold text-sm pixel-font flex justify-center items-center">B</button>
               </div>
               <div className="flex flex-col items-center gap-1">
                   <button onClick={handleButtonA} className="w-12 h-12 rounded-full bg-[#d33c3c] border-b-4 border-[#8f2121] active:border-b-0 active:translate-y-1 transition-all shadow-lg text-[#5e1616] font-bold text-sm pixel-font flex justify-center items-center">A</button>
               </div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4">
               <div className="flex flex-col items-center">
                   <button onClick={handleStart} className="w-16 h-4 bg-[#999] rounded-full transform rotate-[-25deg] border border-gray-600 active:scale-95 shadow-sm"></button>
                   <span className={`text-[9px] font-bold ${activeColor.text} mt-1 uppercase tracking-wider font-sans opacity-70 transform rotate-[-27deg] translate-x-2`}>Select</span>
               </div>
               <div className="flex flex-col items-center">
                   <button onClick={handleStart} className="w-16 h-4 bg-[#999] rounded-full transform rotate-[-25deg] border border-gray-600 active:scale-95 shadow-sm"></button>
                   <span className={`text-[9px] font-bold ${activeColor.text} mt-1 uppercase tracking-wider font-sans opacity-70 transform rotate-[-27deg] translate-x-2`}>Start</span>
               </div>
          </div>
          <div className="absolute bottom-6 right-6 flex gap-1 transform -rotate-12 opacity-30 pointer-events-none">
               {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-8 bg-black/20 rounded-full inset-shadow" />)}
          </div>
      </div>
    </div>
  );
};

export default function WebStoryEditor() {
  const [activeTab, setActiveTab] = useState<'message' | 'music' | 'gallery' | 'design'>('message');
  const [generatedLink, setGeneratedLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [songs, setSongs] = useState(SONGS_LIBRARY); 
  const [storyData, setStoryData] = useState({
     title: "HAPPY BIRTHDAY",
     subtitle: "PRESS START BUTTON",
     message: "Selamat ulang tahun! Semoga panjang umur dan sehat selalu.",
     sender: "Temanmu",
     music: "Happy Birthday",
     musicCover: null as string | null,
     gallery: [
       "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400",
       "https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&q=80&w=400"
     ],
     color: 'white'
  });

  const handleChange = (field: string, value: any) => setStoryData(prev => ({ ...prev, [field]: value }));
  
  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
        if(file.size > 750 * 1024) return alert("Ukuran audio max 750KB untuk demo ini.");
        const reader = new FileReader();
        reader.onload = (event) => {
           const newSong = { title: file.name.substring(0, 20), artist: "Custom Upload", src: event.target?.result as string, cover: storyData.musicCover || "/retro-gameboy.png" };
           setSongs([newSong, ...songs]);
           handleChange('music', newSong.title);
        };
        reader.readAsDataURL(file);
    }
  };
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
        if(file.size > 500 * 1024) return alert("Ukuran cover max 500KB.");
        const reader = new FileReader();
        reader.onload = (event) => handleChange('musicCover', event.target?.result as string);
        reader.readAsDataURL(file);
    }
  };
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
        if(file.size > 500 * 1024) return alert("Ukuran foto max 500KB.");
        const reader = new FileReader();
        reader.onload = (ev) => setStoryData(prev => ({...prev, gallery: [...prev.gallery, ev.target?.result as string]}));
        reader.readAsDataURL(file);
    }
  };
  const handleRemovePhoto = (index: number) => setStoryData(prev => ({...prev, gallery: prev.gallery.filter((_, i) => i !== index)}));

  // --- FIREBASE SAVE ---
  const handlePublish = async () => {
    setIsSaving(true);
    
    // Auth Check
    if (!auth) {
        try {
            await signInAnonymously(auth);
        } catch (e) {
            console.error("Auth error", e);
        }
    }
    
    try {
        const payload = {
            title: storyData.title || "",
            subtitle: storyData.subtitle || "",
            message: storyData.message || "",
            sender: storyData.sender || "",
            music: storyData.music || "",
            musicCover: storyData.musicCover || null,
            gallery: (storyData.gallery || []).filter(item => typeof item === 'string' && item.length > 0),
            color: storyData.color || "white",
            customSongs: songs
                .filter(s => s.artist === "Custom Upload")
                .map(s => ({
                    title: s.title || "Untitled",
                    artist: "Custom Upload",
                    src: s.src || "",
                    cover: s.cover || "/retro-gameboy.png"
                })),
            createdAt: new Date().toISOString(),
            type: "gameboy-v1",
            creatorId: auth?.currentUser?.uid || "anon"
        };
        
        // Simpan ke collection khusus 'gameboy-stories'
        const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'gameboy-stories'), payload);
        
        // Generate Link dengan ID Firestore asli
        const link = `${window.location.origin}/gameboy-app/${docRef.id}`;
        setGeneratedLink(link);
    } catch (error) {
        console.error("Save Error:", error);
        alert("Gagal menyimpan ke server. Data mungkin terlalu besar (>1MB). Kurangi ukuran file.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col md:flex-row text-[#1C1917] font-sans">
       <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          .pixel-font { font-family: 'Press Start 2P', cursive; }
          .font-pixel { font-family: 'Press Start 2P', cursive; }
          .animate-spin-slow { animation: spin 3s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />

       {/* --- LEFT PANEL: EDITOR (AUTO HEIGHT) --- */}
       <div className="w-full md:w-1/3 p-6 md:p-8 bg-[#FAFAF9] border-r border-stone-200">
          <div className="max-w-md mx-auto">
              {/* REPLACED Link with <a> */}
              <a href="/" className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-900 uppercase tracking-widest mb-8">
                 <ArrowLeft size={14} /> Back to Dashboard
              </a>
              
              <h1 className="text-2xl font-bold mb-2">Create Web Story</h1>
              <p className="text-stone-500 mb-6 text-sm">Customize your retro gameboy card content.</p>

              {/* TABS */}
              <div className="flex gap-2 mb-6 border-b border-stone-200 pb-1 overflow-x-auto">
                 {['message', 'design', 'music', 'gallery'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-2 px-3 text-sm font-bold transition-all capitalize whitespace-nowrap ${activeTab === tab ? 'text-amber-600 border-b-2 border-amber-500' : 'text-stone-400'}`}>{tab}</button>
                 ))}
              </div>

              {/* FORM CONTENT */}
              <div className="space-y-6">
                 {activeTab === 'message' && (
                     <div className="space-y-4 animate-in fade-in duration-300">
                        <div><label className="block text-xs font-bold text-stone-500 uppercase mb-2">Title</label><input type="text" value={storyData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg p-3 text-sm outline-none" placeholder="e.g. HAPPY BIRTHDAY" /></div>
                        <div><label className="block text-xs font-bold text-stone-500 uppercase mb-2">Subtitle</label><input type="text" value={storyData.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg p-3 text-sm outline-none" placeholder="e.g. PRESS START" /></div>
                        <div><label className="block text-xs font-bold text-stone-500 uppercase mb-2">Message</label><textarea rows={6} value={storyData.message} onChange={(e) => handleChange('message', e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg p-3 text-sm outline-none" placeholder="Message..." /></div>
                        <div><label className="block text-xs font-bold text-stone-500 uppercase mb-2">Sender</label><input type="text" value={storyData.sender} onChange={(e) => handleChange('sender', e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg p-3 text-sm outline-none" placeholder="From..." /></div>
                     </div>
                 )}
                 {activeTab === 'design' && (
                     <div className="space-y-4 animate-in fade-in duration-300">
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Color Theme</label>
                        <div className="grid grid-cols-2 gap-3">
                           {GAMEBOY_COLORS.map((color) => (
                              <div key={color.id} onClick={() => handleChange('color', color.id)} className={`cursor-pointer rounded-xl p-3 flex items-center gap-3 border transition-all ${storyData.color === color.id ? 'border-amber-400 bg-amber-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                                 <div className={`w-8 h-8 rounded-full shadow-sm border ${color.bg} ${color.border}`}></div>
                                 <span className="text-xs font-medium text-stone-700">{color.label}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                 )}
                 {activeTab === 'music' && (
                     <div className="space-y-4 animate-in fade-in duration-300">
                        <label className="flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 hover:border-amber-400 transition-all group"><Upload size={20} className="text-stone-500 group-hover:text-amber-600" /><div className="text-center"><span className="text-xs font-bold text-stone-600 uppercase block">Upload Song</span><span className="text-[10px] text-stone-400">Max 750KB</span></div><input type="file" accept="audio/*" className="hidden" onChange={handleMusicUpload} /></label>
                        <div><label className="block text-xs font-bold text-stone-500 uppercase mb-2">Cover Art</label><div className="flex gap-4 items-center"><div className="w-16 h-16 bg-stone-100 rounded-lg border border-stone-200 overflow-hidden flex-shrink-0">{storyData.musicCover ? <img src={storyData.musicCover} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-400"><ImageIcon size={20} /></div>}</div><label className="cursor-pointer bg-white border border-stone-200 hover:bg-stone-50 px-4 py-2 rounded-lg text-xs font-bold text-stone-600 transition-colors">Upload Cover<input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} /></label></div></div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 mt-4">
                           {songs.map((song) => (<div key={song.title} onClick={() => handleChange('music', song.title)} className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${storyData.music === song.title ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-200'}`}><div className="flex items-center gap-3 overflow-hidden"><div className="w-8 h-8 bg-stone-100 rounded-full flex-shrink-0 overflow-hidden"><img src={song.cover} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} /></div><span className="text-xs font-bold text-stone-800 truncate">{song.title}</span></div>{storyData.music === song.title && <Check size={16} className="text-amber-500" />}</div>))}
                        </div>
                     </div>
                 )}
                 {activeTab === 'gallery' && (
                     <div className="space-y-4 animate-in fade-in duration-300">
                         <label className="flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 hover:border-amber-400 transition-all group"><Upload size={20} className="text-stone-500 group-hover:text-amber-600" /><div className="text-center"><span className="text-xs font-bold text-stone-600 uppercase block">Upload Photo</span><span className="text-[10px] text-stone-400">Max 500KB</span></div><input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} /></label>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                           {storyData.gallery.map((img, idx) => (<div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm"><img src={img} className="w-full h-full object-cover" /><button onClick={() => handleRemovePhoto(idx)} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button></div>))}
                        </div>
                     </div>
                 )}
              </div>
              <div className="mt-8 pt-6 border-t border-stone-200">
                  {!generatedLink ? (
                      <button onClick={handlePublish} disabled={isSaving} className="w-full py-4 bg-[#1C1917] text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">{isSaving ? <><Loader2 className="animate-spin" size={16}/> Saving...</> : "Publish & Generate Link"} {!isSaving && <Save size={16} />}</button>
                  ) : (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-in slide-in-from-bottom duration-300">
                         <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-2"><Check size={16} /> Link Generated!</div>
                         <div className="flex gap-2"><input readOnly value={generatedLink} className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-xs text-stone-600" /><button onClick={() => navigator.clipboard.writeText(generatedLink)} className="p-2 bg-white border border-green-200 rounded-lg text-green-600 hover:bg-green-100"><LinkIcon size={16} /></button></div>
                         <a href={generatedLink} target="_blank" className="block text-center mt-3 text-xs font-bold text-green-700 underline">Open Viewer</a>
                         <button onClick={() => setGeneratedLink("")} className="block w-full text-center mt-4 text-[10px] text-stone-400 hover:text-stone-600">Create New Story</button>
                      </div>
                  )}
              </div>
          </div>
       </div>

       {/* --- RIGHT PANEL: PREVIEW (AUTO HEIGHT) --- */}
       <div className="w-full md:w-2/3 bg-[#e0f2fe] flex items-center justify-center p-8 relative overflow-hidden min-h-screen">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
           <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
           <div className="relative z-10 flex flex-col items-center sticky top-10">
               <span className="mb-6 px-4 py-1.5 bg-white/60 backdrop-blur rounded-full text-xs font-bold text-sky-700 uppercase tracking-widest border border-white shadow-sm">Interactive Preview</span>
               <GameboyPreview data={storyData} songs={songs} />
               <p className="mt-6 text-[10px] text-stone-400 font-medium tracking-wider uppercase text-center max-w-xs">Use D-Pad to Navigate • A to Select • B to Back</p>
           </div>
       </div>
    </div>
  );
}