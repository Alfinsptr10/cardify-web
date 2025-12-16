"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Image as ImageIcon, 
  Share2, X, Eye, Loader2, Copy, Check, Music, Play, Type, Plus, Trash2, Upload, Heart, Camera, Headphones, Cloud, Sun, Home
} from "lucide-react";
import { DM_Sans, Playfair_Display, Caveat, Great_Vibes } from "next/font/google";

// Import Firebase modules
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// --- FONTS ---
const dmSans = DM_Sans({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

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

const envConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
const envConfig = JSON.parse(envConfigStr);
const firebaseConfig = (envConfig && envConfig.apiKey) ? envConfig : manualConfig;
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

// Background Effect: Sky & Clouds Theme
const BackgroundEffects = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#e0f7fa]">
     {/* Sky Gradient */}
     <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#B2EBF2] to-[#FAFAF9]" />
     
     {/* Sun Element */}
     <div className="absolute -top-20 -right-20 opacity-50 animate-spin-slow" style={{ animationDuration: '60s' }}>
        <Sun size={400} className="text-yellow-200 fill-yellow-100" />
     </div>

     {/* Floating Clouds */}
     <div className="absolute top-20 left-[10%] text-white/90 animate-float-slow drop-shadow-sm">
        <Cloud size={80} fill="white" className="text-white" />
     </div>
     <div className="absolute top-40 right-[15%] text-white/70 animate-float" style={{ animationDelay: '2s', '--rot': '0deg' } as React.CSSProperties}>
        <Cloud size={60} fill="white" className="text-white" />
     </div>
     <div className="absolute bottom-1/3 left-[20%] text-white/50 animate-float-slow" style={{ animationDelay: '5s', '--rot': '0deg' } as React.CSSProperties}>
        <Cloud size={120} fill="white" className="text-white" />
     </div>
     
     {/* Subtle Texture Overlay */}
     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
  </div>
);

// Tali Tambang 3D
const HangingString = ({ length = 8 }: { length?: number }) => (
  <div className="relative w-full mb-[-8px] pointer-events-none z-0 flex justify-center" style={{ height: `${length * 5}px` }}>
    <div className="h-full w-[5px] relative"
        style={{
            background: `repeating-linear-gradient(45deg, #E3D5C3, #E3D5C3 3px, #C0A886 3px, #C0A886 5px)`,
            boxShadow: '1px 0 3px rgba(0,0,0,0.3), inset 1px 0 2px rgba(255,255,255,0.4)',
            borderRadius: '2px',
            zIndex: 0
        }}
    ></div>
  </div>
);

const HeartClip = () => (
  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 z-20 flex items-center justify-center pointer-events-none">
     <div className="w-6 h-6 bg-white border border-sky-200 rounded-full shadow-md flex items-center justify-center relative z-10">
        <Heart size={12} className="text-sky-400 fill-sky-400" />
     </div>
     <div className="absolute top-1 w-6 h-6 bg-black/10 rounded-full blur-[1px] -z-10"></div>
  </div>
);

// Menu Item Component
const HangingMenu = ({ icon: Icon, label, onClick, delay = 0, rotation = 0, stringLength = 10, img }: any) => (
  <div onClick={onClick} className="flex flex-col items-center group cursor-pointer animate-in fade-in slide-in-from-top-10 duration-1000 animate-float" style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}>
    <HangingString length={stringLength} />
    
    <div className="relative transform transition-all hover:scale-110 hover:z-20 hover:drop-shadow-2xl">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <HeartClip />
        </div>

        {/* Floating Object without Polaroid Border */}
        <div className="w-48 h-48 relative filter drop-shadow-xl">
            {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={label} className="w-full h-full object-contain" onError={(e) => {e.currentTarget.style.display='none'}} />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white rounded-full border-4 border-stone-100 shadow-inner">
                    <Icon size={56} className="text-stone-300"/>
                </div>
            )}
        </div>
        
        {/* Floating Label */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/50 whitespace-nowrap">
             <span className={`text-[10px] font-bold uppercase tracking-widest text-stone-600 ${dmSans.className}`}>{label}</span>
        </div>
    </div>
  </div>
);

