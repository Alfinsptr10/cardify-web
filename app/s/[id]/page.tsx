"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Image as ImageIcon, 
  X, Loader2, Music, Heart, Camera, Headphones, Cloud, Sun, Gift, AlertTriangle
} from "lucide-react";
import { DM_Sans, Playfair_Display, Caveat, Great_Vibes } from "next/font/google";

// Firebase Imports
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// --- FONTS ---
const dmSans = DM_Sans({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

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

// --- VISUAL COMPONENTS (READ ONLY - COPIED FROM EDITOR) ---

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

const HangingString = ({ length = 8 }: { length?: number }) => (
  <div className="relative w-full mb-[-8px] pointer-events-none z-0 flex justify-center" style={{ height: `${length * 5}px` }}>
    <div className="h-full w-[5px] relative"
        style={{
            background: `repeating-linear-gradient(45deg, #E3D5C3, #E3D5C3 3px, #C0A886 3px, #C0A886 5px)`,
            boxShadow: '1px 0 3px rgba(0,0,0,0.3), inset 1px 0 2px rgba(255,255,255,0.4)',
            borderRadius: '2px',
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

const HangingMenu = ({ icon: Icon, label, onClick, delay = 0, rotation = 0, stringLength = 10, img }: any) => (
  <div onClick={onClick} className="flex flex-col items-center group cursor-pointer animate-in fade-in slide-in-from-top-10 duration-1000 animate-float" style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}>
    <HangingString length={stringLength} />
    
    <div className="relative transform transition-all hover:scale-110 hover:z-20 hover:drop-shadow-2xl">
        {/* Clip on top of the object */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <HeartClip />
        </div>

        {/* Floating Object without Polaroid Border - UKURAN DIPERBESAR */}
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
  <div className="flex flex-col items-center group relative animate-float" style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}>
    <HangingString length={stringLength} />
    <div onClick={onClick} className="relative bg-white p-3 pb-10 shadow-xl transform transition-all hover:scale-105 hover:z-30 hover:shadow-2xl duration-300 w-64 cursor-pointer rounded-sm">
      <HeartClip />
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

const StickyNote = ({ text, color = "#fef3c7", rotation = 0, onClick, stringLength = 8, delay = 0 }: any) => (
  <div className="flex flex-col items-center group relative animate-float" style={{ animationDelay: `${delay}ms`, '--rot': `${rotation}deg` } as React.CSSProperties}>
    <HangingString length={stringLength} />
    <div onClick={onClick} className="relative p-6 shadow-lg transform transition-all hover:scale-105 hover:z-20 hover:shadow-xl duration-300 w-64 mx-auto flex items-center justify-center text-center cursor-pointer group" style={{ backgroundColor: color, minHeight: '200px' }}>
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-black/5 rounded-full blur-sm"></div> 
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-2 backdrop-blur-sm shadow-sm"></div> 
      <HeartClip />
      <div className="w-full mt-4">
          <p className={`text-xl leading-relaxed text-stone-800 ${caveat.className} w-full break-words`}>{text}</p>
      </div>
    </div>
  </div>
);

const TitleCard = ({ title, subtitle, stringLength = 8 }: any) => (
  <div className="flex flex-col items-center group relative animate-float-slow">
    <HangingString length={stringLength} />
    <div className="text-center p-6 relative w-80">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"><HeartClip /></div>
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
  <HangingMenu img="/template/camera.png" label="Gallery" onClick={onClick} icon={Camera} stringLength={6} rotation={2} delay={0} />
);

const LetterMenu = ({ onClick }: { onClick: () => void }) => (
  <HangingMenu img="/template/letter.png" label="Read Note" onClick={onClick} icon={Heart} stringLength={9} rotation={-2} delay={200} />
);

const MusicMenu = ({ onClick, currentSong }: { onClick: () => void, currentSong: string }) => (
  <HangingMenu img="/template/music.png" label={currentSong || "Music"} onClick={onClick} icon={Headphones} stringLength={4} rotation={1} delay={400} />
);


// --- LIGHTBOX MODAL ---
const LightboxModal = ({ item, onClose }: any) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div className="relative bg-white p-4 pb-12 rounded-sm shadow-2xl max-w-lg w-full transform rotate-1 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-12 right-0 text-white hover:text-rose-200 transition-colors"><X size={32} /></button>
                
                {item.type === 'photo' && (
                    <div className="space-y-4">
                        <div className="aspect-[4/5] w-full bg-stone-100 overflow-hidden relative border border-stone-200">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={item.img} alt={item.caption} className="w-full h-full object-cover" />
                        </div>
                        <p className={`text-center text-3xl text-stone-800 ${caveat.className}`}>{item.caption}</p>
                    </div>
                )}

                {item.type === 'message' && (
                    <div className="w-full aspect-square flex items-center justify-center p-8 relative" style={{ backgroundColor: item.bg }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/30 rotate-1 backdrop-blur-sm shadow-sm"></div>
                        <p className={`text-4xl leading-relaxed text-stone-800 ${caveat.className} text-center`}>{item.text}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN PAGE VIEWER ---
export default function StoryViewer() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data State
  const [storyInfo, setStoryInfo] = useState({ title: "", subtitle: "" });
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [letterData, setLetterData] = useState({ title: "", body: "", sender: "" });
  const [bgMusic, setBgMusic] = useState("Music");

  // View State
  const [view, setView] = useState<'home' | 'gallery' | 'letter'>('home');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        if (!id) return;
        if (!db || !auth) {
            setError("Gagal: Database belum dikonfigurasi.");
            setLoading(false);
            return;
        }

        try {
            await signInAnonymously(auth);
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'stories', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                
                // Pastikan format data sesuai dengan yang dikirim dari Editor v3
                if (data.type === 'web-story-v3' || data.galleryItems) {
                    setStoryInfo(data.storyInfo || { title: "Our Story", subtitle: "Moments" });
                    setGalleryItems(data.galleryItems || []);
                    setLetterData(data.letterData || { title: "", body: "", sender: "" });
                    setBgMusic(data.bgMusic || "Music");
                } else {
                    setError("Format cerita usang atau tidak didukung.");
                }
            } else {
                setError("Halaman tidak ditemukan.");
            }
        } catch (err) {
            console.error(err);
            setError("Gagal memuat. Periksa koneksi internet.");
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [id]);

  const toggleMusic = () => {
      setIsPlayingMusic(!isPlayingMusic);
      // Placeholder logic for music
      alert(`🎶 ${isPlayingMusic ? 'Stopping' : 'Playing'}: ${bgMusic}`);
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
              <Link href="/" className="px-8 py-3 bg-stone-900 text-white rounded-full font-bold text-sm hover:bg-black transition-all">Buat Sendiri</Link>
          </div>
      );
  }

  // --- RENDER VIEWS ---

  const renderHome = () => (
      <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-5xl mx-auto animate-in fade-in duration-700 relative z-10 py-10">
         <TitleCard 
              title={storyInfo.title} 
              subtitle={storyInfo.subtitle} 
              stringLength={10}
         />

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mt-20 w-full max-w-4xl px-6">
              <CameraMenu onClick={() => setView('gallery')} />
              <LetterMenu onClick={() => setView('letter')} />
              <MusicMenu onClick={toggleMusic} currentSong={bgMusic} />
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
          
          <div className="flex-grow overflow-x-auto overflow-y-hidden flex items-center px-10 gap-16 pb-20 custom-scrollbar scroll-smooth">
              {galleryItems && galleryItems.map((item: any, index: number) => {
                  const rotation = (item.id % 2 === 0 ? 2 : -2) * ((index % 3) + 1);
                  return (
                      <div key={index} className="flex-shrink-0 animate-in zoom-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                          {item.type === 'photo' ? (
                             <Polaroid 
                                img={item.img} 
                                caption={item.caption} 
                                rotation={rotation} 
                                stringLength={8 + (index%3)*3}
                                onClick={() => setSelectedItem(item)}
                             />
                          ) : (
                             <StickyNote 
                                text={item.text} 
                                rotation={rotation} 
                                color={item.bg} 
                                stringLength={8 + (index%3)*3}
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

        {/* LIGHTBOX FOR ITEMS */}
        {selectedItem && (
            <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
    </div>
  );
}