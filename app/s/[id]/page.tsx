"use client";

import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Image as ImageIcon, 
  X, Loader2, Music, Heart, Camera, Headphones, Cloud, Sun, Gift, AlertTriangle, Pause, Play, Disc, Mail
} from "lucide-react";

// Firebase Imports
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// --- MOCK FONTS (Untuk Preview) ---
const dmSans = { className: "font-dm-sans" };
const playfair = { className: "font-playfair" };
const caveat = { className: "font-caveat" };
const greatVibes = { className: "font-great-vibes" };
const pressStart = { className: "font-press-start" };

// --- FIREBASE INIT ---
declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;

const manualConfig = {
  apiKey: "AIzaSyDdm9H9HcpHEcxLaqsmNqcJ41aOExkU2hk",             
  authDomain: "web-story-51112.firebaseapp.com",         
  projectId: "web-story-51112",          
  storageBucket: "web-story-51112.firebasestorage.app",
  messagingSenderId: "61476471738",
  appId: "1:61476471738:web:2ce7c42a9b08e9fb0f9383"
};

const envConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
const envConfig = JSON.parse(envConfigStr);
const firebaseConfig = (envConfig && envConfig.apiKey) ? envConfig : manualConfig;
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

// --- VISUAL COMPONENTS (READ ONLY) ---

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

// REMOVED: HeartClip component

const HangingMenu = ({ icon: Icon, label, onClick, delay = 0, rotation = 0, img }: any) => (
  <div onClick={onClick} className="flex flex-col items-center group cursor-pointer animate-in fade-in slide-in-from-top-10 duration-1000 animate-float" style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}>
    <div className="relative transform transition-all hover:scale-110 hover:z-20 hover:drop-shadow-2xl">
        {/* HAPUS HeartClip DI SINI */}
        
        {/* UKURAN DIPERBESAR & DISAMAKAN: w-60 h-60 (240px) */}
        <div className="w-60 h-60 relative filter drop-shadow-xl transition-all duration-300">
            {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={label} className="w-full h-full object-contain" onError={(e) => {e.currentTarget.style.display='none'}} />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white rounded-full border-4 border-stone-100 shadow-inner">
                    <Icon size={80} className="text-stone-300"/>
                </div>
            )}
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-white/50 whitespace-nowrap">
             <span className={`text-xs font-bold uppercase tracking-widest text-stone-600 ${dmSans.className}`}>{label}</span>
        </div>
    </div>
  </div>
);

const Polaroid = ({ img, caption, rotation = 0, onClick, delay = 0 }: any) => (
  <div className="flex flex-col items-center group relative animate-float" style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}>
    <div onClick={onClick} className="relative bg-white p-3 pb-10 shadow-xl transform transition-all hover:scale-105 hover:z-30 hover:shadow-2xl duration-300 w-64 cursor-pointer rounded-sm mt-8">
      {/* HAPUS HeartClip */}
      <div className="aspect-square bg-stone-100 overflow-hidden mb-3 border border-stone-100 relative group">
         {img ? (
           // eslint-disable-next-line @next/next/no-img-element
           <img src={img} alt={caption} className="w-full h-full object-cover" />
         ) : (
           <div className="w-full h-full flex flex-col items-center justify-center text-sky-300 bg-sky-50 gap-2">
              <ImageIcon size={32} />
           </div>
         )}
      </div>
      <p className={`text-center text-stone-600 text-lg ${caveat.className} min-h-[1.5em] leading-tight px-1`}>{caption}</p>
    </div>
  </div>
);

const StickyNote = ({ text, color = "#fef3c7", rotation = 0, onClick, delay = 0 }: any) => (
  <div className="flex flex-col items-center group relative animate-float" style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}>
    <div onClick={onClick} className="relative p-6 shadow-lg transform transition-all hover:scale-105 hover:z-20 hover:shadow-xl duration-300 w-64 mx-auto flex items-center justify-center text-center cursor-pointer group mt-8" style={{ backgroundColor: color, minHeight: '200px' }}>
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-black/5 rounded-full blur-sm"></div> 
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-2 backdrop-blur-sm shadow-sm"></div> 
      {/* HAPUS HeartClip */}
      <div className="w-full mt-4">
          <p className={`text-xl leading-relaxed text-stone-800 ${caveat.className} w-full break-words`}>{text}</p>
      </div>
    </div>
  </div>
);

