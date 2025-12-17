"use client";

import { useState, useEffect, useRef } from "react";
// REMOVED: import Link from "next/link"; -> Replaced with <a> tag
import { 
  ArrowLeft, Image as ImageIcon, 
  Share2, X, Eye, Loader2, Copy, Check, Music, Play, Type, Plus, Trash2, Upload, Heart, Camera, Headphones, Cloud, Sun, Pause, Disc, Link as LinkIcon, FileAudio, Home, Mail
} from "lucide-react";

// REMOVED: import { ... } from "next/font/google"; -> Replaced with standard CSS import below

// Import Firebase modules
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// --- KONFIGURASI BACKGROUND (EDITOR) ---
// Ganti background editor menjadi field.jpeg
const EDITOR_BG_IMAGE = "/field.jpeg";

// --- MOCK FONTS (Standard CSS Classes replacement) ---
const dmSans = { className: "font-dm-sans" };
const playfair = { className: "font-playfair" };
const caveat = { className: "font-caveat" };
const greatVibes = { className: "font-great-vibes" };
const pressStart = { className: "font-press-start" };

// --- KONFIGURASI DATABASE (FIREBASE) ---
const manualConfig = {
  apiKey: "AIzaSyDdm9H9HcpHEcxLaqsmNqcJ41aOExkU2hk",             
  authDomain: "web-story-51112.firebaseapp.com",         
  projectId: "web-story-51112",          
  storageBucket: "web-story-51112.firebasestorage.app",
  messagingSenderId: "61476471738",
  appId: "1:61476471738:web:2ce7c42a9b08e9fb0f9383"
};

// --- FIREBASE INIT (SAFE MODE) ---
declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

let firebaseConfig = manualConfig;
try {
    const envConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
    const envConfig = JSON.parse(envConfigStr);
    if (envConfig && envConfig.apiKey) {
        firebaseConfig = envConfig;
    }
} catch (e) {
    console.log("Using manual config due to parse error");
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'cardify-app';

let app: any = null;
let auth: any = null;
let db: any = null;
let isDbReady = false;

if (firebaseConfig && firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    isDbReady = true;
  } catch (e) {
    console.error("Firebase Init Error:", e);
  }
}

// --- COMPONENTS VISUAL ---

// UPDATED: BackgroundEffects supports custom image
const BackgroundEffects = ({ image }: { image?: string }) => {
  if (image) {
      return (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
             <div className="absolute inset-0 bg-black/40 z-10" />
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={image} alt="Background" className="w-full h-full object-cover animate-in fade-in duration-1000" />
          </div>
      );
  }
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#e0f7fa]">
       <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#B2EBF2] to-[#FAFAF9]" />
       <div className="absolute -top-20 -right-20 opacity-50 animate-spin-slow" style={{ animationDuration: '60s' }}>
          <Sun size={400} className="text-yellow-200 fill-yellow-100" />
       </div>
       {/* ... clouds ... */}
       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
    </div>
  );
};

const HangingMenu = ({ icon: Icon, label, onClick, delay = 0, rotation = 0, img }: any) => (
  <div onClick={onClick} className="flex flex-col items-center group cursor-pointer animate-in fade-in slide-in-from-top-10 duration-1000 animate-float" style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}>
    <div className="relative transform transition-all hover:scale-110 hover:z-20 hover:drop-shadow-2xl">
        <div className="w-64 h-64 md:w-56 md:h-56 relative filter drop-shadow-2xl transition-all duration-300">
            {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={label} className="w-full h-full object-contain" onError={(e) => {e.currentTarget.style.display='none'}} />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white rounded-full border-4 border-stone-100 shadow-inner">
                    <Icon size={64} className="text-stone-300"/>
                </div>
            )}
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50 whitespace-nowrap transform group-hover:-translate-y-2 transition-transform">
             <span className={`text-xs font-bold uppercase tracking-widest text-stone-600 ${dmSans.className}`}>{label}</span>
        </div>
    </div>
  </div>
);

