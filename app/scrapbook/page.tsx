"use client";

import { useState } from "react";
import { 
  ArrowLeft, Save, Plus, Trash2, Link as LinkIcon, Check, Loader2, 
  Palette, Upload, Type, Image as ImageIcon,
  Grid3X3, Square, Columns, X, Book, Sparkles
} from "lucide-react";

// --- FIREBASE IMPORTS ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { saveUserCard } from "@/app/lib/saveCardAction";

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

// --- CLOUDINARY CONFIG ---
const CLOUDINARY_CLOUD_NAME = "dscy8htb3"; 
const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset"; 

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
    photoCount: 1 | 2 | 3;
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

const TAPE_COLORS = ["bg-rose-300/80", "bg-teal-200/80", "bg-amber-200/80", "bg-indigo-300/80", "bg-stone-300/80"];

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

// --- REALISTIC 3D FLIPBOOK COMPONENT (SLOW & SMOOTH PAGE FLIP) ---
const Flipbook = ({ pages, coverTitle, themeId }: { pages: PageData[], coverTitle: string, themeId: string }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = pages.length + 2; 
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
                    // Perubahan di sini: duration-1100 dan ease-in-out untuk efek lambat & natural
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
                {pages.map((page, index) => {
                    const pageIndex = index + 1;
                    const isFlipped = currentPage > pageIndex;
                    
                    return (
                        <div 
                            key={page.id}
                            onClick={() => handleFlip(pageIndex)}
                            // Durasi diperlambat jadi 1100ms dengan transisi halus
                            className={`absolute inset-0 w-full h-full rounded-r-xl origin-left transition-transform duration-1100 ease-in-out transform-style-3d cursor-pointer
                            ${isFlipped ? 'rotate-y-[-180deg]' : 'rotate-y-0'}`}
                            style={{ zIndex: getZIndex(pageIndex) }}
                        >
                            {/* RIGHT PAGE (ISI) */}
                            <div className="absolute inset-0 backface-hidden overflow-hidden rounded-r-xl bg-[#faf9f6] border-l border-stone-300 shadow-2xl">
                                <RealisticPaperTexture />
                                
                                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/25 via-black/8 to-transparent z-20 pointer-events-none"></div>

                                <div className="w-full h-full relative z-30 p-6">
                                    {page.items.map((item) => (
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
                                                <div className="p-3 pb-8 bg-white shadow-xl border border-stone-200/90 rounded-sm transform hover:scale-105 transition-transform">
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
                                        <div className="absolute bottom-6 right-6 text-5xl filter drop-shadow-md transform rotate-12 hover:scale-125 transition-transform select-none">
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
                {(() => {
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

// --- EDITOR PAGE ---
export default function ScrapbookEditor() {
    const [title, setTitle] = useState("OUR STORY");
    const [themeId, setThemeId] = useState("kraft");
    const [pages, setPages] = useState<PageData[]>([
        { id: 1, photoCount: 1, items: [], sticker: null }
    ]);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [generatedLink, setGeneratedLink] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const activePage = pages[activePageIndex] ?? pages[0];
    const selectedItem = activePage.items.find(i => i.id === selectedItemId);

    const addPage = () => {
        if (pages.length >= 8) return alert("Max 8 pages!");
        const newPage: PageData = { id: Date.now(), photoCount: 1, items: [], sticker: null };
        setPages([...pages, newPage]);
        setActivePageIndex(pages.length);
        setSelectedItemId(null);
    };

    const removePage = (index: number) => {
        if (pages.length <= 1) return alert("Minimum 1 page required.");
        setPages(pages.filter((_, i) => i !== index));
        setActivePageIndex(Math.max(0, index - 1));
    };

    const generateLayoutItems = (count: 1 | 2 | 3) => {
        const items: ScrapItem[] = [];
        const baseProps = { type: 'image' as const, scale: 1, content: '', tapeColor: TAPE_COLORS[0] };
        
        if (count === 1) {
            items.push({ ...baseProps, id: Date.now().toString(), x: 50, y: 50, rotation: -2 });
        } else if (count === 2) {
            items.push({ ...baseProps, id: Date.now().toString(), x: 38, y: 35, rotation: -4, tapeColor: TAPE_COLORS[1] });
            items.push({ ...baseProps, id: (Date.now()+1).toString(), x: 62, y: 65, rotation: 3, tapeColor: TAPE_COLORS[2] });
        } else if (count === 3) {
            items.push({ ...baseProps, id: Date.now().toString(), x: 32, y: 30, rotation: -5, tapeColor: TAPE_COLORS[0] });
            items.push({ ...baseProps, id: (Date.now()+1).toString(), x: 68, y: 32, rotation: 4, tapeColor: TAPE_COLORS[1] });
            items.push({ ...baseProps, id: (Date.now()+2).toString(), x: 50, y: 72, rotation: -1, tapeColor: TAPE_COLORS[3] });
        }
        return items;
    };

    const changePhotoCount = (count: 1 | 2 | 3) => {
        const existingNotes = activePage.items.filter(i => i.type === 'text');
        const newPhotos = generateLayoutItems(count);
        
        const newPages = [...pages];
        newPages[activePageIndex] = { 
            ...activePage, 
            photoCount: count,
            items: [...newPhotos, ...existingNotes] 
        };
        setPages(newPages);
        setSelectedItemId(null);
    };

    const addNote = () => {
        if (activePage.items.filter(i => i.type === 'text').length >= 2) return alert("Max 2 notes per page.");
        const newNote: ScrapItem = {
            id: Date.now().toString(),
            type: 'text',
            content: "Sweet memory...",
            x: 50, y: 50, rotation: 1, scale: 1
        };
        const newPages = [...pages];
        newPages[activePageIndex].items.push(newNote);
        setPages(newPages);
        setSelectedItemId(newNote.id);
    };

    const updateItem = (id: string, field: keyof ScrapItem, value: any) => {
        const newPages = [...pages];
        const pageItems = newPages[activePageIndex].items;
        const itemIndex = pageItems.findIndex(i => i.id === id);
        if (itemIndex > -1) {
            pageItems[itemIndex] = { ...pageItems[itemIndex], [field]: value };
            setPages(newPages);
        }
    };

    const deleteItem = (id: string) => {
        const newPages = [...pages];
        newPages[activePageIndex].items = newPages[activePageIndex].items.filter(i => i.id !== id);
        setPages(newPages);
        setSelectedItemId(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return alert("Max size 5MB");
            if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) return alert("Cloudinary Config Missing");

            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
                if (!response.ok) throw new Error("Upload failed");
                const data = await response.json();
                updateItem(itemId, 'content', data.secure_url);
            } catch (error: any) { alert(`Upload failed: ${error.message}`); } 
            finally { setIsUploading(false); }
        }
    };

    const handlePublish = async () => {
        setIsSaving(true);
        if (!auth) await signInAnonymously(auth);
        try {
            const payload = { title, themeId, pages, createdAt: new Date().toISOString(), type: "scrapbook-diy-v4" };
            const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'scrap-book'), payload);
            
            await saveUserCard({
                title: title || "DIY Scrapbook",
                template: "scrapbook",
                bg: themeId === 'mint' ? '#d1fae5' : themeId === 'blush' ? '#fce7f3' : themeId === 'blue' ? '#e0f2fe' : themeId === 'dark' ? '#333333' : '#d4c5a9',
                status: "saved",
            });

            setGeneratedLink(`${window.location.origin}/scrapbook/${docRef.id}`);
        } catch (error) { 
            alert("Failed to save."); 
        } finally { 
            setIsSaving(false); 
        }
    };

    return (
        <div className="h-screen w-full flex flex-col md:flex-row bg-[#EAE6DC] overflow-hidden text-stone-800 font-sans">
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Indie+Flower&family=Playfair+Display:wght@700&family=Boldonse&display=swap');
                .font-handwriting { font-family: 'Patrick Hand', cursive; }
                .font-serif { font-family: 'Playfair Display', serif; }
                .font-boldonse-chrome { font-family: 'Boldonse', sans-serif; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-0 { transform: rotateY(0deg); }
                .rotate-y-180 { transform: rotateY(180deg); }
                .rotate-y-\[-180deg\] { transform: rotateY(-180deg); }
                .perspective-\[2000px\] { perspective: 2000px; }
            `}} />

            {/* --- LEFT PANEL --- */}
            <div className="w-full md:w-[420px] h-full bg-white border-r-2 border-[#1C1917] flex flex-col shadow-xl z-20 relative">
                <div className="p-5 border-b-2 border-[#1C1917] z-10 bg-white">
                    <a href="/templates" className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-800 uppercase tracking-widest mb-3 transition-colors">
                        <ArrowLeft size={14} /> Back to Templates
                    </a>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F6C445] rounded-xl flex items-center justify-center border-2 border-[#1C1917] shadow-[3px_3px_0_0_#1C1917] text-[#1C1917]">
                            <Book size={20} />
                        </div>
                        <h1 className="text-xl text-stone-800 font-boldonse-chrome font-black">DIY Scrapbook</h1>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                    {/* BOOK SETTINGS */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#FDFBF3] border-2 border-stone-200 rounded-lg p-2 font-handwriting text-xl text-stone-800 focus:outline-none focus:border-[#1C1917] focus:ring-4 focus:ring-[#F6C445]/30 transition-all" />
                        </div>
                        <div className="space-y-2">
                             <div className="flex items-center gap-2 text-stone-500">
                                <Palette size={14} />
                                <label className="text-xs font-bold uppercase tracking-widest">Cover Theme</label>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {SCRAPBOOK_THEMES.map((t) => (
                                    <button key={t.id} onClick={() => setThemeId(t.id)} title={t.name} className={`w-full aspect-square rounded-md border-2 relative overflow-hidden transition-all ${themeId === t.id ? 'ring-2 ring-offset-2 ring-[#F6C445] border-[#1C1917] scale-105' : 'border-stone-200 hover:border-[#1C1917]'}`} style={{ background: t.bg }}>
                                        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: t.pattern, backgroundSize: t.bgSize || 'auto' }}></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <hr className="border-stone-100" />

                    {/* PHOTO COUNT SELECTOR */}
                    <div>
                        <div className="flex items-center gap-2 text-stone-600 mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest">Page Layout</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map((count) => (
                                <button 
                                    key={count} 
                                    onClick={() => changePhotoCount(count as 1|2|3)}
                                    className={`p-2 border-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition-all ${activePage.photoCount === count ? 'bg-[#1C1917] text-[#F6C445] border-[#1C1917] shadow-[2px_2px_0_0_#F6C445]' : 'bg-white text-stone-500 border-stone-200 hover:border-[#1C1917]'}`}
                                >
                                    {count === 1 && <Square size={16} />}
                                    {count === 2 && <Columns size={16} />}
                                    {count === 3 && <Grid3X3 size={16} />}
                                    {count} Photo{count > 1 ? 's' : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CONTENT LIST */}
                    <div className="bg-[#FDFBF3] p-4 rounded-xl border-2 border-stone-200 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-stone-600 uppercase tracking-wide">Items on Page</span>
                            <button onClick={addNote} className="text-[10px] bg-white border-2 border-[#1C1917] px-2.5 py-1 rounded-md text-stone-700 hover:bg-[#F6C445]/20 font-bold transition-colors">+ Add Note</button>
                        </div>
                        
                        <div className="space-y-2 max-h-44 overflow-y-auto">
                            {activePage.items.map((item, idx) => (
                                <div key={item.id} onClick={() => setSelectedItemId(item.id)} className={`p-2 rounded-lg border-2 flex items-center gap-3 cursor-pointer transition-all ${selectedItemId === item.id ? 'bg-[#F6C445]/15 border-[#1C1917]' : 'bg-white border-stone-200 hover:border-[#1C1917]'}`}>
                                    <div className="w-8 h-8 bg-stone-200 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {item.type === 'image' ? (
                                            item.content ? <img src={item.content} className="w-full h-full object-cover" alt=""/> : <ImageIcon size={14} className="text-stone-400" />
                                        ) : <Type size={14} className="text-stone-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-stone-700 truncate">{item.type === 'image' ? `Photo #${idx+1}` : (item.content || 'Empty Note')}</p>
                                        <p className="text-[10px] text-stone-400">Click to adjust position</p>
                                    </div>
                                    {item.type === 'image' && (
                                        <label className="p-1.5 bg-white border-2 border-stone-200 rounded-md hover:border-[#1C1917] cursor-pointer text-stone-600 transition-colors">
                                            {isUploading ? <Loader2 className="animate-spin" size={12}/> : <Upload size={12} />}
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, item.id)} disabled={isUploading} />
                                        </label>
                                    )}
                                    {item.type === 'text' && (
                                        <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="text-stone-400 hover:text-red-500"><Trash2 size={12}/></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SELECTED ITEM CONTROLS */}
                    {selectedItem && (
                        <div className="bg-white p-4 rounded-xl border-2 border-[#1C1917] shadow-[3px_3px_0_0_#1C1917] animate-in slide-in-from-top-2 space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b-2 border-stone-100">
                                <span className="text-xs font-bold text-[#1C1917] uppercase bg-[#F6C445] px-2 py-0.5 rounded-full border border-[#1C1917]">Adjusting {selectedItem.type}</span>
                                <button onClick={() => setSelectedItemId(null)} className="text-stone-400 hover:text-stone-600"><X size={14}/></button>
                            </div>
                            
                            {selectedItem.type === 'text' && (
                                <div className="space-y-1">
                                    <textarea 
                                        value={selectedItem.content}
                                        maxLength={100} 
                                        onChange={(e) => updateItem(selectedItem.id, 'content', e.target.value)}
                                        className="w-full bg-[#FDFBF3] border-2 border-stone-200 rounded p-2 text-sm font-handwriting focus:outline-none focus:border-[#1C1917] focus:ring-4 focus:ring-[#F6C445]/30 transition-all"
                                        rows={2}
                                        placeholder="Write your note here..."
                                    />
                                    <div className="text-[10px] text-right text-stone-400">{selectedItem.content.length}/100 chars</div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400">Move X</label>
                                    <input type="range" min="0" max="100" value={selectedItem.x} onChange={(e) => updateItem(selectedItem.id, 'x', Number(e.target.value))} className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#1C1917]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400">Move Y</label>
                                    <input type="range" min="0" max="100" value={selectedItem.y} onChange={(e) => updateItem(selectedItem.id, 'y', Number(e.target.value))} className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#1C1917]" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400">Rotation</label>
                                    <input type="range" min="-45" max="45" value={selectedItem.rotation} onChange={(e) => updateItem(selectedItem.id, 'rotation', Number(e.target.value))} className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#1C1917]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STICKER */}
                    <div>
                         <div className="flex justify-between items-center mb-1">
                             <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Sticker</label>
                             <button onClick={() => {
                                 const newPages = [...pages]; newPages[activePageIndex].sticker = null; setPages(newPages);
                             }} className="text-[10px] text-stone-400 hover:text-stone-600 font-bold uppercase">Clear</button>
                         </div>
                         <div className="flex gap-2 overflow-x-auto pb-1">
                             {['🎟️', '✈️', '💖', '✨', '🔥', '🌸'].map(emoji => (
                                 <button key={emoji} onClick={() => {
                                     const newPages = [...pages]; newPages[activePageIndex].sticker = emoji; setPages(newPages);
                                 }} className="flex-shrink-0 w-9 h-9 rounded-lg border-2 border-stone-200 hover:border-[#1C1917] flex items-center justify-center text-lg bg-white transition-colors shadow-sm">
                                     {emoji}
                                 </button>
                             ))}
                         </div>
                    </div>

                    <hr className="border-stone-100" />

                    {/* PAGE NAVIGATION */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pages ({pages.length}/8)</label>
                            <div className="flex gap-2">
                                {pages.length > 1 && <button onClick={() => removePage(activePageIndex)} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 font-bold"><Trash2 size={12}/> Delete</button>}
                                <button onClick={addPage} className="text-xs font-bold text-stone-700 hover:text-black flex items-center gap-1"><Plus size={12} /> Add Page</button>
                            </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {pages.map((_, i) => (
                                <button key={i} onClick={() => { setActivePageIndex(i); setSelectedItemId(null); }} className={`w-9 h-11 rounded-lg flex items-center justify-center text-xs font-bold border-2 transition-all ${activePageIndex === i ? 'bg-[#1C1917] text-[#F6C445] border-[#1C1917] scale-105 shadow-[2px_2px_0_0_#F6C445]' : 'bg-[#FDFBF3] text-stone-500 border-stone-200 hover:border-[#1C1917]'}`}>{i + 1}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 bg-white border-t-2 border-[#1C1917]">
                    {!generatedLink ? (
                        <button onClick={handlePublish} disabled={isSaving} className="w-full py-3.5 bg-[#1C1917] text-[#FDFBF3] rounded-xl font-bold text-sm border-2 border-[#1C1917] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#F6C445] active:translate-y-0 active:shadow-none transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2">
                            {isSaving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
                            {isSaving ? "Saving Scrapbook..." : "Finish Scrapbook"}
                        </button>
                    ) : (
                        <div className="bg-[#FDFBF3] border-2 border-[#1C1917] rounded-xl p-3 text-center space-y-2">
                            <div className="flex gap-2">
                                <input readOnly value={generatedLink} className="flex-1 bg-white border-2 border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-600 select-all font-mono" />
                                <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="p-2 bg-white border-2 border-[#1C1917] rounded-lg hover:bg-stone-50"><LinkIcon size={14} /></button>
                            </div>
                            <a href={generatedLink} target="_blank" className="inline-block text-xs font-bold text-[#1C1917] underline hover:text-amber-600">Open Generated Link ↗</a>
                        </div>
                    )}
                </div>
            </div>

            {/* --- RIGHT PANEL: PREVIEW --- */}
            <div className="flex-1 bg-[#EAE6DC] relative flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                <div className="relative z-10 transform transition-transform hover:scale-[1.02] duration-500">
                     <Flipbook pages={pages} coverTitle={title} themeId={themeId} /> 
                </div>
                
                <div className="absolute bottom-6 bg-white/90 backdrop-blur px-5 py-2.5 rounded-full text-xs font-bold text-[#1C1917] border-2 border-[#1C1917] shadow-md flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500" /> Click pages to flip and view your handmade scrapbook
                </div>
            </div>
        </div>
    );
}