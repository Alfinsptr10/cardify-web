"use client";

import { useState, useEffect, useRef } from "react";
// REMOVED: import Link from "next/link"; -> Replaced with <a> tag
import { 
  ArrowLeft, Image as ImageIcon, 
  Share2, X, Eye, Loader2, Copy, Check, Music, Play, Type, Plus, Trash2, Upload, Heart, Camera, Headphones, Cloud, Sun, Pause, Disc, Link as LinkIcon, FileAudio, Home
} from "lucide-react";

// REMOVED: import { ... } from "next/font/google"; -> Replaced with standard CSS import below

// Import Firebase modules
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

const BackgroundEffects = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#e0f7fa]">
     <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#B2EBF2] to-[#FAFAF9]" />
     <div className="absolute -top-20 -right-20 opacity-50 animate-spin-slow" style={{ animationDuration: '60s' }}>
        <Sun size={400} className="text-yellow-200 fill-yellow-100" />
     </div>
     <div className="absolute top-20 left-[10%] text-white/90 animate-float-slow drop-shadow-sm">
        <Cloud size={80} fill="white" className="text-white" />
     </div>
     <div className="absolute top-40 right-[15%] text-white/70 animate-float" style={{ animationDelay: '2s', '--rot': '0deg' } as React.CSSProperties}>
        <Cloud size={60} fill="white" className="text-white" />
     </div>
     <div className="absolute bottom-1/3 left-[20%] text-white/50 animate-float-slow" style={{ animationDelay: '5s', '--rot': '0deg' } as React.CSSProperties}>
        <Cloud size={120} fill="white" className="text-white" />
     </div>
     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
  </div>
);

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