const Polaroid = ({ img, caption, rotation = 0, onClick, delay = 0 }: any) => (
  <div 
    className="flex flex-col items-center group relative animate-float" 
    style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}
  >
    <div 
      onClick={onClick}
      className="relative bg-white p-3 pb-10 shadow-xl transform transition-all hover:scale-105 hover:z-30 hover:shadow-2xl duration-300 w-64 cursor-pointer rounded-sm"
    >
      <div className="aspect-square bg-stone-100 overflow-hidden mb-3 border border-stone-100 relative group">
         {img ? (
           // eslint-disable-next-line @next/next/no-img-element
           <img src={img} alt={caption} className="w-full h-full object-cover" />
         ) : (
           <div className="w-full h-full flex flex-col items-center justify-center text-sky-300 bg-sky-50 gap-2">
              <ImageIcon size={32} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Tap to Edit</span>
           </div>
         )}
      </div>
      <p className={`text-center text-stone-600 text-lg ${caveat.className} min-h-[1.5em] leading-tight px-1`}>
        {caption || <span className="text-stone-300 italic">Caption...</span>}
      </p>
    </div>
  </div>
);

const HangingString = ({ length = 8 }: { length?: number }) => (
  <div className="relative w-12 h-24 flex justify-center mb-2">
    <div className="w-0.5 bg-gradient-to-b from-stone-400 to-stone-300" style={{ height: `${length * 4}px` }}></div>
  </div>
);

const StickyNote = ({ text, color = "#fef3c7", rotation = 0, onClick, delay = 0 }: any) => (
  <div 
    className="flex flex-col items-center group relative animate-float" 
    style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}
  >
    <div 
      onClick={onClick}
      className="relative p-6 shadow-lg transform transition-all hover:scale-105 hover:z-20 hover:shadow-xl duration-300 w-64 mx-auto flex items-center justify-center text-center cursor-pointer group"
      style={{ backgroundColor: color, minHeight: '200px' }}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-black/5 rounded-full blur-sm"></div> 
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-2 backdrop-blur-sm shadow-sm"></div> 
      
      <div className="w-full mt-4">
          <p className={`text-xl leading-relaxed text-stone-800 ${caveat.className} w-full break-words`}>{text}</p>
      </div>
    </div>
  </div>
);

// UPDATED: TitleCard with Rose/Pink theme and flexible height
const TitleCard = ({ title, subtitle, onClick, onEdit }: { title: string, subtitle: string, onClick?: () => void, onEdit?: (field: string, value: string) => void }) => (
  <div className="flex flex-col items-center group relative animate-float-slow w-full px-4">
    <div onClick={onClick} className="text-center relative mt-4 max-w-full cursor-pointer hover:scale-105 transition-transform duration-300">
      {/* Changed border color to rose-200 and shadow to match pink theme */}
      <div className="inline-block border-[6px] border-double border-rose-200 p-8 bg-white shadow-[0_10px_30px_-5px_rgba(251,113,133,0.2)] relative rounded-xl rotate-1 min-w-[320px] max-w-full">
          {onEdit ? (
            <div className="space-y-2 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                {/* Replaced input with textarea for auto-wrap/size adaptation */}
                <textarea 
                    value={title}
                    onChange={(e) => onEdit('title', e.target.value)}
                    className={`w-full text-center text-5xl md:text-6xl text-rose-500 bg-transparent border-b border-transparent hover:border-rose-200 focus:border-rose-300 focus:outline-none transition-colors resize-none overflow-hidden ${greatVibes.className}`}
                    placeholder="Your Title"
                    rows={1}
                    style={{ minHeight: '80px', height: 'auto' }}
                    onInput={(e) => {
                        // Auto-grow height script
                        e.currentTarget.style.height = 'auto'; 
                        e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                    }}
                />
                <div className="w-20 h-1 bg-rose-300 mx-auto mb-4 rounded-full opacity-50"></div>
                <textarea 
                    value={subtitle}
                    onChange={(e) => onEdit('subtitle', e.target.value)}
                    className={`w-full text-center text-lg text-stone-500 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-stone-300 focus:outline-none italic resize-none overflow-hidden ${dmSans.className}`}
                    placeholder="Your Subtitle"
                    rows={1}
                    onInput={(e) => {
                        e.currentTarget.style.height = 'auto'; 
                        e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                    }}
                />
            </div>
          ) : (
             <>
                <h1 className={`text-5xl md:text-7xl font-bold text-rose-500 mb-2 ${greatVibes.className} drop-shadow-sm`}>{title || "Title Here"}</h1>
                <div className="w-20 h-1 bg-rose-300 mx-auto mb-4 rounded-full"></div>
                <p className={`text-xl text-stone-500 italic ${dmSans.className}`}>{subtitle || "Subtitle Here"}</p>
             </>
          )}
      </div>
    </div>
  </div>
);

// --- MENU ILLUSTRATIONS ---
const CameraMenu = ({ onClick }: { onClick: () => void }) => (
  <HangingMenu img="/template/camera.png" label="Gallery" onClick={onClick} icon={Camera} rotation={2} delay={0} />
);

