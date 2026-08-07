"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";

// --- FIREBASE IMPORTS ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
    if (envConfig && envConfig.apiKey) firebaseConfig = envConfig;
} catch (e) { console.log("Using manual config"); }

const appId = typeof __app_id !== 'undefined' ? __app_id : 'cardify-app';
let app: any = null;
let auth: any = null;
let db: any = null;

if (firebaseConfig && firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) { console.error("Firebase Init Error:", e); }
}

// --- TYPES ---
type ScrapItem = {
    id: string;
    type: 'image' | 'text';
    content: string; 
    x: number; 
    y: number; 
    rotation: number;
    scale: number;
    tapeColor?: string;
};

type PageData = {
    id: number;
    items: ScrapItem[];
    sticker: string | null;
};

// --- SCRAPBOOK THEMES ---
const SCRAPBOOK_THEMES = [
    { 
        id: 'kraft', name: 'Kraft Paper', 
        bg: '#d4c5a9', spine: '#8c7b5d',
        pattern: 'url("https://www.transparenttextures.com/patterns/cardboard.png")',
        accent: '#5d4037'
    },
    { 
        id: 'mint', name: 'Mint Grid', 
        bg: '#d1fae5', spine: '#34d399',
        pattern: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #6ee7b7 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #6ee7b7 20px)',
        bgSize: '20px 20px', accent: '#065f46'
    },
    { 
        id: 'blush', name: 'Pink Dot', 
        bg: '#fce7f3', spine: '#f472b6',
        pattern: 'radial-gradient(#fbcfe8 20%, transparent 20%)',
        bgSize: '10px 10px', accent: '#be185d'
    },
    { 
        id: 'blue', name: 'Sky Blue', 
        bg: '#e0f2fe', spine: '#38bdf8',
        pattern: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
        accent: '#0369a1'
    },
    { 
        id: 'dark', name: 'Chalkboard', 
        bg: '#333333', spine: '#1a1a1a',
        pattern: 'url("https://www.transparenttextures.com/patterns/black-scales.png")',
        accent: '#ffffff' 
    },
];

const WashiTape = ({ color = "bg-rose-300/80", className }: { color?: string, className?: string }) => (
  <div className={`absolute h-5 ${color} shadow-sm z-30 mix-blend-multiply pointer-events-none transform -rotate-1 ${className}`}>
    <div className="absolute inset-0 bg-white/20 w-full h-full"></div>
    <div className="absolute -left-1 top-0 bottom-0 w-2 bg-transparent border-r border-dashed border-white/60"></div>
    <div className="absolute -right-1 top-0 bottom-0 w-2 bg-transparent border-l border-dashed border-white/60"></div>
  </div>
);

const RealisticPaperTexture = () => (
    <>
        <div className="absolute inset-0 bg-[#fffefc]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_60%,_rgba(60,40,20,0.12)_100%)] pointer-events-none"></div>
    </>
);