const TitleCard = ({ title, subtitle, onClick, onEdit }: { title: string, subtitle: string, onClick?: () => void, onEdit?: (field: string, value: string) => void }) => (
  <div className="flex flex-col items-center group relative animate-float-slow">
    <div onClick={onClick} className="text-center p-6 relative cursor-pointer hover:scale-105 transition-transform duration-300 w-80">
      <div className="inline-block border-[6px] border-double border-sky-200 p-8 bg-white shadow-[0_10px_30px_-5px_rgba(135,206,235,0.4)] relative rounded-xl rotate-1 w-full">
          {onEdit ? (
            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <input 
                    value={title}
                    onChange={(e) => onEdit('title', e.target.value)}
                    className={`w-full text-center text-5xl md:text-6xl text-sky-600 bg-transparent border-b border-transparent hover:border-sky-200 focus:border-sky-300 focus:outline-none transition-colors ${greatVibes.className}`}
                    placeholder="Your Title"
                />
                <div className="w-20 h-1 bg-sky-300 mx-auto mb-4 rounded-full opacity-50"></div>
                <input 
                    value={subtitle}
                    onChange={(e) => onEdit('subtitle', e.target.value)}
                    className={`w-full text-center text-lg text-stone-500 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-stone-300 focus:outline-none italic ${dmSans.className}`}
                    placeholder="Your Subtitle"
                />
            </div>
          ) : (
             <>
                <h1 className={`text-5xl md:text-7xl font-bold text-sky-600 mb-2 ${greatVibes.className} drop-shadow-sm`}>{title || "Title Here"}</h1>
                <div className="w-20 h-1 bg-sky-300 mx-auto mb-4 rounded-full"></div>
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

// --- ADD MUSIC MODAL (RETRO DARK DESIGN - COMPACT) ---
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
             // SIZE CHECK: 750KB limit to fit in 1MB Firestore doc (Base64 adds 33% overhead)
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* CONTAINER UTAMA: Gaya Gelap & Retro */}
            <div className="bg-[#1a1f1a] border-2 border-yellow-400 rounded-3xl w-full max-w-[340px] p-5 text-white text-center shadow-[0_0_40px_rgba(251,191,36,0.2)] relative overflow-hidden flex flex-col max-h-[85vh]">
                
                {/* Decorative Screws */}
                <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-zinc-600 rotate-45"></div></div>
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-zinc-600 rotate-45"></div></div>
                <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-zinc-600 rotate-45"></div></div>
                <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-zinc-600 rotate-45"></div></div>

                <button onClick={onClose} className="absolute top-2 right-2 p-2 text-zinc-500 hover:text-white transition-colors z-20"><X size={18} /></button>

                {/* Header Title */}
                <div className="text-center mb-4 mt-2">
                    <h2 className={`text-amber-400 text-sm tracking-widest font-bold uppercase ${pressStart.className}`}>MIXTAPE VOL.1</h2>
                    <div className="w-16 h-1 bg-amber-500/50 mx-auto mt-2 rounded-full"></div>
                </div>
                
                {/* NOW PLAYING SECTION (COMPACT) */}
                <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 mb-4 shrink-0 shadow-inner">
                    <div className="flex gap-3">
                        {/* Song Cover Image - Compact but visible */}
                        <div className="w-20 h-20 rounded-lg bg-black flex-shrink-0 overflow-hidden relative border border-zinc-700 group shadow-lg">
                            {activeSong?.cover ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={activeSong.cover} alt="Song Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center opacity-50 w-full h-full">
                                    <Disc size={24} className="animate-spin-slow mb-1" />
                                    <span className="text-[10px] uppercase">No Cover</span>
                                </div>
                            )}
                            {/* Play Overlay if playing */}
                            {isPlaying && (
                                <div className="absolute inset-0 bg-black/20 flex items-end justify-center pb-1 gap-0.5">
                                    <div className="w-1 bg-amber-400 animate-[bounce_0.6s_infinite] h-1/2"></div>
                                    <div className="w-1 bg-amber-400 animate-[bounce_0.8s_infinite] h-3/4"></div>
                                    <div className="w-1 bg-amber-400 animate-[bounce_0.5s_infinite] h-1/3"></div>
                                </div>
                            )}
                        </div>

                        {/* Info & Controls */}
                        <div className="flex-1 flex flex-col justify-center min-w-0 text-left pl-1">
                            <div className="mb-2">
                                <p className="text-xs font-bold text-white truncate max-w-[150px]">{activeSong ? activeSong.title : "No Track Selected"}</p>
                                <p className="text-[9px] text-zinc-400 uppercase tracking-wider truncate max-w-[150px]">{activeSong ? activeSong.artist : "Select a song below"}</p>
                            </div>

                            {/* HTML Audio Player Control (Native) */}
                            <audio 
                                className="w-full h-6 opacity-60 hover:opacity-100 transition-opacity" 
                                controls 
                                src={activeSong?.audio}
                                key={activeSong?.id || 'no-song'} // Force re-render on song change
                                autoPlay={isPlaying}
                                onPlay={() => activeSong && !isPlaying && togglePlay(activeSong.id)}
                                onPause={() => isPlaying && togglePlay(activeSong?.id)}
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </div>

                {/* PLAYLIST (LIST DECIMAL - COMPACT) */}
                <div className="text-sm text-left mb-3 mt-2 border-t border-zinc-800 pt-2 flex-grow overflow-y-auto custom-scrollbar" style={{ maxHeight: '150px' }}>
                    {playlist.length === 0 ? (
                        <p className="text-zinc-600 italic text-[10px] text-center py-4">Playlist is empty.</p>
                    ) : (
                        <div className="space-y-1">
                            {playlist.map((song: any, i: number) => (
                                <div 
                                    key={song.id} 
                                    onClick={() => onSelectSong(song.id)}
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${currentSongId === song.id ? 'bg-amber-500/10 border-amber-500/50' : 'bg-zinc-800/30 border-transparent hover:bg-zinc-800'}`}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={`text-[10px] font-mono w-4 text-center ${currentSongId === song.id ? 'text-amber-400' : 'text-zinc-600'}`}>{i + 1}</span>
                                        <div className="min-w-0">
                                            <p className={`text-[11px] font-bold truncate max-w-[120px] ${currentSongId === song.id ? 'text-amber-300' : 'text-zinc-300'}`}>{song.title}</p>
                                            <p className="text-[9px] text-zinc-500 truncate max-w-[120px]">{song.artist}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); togglePlay(song.id); }} 
                                            className={`p-1.5 rounded-full ${currentSongId === song.id && isPlaying ? 'text-amber-400 bg-amber-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            {currentSongId === song.id && isPlaying ? <Pause size={10} fill="currentColor"/> : <Play size={10} fill="currentColor"/>}
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDeleteSong(song.id); }} 
                                            className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ADD NEW SONG FORM (COMPACT) */}
                {!isFull ? (
                    <div className="bg-zinc-900 p-2 rounded border border-zinc-800 mb-1 shrink-0">
                        <div className="flex justify-between items-center mb-2">
                             <p className="text-[9px] text-zinc-500 uppercase font-bold text-left pl-1">Add Track ({playlist.length}/5)</p>
                             <div className="flex bg-black rounded p-0.5 gap-0.5">
                                 <button onClick={() => setInputType('upload')} className={`px-2 py-0.5 text-[8px] uppercase font-bold rounded ${inputType === 'upload' ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}>Upload</button>
                                 <button onClick={() => setInputType('link')} className={`px-2 py-0.5 text-[8px] uppercase font-bold rounded ${inputType === 'link' ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}>Link</button>
                             </div>
                        </div>

                        <div className="flex gap-1 mb-1">
                            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-1/2 bg-black border border-zinc-700 rounded px-2 py-1 text-[10px] text-white focus:border-amber-500 outline-none placeholder:text-zinc-600" placeholder="Title" />
                            <input value={newArtist} onChange={e => setNewArtist(e.target.value)} className="w-1/2 bg-black border border-zinc-700 rounded px-2 py-1 text-[10px] text-white focus:border-amber-500 outline-none placeholder:text-zinc-600" placeholder="Artist" />
                        </div>
                        
                        <div className="flex gap-1">
                            <label className={`flex-1 bg-zinc-800 hover:bg-zinc-700 text-[9px] py-1 rounded cursor-pointer text-center border border-zinc-700 truncate px-1 transition-colors ${newCover ? 'text-amber-400 border-amber-900' : 'text-zinc-400'}`}>
                                {newCover ? "Cover OK" : "+ Cover"}
                                <input type="file" hidden accept="image/*" onChange={handleCoverUpload} />
                            </label>
                            
                            {inputType === 'upload' ? (
                                <label className={`flex-1 bg-zinc-800 hover:bg-zinc-700 text-[9px] py-1.5 rounded cursor-pointer text-center border border-zinc-700 truncate px-1 transition-colors ${newAudio ? 'text-green-400 border-green-900' : 'text-zinc-400'}`}>
                                    {newAudio ? "MP3 OK" : "+ Audio File"}
                                    <input type="file" hidden accept="audio/*" onChange={handleAudioUpload} />
                                </label>
                            ) : (
                                <input 
                                    value={newAudio || ''} 
                                    onChange={(e) => setNewAudio(e.target.value)} 
                                    className="flex-[2] bg-black border border-zinc-700 rounded px-2 py-1 text-[10px] text-white focus:border-green-500 outline-none placeholder:text-zinc-600" 
                                    placeholder="Paste Direct MP3 Link here..." 
                                />
                            )}
                            
                            <button onClick={handleAdd} disabled={!newTitle || !newArtist || !newAudio} className="w-8 bg-amber-500 hover:bg-amber-400 text-black rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg">
                                <Plus size={14} />
                            </button>
                        </div>
                        {inputType === 'link' && (
                            <p className="text-[8px] text-amber-500/70 mt-1 italic">*Spotify/YouTube links will NOT work. Use direct MP3 links.</p>
                        )}
                    </div>
                ) : (
                    <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-center shrink-0 mb-1">
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Mixtape Full (5/5)</p>
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

    // 1. Cek Database Ready gak?
    if (!isDbReady) {
        alert("Database belum siap/error konfigurasi. Coba refresh halaman.");
        setIsPublishing(false);
        return;
    }

    // 2. Cek User. Kalau null, COBA LOGIN DULU JANGAN NYERAH.
    let currentUser = user;
    if (!currentUser && auth) {
        try {
            console.log("User null, attempting panic login...");
            const result = await signInAnonymously(auth);
            currentUser = result.user;
            setUser(currentUser); // Update state lokal biar UI tau
        } catch (e) {
            console.error("Auto-login error:", e);
        }
    }

    // 3. Kalau masih null juga, baru kasih error (BUKAN DEMO)
    if (!currentUser) {
        alert("Gagal memverifikasi user. Cek koneksi internet lalu coba lagi.");
        setIsPublishing(false);
        return;
    }
    
    // 4. Proses Simpan
    try {
        const payload = {
            storyInfo,
            galleryItems,
            letterData,
            playlist, // Full playlist with Base64 audio/images
            currentSongId, // Default selected song
            creatorId: currentUser.uid,
            createdAt: new Date().toISOString(),
            type: "web-story-v3"
        };

        // SAFETY CHECK: Calculate Size BEFORE sending to prevent crash
        const payloadStr = JSON.stringify(payload);
        const sizeInBytes = new Blob([payloadStr]).size;
        
        if (sizeInBytes > 1000000) { // 1MB limit
             const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);
             alert(`GAGAL: Total ukuran data terlalu besar (${sizeInMB} MB).\n\nBatas maksimal Firestore adalah 1 MB.\nSolusi: Gunakan fitur 'Link URL' untuk lagu daripada upload file, atau hapus beberapa foto.`);
             setIsPublishing(false);
             return;
        }
        
        const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'stories'), payload);
        
        // PENTING: Generate Link Asli
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
         <div className="absolute top-4 left-6 md:top-8 md:left-[-100px] z-50">
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
                 <button onClick={handlePublish} disabled={isPublishing} className="w-full py-4 bg-sky-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-sky-500 hover:scale-105 transition-all shadow-xl shadow-sky-200 disabled:opacity-70">
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
        <BackgroundEffects />
        
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