const LetterMenu = ({ onClick }: { onClick: () => void }) => (
  <HangingMenu img="/template/letter.png" label="Read Note" onClick={onClick} icon={Heart} rotation={-2} delay={200} />
);

const MusicMenu = ({ onClick, currentSong }: { onClick: () => void, currentSong: string }) => (
  <HangingMenu img="/template/music.png" label="Music" onClick={onClick} icon={Headphones} rotation={1} delay={400} />
);

// --- MODAL EDITOR COMPONENT ---
const EditModal = ({ slide, onClose, onUpdate, onDelete, onImageUpload }: any) => {
    if (!slide) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white/95 backdrop-blur rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/50">
                <div className="p-5 border-b border-sky-100 flex justify-between items-center bg-sky-50/50">
                    <span className="text-xs font-bold text-sky-500 uppercase tracking-widest flex items-center gap-2">
                        Edit Content
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => onDelete(slide.id)} className="p-2 hover:bg-red-50 text-rose-300 hover:text-red-500 rounded-full transition-colors"><Trash2 size={18} /></button>
                        <button onClick={onClose} className="p-2 hover:bg-stone-100 text-stone-400 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
                    {slide.type === 'photo' && (
                        <>
                            <div className="space-y-2">
                                <input type="file" id="modal-upload" className="hidden" accept="image/*" onChange={(e) => onImageUpload(e, slide.id)} />
                                <button onClick={() => document.getElementById("modal-upload")?.click()} className="w-full h-64 bg-sky-50 border-2 border-dashed border-sky-200 rounded-2xl flex flex-col items-center justify-center text-sky-400 hover:border-sky-400 transition-all overflow-hidden relative group">
                                    {slide.img ? <img src={slide.img} className="w-full h-full object-cover" alt="upload" /> : <><ImageIcon size={28} className="mb-2"/><span className="text-xs font-bold uppercase">Upload Photo</span></>}
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Caption</label>
                                <input value={slide.caption} onChange={(e) => onUpdate(slide.id, 'caption', e.target.value)} className={`w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xl text-center ${caveat.className}`} placeholder="Caption..." />
                            </div>
                        </>
                    )}
                    {slide.type === 'message' && (
                        <textarea value={slide.text} onChange={(e) => onUpdate(slide.id, 'text', e.target.value)} className={`w-full bg-[#fefce8] border border-yellow-100 rounded-xl px-5 py-4 text-2xl h-48 resize-none leading-relaxed text-stone-700 ${caveat.className}`} placeholder="Write message..." />
                    )}
                </div>
                <div className="p-4 border-t border-stone-100 bg-white flex justify-end">
                    <button onClick={onClose} className="px-8 py-3 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg">Save</button>
                </div>
            </div>
        </div>
    );
};