// --- REALISTIC 3D FLIPBOOK COMPONENT (VIEWER) ---
const Flipbook = ({ pages, coverTitle, themeId }: { pages: PageData[], coverTitle: string, themeId: string }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = pages.length + 2; // +1 Isi Cover, +1 Back Cover
    const theme = SCRAPBOOK_THEMES.find(t => t.id === themeId) || SCRAPBOOK_THEMES[0];

    const handleFlip = (index: number) => {
        if (index === currentPage) setCurrentPage(index + 1);
        else if (index === currentPage - 1) setCurrentPage(index);
    };

    const getZIndex = (pageIndex: number) => {
        if (currentPage === pageIndex) return totalPages + 1;
        if (currentPage === pageIndex + 1) return totalPages + 1;
        if (pageIndex < currentPage) return pageIndex; 
        return totalPages - pageIndex; 
    };

    return (
        <div className="relative w-[380px] h-[520px] perspective-[3000px] select-none font-sans flex items-center justify-center">
            {/* Realistic Deep Desk Shadow */}
            <div className="absolute bottom-1 left-4 right-4 h-10 bg-black/45 blur-2xl rounded-[100%] z-0 transform translate-y-5"></div>

            <div className="relative w-full h-full transform-style-3d transition-transform duration-700 z-10 flex items-center justify-center transform rotate-x-[2deg] hover:rotate-x-[0deg] transition-all">
                
                {/* PAGE THICKNESS STACK */}
                <div className="absolute right-0 top-3 bottom-3 w-3 bg-[#e6e2d3] rounded-r-sm translate-z-[-5px] shadow-sm border-r border-stone-300/60 overflow-hidden flex flex-col justify-between py-1 opacity-90 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-full h-[1px] bg-stone-300/70"></div>
                    ))}
                </div>
                <div className="absolute bottom-0 left-3 right-3 h-3 bg-[#ded9cc] rounded-b-sm translate-z-[-5px] shadow-sm border-b border-stone-300/60 flex justify-between px-2 items-center opacity-90 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="h-full w-[1px] bg-stone-300/70"></div>
                    ))}
                </div>

                {/* Book Binding Spine Stack */}
                <div className="absolute left-0 top-3 bottom-3 w-4 rounded-l-md shadow-inner bg-stone-800/40 translate-z-[-8px]"></div>

                {/* --- COVER DEPAN (INDEX 0) --- */}
                <div 
                    onClick={() => handleFlip(0)}
                    className={`absolute inset-0 w-full h-full rounded-r-2xl origin-left transition-transform duration-1100 ease-in-out transform-style-3d cursor-pointer 
                    ${currentPage > 0 ? 'rotate-y-[-180deg]' : 'rotate-y-0'}`}
                    style={{ zIndex: getZIndex(0) }}
                >
                    <div className="absolute inset-0 backface-hidden p-8 rounded-r-2xl shadow-2xl overflow-hidden border-l-[16px]"
                         style={{ 
                             backgroundColor: theme.bg, 
                             backgroundImage: theme.pattern,
                             backgroundSize: theme.bgSize || 'auto',
                             borderColor: theme.spine 
                         }}>
                         
                         <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none z-20"></div>

                         <div className="absolute top-6 right-6 text-3xl opacity-60 rotate-12">✨</div>
                         <div className="absolute bottom-6 left-6 text-3xl opacity-60 -rotate-12">🎨</div>

                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 bg-[#fdfbf7] p-8 shadow-2xl transform -rotate-2 border-2 border-stone-300 rounded-sm">
                             <WashiTape color="bg-rose-300/90" className="w-24 -top-3 left-1/2 -translate-x-1/2 rotate-1" />
                             <h1 className="font-handwriting text-4xl md:text-5xl text-stone-800 text-center leading-[0.95] pt-2">
                                 {coverTitle || "Our Story"}
                             </h1>
                             <div className="mt-5 border-t-2 border-dashed border-stone-300 w-full"></div>
                             <p className="text-center text-[10px] text-stone-400 mt-2 font-sans uppercase tracking-widest font-bold">Handmade Memories ✿</p>
                         </div>
                    </div>

                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-l-2xl shadow-2xl bg-[#fdfbf7] overflow-hidden flex items-center justify-center">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-40"></div>
                         <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/20 via-black/5 to-transparent pointer-events-none z-20"></div>
                         <div className="w-full h-full border-8 border-double border-stone-200 flex items-center justify-center p-6">
                            <p className="font-handwriting text-stone-400 text-2xl rotate-[-2deg]">"Every picture tells a story..."</p>
                         </div>
                    </div>
                </div>

                {/* --- HALAMAN ISI (CONTENT PAGES) --- */}
                {pages && pages.map((page, index) => {
                    const pageIndex = index + 1;
                    const isFlipped = currentPage > pageIndex;
                    
                    return (
                        <div 
                            key={page.id || index}
                            onClick={() => handleFlip(pageIndex)}
                            className={`absolute inset-0 w-full h-full rounded-r-xl origin-left transition-transform duration-1100 ease-in-out transform-style-3d cursor-pointer
                            ${isFlipped ? 'rotate-y-[-180deg]' : 'rotate-y-0'}`}
                            style={{ zIndex: getZIndex(pageIndex) }}
                        >
                            {/* RIGHT PAGE (ISI) */}
                            <div className="absolute inset-0 backface-hidden overflow-hidden rounded-r-xl bg-[#faf9f6] border-l border-stone-300 shadow-2xl">
                                <RealisticPaperTexture />
                                
                                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/25 via-black/8 to-transparent z-20 pointer-events-none"></div>

                                <div className="w-full h-full relative z-30 p-6">
                                    {page.items && page.items.map((item) => (
                                        <div 
                                            key={item.id}
                                            className="absolute transition-all duration-300 filter drop-shadow-lg"
                                            style={{ 
                                                left: `${item.x}%`, 
                                                top: `${item.y}%`, 
                                                transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale || 1})`,
                                                zIndex: 10
                                            }}
                                        >
                                            {item.type === 'image' ? (
                                                <div className="p-3 pb-8 bg-white shadow-xl border border-stone-200/90 rounded-sm">
                                                    <WashiTape color={item.tapeColor} className="w-20 -top-2.5 left-1/2 -translate-x-1/2 -rotate-2" />
                                                    <div className="w-32 h-32 md:w-36 md:h-36 bg-stone-100 overflow-hidden relative rounded-xs">
                                                        {item.content ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={item.content} alt="memory" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 text-xs">
                                                                <ImageIcon size={24} className="mb-1" />
                                                                <span>No Photo</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-40 pointer-events-none"></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-36 p-4 bg-[#fefce8] shadow-lg border border-stone-200/70 relative rounded-sm transform rotate-1">
                                                    <WashiTape color="bg-amber-200/80" className="w-16 -top-2 left-1/2 -translate-x-1/2 rotate-2" />
                                                    <p className="font-handwriting text-stone-700 text-base leading-snug relative z-10 break-words text-center min-h-[2.5rem] pt-1">
                                                        {item.content || "Write a note..."}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {page.sticker && (
                                        <div className="absolute bottom-6 right-6 text-5xl filter drop-shadow-md transform rotate-12 select-none">
                                            {page.sticker}
                                        </div>
                                    )}
                                </div>

                                <span className="absolute bottom-4 right-6 text-[10px] text-stone-400 font-serif italic opacity-70">Page {pageIndex}</span>
                            </div>

                            {/* LEFT PAGE (BACK) */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-l-xl overflow-hidden bg-[#f0eee6] shadow-2xl">
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/crinkled-paper.png')] opacity-30"></div>
                                 <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/25 via-black/8 to-transparent z-20 pointer-events-none"></div>
                                 <div className="w-full h-full flex items-center justify-center p-8 opacity-20 z-30 relative">
                                     <div className="text-6xl -rotate-12">✂️</div>
                                 </div>
                            </div>
                        </div>
                    );
                })}

                {/* --- BACK COVER --- */}
                {pages && (() => {
                    const backCoverIndex = pages.length + 1;
                    const isFlipped = currentPage > backCoverIndex;
                    
                    return (
                        <div 
                            key="back-cover"
                            onClick={() => handleFlip(backCoverIndex)}
                            className={`absolute inset-0 w-full h-full rounded-r-2xl origin-left transition-transform duration-1100 ease-in-out transform-style-3d cursor-pointer
                            ${isFlipped ? 'rotate-y-[-180deg]' : 'rotate-y-0'}`}
                            style={{ zIndex: getZIndex(backCoverIndex) }}
                        >
                            <div className="absolute inset-0 backface-hidden p-8 rounded-r-2xl shadow-2xl overflow-hidden border-l-[16px] flex flex-col items-center justify-between"
                                 style={{ 
                                     backgroundColor: theme.bg, 
                                     backgroundImage: theme.pattern,
                                     backgroundSize: theme.bgSize || 'auto',
                                     borderColor: theme.spine 
                                 }}>
                                 
                                 <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none z-20"></div>

                                 <div className="w-full text-center pt-6 z-10">
                                     <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 text-stone-700">Cardify Memories</span>
                                 </div>

                                 <div className="w-32 h-32 rounded-full border-4 border-dashed border-stone-500/40 flex flex-col items-center justify-center p-2 transform rotate-6 z-10 bg-white/10 backdrop-blur-[2px]">
                                     <span className="text-2xl">🌿</span>
                                     <span className="text-[9px] font-bold uppercase tracking-widest text-stone-700 mt-1 text-center">Handcrafted Edition</span>
                                     <span className="text-[8px] text-stone-500 mt-0.5">Made with Love</span>
                                 </div>

                                 <div className="w-full pb-4 flex flex-col items-center z-10 opacity-70">
                                     <div className="h-6 w-28 bg-stone-800/80 rounded-sm mb-1 flex items-center justify-center text-[7px] text-white tracking-widest font-mono">
                                         |||| | |||| || |
                                     </div>
                                     <span className="text-[8px] text-stone-600 font-mono">EST. 2026 • ALL RIGHTS RESERVED</span>
                                 </div>
                            </div>

                            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-l-2xl shadow-2xl bg-[#faf9f6] overflow-hidden flex items-center justify-center">
                                 <RealisticPaperTexture />
                                 <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/15 via-black/4 to-transparent pointer-events-none z-20"></div>
                                 <div className="w-full h-full flex flex-col items-center justify-center p-8 z-30">
                                     <p className="font-handwriting text-stone-400 text-xl text-center">"The End of Chapter, but not the story."</p>
                                 </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

// --- MAIN VIEWER PAGE ---
export default function ScrapbookViewer() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
      const path = window.location.pathname;
      const segments = path.split('/');
      const id = segments[segments.length - 1]; 

    if (id && id !== 'viewer') {
       if (!db || !auth) {
           setError(true);
           setLoading(false);
           return;
       }

       const fetchData = async () => {
           try {
             await signInAnonymously(auth);
             const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'scrap-book', id);
             const docSnap = await getDoc(docRef);

             if (docSnap.exists()) {
                 setData(docSnap.data());
             } else {
                 setError(true);
             }
           } catch (e) {
             console.error("Error fetching story:", e);
             setError(true);
           } finally {
             setLoading(false);
           }
       };
       fetchData();
    } else {
        setError(true);
        setLoading(false);
    }
  }, []);

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8e4dc]">
         <Loader2 className="animate-spin text-stone-400" size={32} />
      </div>
  );

  if (error || !data) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e8e4dc] p-4 text-center font-sans">
         <h1 className="text-xl font-bold text-stone-800 mb-2">Book Not Found</h1>
         <p className="text-stone-500 mb-6 text-sm">Cerita tidak ditemukan atau link salah.</p>
         <a href="/templates" className="px-6 py-2 bg-stone-800 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black">
             Buat Sendiri
         </a>
      </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#EAE6DC] flex items-center justify-center p-8 relative overflow-hidden perspective-[3000px]">
        {/* Inject Google Fonts */}
        <style dangerouslySetInnerHTML={{__html: `
            @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Indie+Flower&family=Playfair+Display:wght@700&display=swap');
            .font-handwriting { font-family: 'Patrick Hand', cursive; }
            .font-serif { font-family: 'Playfair Display', serif; }
            .transform-style-3d { transform-style: preserve-3d; }
            .backface-hidden { backface-visibility: hidden; }
            .rotate-y-0 { transform: rotateY(0deg); }
            .rotate-y-180 { transform: rotateY(180deg); }
            .rotate-y-\[-180deg\] { transform: rotateY(-180deg); }
            .perspective-\[3000px\] { perspective: 3000px; }
        `}} />

        {/* Desk Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10 flex flex-col items-center transform transition-transform duration-500">
            {/* Back Button */}
            <div className="absolute top-0 left-0 -mt-24 md:-ml-32">
                <a href="/templates" className="flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors uppercase tracking-widest bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                    <ArrowLeft size={12} /> Create Your Own
                </a>
            </div>

            <span className="mb-10 px-6 py-2 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold text-stone-600 uppercase tracking-[0.2em] shadow-sm border border-white/40">
                Tap cover to open book
            </span>

            {/* Pass themeId, pages, and title */}
            <Flipbook pages={data.pages} coverTitle={data.title} themeId={data.themeId} />
            
            <p className="mt-12 text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase">
                Created with Cardify
            </p>
        </div>
    </div>
  );
}