const TitleCard = ({ title, subtitle }: any) => (
  <div className="flex flex-col items-center group relative animate-float-slow">
    <div className="text-center p-6 relative w-80 mt-4">
      {/* HAPUS HeartClip */}
      <div className="inline-block border-[6px] border-double border-sky-200 p-8 bg-white shadow-[0_10px_30px_-5px_rgba(135,206,235,0.4)] relative rounded-xl rotate-1 w-full">
          <h1 className={`text-5xl md:text-7xl font-bold text-sky-600 mb-2 ${greatVibes.className} drop-shadow-sm`}>{title}</h1>
          <div className="w-20 h-1 bg-sky-300 mx-auto mb-4 rounded-full"></div>
          <p className={`text-xl text-stone-500 italic ${dmSans.className}`}>{subtitle}</p>
      </div>
    </div>
  </div>
);

// --- MENU ILLUSTRATIONS ---
const CameraMenu = ({ onClick }: { onClick: () => void }) => (
  <HangingMenu img="/template/camera.png" label="Gallery" onClick={onClick} icon={Camera} rotation={2} delay={0} />
);

const LetterMenu = ({ onClick }: { onClick: () => void }) => (
  <HangingMenu img="/template/letter.png" label="Read Note" onClick={onClick} icon={Mail} rotation={-2} delay={200} />
);

const MusicMenu = ({ onClick, currentSong }: { onClick: () => void, currentSong: string }) => (
  <HangingMenu img="/template/music.png" label={currentSong || "Music"} onClick={onClick} icon={Headphones} rotation={1} delay={400} />
);