// --- ADD MUSIC MODAL (SOFT PINK/CREAM THEME) ---
const MusicModal = ({ playlist, onClose, onAddSong, onDeleteSong, onSelectSong, currentSongId, togglePlay, isPlaying, playingId }: any) => {
    const [newTitle, setNewTitle] = useState("");
    const [newArtist, setNewArtist] = useState("");
    const [newCover, setNewCover] = useState<string | null>(null);
    const [newAudio, setNewAudio] = useState<string | null>(null);
    
    // NEW STATE: Input Method
    const [inputType, setInputType] = useState<'upload' | 'link'>('upload');

    const activeSong = playlist.find((s: any) => s.id === currentSongId);
    const isFull = playlist.length >= 5;

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
             const reader = new FileReader();
             reader.onloadend = () => setNewCover(reader.result as string);
             reader.readAsDataURL(file);
        }
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
             if (file.size > 750 * 1024) { 
                 alert("Batas Firestore adalah 1MB/dokumen. Mohon gunakan audio di bawah 750KB atau gunakan fitur 'Link URL' untuk file besar.");
                 return;
             }
             const reader = new FileReader();
             reader.onloadend = () => setNewAudio(reader.result as string);
             reader.readAsDataURL(file);
        }
    };

    const handleAdd = () => {
        if(newTitle && newArtist && newAudio) {
            onAddSong(newTitle, newArtist, newCover, newAudio);
            setNewTitle("");
            setNewArtist("");
            setNewCover(null);
            setNewAudio(null);
        } else {
            alert("Please fill Title, Artist, and ensure Audio is uploaded or linked.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* CONTAINER UTAMA: Soft Pink/Cream, tidak terlalu terang, border tipis */}
            <div className="bg-[#fff9f9] border border-rose-100 rounded-[2rem] w-full max-w-[360px] p-6 text-stone-700 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
                
                {/* Decorative Elements - Subtle */}
                <div className="absolute top-5 left-5 w-2 h-2 rounded-full bg-rose-200"></div>
                <div className="absolute top-5 right-12 w-2 h-2 rounded-full bg-rose-200"></div>

                <button onClick={onClose} className="absolute top-3 right-3 p-2 hover:bg-rose-50 text-stone-400 hover:text-rose-400 rounded-full transition-colors z-20"><X size={18} /></button>

                {/* Header Title */}
                <div className="text-center mb-6 mt-1">
                    <h2 className={`text-stone-600 text-xl tracking-widest font-bold uppercase ${greatVibes.className} text-3xl`}>My Playlist</h2>
                    <div className="w-12 h-1 bg-rose-200 mx-auto mt-1 rounded-full"></div>
                </div>
                
                {/* NOW PLAYING SECTION (Soft) */}
                <div className="bg-white rounded-2xl p-4 border border-rose-50 mb-6 shadow-sm relative overflow-hidden group">
                    {/* Decorative bg shape */}
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-50 rounded-full blur-xl"></div>
                    
                    <div className="flex gap-4 relative z-10">
                        {/* Song Cover Image */}
                        <div className="w-20 h-20 rounded-xl bg-stone-50 shadow-sm flex-shrink-0 overflow-hidden relative border border-stone-100">
                            {activeSong?.cover ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={activeSong.cover} alt="Song Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center opacity-50 w-full h-full text-rose-300">
                                    <Disc size={28} className="animate-spin-slow mb-1" />
                                </div>
                            )}
                            {/* Play Overlay if playing */}
                            {isPlaying && (
                                <div className="absolute inset-0 bg-rose-400/20 flex items-end justify-center pb-1 gap-0.5">
                                    <div className="w-1 bg-white animate-[bounce_0.6s_infinite] h-1/2 rounded-full"></div>
                                    <div className="w-1 bg-white animate-[bounce_0.8s_infinite] h-3/4 rounded-full"></div>
                                    <div className="w-1 bg-white animate-[bounce_0.5s_infinite] h-1/3 rounded-full"></div>
                                </div>
                            )}
                        </div>

                        {/* Info & Controls */}
                        <div className="flex-1 flex flex-col justify-center min-w-0 text-left">
                            <div className="mb-2">
                                <p className="text-sm font-bold text-stone-700 truncate">{activeSong ? activeSong.title : "No Track Selected"}</p>
                                <p className="text-xs text-stone-400 font-medium uppercase tracking-wider truncate">{activeSong ? activeSong.artist : "Select a song"}</p>
                            </div>

                            {/* HTML Audio Player Control (Native) */}
                            <audio 
                                className="w-full h-6 opacity-70 hover:opacity-100 transition-opacity accent-rose-400" 
                                controls 
                                src={activeSong?.audio}
                                key={activeSong?.id || 'no-song'} 
                                autoPlay={isPlaying}
                                onPlay={() => activeSong && !isPlaying && togglePlay(activeSong.id)}
                                onPause={() => isPlaying && togglePlay(activeSong?.id)}
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </div>

                {/* PLAYLIST */}
                <div className="text-sm text-left mb-4 flex-grow overflow-y-auto custom-scrollbar pr-1" style={{ maxHeight: '200px' }}>
                    {playlist.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-rose-100 rounded-xl bg-white/50">
                            <Music size={24} className="text-rose-200 mx-auto mb-2" />
                            <p className="text-rose-300 text-xs">Playlist is empty.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {playlist.map((song: any, i: number) => (
                                <div 
                                    key={song.id} 
                                    onClick={() => onSelectSong(song.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${currentSongId === song.id ? 'bg-white border-rose-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-white hover:border-stone-100'}`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentSongId === song.id ? 'bg-rose-400 text-white' : 'bg-stone-100 text-stone-400'}`}>
                                            {currentSongId === song.id && isPlaying ? <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"/> : i + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-xs font-bold truncate max-w-[120px] ${currentSongId === song.id ? 'text-stone-800' : 'text-stone-600'}`}>{song.title}</p>
                                            <p className="text-[10px] text-stone-400 truncate max-w-[120px]">{song.artist}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); togglePlay(song.id); }} 
                                            className={`p-2 rounded-full transition-colors ${currentSongId === song.id && isPlaying ? 'text-rose-500 bg-rose-50' : 'text-stone-400 hover:bg-stone-100'}`}
                                        >
                                            {currentSongId === song.id && isPlaying ? <Pause size={12} fill="currentColor"/> : <Play size={12} fill="currentColor"/>}
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDeleteSong(song.id); }} 
                                            className="p-2 text-stone-300 hover:text-rose-400 hover:bg-rose-50 rounded-full transition-colors"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ADD NEW SONG FORM */}
                {!isFull ? (
                    <div className="bg-white p-3 rounded-2xl border border-stone-100 shrink-0 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                             <p className="text-[10px] text-stone-400 uppercase font-bold text-left pl-1 tracking-wide">Add Track ({playlist.length}/5)</p>
                             <div className="flex bg-stone-50 border border-stone-100 rounded-lg p-0.5 gap-0.5">
                                 <button onClick={() => setInputType('upload')} className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-md transition-colors ${inputType === 'upload' ? 'bg-white text-stone-700 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>Upload</button>
                                 <button onClick={() => setInputType('link')} className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-md transition-colors ${inputType === 'link' ? 'bg-white text-stone-700 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>Link</button>
                             </div>
                        </div>

                        <div className="flex gap-2 mb-2">
                            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-1/2 bg-stone-50 border border-stone-100 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:border-rose-200 focus:bg-white outline-none placeholder:text-stone-300 transition-all" placeholder="Song Title" />
                            <input value={newArtist} onChange={e => setNewArtist(e.target.value)} className="w-1/2 bg-stone-50 border border-stone-100 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:border-rose-200 focus:bg-white outline-none placeholder:text-stone-300 transition-all" placeholder="Artist Name" />
                        </div>
                        
                        <div className="flex gap-2 items-center">
                            <label className={`flex-1 bg-stone-50 hover:bg-white text-[10px] py-2 rounded-lg cursor-pointer text-center border transition-all ${newCover ? 'text-rose-500 border-rose-200 font-bold bg-rose-50' : 'text-stone-400 border-stone-100'}`}>
                                {newCover ? "Cover OK" : "+ Cover"}
                                <input type="file" hidden accept="image/*" onChange={handleCoverUpload} />
                            </label>
                            
                            {inputType === 'upload' ? (
                                <label className={`flex-1 bg-stone-50 hover:bg-white text-[10px] py-2 rounded-lg cursor-pointer text-center border transition-all ${newAudio ? 'text-rose-500 border-rose-200 font-bold bg-rose-50' : 'text-stone-400 border-stone-100'}`}>
                                    {newAudio ? "Audio OK" : "+ MP3"}
                                    <input type="file" hidden accept="audio/*" onChange={handleAudioUpload} />
                                </label>
                            ) : (
                                <input 
                                    value={newAudio || ''} 
                                    onChange={(e) => setNewAudio(e.target.value)} 
                                    className="flex-[2] bg-stone-50 border border-stone-100 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:border-rose-200 focus:bg-white outline-none placeholder:text-stone-300 transition-all" 
                                    placeholder="Link..." 
                                />
                            )}
                            
                            <button onClick={handleAdd} disabled={!newTitle || !newArtist || !newAudio} className="w-8 h-8 bg-rose-400 hover:bg-rose-500 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
                                <Plus size={16} />
                            </button>
                        </div>
                        {inputType === 'link' && (
                            <p className="text-[9px] text-stone-300 mt-1.5 italic text-center">*Direct MP3 links only</p>
                        )}
                    </div>
                ) : (
                    <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-center shrink-0 mb-1">
                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Playlist Full</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- MAIN PAGE ---

export default function WebStoryEditor() {
  // --- STATE ---
  const [view, setView] = useState<'home' | 'gallery' | 'letter'>('home');

  // Data
  const [storyInfo, setStoryInfo] = useState({ title: "Our Story", subtitle: "A collection of moments" });
  const [galleryItems, setGalleryItems] = useState([
    { id: 1, type: "photo", caption: "First date", img: null as string | null, text: "", bg: "#fef3c7" },
    { id: 2, type: "photo", caption: "Sweet memory", img: null as string | null, text: "", bg: "#fef3c7" },
  ]);
  const [letterData, setLetterData] = useState({
      title: "My Dearest,",
      body: "Every moment with you is a treasure I hold close to my heart...",
      sender: "Yours, Alex"
  });
  
  // Music State
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Editor State
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  // --- AUTH SETUP ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            try { await signInWithCustomToken(auth, __initial_auth_token); } 
            catch (e) { await signInAnonymously(auth); }
        } else { await signInAnonymously(auth); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // --- HANDLERS ---
  const updateGalleryItem = (id: number, field: string, value: string) => {
    setGalleryItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) { 
          alert("Image too large. Max 500KB per photo to save space.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
          updateGalleryItem(id, 'img', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPhoto = () => {
      const newId = Math.max(0, ...galleryItems.map(s => s.id)) + 1;
      setGalleryItems([...galleryItems, {
        id: newId, type: "photo", caption: "", img: null,
        text: "",
        bg: ""
      }]);
      setEditingItemId(newId);
  };

  const addNote = () => {
      const newId = Math.max(0, ...galleryItems.map(s => s.id)) + 1;
      setGalleryItems([...galleryItems, { id: newId, type: "message", caption: "", img: null, text: "", bg: "#fef3c7" }]);
      setEditingItemId(newId);
  };

  const removePhoto = (id: number) => {
      setGalleryItems(prev => prev.filter(s => s.id !== id));
      setEditingItemId(null);
  };

  // Music CRUD
  const addSong = (title: string, artist: string, cover: string, audio: string) => {
      const newId = Date.now();
      const newSong = { id: newId, title, artist, cover, audio };
      setPlaylist([...playlist, newSong]);
      if (!currentSongId) setCurrentSongId(newId);
  };

  const deleteSong = (id: number) => {
      const newPl = playlist.filter(s => s.id !== id);
      setPlaylist(newPl);
      if (currentSongId === id) {
          setCurrentSongId(null);
          setIsPlaying(false);
      }
  };

  const togglePlay = (id: number) => {
      if (currentSongId === id && isPlaying) {
          setIsPlaying(false);
      } else {
          setCurrentSongId(id);
          setIsPlaying(true);
      }
  };

  // --- LOGIC FIX: AGGRESSIVE AUTH & NO DEMO FALLBACK ---
  const handlePublish = async () => {
    setIsPublishing(true);

    if (!isDbReady) {
        alert("Database belum siap/error konfigurasi. Coba refresh halaman.");
        setIsPublishing(false);
        return;
    }

    let currentUser = user;
    if (!currentUser && auth) {
        try {
            console.log("User null, attempting panic login...");
            const result = await signInAnonymously(auth);
            currentUser = result.user;
            setUser(currentUser);
        } catch (e) {
            console.error("Auto-login error:", e);
        }
    }

    if (!currentUser) {
        alert("Gagal memverifikasi user. Cek koneksi internet lalu coba lagi.");
        setIsPublishing(false);
        return;
    }
    
    try {
        const payload = {
            storyInfo,
            galleryItems,
            letterData,
            playlist, 
            currentSongId,
            backgroundImage: EDITOR_BG_IMAGE, // Add custom BG to database
            creatorId: currentUser.uid,
            createdAt: new Date().toISOString(),
            type: "web-story-v3"
        };

        const payloadStr = JSON.stringify(payload);
        const sizeInBytes = new Blob([payloadStr]).size;
        
        if (sizeInBytes > 1000000) { 
             const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);
             alert(`GAGAL: Total ukuran data terlalu besar (${sizeInMB} MB).\n\nBatas maksimal Firestore adalah 1 MB.\nSolusi: Gunakan fitur 'Link URL' untuk lagu daripada upload file, atau hapus beberapa foto.`);
             setIsPublishing(false);
             return;
        }
        
        const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'stories'), payload);
        
        const url = `${window.location.origin}/s/${docRef.id}`;
        setPublishedUrl(url);
    } catch (error) {
        console.error("Error publishing:", error);
        alert("Gagal menyimpan. Terjadi kesalahan jaringan atau file masih terlalu besar.");
    } finally {
        setIsPublishing(false);
    }
  };

  const copyToClipboard = () => {
      if (publishedUrl) {
          navigator.clipboard.writeText(publishedUrl);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
      }
  };

  const currentEditingItem = galleryItems.find(s => s.id === editingItemId);
  const activeSong = playlist.find(s => s.id === currentSongId);
  const bgMusicLabel = activeSong ? activeSong.title : "Music";

  // --- RENDER VIEWS ---

  // 1. HOME VIEW (MENU UTAMA)
  const renderHome = () => (
      <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-5xl mx-auto animate-in fade-in duration-700 relative z-10 py-10">
         {/* ADDED: Back to App Home Button */}
         <div className="absolute top-4 left-4 md:top-8 md:left-[-100px] z-50">
            <a href="/" className="flex items-center gap-2 bg-white/40 hover:bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full text-stone-600 hover:text-sky-600 font-bold uppercase text-xs tracking-widest shadow-sm border border-white/50 transition-all duration-300 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Exit Editor</span>
            </a>
         </div>

         <TitleCard 
              title={storyInfo.title} 
              subtitle={storyInfo.subtitle} 
              onEdit={(f, v) => setStoryInfo(prev => ({ ...prev, [f]: v }))}
         />

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mt-12 w-full max-w-4xl px-6">
              <CameraMenu onClick={() => setView('gallery')} />
              <LetterMenu onClick={() => setView('letter')} />
              <MusicMenu 
                  onClick={() => setIsMusicModalOpen(true)} 
                  currentSong={bgMusicLabel}
              />
         </div>

         <div className="mt-20 w-full max-w-md px-6 text-center">
             {!publishedUrl ? (
                 <button onClick={handlePublish} disabled={isPublishing} className="w-full py-4 bg-sky-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-sky-500 hover:scale-105 transition-all shadow-xl shadow-sky-0 disabled:opacity-70">
                    {isPublishing ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
                    {isPublishing ? "Saving..." : "Publish Website"}
                 </button>
             ) : (
                 <div className="space-y-3 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white animate-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                        <Check size={16} className="text-green-600"/>
                        <span className="text-xs font-bold text-green-700 truncate flex-1">{publishedUrl}</span>
                        <button onClick={copyToClipboard} className="p-1.5 hover:bg-white rounded text-green-700"><Copy size={14}/></button>
                    </div>
                    {/* CHANGED: Link to standard <a> tag */}
                    <a href={publishedUrl} target="_blank" className="block w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-md">
                        Visit Website
                    </a>
                    <button onClick={() => setPublishedUrl(null)} className="text-xs text-stone-400 hover:text-stone-600 underline">Edit Again</button>
                 </div>
             )}
         </div>
      </div>
  );

  // 2. GALLERY VIEW
  const renderGallery = () => (
      <div className="flex flex-col min-h-screen relative z-10 w-full">
          <div className="p-6 flex items-center justify-between sticky top-0 z-40">
             <button onClick={() => setView('home')} className="flex items-center gap-2 bg-white/80 backdrop-blur px-5 py-2.5 rounded-full text-stone-600 hover:text-black font-bold uppercase text-xs tracking-widest group shadow-sm border border-white/50 hover:scale-105 transition-all">
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Menu
             </button>
             <h2 className={`text-4xl text-sky-600 ${greatVibes.className} drop-shadow-sm hidden md:block`}>{storyInfo.title} Gallery</h2>
             <div className="w-8"></div> 
          </div>
          
          <div className="flex-grow overflow-x-auto overflow-y-hidden flex items-center px-10 gap-16 pb-20 custom-scrollbar scroll-smooth pt-20">
              {galleryItems.map((item, index) => {
                  const rotation = (item.id % 2 === 0 ? 2 : -2) * ((index % 3) + 1);
                  return (
                      <div key={item.id} className="flex-shrink-0 animate-in zoom-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                          {item.type === 'photo' ? (
                             <Polaroid 
                                img={item.img} 
                                caption={item.caption} 
                                rotation={rotation} 
                                onClick={() => setEditingItemId(item.id)}
                             />
                          ) : (
                             <StickyNote 
                                text={item.text || ""} 
                                rotation={rotation} 
                                color={item.bg || "#fef3c7"} 
                                onClick={() => setEditingItemId(item.id)}
                             />
                          )}
                      </div>
                  );
              })}
              {/* Add New Placeholders */}
              <div className="flex gap-8 items-start">
                  <div onClick={addPhoto} className="flex-shrink-0 flex flex-col items-center group cursor-pointer opacity-60 hover:opacity-100 transition-opacity hover:-translate-y-2 duration-300">
                      <HangingString />
                      <div className="w-56 aspect-[4/5] border-4 border-dashed border-sky-300 rounded-sm flex flex-col items-center justify-center gap-2 bg-sky-50/50 -mt-2 hover:bg-sky-100 transition-colors">
                          <Plus size={40} className="text-sky-300" />
                          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">New Photo</span>
                      </div>
                  </div>
                  
                  <div onClick={addNote} className="flex-shrink-0 flex flex-col items-center group cursor-pointer opacity-60 hover:opacity-100 transition-opacity hover:-translate-y-2 duration-300">
                      <HangingString length={10} />
                      <div className="w-56 h-56 border-4 border-dashed border-yellow-300 rounded-sm flex flex-col items-center justify-center gap-2 bg-yellow-50/50 -mt-2 hover:bg-yellow-100 transition-colors">
                          <Plus size={40} className="text-yellow-300" />
                          <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">New Note</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  // 3. LETTER VIEW
  const renderLetter = () => (
      <div className="flex flex-col min-h-screen items-center justify-center p-6 relative z-10 w-full">
          <div className="absolute top-6 left-6 z-40">
             <button onClick={() => setView('home')} className="flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full text-stone-600 hover:text-black font-bold uppercase text-xs tracking-widest group shadow-sm">
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Home
             </button>
          </div>

          <div className="max-w-2xl w-full bg-[#fffcf5] p-10 md:p-16 rounded-sm shadow-2xl relative animate-in slide-in-from-bottom-10 duration-700 border border-[#f0ead6] rotate-1">
               {/* Paper Texture */}
               <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
               
               <div className="relative z-10 space-y-8 text-center">
                   <input 
                      value={letterData.title}
                      onChange={(e) => setLetterData({...letterData, title: e.target.value})}
                      className={`w-full text-center text-5xl md:text-6xl text-rose-500 bg-transparent border-b border-transparent hover:border-rose-100 focus:border-rose-300 focus:outline-none transition-colors ${greatVibes.className}`}
                      placeholder="Title Here"
                   />
                   
                   <textarea 
                      value={letterData.body}
                      onChange={(e) => setLetterData({...letterData, body: e.target.value})}
                      className={`w-full bg-transparent text-xl md:text-2xl text-stone-700 leading-loose resize-none min-h-[300px] border-none focus:ring-0 text-center ${caveat.className}`}
                      placeholder="Write your beautiful letter here..."
                   />

                   <div className="text-right mt-8 pt-8 border-t border-stone-100/50">
                       <input 
                          value={letterData.sender}
                          onChange={(e) => setLetterData({...letterData, sender: e.target.value})}
                          className={`w-full text-right text-2xl text-stone-500 bg-transparent border-none focus:ring-0 ${caveat.className}`}
                          placeholder="- Your Name"
                       />
                   </div>
               </div>
          </div>
      </div>
  );

  return (
    <div className={`min-h-screen bg-[#FDFDFC] overflow-hidden ${dmSans.className} relative flex flex-col`}>
        
        {/* ADDED: Google Fonts import via style tag */}
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=DM+Sans:opsz,wght@9..40,400;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;1,400&family=Press+Start+2P&display=swap');
          
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-caveat { font-family: 'Caveat', cursive; }
          .font-great-vibes { font-family: 'Great Vibes', cursive; }
          .font-press-start { font-family: 'Press Start 2P', cursive; }
        `}} />

        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(var(--rot)); }
            50% { transform: translateY(-10px) rotate(var(--rot)); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-slow { animation: float 8s ease-in-out infinite; }
          .animate-spin-slow { animation: spin 60s linear infinite; }

          /* Custom Scrollbar Styles */
          .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
              height: 8px; /* For horizontal scroll */
          }
          .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #cbd5e1; /* Stone-300 equivalent */
              border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #94a3b8; /* Stone-400 equivalent */
          }
        `}</style>

        {/* Background Effect */}
        <BackgroundEffects image={EDITOR_BG_IMAGE} />
        
        {/* VIEW SWITCHER */}
        {view === 'home' && renderHome()}
        {view === 'gallery' && renderGallery()}
        {view === 'letter' && renderLetter()}

        {/* MODAL EDITOR FOR PHOTOS */}
        {editingItemId && currentEditingItem && (
            <EditModal 
                slide={{...currentEditingItem, type: 'photo'}} 
                onClose={() => setEditingItemId(null)}
                onUpdate={(id: number, field: string, val: string) => updateGalleryItem(id, field, val)}
                onDelete={removePhoto}
                onImageUpload={handleImageUpload}
            />
        )}

        {/* MODAL EDITOR FOR MUSIC (RETRO STYLE) */}
        {isMusicModalOpen && (
            <MusicModal 
                playlist={playlist}
                onClose={() => setIsMusicModalOpen(false)}
                onAddSong={addSong}
                onDeleteSong={deleteSong}
                onSelectSong={setCurrentSongId}
                currentSongId={currentSongId}
                togglePlay={togglePlay}
                isPlaying={isPlaying}
                playingId={currentSongId}
            />
        )}
    </div>
  );
}