const Polaroid = ({ img, caption, rotation = 0, onClick, stringLength = 8, delay = 0 }: any) => (
  <div 
    className="flex flex-col items-center group relative animate-float" 
    style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}
  >
    <HangingString length={stringLength} />
    <div 
      onClick={onClick}
      className="relative bg-white p-3 pb-10 shadow-xl transform transition-all hover:scale-105 hover:z-30 hover:shadow-2xl duration-300 w-64 cursor-pointer rounded-sm"
    >
      <HeartClip />
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

const StickyNote = ({ text, color = "#fef3c7", rotation = 0, onClick, stringLength = 8, delay = 0 }: any) => (
  <div 
    className="flex flex-col items-center group relative animate-float" 
    style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}
  >
    <HangingString length={stringLength} />
    <div 
      onClick={onClick}
      className="relative p-6 shadow-lg transform transition-all hover:scale-105 hover:z-20 hover:shadow-xl duration-300 w-64 mx-auto flex items-center justify-center text-center cursor-pointer group"
      style={{ backgroundColor: color, minHeight: '200px' }}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-black/5 rounded-full blur-sm"></div> 
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-2 backdrop-blur-sm shadow-sm"></div> 
      
      <HeartClip />

      <div className="w-full mt-4">
          <p className={`text-xl leading-relaxed text-stone-800 ${caveat.className} w-full break-words`}>
          {text || <span className="opacity-50">Write your message...</span>}
          </p>
      </div>
    </div>
  </div>
);

const TitleCard = ({ title, subtitle, onClick, stringLength = 8, onEdit }: { title: string, subtitle: string, onClick?: () => void, stringLength?: number, onEdit?: (field: string, value: string) => void }) => (
  <div className="flex flex-col items-center group relative animate-float-slow">
    <HangingString length={stringLength} />
    <div onClick={onClick} className="text-center p-6 relative cursor-pointer hover:scale-105 transition-transform duration-300 w-80">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"><HeartClip /></div>
      <div className="inline-block border-[6px] border-double border-sky-200 p-8 bg-white shadow-[0_10px_30px_-5px_rgba(135,206,235,0.4)] relative rounded-xl rotate-1 group-hover:rotate-0 transition-transform w-full">
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
  <HangingMenu img="/template/camera.png" label="Gallery" onClick={onClick} icon={Camera} stringLength={6} rotation={2} delay={0} />
);

const LetterMenu = ({ onClick }: { onClick: () => void }) => (
  <HangingMenu img="/template/letter.png" label="Read Note" onClick={onClick} icon={Heart} stringLength={9} rotation={-2} delay={200} />
);