// --- MUSIC PLAYER MODAL (READ ONLY) ---
const MusicPlayerModal = ({ playlist, onClose, onSelectSong, currentSongId, togglePlay, isPlaying }: any) => {
    const activeSong = playlist.find((s: any) => s.id === currentSongId);

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#1a1f1a] border-2 border-yellow-400 rounded-3xl w-full max-w-[340px] p-5 text-white text-center shadow-[0_0_40px_rgba(251,191,36,0.2)] relative overflow-hidden flex flex-col max-h-[85vh]">
                
                <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-zinc-600 rotate-45"></div></div>
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-zinc-600 rotate-45"></div></div>
                <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-zinc-600 rotate-45"></div></div>
                <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-zinc-600 rotate-45"></div></div>

                <button onClick={onClose} className="absolute top-2 right-2 p-2 text-zinc-500 hover:text-white transition-colors z-20"><X size={18} /></button>

                <div className="text-center mb-4 mt-2">
                    <h2 className={`text-amber-400 text-sm tracking-widest font-bold uppercase ${pressStart.className}`}>MIXTAPE VOL.1</h2>
                    <div className="w-16 h-1 bg-amber-500/50 mx-auto mt-2 rounded-full"></div>
                </div>
                
                <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 mb-4 shrink-0 shadow-inner">
                    <div className="flex gap-3">
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
                            {isPlaying && (
                                <div className="absolute inset-0 bg-black/20 flex items-end justify-center pb-1 gap-0.5">
                                    <div className="w-1 bg-amber-400 animate-[bounce_0.6s_infinite] h-1/2"></div>
                                    <div className="w-1 bg-amber-400 animate-[bounce_0.8s_infinite] h-3/4"></div>
                                    <div className="w-1 bg-amber-400 animate-[bounce_0.5s_infinite] h-1/3"></div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-center min-w-0 text-left pl-1">
                            <div className="mb-2">
                                <p className="text-xs font-bold text-white truncate max-w-[150px]">{activeSong ? activeSong.title : "No Track Selected"}</p>
                                <p className="text-[9px] text-zinc-400 uppercase tracking-wider truncate max-w-[150px]">{activeSong ? activeSong.artist : "Select a song below"}</p>
                            </div>

                            <audio 
                                className="w-full h-6 opacity-60 hover:opacity-100 transition-opacity" 
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

                <div className="text-sm text-left mb-3 mt-2 border-t border-zinc-800 pt-2 flex-grow overflow-y-auto custom-scrollbar" style={{ maxHeight: '250px' }}>
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
                                            <p className={`text-[11px] font-bold truncate max-w-[150px] ${currentSongId === song.id ? 'text-amber-300' : 'text-zinc-300'}`}>{song.title}</p>
                                            <p className="text-[9px] text-zinc-500 truncate max-w-[150px]">{song.artist}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); togglePlay(song.id); }} 
                                            className={`p-1.5 rounded-full ${currentSongId === song.id && isPlaying ? 'text-amber-400 bg-amber-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            {currentSongId === song.id && isPlaying ? <Pause size={10} fill="currentColor"/> : <Play size={10} fill="currentColor"/>}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <button onClick={onClose} className="w-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white py-2 rounded-md font-bold text-xs transition-colors shadow-lg mt-auto">
                    CLOSE PLAYER
                </button>

            </div>
        </div>
    );
};


// --- LIGHTBOX MODAL ---
const LightboxModal = ({ item, onClose }: any) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div className="relative bg-white p-3 pb-8 rounded-sm shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto transform rotate-1 animate-in zoom-in-95 duration-300 scrollbar-hide" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"><X size={24} /></button>
                
                {item.type === 'photo' && (
                    <div className="space-y-3">
                        <div className="aspect-[4/5] w-full bg-stone-100 overflow-hidden relative border border-stone-200">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={item.img} alt={item.caption} className="w-full h-full object-cover" />
                        </div>
                        <p className={`text-center text-2xl text-stone-800 ${caveat.className} px-2 leading-tight`}>{item.caption}</p>
                    </div>
                )}

                {item.type === 'message' && (
                    <div className="w-full aspect-square flex items-center justify-center p-6 relative" style={{ backgroundColor: item.bg }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/30 rotate-1 backdrop-blur-sm shadow-sm"></div>
                        <p className={`text-2xl md:text-3xl leading-relaxed text-stone-800 ${caveat.className} text-center w-full break-words`}>{item.text}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN PAGE VIEWER ---
export default function WebStoryViewer() {
  // Use Manual URL parsing instead of useParams for preview compatibility
  const [id, setId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data State
  const [storyInfo, setStoryInfo] = useState({ title: "", subtitle: "" });
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [letterData, setLetterData] = useState({ title: "", body: "", sender: "" });
  
  // Music State
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgMusic, setBgMusic] = useState("Music");

  // View State
  const [view, setView] = useState<'home' | 'gallery' | 'letter'>('home');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

  useEffect(() => {
    // Manual ID extraction logic for preview
    const pathParts = window.location.pathname.split('/');
    const idFromUrl = pathParts[pathParts.indexOf('s') + 1];
    setId(idFromUrl);

    const fetchData = async () => {
        if (!idFromUrl) {
            // MOCK DATA FOR DEMO IF NO ID
            setStoryInfo({ title: "Preview Story", subtitle: "Moments" });
            setGalleryItems([{id:1, type:'photo', caption:'Demo Photo', img: null}, {id:2, type:'message', text:'Demo Note', bg:'#fef3c7'}]);
            setLetterData({title:"Hello", body:"This is a demo.", sender:"Admin"});
            setLoading(false);
            return;
        }

        if (!db || !auth) {
            setError("Database error.");
            setLoading(false);
            return;
        }

        try {
            await signInAnonymously(auth);
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'stories', idFromUrl);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.type === 'web-story-v3' || data.galleryItems) {
                    setStoryInfo(data.storyInfo || { title: "Our Story", subtitle: "Moments" });
                    setGalleryItems(data.galleryItems || []);
                    setLetterData(data.letterData || { title: "", body: "", sender: "" });
                    setBgMusic(data.bgMusic || "Music");
                    if(data.playlist) setPlaylist(data.playlist);
                    if(data.currentSongId) setCurrentSongId(data.currentSongId);
                } else {
                    setError("Format cerita usang.");
                }
            } else {
                setError("Halaman tidak ditemukan.");
            }
        } catch (err) {
            console.error(err);
            setError("Gagal memuat.");
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const togglePlay = (id: number) => {
      if (currentSongId === id && isPlaying) {
          setIsPlaying(false);
      } else {
          setCurrentSongId(id);
          setIsPlaying(true);
      }
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-[#e0f7fa] flex flex-col items-center justify-center text-sky-600 gap-4">
              <Loader2 size={40} className="animate-spin" />
              <p className={`text-lg font-medium ${playfair.className}`}>Mengambil Kenangan...</p>
          </div>
      );
  }

  if (error) {
      return (
          <div className="min-h-screen bg-[#FDFDFC] flex flex-col items-center justify-center text-stone-800 p-8 text-center">
              <AlertTriangle size={48} className="text-red-400 mb-6" />
              <h1 className={`text-3xl font-bold mb-3 ${playfair.className}`}>Maaf</h1>
              <p className="text-stone-500 mb-8 max-w-md">{error}</p>
              <a href="/" className="px-8 py-3 bg-stone-900 text-white rounded-full font-bold text-sm hover:bg-black transition-all">Buat Sendiri</a>
          </div>
      );
  }

  // --- RENDER VIEWS ---

  const renderHome = () => (
      <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-5xl mx-auto animate-in fade-in duration-700 relative z-10 py-10">
         <TitleCard 
              title={storyInfo.title} 
              subtitle={storyInfo.subtitle} 
         />

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mt-20 w-full max-w-4xl px-6">
              <CameraMenu onClick={() => setView('gallery')} />
              <LetterMenu onClick={() => setView('letter')} />
              <MusicMenu 
                  onClick={() => setIsMusicModalOpen(true)} 
                  currentSong={playlist.find((s:any) => s.id === currentSongId)?.title || "Music"} 
              />
         </div>

         <div className="mt-20 opacity-60">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur rounded-full text-stone-500 text-xs font-bold uppercase tracking-widest border border-white/50">
                 <Gift size={14} className="text-rose-400" /> Made with Cardify
             </div>
         </div>
      </div>
  );

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
                                onClick={() => setSelectedItem(item)}
                             />
                          ) : (
                             <StickyNote 
                                text={item.text} 
                                rotation={rotation} 
                                color={item.bg} 
                                onClick={() => setSelectedItem(item)}
                             />
                          )}
                      </div>
                  );
              })}
          </div>
      </div>
  );

  const renderLetter = () => (
      <div className="flex flex-col min-h-screen items-center justify-center p-6 relative z-10 w-full">
          <div className="absolute top-6 left-6 z-40">
             <button onClick={() => setView('home')} className="flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full text-stone-600 hover:text-black font-bold uppercase text-xs tracking-widest group shadow-sm">
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Home
             </button>
          </div>

          <div className="max-w-2xl w-full bg-[#fffcf5] p-10 md:p-16 rounded-sm shadow-2xl relative animate-in slide-in-from-bottom-10 duration-700 border border-[#f0ead6] rotate-1">
               <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
               
               <div className="relative z-10 space-y-8 text-center">
                   <h1 className={`text-5xl md:text-6xl text-rose-500 ${greatVibes.className}`}>{letterData.title}</h1>
                   <p className={`text-xl md:text-2xl text-stone-700 leading-loose ${caveat.className} whitespace-pre-wrap`}>
                      {letterData.body}
                   </p>
                   <div className="text-right mt-8 pt-8 border-t border-stone-100/50">
                       <p className={`text-3xl text-stone-500 ${caveat.className}`}>{letterData.sender}</p>
                   </div>
               </div>
          </div>
      </div>
  );

  return (
    <div className={`min-h-screen bg-[#FDFDFC] overflow-hidden ${dmSans.className} relative flex flex-col`}>
        
        {/* ADDED: Google Fonts import via style tag for preview */}
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

          /* HIDE SCROLLBAR CLASS */
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
          }
        `}</style>

        {/* Background Effect */}
        <BackgroundEffects />
        
        {/* VIEW SWITCHER */}
        {view === 'home' && renderHome()}
        {view === 'gallery' && renderGallery()}
        {view === 'letter' && renderLetter()}

        {/* LIGHTBOX FOR ITEMS */}
        {selectedItem && (
            <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}

        {/* MUSIC PLAYER MODAL (READ ONLY) */}
        {isMusicModalOpen && (
            <MusicPlayerModal 
                playlist={playlist}
                onClose={() => setIsMusicModalOpen(false)}
                onSelectSong={setCurrentSongId}
                currentSongId={currentSongId}
                togglePlay={togglePlay}
                isPlaying={isPlaying}
            />
        )}
    </div>
  );
}