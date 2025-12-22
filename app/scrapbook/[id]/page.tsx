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

// --- SCRAPBOOK THEMES (DIY STYLE) ---
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

// --- HELPER COMPONENTS ---
const WashiTape = ({ color = "bg-rose-300", className }: { color?: string, className?: string }) => (
  <div className={`absolute h-6 ${color} opacity-90 shadow-sm z-30 mix-blend-multiply pointer-events-none ${className}`}>
    <div className="absolute inset-0 bg-white/20 w-full h-full"></div>
    <div className="absolute -left-1 top-0 bottom-0 w-2 bg-transparent border-r-2 border-dashed border-white/50 blur-[0.5px]"></div>
    <div className="absolute -right-1 top-0 bottom-0 w-2 bg-transparent border-l-2 border-dashed border-white/50 blur-[0.5px]"></div>
  </div>
);

const RealisticPaperTexture = () => (
    <>
        <div className="absolute inset-0 bg-[#fffefc]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_70%,_rgba(100,100,100,0.1)_100%)] pointer-events-none"></div>
    </>
);

// --- FLIPBOOK COMPONENT (VIEWER) ---
const Flipbook = ({ pages, coverTitle, themeId }: { pages: PageData[], coverTitle: string, themeId: string }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = pages.length + 1;
    
    // Fallback to kraft if theme not found
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
        <div className="relative w-[340px] h-[460px] perspective-[2000px] select-none font-sans">
            {/* SHADOW BUKU */}
            <div className="absolute bottom-5 left-5 right-5 h-4 bg-black/20 blur-xl rounded-[100%] z-0 transform translate-y-2"></div>

            {/* BOOK CONTAINER */}
            <div className="relative w-full h-full transform-style-3d transition-transform duration-700 z-10">
                
                {/* --- SPINE (DIY Style) --- */}
                <div className="absolute inset-0 rounded-r-sm shadow-xl translate-z-[-4px]"
                     style={{ backgroundColor: theme.spine }}>
                     <div className="absolute left-0 top-0 bottom-0 w-8 bg-black/10 border-r border-black/10"></div>
                </div>

                {/* --- COVER PAGE --- */}
                <div 
                    onClick={() => handleFlip(0)}
                    className={`absolute inset-0 w-full h-full rounded-r-lg origin-left transition-transform duration-700 transform-style-3d cursor-pointer 
                    ${currentPage > 0 ? 'rotate-y-[-180deg]' : 'rotate-y-0'}`}
                    style={{ zIndex: getZIndex(0) }}
                >
                    {/* Front Cover (DIY Style) */}
                    <div className="absolute inset-0 backface-hidden p-6 rounded-r-lg shadow-inner overflow-hidden border-l-8"
                         style={{ 
                             backgroundColor: theme.bg, 
                             backgroundImage: theme.pattern,
                             backgroundSize: theme.bgSize || 'auto',
                             borderColor: theme.spine 
                         }}>
                         
                         {/* Decor */}
                         <div className="absolute top-4 right-4 text-4xl opacity-50 rotate-12">✨</div>
                         <div className="absolute bottom-4 left-4 text-4xl opacity-50 -rotate-12">🎨</div>

                         {/* Label Title */}
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 bg-[#fdfbf7] p-6 shadow-md transform -rotate-2 border border-stone-200">
                             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-rose-300/80 rotate-1 shadow-sm mix-blend-multiply"></div>
                             <h1 className="font-handwriting text-4xl text-stone-800 text-center leading-[0.9]">
                                 {coverTitle}
                             </h1>
                             <div className="mt-4 border-t-2 border-dashed border-stone-300 w-full"></div>
                             <p className="text-center text-[10px] text-stone-400 mt-1 font-sans uppercase tracking-widest">Handmade Memories</p>
                         </div>
                    </div>

                    {/* Inner Cover */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-l-lg shadow-md bg-[#fdfbf7] overflow-hidden flex items-center justify-center">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-50"></div>
                         <div className="w-full h-full border-4 border-double border-stone-200 flex items-center justify-center p-4">
                            <p className="font-handwriting text-stone-500 text-xl rotate-[-2deg]">"A collection of moments..."</p>
                         </div>
                    </div>
                </div>

                {/* --- CONTENT PAGES --- */}
                {pages.map((page, index) => {
                    const pageIndex = index + 1;
                    const isFlipped = currentPage > pageIndex;
                    
                    return (
                        <div 
                            key={page.id}
                            onClick={() => handleFlip(pageIndex)}
                            className={`absolute inset-0 w-full h-full rounded-r-md origin-left transition-transform duration-700 transform-style-3d cursor-pointer
                            ${isFlipped ? 'rotate-y-[-180deg]' : 'rotate-y-0'}`}
                            style={{ zIndex: getZIndex(pageIndex) }}
                        >
                            {/* RIGHT PAGE (CONTENT) */}
                            <div className="absolute inset-0 backface-hidden overflow-hidden rounded-r-md bg-[#faf9f6] border-l border-stone-200">
                                <RealisticPaperTexture />
                                {/* Shadow Spine */}
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent z-10 pointer-events-none"></div>

                                {/* RENDER ITEMS (PHOTOS & NOTES) */}
                                <div className="w-full h-full relative z-20 p-4 overflow-hidden">
                                    {page.items && page.items.map((item) => (
                                        <div 
                                            key={item.id}
                                            className="absolute transition-all duration-300"
                                            style={{ 
                                                left: `${item.x}%`, 
                                                top: `${item.y}%`, 
                                                transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale || 1})`,
                                                zIndex: 10 // Items above background
                                            }}
                                        >
                                            {item.type === 'image' ? (
                                                <div className="p-2 bg-white shadow-md border border-stone-200">
                                                    <WashiTape color={item.tapeColor} className="w-16 -top-2 left-1/2 -translate-x-1/2 -rotate-1" />
                                                    <div className="w-32 h-32 md:w-36 md:h-36 bg-stone-100 overflow-hidden relative">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={item.content} alt="memory" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50 pointer-events-none mix-blend-screen"></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-36 p-3 bg-[#fefce8] shadow-sm border border-stone-200/50 relative">
                                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-30"></div>
                                                    {/* Pin */}
                                                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400 border border-red-500 shadow-sm z-20"></div>
                                                    <p className="font-handwriting text-stone-700 text-sm leading-relaxed relative z-10 break-words text-center min-h-[2rem]">
                                                        {item.content}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Sticker */}
                                    {page.sticker && (
                                        <div className="absolute bottom-4 right-4 text-5xl drop-shadow-md transform rotate-12 filter saturate-125 transition-transform z-0">
                                            {page.sticker}
                                        </div>
                                    )}
                                </div>

                                <span className="absolute bottom-3 right-4 text-[10px] text-stone-400 font-serif italic opacity-70">Page {pageIndex}</span>
                            </div>

                            {/* LEFT PAGE (BACK OF SPREAD) */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-l-md overflow-hidden bg-[#f4f4f5]">
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/crinkled-paper.png')] opacity-40"></div>
                                 <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/5 to-transparent z-10 pointer-events-none"></div>
                                 <div className="w-full h-full flex items-center justify-center p-8 opacity-30 z-20 relative">
                                     <div className="text-6xl rotate-12">✂️</div>
                                 </div>
                            </div>
                        </div>
                    );
                })}
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
      // Manual ID parsing
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
             // FETCH FROM 'scrap-book' COLLECTION
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
         <a href="/" className="px-6 py-2 bg-stone-800 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black">
             Buat Sendiri
         </a>
      </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#e5e5e5] flex items-center justify-center p-8 relative overflow-hidden perspective-[2000px]">
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
            .perspective-\[2000px\] { perspective: 2000px; }
        `}} />

        {/* Desk Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10 flex flex-col items-center transform transition-transform hover:scale-[1.02] duration-500">
            {/* Back Button */}
            <div className="absolute top-0 left-0 -mt-24 md:-ml-32">
                <a href="/" className="flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors uppercase tracking-widest bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                    <ArrowLeft size={12} /> Create Your Own
                </a>
            </div>

            <span className="mb-10 px-6 py-2 bg-white/60 backdrop-blur-md rounded-full text-[10px] font-bold text-stone-600 uppercase tracking-[0.2em] shadow-sm border border-white/40">
                Tap cover to open
            </span>

            {/* Pass themeId here, not coverColorId */}
            <Flipbook pages={data.pages} coverTitle={data.title} themeId={data.themeId} />
            
            <p className="mt-12 text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase">
                Created with Cardify
            </p>
        </div>
    </div>
  );
}