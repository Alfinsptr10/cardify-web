"use client";

import { useState } from "react";
import { 
  ArrowLeft, Save, Plus, Trash2, Link as LinkIcon, Check, Loader2, 
  Book, Sparkles, LayoutTemplate, Palette, Upload, Move, RotateCw, Type, Image as ImageIcon,
  Grid3X3, Square, Columns,
  X
} from "lucide-react";

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
    x: number; // Posisi X (0-100%)
    y: number; // Posisi Y (0-100%)
    rotation: number; // Derajat
    scale: number;
    tapeColor?: string;
};

type PageData = {
    id: number;
    photoCount: 1 | 2 | 3; // Menentukan mode layout
    items: ScrapItem[];
    sticker: string | null;
};

// --- SCRAPBOOK THEMES (DIY COVER STYLES) ---
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

const TAPE_COLORS = ["bg-rose-300", "bg-teal-200", "bg-amber-200", "bg-indigo-300", "bg-stone-300"];

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

// --- FLIPBOOK COMPONENT ---
const Flipbook = ({ pages, coverTitle, themeId }: { pages: PageData[], coverTitle: string, themeId: string }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = pages.length + 1;
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
                
                {/* --- SPINE (Selotip Style) --- */}
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
                    {/* Front Cover */}
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

                                {/* RENDER ITEMS */}
                                <div className="w-full h-full relative z-20 p-4">
                                    {page.items.map((item) => (
                                        <div 
                                            key={item.id}
                                            className="absolute transition-all duration-300"
                                            style={{ 
                                                left: `${item.x}%`, 
                                                top: `${item.y}%`, 
                                                transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale || 1})`,
                                                zIndex: 10
                                            }}
                                        >
                                            {item.type === 'image' ? (
                                                <div className="p-2 bg-white shadow-md border border-stone-200">
                                                    <WashiTape color={item.tapeColor} className="w-16 -top-2 left-1/2 -translate-x-1/2 -rotate-1" />
                                                    <div className="w-28 h-28 md:w-32 md:h-32 bg-stone-100 overflow-hidden relative">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={item.content} alt="memory" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50 pointer-events-none mix-blend-screen"></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-32 p-3 bg-[#fefce8] shadow-sm border border-stone-200/50 relative">
                                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-30"></div>
                                                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400 border border-red-500 shadow-sm z-20"></div>
                                                    <p className="font-handwriting text-stone-700 text-sm leading-relaxed relative z-10 break-words text-center min-h-[2rem]">
                                                        {item.content}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {page.sticker && (
                                        <div className="absolute bottom-4 right-4 text-5xl drop-shadow-md transform rotate-12 filter saturate-125 hover:scale-110 transition-transform">
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

    // --- LOGIC ---
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

    // --- LAYOUT LOGIC ---
    // Helper to generate default positions based on count
    const generateLayoutItems = (count: 1 | 2 | 3) => {
        const items: ScrapItem[] = [];
        const baseProps = { type: 'image' as const, scale: 1, content: '', tapeColor: TAPE_COLORS[0] };
        
        if (count === 1) {
            items.push({ ...baseProps, id: Date.now().toString(), x: 50, y: 50, rotation: -2 });
        } else if (count === 2) {
            items.push({ ...baseProps, id: Date.now().toString(), x: 40, y: 35, rotation: -5, tapeColor: TAPE_COLORS[1] });
            items.push({ ...baseProps, id: (Date.now()+1).toString(), x: 60, y: 65, rotation: 5, tapeColor: TAPE_COLORS[2] });
        } else if (count === 3) {
            items.push({ ...baseProps, id: Date.now().toString(), x: 30, y: 30, rotation: -6, tapeColor: TAPE_COLORS[0] });
            items.push({ ...baseProps, id: (Date.now()+1).toString(), x: 70, y: 30, rotation: 6, tapeColor: TAPE_COLORS[1] });
            items.push({ ...baseProps, id: (Date.now()+2).toString(), x: 50, y: 70, rotation: 0, tapeColor: TAPE_COLORS[3] });
        }
        return items;
    };

    const changePhotoCount = (count: 1 | 2 | 3) => {
        // Keep existing text notes, reset photos
        const existingNotes = activePage.items.filter(i => i.type === 'text');
        const newPhotos = generateLayoutItems(count);
        
        // Update page
        const newPages = [...pages];
        newPages[activePageIndex] = { 
            ...activePage, 
            photoCount: count,
            items: [...newPhotos, ...existingNotes] // Photos reset, notes kept
        };
        setPages(newPages);
        setSelectedItemId(null);
    };

    const addNote = () => {
        if (activePage.items.filter(i => i.type === 'text').length >= 2) return alert("Max 2 notes per page.");
        const newNote: ScrapItem = {
            id: Date.now().toString(),
            type: 'text',
            content: "Note...",
            x: 50, y: 50, rotation: 0, scale: 1
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
            setGeneratedLink(`${window.location.origin}/scrapbook/${docRef.id}`);
        } catch (error) { alert("Failed to save."); } finally { setIsSaving(false); }
    };

    return (
        <div className="h-screen w-full flex flex-col md:flex-row bg-stone-100 overflow-hidden text-stone-800 font-sans">
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

            {/* --- LEFT PANEL --- */}
            <div className="w-full md:w-[420px] h-full bg-white border-r border-stone-200 flex flex-col shadow-xl z-20 relative">
                <div className="p-5 border-b border-stone-100 z-10">
                    <a href="/" className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-700 uppercase tracking-widest mb-3">
                        <ArrowLeft size={12} /> Back
                    </a>
                    <h1 className="text-xl font-bold text-stone-800">DIY Scrapbook Editor</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                    {/* BOOK SETTINGS */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-handwriting text-xl text-stone-800 focus:outline-none focus:border-stone-400" />
                        </div>
                        <div className="space-y-2">
                             <div className="flex items-center gap-2 text-stone-500">
                                <Palette size={14} />
                                <label className="text-xs font-bold uppercase tracking-widest">Cover Theme</label>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {SCRAPBOOK_THEMES.map((t) => (
                                    <button key={t.id} onClick={() => setThemeId(t.id)} title={t.name} className={`w-full aspect-square rounded-md border-2 relative overflow-hidden ${themeId === t.id ? 'ring-2 ring-offset-2 ring-stone-400 border-stone-400' : 'border-stone-200'}`} style={{ background: t.bg }}>
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
                            <LayoutTemplate size={14} />
                            <span className="text-xs font-bold uppercase tracking-widest">Page Layout</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map((count) => (
                                <button 
                                    key={count} 
                                    onClick={() => changePhotoCount(count as 1|2|3)}
                                    className={`p-2 border rounded-lg text-xs font-bold flex flex-col items-center gap-1 ${activePage.photoCount === count ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}
                                >
                                    {count === 1 && <Square size={16} />}
                                    {count === 2 && <Columns size={16} />}
                                    {count === 3 && <Grid3X3 size={16} />}
                                    {count} Photo{count > 1 ? 's' : ''}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1 italic">*Changing count resets photo positions</p>
                    </div>

                    {/* CONTENT LIST */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-stone-600 uppercase">Items on Page</span>
                            <button onClick={addNote} className="text-[10px] bg-white border border-stone-300 px-2 py-1 rounded text-stone-600 hover:bg-stone-100 font-bold">+ Add Note</button>
                        </div>
                        
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {activePage.items.map((item, idx) => (
                                <div key={item.id} onClick={() => setSelectedItemId(item.id)} className={`p-2 rounded border flex items-center gap-3 cursor-pointer ${selectedItemId === item.id ? 'bg-white border-stone-400 shadow-sm' : 'bg-stone-100 border-transparent hover:bg-white'}`}>
                                    <div className="w-8 h-8 bg-stone-200 rounded flex items-center justify-center flex-shrink-0">
                                        {item.type === 'image' ? (
                                            item.content ? <img src={item.content} className="w-full h-full object-cover rounded" alt=""/> : <ImageIcon size={14} className="text-stone-400" />
                                        ) : <Type size={14} className="text-stone-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-stone-700 truncate">{item.type === 'image' ? `Photo #${idx+1}` : (item.content || 'Empty Note')}</p>
                                        <p className="text-[10px] text-stone-400">Click to edit pos</p>
                                    </div>
                                    {item.type === 'image' && (
                                        <label className="p-1.5 bg-stone-200 rounded hover:bg-stone-300 cursor-pointer text-stone-600">
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
                        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm animate-in slide-in-from-top-2 space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                                <span className="text-xs font-bold text-indigo-600 uppercase">Adjusting {selectedItem.type}</span>
                                <button onClick={() => setSelectedItemId(null)} className="text-stone-400 hover:text-stone-600"><X size={14}/></button>
                            </div>
                            
                            {selectedItem.type === 'text' && (
                                <div className="space-y-1">
                                    <textarea 
                                        value={selectedItem.content}
                                        maxLength={100} // LIMITER
                                        onChange={(e) => updateItem(selectedItem.id, 'content', e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-sm font-handwriting focus:outline-none focus:border-stone-400"
                                        rows={2}
                                        placeholder="Write your note here..."
                                    />
                                    <div className="text-[10px] text-right text-stone-400">{selectedItem.content.length}/100 chars</div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400">Move X</label>
                                    <input type="range" min="0" max="100" value={selectedItem.x} onChange={(e) => updateItem(selectedItem.id, 'x', Number(e.target.value))} className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400">Move Y</label>
                                    <input type="range" min="0" max="100" value={selectedItem.y} onChange={(e) => updateItem(selectedItem.id, 'y', Number(e.target.value))} className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400">Rotation</label>
                                    <input type="range" min="-45" max="45" value={selectedItem.rotation} onChange={(e) => updateItem(selectedItem.id, 'rotation', Number(e.target.value))} className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STICKER */}
                    <div>
                         <div className="flex justify-between items-center mb-1">
                             <label className="text-[10px] font-bold text-stone-400 uppercase">Sticker</label>
                             <button onClick={() => {
                                 const newPages = [...pages]; newPages[activePageIndex].sticker = null; setPages(newPages);
                             }} className="text-[10px] text-stone-400 hover:text-stone-600">Clear</button>
                         </div>
                         <div className="flex gap-1 overflow-x-auto pb-1">
                             {['🎟️', '✈️', '💖', '✨', '🔥', '🌸'].map(emoji => (
                                 <button key={emoji} onClick={() => {
                                     const newPages = [...pages]; newPages[activePageIndex].sticker = emoji; setPages(newPages);
                                 }} className="flex-shrink-0 w-8 h-8 rounded border border-stone-200 flex items-center justify-center text-lg bg-white hover:bg-stone-50">
                                     {emoji}
                                 </button>
                             ))}
                         </div>
                    </div>

                    <hr className="border-stone-100" />

                    {/* PAGE NAVIGATION */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-stone-500 uppercase">Pages</label>
                            <div className="flex gap-2">
                                {pages.length > 1 && <button onClick={() => removePage(activePageIndex)} className="text-xs text-red-400 hover:text-red-600"><Trash2 size={12}/></button>}
                                <button onClick={addPage} className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1"><Plus size={12} /> Add</button>
                            </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {pages.map((_, i) => (
                                <button key={i} onClick={() => { setActivePageIndex(i); setSelectedItemId(null); }} className={`w-8 h-10 rounded flex items-center justify-center text-xs font-bold border transition-all ${activePageIndex === i ? 'bg-stone-800 text-white border-stone-800 scale-105' : 'bg-stone-50 text-stone-400 border-stone-200'}`}>{i + 1}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 bg-white border-t border-stone-200">
                    {!generatedLink ? (
                        <button onClick={handlePublish} disabled={isSaving} className="w-full py-3 bg-stone-800 text-white rounded-lg font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2">
                            {isSaving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
                            {isSaving ? "Saving..." : "Finish Scrapbook"}
                        </button>
                    ) : (
                        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-center">
                            <div className="flex gap-2 mb-2">
                                <input readOnly value={generatedLink} className="flex-1 bg-white border border-stone-300 rounded px-2 py-1 text-xs text-stone-600" />
                                <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="p-1 bg-white border border-stone-300 rounded"><LinkIcon size={14} /></button>
                            </div>
                            <a href={generatedLink} target="_blank" className="text-xs font-bold text-stone-600 underline">Open Link</a>
                        </div>
                    )}
                </div>
            </div>

            {/* --- RIGHT PANEL: PREVIEW --- */}
            <div className="flex-1 bg-[#e5e5e5] relative flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                <div className="relative z-10 transform transition-transform hover:scale-[1.02] duration-500 drop-shadow-2xl">
                     <Flipbook pages={pages} coverTitle={title} themeId={themeId} /> 
                </div>
                
                <div className="absolute bottom-8 bg-white/80 px-4 py-2 rounded-full text-xs font-bold text-stone-500 shadow-sm backdrop-blur">
                    Preview Mode (Use sliders to adjust positions)
                </div>
            </div>
        </div>
    );
}