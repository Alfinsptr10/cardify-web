"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { uploadToCloudinary } from "@/app/lib/cloudinary";
import { 
  ArrowLeft, Save, Music, Image as ImageIcon, MessageSquare, 
  Play, Pause, Plus, Trash2, Link as LinkIcon, Check,
  Heart, Cake, ChevronLeft, ChevronRight, X, SkipBack, SkipForward, Gamepad2,
  ArrowUp, ArrowDown, ArrowRight as IconArrowRight, ArrowLeft as IconArrowLeft, Disc, Upload, Palette, Loader2, Sparkles
} from "lucide-react";

type Song = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
};


// --- FIREBASE IMPORTS ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


// --- FIREBASE CONFIG ---
const manualConfig = {
  apiKey: "AIzaSyDdm9H9HcpHEcxLaqsmNqcJ41aOExkU2hk",              
  authDomain: "web-story-51112.firebaseapp.com",         
  projectId: "web-story-51112",       
  storageBucket: "web-story-51112.appspot.com",
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
let storage: any = null;

if (firebaseConfig && firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (e) {
    console.error("Firebase Init Error:", e);
  }
}

// --- DATA & CONFIG ---
const SONGS_LIBRARY: Song[] = [
  {
    id: "default-happy",
    title: "Happy Birthday",
    artist: "Traditional",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "/cat.jpg",
  },
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
  const [activePopup, setActivePopup] = useState<'none' | 'message' | 'music' | 'gallery' | 'game'>('none');
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0); 
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [snakeScore, setSnakeScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeRef = useRef<Array<{x: number, y: number}>>([{x: 5, y: 5}]);
  const foodRef = useRef<{x: number, y: number}>({x: 10, y: 10});
  const directionRef = useRef<string>("RIGHT");
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentSong = songs.find(s => s.id === data.music) || songs[0];
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

  // --- GAME LOGIC ---
  const startGame = () => {
    setSnakeScore(0);
    setIsGameOver(false);
    snakeRef.current = [{x: 5, y: 5}];
    directionRef.current = "RIGHT";
    placeFood();
    
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    gameIntervalRef.current = setInterval(gameLoop, 150); // Kecepatan game
  };

const placeFood = () => {
  if (!canvasRef.current) return;

  const gridSize = 10;
  const cols = canvasRef.current.width / gridSize;
  const rows = canvasRef.current.height / gridSize;

  let newFood: { x: any; y: any; };
  do {
    newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } while (snakeRef.current.some(p => p.x === newFood.x && p.y === newFood.y));

  foodRef.current = newFood;
};


  const gameLoop = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Game Constants
    const gridSize = 10; // Ukuran kotak
    const cols = canvasRef.current.width / gridSize;
    const rows = canvasRef.current.height / gridSize;

    // Logic: Move Head
    let head = { ...snakeRef.current[0] };
    if (directionRef.current === "UP") head.y -= 1;
    if (directionRef.current === "DOWN") head.y += 1;
    if (directionRef.current === "LEFT") head.x -= 1;
    if (directionRef.current === "RIGHT") head.x += 1;

    // Logic: Collision (Wall or Self)
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snakeRef.current.some(s => s.x === head.x && s.y === head.y)) {
        setIsGameOver(true);
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
        return;
    }

    // Logic: Eat Food
    let newSnake = [head, ...snakeRef.current];
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setSnakeScore(s => s + 10);
        placeFood();
    } else {
        newSnake.pop();
    }
    snakeRef.current = newSnake;

    // Render
    ctx.fillStyle = "#0f380f"; // Background color (Dark Green LCD)
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw Food
    ctx.fillStyle = "#8bac0f"; // Food color (Light Green)
    ctx.fillRect(foodRef.current.x * gridSize, foodRef.current.y * gridSize, gridSize - 1, gridSize - 1);

    // Draw Snake
    ctx.fillStyle = "#9bbc0f"; // Snake color (Lighter Green)
    newSnake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
    });
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
         // Intro only Start works
         return; 
     } else if (screenView === 'menu' && activePopup === 'none') {
         // Select menu
         if (selectedMenuIndex === 0) setActivePopup('message');
         else if (selectedMenuIndex === 1) setActivePopup('music');
         else if (selectedMenuIndex === 2) setActivePopup('gallery');
         else if (selectedMenuIndex === 3) {
             setActivePopup('game');
             // Perlu delay sedikit agar canvas di-render dulu oleh React
             setTimeout(startGame, 100); 
         }
     } else if (activePopup === 'music') {
         setIsPlaying(!isPlaying);
     } else if (activePopup === 'game' && isGameOver) {
         startGame(); // Restart game
     }
  };

  const handleDpad = (dir: string) => {
      // D-Pad tidak boleh berfungsi di intro
      if (screenView === 'intro') return;

      if (screenView === 'menu' && activePopup === 'none') {
          if (dir === 'UP') setSelectedMenuIndex(prev => (prev > 0 ? prev - 1 : 3));
          else if (dir === 'DOWN') setSelectedMenuIndex(prev => (prev < 3 ? prev + 1 : 0));
      }
      if (activePopup === 'gallery') {
          if (dir === 'LEFT') prevPhoto();
          if (dir === 'RIGHT') nextPhoto();
      }
      if (activePopup === 'game' && !isGameOver) {
          if (dir === "UP" && directionRef.current !== "DOWN") directionRef.current = "UP";
          if (dir === "DOWN" && directionRef.current !== "UP") directionRef.current = "DOWN";
          if (dir === "LEFT" && directionRef.current !== "RIGHT") directionRef.current = "LEFT";
          if (dir === "RIGHT" && directionRef.current !== "LEFT") directionRef.current = "RIGHT";
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
                                                <div className={`text-[8px] p-1.5 text-left flex items-center gap-2 transition-colors pixel-font ${selectedMenuIndex === 3 ? 'bg-[#8bac0f] text-[#0f380f]' : 'bg-[#306230] text-[#9bbc0f]'}`}>
                            {selectedMenuIndex === 3 && <span className="animate-pulse">▶</span>} <Gamepad2 size={10} /> 4. GAMES
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
                        {/* 6. GAME POPUP (NEW) */}
            {activePopup === 'game' && (
                <div className="absolute inset-0 bg-[#0f380f] z-20 flex flex-col items-center justify-center p-1">
                    <div className="text-[#9bbc0f] text-[10px] mb-2 font-pixel">SNAKE GAME</div>
                    <canvas ref={canvasRef} width={200} height={150} className="border-2 border-[#306230] bg-[#8bac0f]"></canvas>
                    <div className="flex justify-between w-full px-4 mt-2 text-[8px] font-pixel text-[#9bbc0f]">
                       <span>SCORE: {snakeScore}</span>
                       <span className="text-[#306230]">{isGameOver ? "GAME OVER" : "PLAYING"}</span>
                    </div>
                    {isGameOver && <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-pixel text-[10px] animate-pulse">PRESS A TO RESTART</div>}
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
  const [isUploading, setIsUploading] = useState(false);
  const [storyData, setStoryData] = useState({
     title: "HAPPY BIRTHDAY",
     subtitle: "PRESS START BUTTON",
     message: "Happy birthday! May you have a long and healthy life. Wishing you all the best on your special day!",
     sender: "Your friend",
     music: "default-happy",
     musicCover: null as string | null,
     gallery: [
       "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400"
     ],
     color: 'white'
  });

  // --- STATE BARU UNTUK UPLOAD MUSIK & COVER SEKALIGUS ---
  const [tempAudioFile, setTempAudioFile] = useState<File | null>(null);
  const [tempCoverFile, setTempCoverFile] = useState<File | null>(null);
  const [tempSongTitle, setTempSongTitle] = useState("");

  const handleChange = (field: string, value: any) => setStoryData(prev => ({ ...prev, [field]: value }));

  // --- FUNGSI BARU: HANDLE UPLOAD SEKALIGUS ---
  const handleCombinedUpload = async () => {
    if (!tempAudioFile) {
      alert("Mohon pilih file lagu terlebih dahulu.");
      return;
    }

    // Validasi Ukuran
    if (tempAudioFile.size > 10 * 1024 * 1024) return alert("Ukuran lagu max 10MB");
    if (tempCoverFile && tempCoverFile.size > 5 * 1024 * 1024) return alert("Ukuran cover max 5MB");

    setIsUploading(true);

    try {
      // 1. Upload Audio
      const audioUrl = await uploadToCloudinary(tempAudioFile, "music");
      
      // 2. Upload Cover (jika ada, jika tidak pakai default)
      let coverUrl = storyData.musicCover || "/cat.jpg"; // Default fallback
      if (tempCoverFile) {
        coverUrl = await uploadToCloudinary(tempCoverFile, "covers");
      }

      // 3. Buat Object Lagu Baru
      const newSong: Song = {
        id: crypto.randomUUID(),
        title: tempSongTitle || tempAudioFile.name.replace(/\.[^/.]+$/, "").substring(0, 20), // Pakai nama file jika judul kosong
        artist: "Custom Upload",
        src: audioUrl,
        cover: coverUrl
      };

      // 4. Update State
      setSongs(prev => [newSong, ...prev]); // Masukkan ke list
      
      // 5. Langsung Pilih Lagu & Cover Tersebut
      setStoryData(prev => ({
        ...prev,
        music: newSong.id,
        musicCover: coverUrl 
      }));

      // 6. Reset Form
      setTempAudioFile(null);
      setTempCoverFile(null);
      setTempSongTitle("");

    } catch (error) {
      console.error("Upload Error:", error);
      alert("Gagal mengupload file. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };


  const uploadToStorage = async (file: File, folder: string): Promise<string> => {
      if (!storage) throw new Error("Storage not initialized");
      const storageRef = ref(storage, `uploads/${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
  };
  
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ---------------------------------------------
    // LOGIKA BARU: CEK LIMIT MAX 3 FOTO
    // ---------------------------------------------
    if (storyData.gallery.length >= 3) {
        alert("Maksimal hanya boleh upload 3 foto di galeri!");
        e.target.value = ""; // Reset input agar user bisa pilih file lagi nanti jika sudah menghapus
        return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Foto harus JPG atau PNG");
      e.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("Ukuran foto max 20MB");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, "gallery");

      setStoryData(prev => ({
        ...prev,
        gallery: [...prev.gallery, url]
      }));
    } catch (err) {
      console.error(err);
      alert("Gagal upload foto");
    } finally {
      setIsUploading(false);
      e.target.value = "";
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
            gallery: storyData.gallery,
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
    <div className="h-screen overflow-hidden bg-[#FAFAF9] flex flex-col md:flex-row text-[#1C1917] font-sans">
       <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          .pixel-font { font-family: 'Press Start 2P', cursive; }
          .font-pixel { font-family: 'Press Start 2P', cursive; }
          .animate-spin-slow { animation: spin 3s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          /* Custom Scrollbar for modern feel */
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 3px; }
          ::-webkit-scrollbar-thumb { background: #d4d4d4; }
      `}} />

       {/* --- LEFT PANEL: EDITOR (SCROLLABLE INDEPENDENTLY) --- */}
       <div className="w-full md:w-1/3 h-full overflow-y-auto bg-white border-r border-stone-200 shadow-xl z-20 relative">
          <div className="p-6 md:p-8 max-w-lg mx-auto min-h-full flex flex-col">
              {/* REPLACED Link with <a> */}
              <a href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-stone-400 hover:text-stone-900 uppercase tracking-widest mb-8 transition-colors group">
                 <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
              </a>
              
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <Gamepad2 size={20} />
                 </div>
                 <h1 className="text-lg font-bold pixel-font text-stone-800 leading-tight">CARTRIDGE EDITOR</h1>
              </div>
              <p className="text-stone-500 mb-8 text-xs font-medium pl-12">Craft your digital retro story.</p>

              {/* TABS (SEGMENTED CONTROL STYLE) */}
              <div className="flex p-1 bg-stone-100 rounded-xl mb-8 sticky top-0 z-10 shadow-sm backdrop-blur-sm bg-stone-100/90">
                 {['message', 'design', 'music', 'gallery'].map((tab) => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab as any)} 
                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${activeTab === tab ? 'bg-white text-amber-600 shadow-sm scale-100' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                        {tab}
                    </button>
                 ))}
              </div>

              {/* FORM CONTENT */}
              <div className="space-y-6 flex-1">
                 {activeTab === 'message' && (
                     <div className="space-y-5 animate-in slide-in-from-left-2 duration-300">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5 ml-1">Title (Max 15 chars)</label>
                            <input type="text" value={storyData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-all font-medium text-stone-700" placeholder="e.g. HAPPY BIRTHDAY" maxLength={20} />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5 ml-1">Subtitle</label>
                            <input type="text" value={storyData.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-all font-medium text-stone-700" placeholder="e.g. PRESS START" maxLength={25} />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5 ml-1">Message Body</label>
                            <textarea rows={6} value={storyData.message} onChange={(e) => handleChange('message', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-all font-medium text-stone-700 resize-none leading-relaxed" placeholder="Write your heartfelt message here..." />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5 ml-1">Sender Name</label>
                            <input type="text" value={storyData.sender} onChange={(e) => handleChange('sender', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-all font-medium text-stone-700" placeholder="e.g. Your Bestie" />
                        </div>
                     </div>
                 )}
                 {activeTab === 'design' && (
                     <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                        <div>
                            <label className="block text-[10px] font-bold text-stone-400 uppercase mb-3 ml-1">Select Console Color</label>
                            <div className="grid grid-cols-2 gap-3">
                            {GAMEBOY_COLORS.map((color) => (
                                <div key={color.id} onClick={() => handleChange('color', color.id)} className={`cursor-pointer rounded-xl p-3 flex items-center gap-3 border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${storyData.color === color.id ? 'border-amber-400 bg-amber-50/50 shadow-md ring-2 ring-amber-100' : 'border-transparent bg-stone-50 hover:bg-white hover:border-stone-200'}`}>
                                    <div className={`w-8 h-8 rounded-full shadow-inner border ${color.bg} ${color.border}`}></div>
                                    <span className={`text-xs font-bold ${storyData.color === color.id ? 'text-stone-800' : 'text-stone-500'}`}>{color.label}</span>
                                </div>
                            ))}
                            </div>
                        </div>
                     </div>
                 )}
                 {activeTab === 'music' && (
                    <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                        
                        {/* INPUT UPLOAD BARU */}
                        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10"><Music size={60} /></div>
                            <div className="flex items-center gap-2 mb-2 border-b border-stone-100 pb-3 relative z-10">
                                <div className="p-1.5 bg-amber-100 rounded-md text-amber-600"><Upload size={14} /></div>
                                <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">Upload Custom Track</span>
                            </div>

                            {/* Input Judul */}
                            <div className="relative z-10">
                                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5 ml-1">Track Title (Optional)</label>
                                <input 
                                    type="text" 
                                    value={tempSongTitle}
                                    onChange={(e) => setTempSongTitle(e.target.value)}
                                    placeholder="e.g. Our Favorite Song"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="flex gap-3 relative z-10">
                                {/* Input File Audio */}
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5 ml-1">Audio File</label>
                                    <label className={`flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${tempAudioFile ? 'bg-green-50 border-green-400' : 'bg-stone-50 border-stone-300 hover:bg-white hover:border-amber-400'}`}>
                                        <Music size={24} className={tempAudioFile ? "text-green-600" : "text-stone-400"} />
                                        <span className="text-[10px] text-center px-2 truncate w-full font-bold text-stone-500">
                                            {tempAudioFile ? tempAudioFile.name : "Select MP3"}
                                        </span>
                                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => setTempAudioFile(e.target.files?.[0] || null)} />
                                    </label>
                                </div>

                                {/* Input File Cover */}
                                <div className="w-28">
                                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5 ml-1">Cover Art</label>
                                    <label className={`flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden relative hover:scale-[1.02] active:scale-[0.98] ${tempCoverFile ? 'border-green-400' : 'bg-stone-50 border-stone-300 hover:bg-white hover:border-amber-400'}`}>
                                        {tempCoverFile ? (
                                            <img src={URL.createObjectURL(tempCoverFile)} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="preview" />
                                        ) : (
                                            <>
                                                <ImageIcon size={24} className="text-stone-400" />
                                                <span className="text-[9px] font-bold text-stone-500">Image</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setTempCoverFile(e.target.files?.[0] || null)} />
                                    </label>
                                </div>
                            </div>

                            {/* Tombol Eksekusi */}
                            <button 
                                onClick={handleCombinedUpload} 
                                disabled={isUploading || !tempAudioFile}
                                className="w-full py-3 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-black disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg relative z-10"
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={14}/> : <Plus size={14}/>}
                                {isUploading ? "Uploading..." : "Add to Library"}
                            </button>
                        </div>

                        {/* LIST LAGU */}
                        <div>
                            <label className="block text-[10px] font-bold text-stone-400 uppercase mb-3 ml-1">Your Library</label>
                            <div className="space-y-2.5">
                                {songs.map((song) => (
                                    <div 
                                        key={song.id} 
                                        onClick={() => handleChange('music', song.id)} 
                                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all group ${storyData.music === song.id ? 'bg-white border-amber-400 shadow-md ring-1 ring-amber-100' : 'bg-white border-stone-100 hover:border-stone-300 hover:shadow-sm'}`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 bg-stone-100 rounded-lg flex-shrink-0 overflow-hidden border border-stone-100 shadow-inner">
                                                <img src={song.cover} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} alt="cover" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className={`text-xs font-bold truncate ${storyData.music === song.id ? 'text-stone-800' : 'text-stone-600'}`}>{song.title}</span>
                                                <span className="text-[10px] text-stone-400 truncate font-medium">{song.artist}</span>
                                            </div>
                                        </div>
                                        {storyData.music === song.id && (
                                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-sm animate-in zoom-in duration-200">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                 )}

                 {activeTab === 'gallery' && (
                     <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                         <label className={`flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all group bg-stone-50 ${storyData.gallery.length >= 3 ? 'border-red-200 opacity-50 cursor-not-allowed' : 'border-stone-300 hover:bg-white hover:border-amber-400 hover:scale-[1.01]'}`}>
                            <div className="p-3 bg-stone-200 rounded-full text-stone-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                <Upload size={24} />
                            </div>
                            <div className="text-center">
                                <span className="text-sm font-bold text-stone-600 block group-hover:text-stone-800">
                                    {storyData.gallery.length >= 3 ? "Gallery Full (3/3)" : "Click to Upload Photo"}
                                </span>
                                <span className="text-[10px] text-stone-400 font-medium">
                                    {storyData.gallery.length >= 3 ? "Delete a photo to add more" : "JPG/PNG • Max 20MB • Limit 3"}
                                </span>
                            </div>
                            <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleGalleryUpload} disabled={storyData.gallery.length >= 3} />
                         </label>
                        
                        <div>
                            <label className="block text-[10px] font-bold text-stone-400 uppercase mb-3 ml-1">Gallery Preview ({storyData.gallery.length}/3)</label>
                            <div className="grid grid-cols-2 gap-3">
                            {storyData.gallery.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md bg-stone-100">
                                    <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button onClick={() => handleRemovePhoto(idx)} className="bg-white text-red-500 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors transform hover:scale-110"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                     </div>
                 )}
              </div>

              {/* ACTION FOOTER */}
              <div className="mt-8 pt-6 border-t border-stone-100 sticky bottom-0 bg-white/95 backdrop-blur-sm z-20 pb-2">
                  {!generatedLink ? (
                      <button onClick={handlePublish} disabled={isSaving} className="w-full py-4 bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-xl font-bold text-sm hover:from-black hover:to-black transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0">
                        {isSaving ? <><Loader2 className="animate-spin" size={16}/> Saving...</> : "Publish & Generate Link"} 
                        {!isSaving && <Sparkles size={16} className="text-amber-300" />}
                      </button>
                  ) : (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 animate-in slide-in-from-bottom duration-300 shadow-lg">
                         <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-3"><Check size={18} className="text-emerald-500" /> Story Published!</div>
                         <div className="flex gap-2 mb-3">
                            <input readOnly value={generatedLink} className="flex-1 bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs text-stone-600 font-medium select-all" />
                            <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="p-2.5 bg-white border border-emerald-200 rounded-xl text-emerald-600 hover:bg-emerald-100 transition-colors"><LinkIcon size={16} /></button>
                         </div>
                         <div className="flex gap-2">
                             <a href={generatedLink} target="_blank" className="flex-1 py-2 text-center text-xs font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">View Story</a>
                             <button onClick={() => setGeneratedLink("")} className="flex-1 py-2 text-center text-xs font-bold text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">New Story</button>
                         </div>
                      </div>
                  )}
              </div>
          </div>
       </div>

       {/* --- RIGHT PANEL: PREVIEW (SCROLLABLE INDEPENDENTLY) --- */}
       <div className="w-full md:w-2/3 h-full overflow-y-auto bg-[#e0f2fe] flex items-center justify-center p-8 relative">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] fixed" />
           <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl fixed" />
           <div className="relative z-10 flex flex-col items-center my-auto min-h-[700px] justify-center -mt-30">
               <span className="mb-6 px-4 py-1.5 bg-white/60 backdrop-blur rounded-full text-[10px] font-bold text-sky-700 uppercase tracking-widest border border-white shadow-sm ring-1 ring-white/50">Interactive Preview</span>
               <GameboyPreview data={storyData} songs={songs} />
               <p className="mt-8 text-[10px] text-stone-400 font-bold tracking-widest uppercase text-center max-w-xs bg-white/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">D-Pad: Navigate • A: Select • B: Back</p>
           </div>
       </div>
    </div>
  );
}