const MusicMenu = ({ onClick, currentSong }: { onClick: () => void, currentSong: string }) => (
  <HangingMenu img="/template/music.png" label={currentSong || "Music"} onClick={onClick} icon={Headphones} stringLength={4} rotation={1} delay={400} />
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
                    {slide.type === 'intro' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Title</label>
                                <input value={slide.title} onChange={(e) => onUpdate(slide.id, 'title', e.target.value)} className={`w-full bg-white border border-sky-100 rounded-xl px-4 py-3 text-3xl text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200 text-center ${greatVibes.className}`} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Subtitle</label>
                                <input value={slide.subtitle} onChange={(e) => onUpdate(slide.id, 'subtitle', e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-center" />
                            </div>
                        </>
                    )}
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

// --- MAIN PAGE ---

export default function WebStoryEditor() {
  // --- STATE ---
  const [view, setView] = useState<'home' | 'gallery' | 'letter'>('home');

  // Data
  const [storyInfo, setStoryInfo] = useState({ title: "Our Story", subtitle: "A collection of moments" });
  const [galleryItems, setGalleryItems] = useState([
    { id: 1, type: "photo", caption: "First date", img: null as string | null },
    { id: 2, type: "photo", caption: "Sweet memory", img: null as string | null },
  ]);
  const [letterData, setLetterData] = useState({
      title: "My Dearest,",
      body: "Every moment with you is a treasure I hold close to my heart...",
      sender: "Yours, Alex"
  });
  const [bgMusic, setBgMusic] = useState("Romantic Piano"); 
  
  // Editor State
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
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
      if (file.size > 800000) { 
          alert("Image too large. Max 800KB.");
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
      setGalleryItems([...galleryItems, { id: newId, type: "photo", caption: "", img: null }]);
      setEditingItemId(newId);
  };

  const addNote = () => {
      const newId = Math.max(0, ...galleryItems.map(s => s.id)) + 1;
      setGalleryItems([...galleryItems, { id: newId, type: "message", caption: "", img: null }]);
      setEditingItemId(newId);
  };

  const removePhoto = (id: number) => {
      setGalleryItems(prev => prev.filter(s => s.id !== id));
      setEditingItemId(null);
  };

  const changeMusic = () => {
      const songs = ["Romantic Piano", "Acoustic Love", "Lo-Fi Date", "Jazz Night"];
      const nextSong = songs[(songs.indexOf(bgMusic) + 1) % songs.length];
      setBgMusic(nextSong);
      alert(`🎵 Music Changed to: ${nextSong}`);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    if (!isDbReady || !user) {
        setTimeout(() => {
            setIsPublishing(false);
            const demoId = "demo-" + Math.random().toString(36).substr(2, 6);
            const fakeUrl = `${window.location.origin}/s/${demoId}?demo=true`;
            setPublishedUrl(fakeUrl);
            alert("⚠️ MODE SIMULASI (DB Not Configured)\nLink Demo: " + fakeUrl);
        }, 1500);
        return;
    }
    try {
        const payload = {
            storyInfo,
            galleryItems,
            letterData,
            bgMusic,
            creatorId: user.uid,
            createdAt: new Date().toISOString(),
            type: "web-story-v3"
        };
        
        const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'stories'), payload);
        const url = `${window.location.origin}/s/${docRef.id}`;
        setPublishedUrl(url);
    } catch (error) {
        console.error("Error publishing:", error);
        alert("Gagal menyimpan.");
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

  // --- RENDER VIEWS ---

  // 1. HOME VIEW (MENU UTAMA)
  const renderHome = () => (
      <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-5xl mx-auto animate-in fade-in duration-700 relative z-10 py-10">
          
          {/* Header Title Editor */}
          <TitleCard 
              title={storyInfo.title} 
              subtitle={storyInfo.subtitle} 
              onEdit={(f, v) => setStoryInfo(prev => ({ ...prev, [f]: v }))}
              stringLength={10}
          />
          
          {/* Tombol Back to App */}
          <div className="absolute top-0 right-40 p-6 w-full flex justify-between items-start pointer-events-none">
             <Link href="/" className="pointer-events-auto flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full text-stone-600 hover:text-black font-bold uppercase text-xs tracking-widest group shadow-sm border border-white/50 transition-all hover:scale-105">
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Home
             </Link>
          </div>

          {/* Menus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mt-12 w-full max-w-4xl px-6">
              <CameraMenu onClick={() => setView('gallery')} />
              <LetterMenu onClick={() => setView('letter')} />
              <MusicMenu onClick={changeMusic} currentSong={bgMusic} />
          </div>

          {/* Publish Bar */}
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
                    <Link href={publishedUrl} target="_blank" className="block w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-md">
                        Visit Website
                    </Link>
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
             <h2 className={`text-4xl text-sky-600 ${greatVibes.className} drop-shadow-sm`}>Photo Gallery</h2>
             <button onClick={addPhoto} className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-sky-500 transition-all shadow-lg hover:scale-105">
                 <Plus size={16} /> Add Photo
             </button>
          </div>
          
          <div className="flex-grow overflow-x-auto overflow-y-hidden flex items-center px-10 gap-16 pb-20 custom-scrollbar scroll-smooth">
              {galleryItems.map((item, index) => {
                  const rotation = (item.id % 2 === 0 ? 2 : -2) * ((index % 3) + 1);
                  return (
                      <div key={item.id} className="flex-shrink-0 animate-in zoom-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                          <Polaroid 
                             img={item.img} 
                             caption={item.caption} 
                             rotation={rotation} 
                             stringLength={8 + (index%3)*3}
                             onClick={() => setEditingItemId(item.id)}
                          />
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
             <button onClick={() => setView('home')} className="flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full text-stone-600 hover:text-black font-bold uppercase text-xs tracking-widest group shadow-sm hover:scale-105 transition-all">
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Menu
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
        
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(var(--rot)); }
            50% { transform: translateY(-10px) rotate(var(--rot)); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-slow { animation: float 8s ease-in-out infinite; }
          .animate-spin-slow { animation: spin 60s linear infinite; }
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
    </div>
  );
}