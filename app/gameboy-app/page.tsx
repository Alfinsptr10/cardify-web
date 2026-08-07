"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { uploadToCloudinary } from "@/app/lib/cloudinary";
import { saveUserCard } from "@/app/lib/saveCardAction";
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

// --- DOZO STYLE TOKENS ---
const INK = "#111111";
const CREAM = "#FFFDF5";
const MINT = "#BFE7DA";
const SKY = "#BBD9F5";
const YELLOW = "#F7D046";
const CORAL = "#F58A7B";
const LILAC = "#D8C6F0";

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
    <div
      className={`relative ${activeColor.bg} rounded-[2rem] w-[340px] h-[600px] p-5 flex flex-col border-[3px] transform scale-90 sm:scale-100 origin-top select-none sticky top-10 transition-colors duration-300`}
      style={{ borderColor: INK, boxShadow: `10px 10px 0px 0px ${INK}` }}
    >
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]"></div>
              <span className={`text-[6px] font-bold ${activeColor.text} mt-0.5 font-sans`}>BATTERY</span>
        </div>
        <div className={`font-serif font-bold text-xs ${activeColor.text} italic opacity-80`}>CARDIFY</div>
      </div>
      
      {/* Screen */}
      <div className="bg-[#788a82] p-2.5 rounded-md border-[2.5px] relative mb-4" style={{ borderColor: INK }}>
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
               <div className="relative w-full h-full" style={{ filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.45))" }}>
                   {/* Vertical arm */}
                   <div
                     className="absolute top-0 left-1/3 w-1/3 h-full rounded-[3px]"
                     style={{
                       background: "linear-gradient(155deg, #4a4a4a 0%, #2c2c2c 45%, #1a1a1a 100%)",
                       boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -3px 4px rgba(0,0,0,0.55)",
                     }}
                   />
                   {/* Horizontal arm */}
                   <div
                     className="absolute top-1/3 left-0 w-full h-1/3 rounded-[3px]"
                     style={{
                       background: "linear-gradient(155deg, #4a4a4a 0%, #2c2c2c 45%, #1a1a1a 100%)",
                       boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -3px 4px rgba(0,0,0,0.55)",
                     }}
                   />
                   {/* Center pivot dome */}
                   <div
                     className="absolute top-1/3 left-1/3 w-1/3 h-1/3 rounded-full"
                     style={{
                       background: "radial-gradient(circle at 35% 30%, #565656 0%, #232323 65%, #141414 100%)",
                       boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -2px 3px rgba(0,0,0,0.6)",
                     }}
                   />

                   {/* Panah dekoratif tiap arah — murni visual, pointer-events-none */}
                   <ArrowUp size={11} strokeWidth={3} className="absolute top-[8%] left-1/2 -translate-x-1/2 text-white/40 pointer-events-none" />
                   <ArrowDown size={11} strokeWidth={3} className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-white/40 pointer-events-none" />
                   <IconArrowLeft size={11} strokeWidth={3} className="absolute left-[8%] top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                   <IconArrowRight size={11} strokeWidth={3} className="absolute right-[8%] top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />

                   {/* Highlight tipis di tepi atas tiap arm biar kesan plastik mengkilap */}
                   <div className="absolute top-0 left-1/3 w-1/3 h-[3px] bg-white/20 rounded-full pointer-events-none" />
                   <div className="absolute top-1/3 left-0 w-[3px] h-1/3 bg-white/20 rounded-full pointer-events-none" />

                   {/* 4 tombol klik — geometri & onClick sama persis, cuma tambah efek tekan 3D */}
                   <button onClick={() => handleDpad('UP')} className="absolute top-0 left-1/3 w-1/3 h-1/3 z-10 active:bg-black/30 active:scale-95 transition-transform rounded-t-sm" />
                   <button onClick={() => handleDpad('DOWN')} className="absolute bottom-0 left-1/3 w-1/3 h-1/3 z-10 active:bg-black/30 active:scale-95 transition-transform rounded-b-sm" />
                   <button onClick={() => handleDpad('LEFT')} className="absolute top-1/3 left-0 w-1/3 h-1/3 z-10 active:bg-black/30 active:scale-95 transition-transform rounded-l-sm" />
                   <button onClick={() => handleDpad('RIGHT')} className="absolute top-1/3 right-0 w-1/3 h-1/3 z-10 active:bg-black/30 active:scale-95 transition-transform rounded-r-sm" />
               </div>
          </div>
          <div className="absolute top-6 right-1 flex gap-5 transform -rotate-12">
               <div className="flex flex-col items-center gap-1 mt-6">
                   <button onClick={handleButtonB} className="w-12 h-12 rounded-full bg-[#d33c3c] border-[2.5px] border-black active:translate-y-1 transition-all text-white font-bold text-sm pixel-font flex justify-center items-center" style={{ boxShadow: `3px 3px 0 ${INK}` }}>B</button>
               </div>
               <div className="flex flex-col items-center gap-1">
                   <button onClick={handleButtonA} className="w-12 h-12 rounded-full bg-[#d33c3c] border-[2.5px] border-black active:translate-y-1 transition-all text-white font-bold text-sm pixel-font flex justify-center items-center" style={{ boxShadow: `3px 3px 0 ${INK}` }}>A</button>
               </div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4">
               <div className="flex flex-col items-center">
                   <button onClick={handleStart} className="w-16 h-4 bg-[#999] rounded-full transform rotate-[-25deg] border-2 border-black active:scale-95"></button>
                   <span className={`text-[9px] font-bold ${activeColor.text} mt-1 uppercase tracking-wider font-sans opacity-70 transform rotate-[-27deg] translate-x-2`}>Select</span>
               </div>
               <div className="flex flex-col items-center">
                   <button onClick={handleStart} className="w-16 h-4 bg-[#999] rounded-full transform rotate-[-25deg] border-2 border-black active:scale-95"></button>
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
  const [copied, setCopied] = useState(false); // fungsi tambahan: feedback copy link
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
        
        // --- SIMPAN OTOMATIS KE DASHBOARD AKUN ---
        await saveUserCard({
            title: storyData.title || "Retro Gameboy Story",
            template: "gameboy", // Sesuai identifier template gameboy
            bg: storyData.color === 'purple' ? '#a855f7' : storyData.color === 'teal' ? '#2dd4bf' : storyData.color === 'yellow' ? '#facc15' : storyData.color === 'pink' ? '#fb7185' : '#ffffff',
            status: "saved",
        });
        // ----------------------------------------

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

  // fungsi tambahan (tidak mengubah yang lama)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TAB_COLORS: Record<string, string> = {
    message: CORAL,
    design: LILAC,
    music: YELLOW,
    gallery: MINT,
  };

  const inputClass =
    "w-full rounded-2xl px-4 py-3 text-sm outline-none font-bold transition-all placeholder:font-medium placeholder:text-black/30 focus:-translate-y-0.5";
  const inputStyle = { background: CREAM, border: `2.5px solid ${INK}`, color: INK, boxShadow: `3px 3px 0 ${INK}` } as const;
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.18em] mb-2 ml-1";

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row font-sans" style={{ background: CREAM, color: INK }}>
       <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Boldonse&family=Archivo+Black&family=DM+Sans:opsz,wght@9..40,400;500;700;900&display=swap');
          .pixel-font { font-family: 'Press Start 2P', cursive; }
          .font-pixel { font-family: 'Press Start 2P', cursive; }
          .dozo-display { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
          .animate-spin-slow { animation: spin 3s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes dozo-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .dozo-marquee { animation: dozo-marquee 22s linear infinite; }
          @keyframes dozo-float { 0%,100% { transform: translateY(0) rotate(-4deg);} 50% { transform: translateY(-12px) rotate(4deg);} }
          .dozo-float { animation: dozo-float 6s ease-in-out infinite; }
          /* Custom Scrollbar */
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #111111; border-radius: 99px; }
      `}} />

       {/* --- LEFT PANEL: EDITOR (SCROLLABLE INDEPENDENTLY) --- */}
       <div className="w-full md:w-1/3 h-full overflow-y-auto z-20 relative" style={{ background: CREAM, borderRight: `3px solid ${INK}` }}>

          <div className="p-6 md:p-8 max-w-lg mx-auto min-h-full flex flex-col">
              {/* REPLACED Link with <a> */}
              <a
                href="/"
                className="inline-flex items-center gap-2 self-start text-[10px] font-black uppercase tracking-[0.2em] mb-8 px-4 py-2 rounded-full transition-all group hover:-translate-y-0.5"
                style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}` }}
              >
                 <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
              </a>
              
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2.5 rounded-2xl" style={{ background: YELLOW, border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}>
                    <Gamepad2 size={20} />
                 </div>
                 <h1 className="dozo-display text-xl font-black leading-tight uppercase">Cartridge Editor</h1>
              </div>
              <p className="mb-8 text-xs font-bold pl-14 opacity-60">Craft your digital retro story. ✿</p>

              {/* TABS (SEGMENTED CONTROL STYLE) */}
              <div
                className="flex gap-1 p-1.5 rounded-2xl mb-8 sticky top-9 z-20"
                style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `5px 5px 0 ${INK}` }}
              >
                 {['message', 'design', 'music', 'gallery'].map((tab) => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab as any)} 
                        className="flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200"
                        style={
                          activeTab === tab
                            ? { background: TAB_COLORS[tab], border: `2px solid ${INK}`, boxShadow: `2px 2px 0 ${INK}` }
                            : { border: "2px solid transparent", opacity: 0.5 }
                        }
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
                            <label className={labelClass}>Title (Max 15 chars)</label>
                            <input type="text" value={storyData.title} onChange={(e) => handleChange('title', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. HAPPY BIRTHDAY" maxLength={20} />
                        </div>
                        <div className="group">
                            <label className={labelClass}>Subtitle</label>
                            <input type="text" value={storyData.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. PRESS START" maxLength={25} />
                        </div>
                        <div className="group">
                            <label className={labelClass}>Message Body</label>
                            <textarea rows={6} value={storyData.message} onChange={(e) => handleChange('message', e.target.value)} className={`${inputClass} resize-none leading-relaxed`} style={inputStyle} placeholder="Write your heartfelt message here..." />
                        </div>
                        <div className="group">
                            <label className={labelClass}>Sender Name</label>
                            <input type="text" value={storyData.sender} onChange={(e) => handleChange('sender', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Your Bestie" />
                        </div>
                     </div>
                 )}
                 {activeTab === 'design' && (
                     <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                        <div>
                            <label className={labelClass}>Select Console Color</label>
                            <div className="grid grid-cols-2 gap-3">
                            {GAMEBOY_COLORS.map((color) => (
                                <div
                                  key={color.id}
                                  onClick={() => handleChange('color', color.id)}
                                  className="cursor-pointer rounded-2xl p-3 flex items-center gap-3 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                  style={{
                                    background: storyData.color === color.id ? LILAC : CREAM,
                                    border: `2.5px solid ${INK}`,
                                    boxShadow: storyData.color === color.id ? `5px 5px 0 ${INK}` : `3px 3px 0 ${INK}`,
                                  }}
                                >
                                    <div className={`w-8 h-8 rounded-full border-2 border-black ${color.bg}`}></div>
                                    <span className="text-[11px] font-black uppercase tracking-wide">{color.label}</span>
                                </div>
                            ))}
                            </div>
                        </div>
                     </div>
                 )}
                 {activeTab === 'music' && (
                    <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                        
                        {/* INPUT UPLOAD BARU */}
                        <div className="p-5 rounded-3xl space-y-4 relative overflow-hidden" style={{ background: CREAM, border: `3px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}` }}>
                            <div className="absolute -top-3 -right-3 p-6 opacity-10"><Music size={70} /></div>
                            <div className="flex items-center gap-2 mb-2 pb-3 relative z-10" style={{ borderBottom: `2px dashed ${INK}` }}>
                                <div className="p-1.5 rounded-lg" style={{ background: YELLOW, border: `2px solid ${INK}` }}><Upload size={14} /></div>
                                <span className="text-xs font-black uppercase tracking-wide">Upload Custom Track</span>
                            </div>

                            {/* Input Judul */}
                            <div className="relative z-10">
                                <label className={labelClass}>Track Title (Optional)</label>
                                <input 
                                    type="text" 
                                    value={tempSongTitle}
                                    onChange={(e) => setTempSongTitle(e.target.value)}
                                    placeholder="e.g. Our Favorite Song"
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>

                            <div className="flex gap-3 relative z-10">
                                {/* Input File Audio */}
                                <div className="flex-1">
                                    <label className={labelClass}>Audio File</label>
                                    <label
                                      className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5"
                                      style={{ background: tempAudioFile ? MINT : CREAM, border: `2.5px dashed ${INK}`, boxShadow: `4px 4px 0 ${INK}` }}
                                    >
                                        <Music size={24} />
                                        <span className="text-[10px] text-center px-2 truncate w-full font-black uppercase">
                                            {tempAudioFile ? tempAudioFile.name : "Select MP3"}
                                        </span>
                                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => setTempAudioFile(e.target.files?.[0] || null)} />
                                    </label>
                                </div>

                                {/* Input File Cover */}
                                <div className="w-28">
                                    <label className={labelClass}>Cover Art</label>
                                    <label
                                      className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-2xl cursor-pointer transition-all overflow-hidden relative hover:-translate-y-0.5"
                                      style={{ background: tempCoverFile ? MINT : CREAM, border: `2.5px dashed ${INK}`, boxShadow: `4px 4px 0 ${INK}` }}
                                    >
                                        {tempCoverFile ? (
                                            <img src={URL.createObjectURL(tempCoverFile)} className="absolute inset-0 w-full h-full object-cover" alt="preview" />
                                        ) : (
                                            <>
                                                <ImageIcon size={24} />
                                                <span className="text-[9px] font-black uppercase">Image</span>
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
                                className="w-full py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 relative z-10 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:-translate-y-0.5 enabled:active:translate-y-0"
                                style={{ background: INK, color: CREAM, border: `2.5px solid ${INK}`, boxShadow: `5px 5px 0 ${CORAL}` }}
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={14}/> : <Plus size={14}/>}
                                {isUploading ? "Uploading..." : "Add to Library"}
                            </button>
                        </div>

                        {/* LIST LAGU */}
                        <div>
                            <label className={labelClass}>Your Library</label>
                            <div className="space-y-3">
                                {songs.map((song) => (
                                    <div 
                                        key={song.id} 
                                        onClick={() => handleChange('music', song.id)} 
                                        className="p-3 rounded-2xl cursor-pointer flex items-center justify-between transition-all hover:-translate-y-0.5"
                                        style={{
                                          background: storyData.music === song.id ? YELLOW : CREAM,
                                          border: `2.5px solid ${INK}`,
                                          boxShadow: storyData.music === song.id ? `5px 5px 0 ${INK}` : `3px 3px 0 ${INK}`,
                                        }}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden" style={{ border: `2px solid ${INK}`, background: CREAM }}>
                                                <img src={song.cover} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} alt="cover" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-xs font-black truncate uppercase">{song.title}</span>
                                                <span className="text-[10px] truncate font-bold opacity-60">{song.artist}</span>
                                            </div>
                                        </div>
                                        {storyData.music === song.id && (
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center animate-in zoom-in duration-200" style={{ background: INK, color: CREAM, border: `2px solid ${INK}` }}>
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
                         <label
                           className={`flex flex-col items-center justify-center gap-3 w-full p-8 rounded-3xl cursor-pointer transition-all group ${storyData.gallery.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                           style={{ background: storyData.gallery.length >= 3 ? "#F3D6D1" : MINT, border: `3px dashed ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}
                         >
                            <div className="p-3 rounded-full" style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}>
                                <Upload size={24} />
                            </div>
                            <div className="text-center">
                                <span className="text-sm font-black uppercase block tracking-wide">
                                    {storyData.gallery.length >= 3 ? "Gallery Full (3/3)" : "Click to Upload Photo"}
                                </span>
                                <span className="text-[10px] font-bold opacity-70">
                                    {storyData.gallery.length >= 3 ? "Delete a photo to add more" : "JPG/PNG • Max 20MB • Limit 3"}
                                </span>
                            </div>
                            <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleGalleryUpload} disabled={storyData.gallery.length >= 3} />
                         </label>
                        
                        <div>
                            <label className={labelClass}>Gallery Preview ({storyData.gallery.length}/3)</label>
                            {storyData.gallery.length === 0 ? (
                              <div className="rounded-2xl p-6 text-center" style={{ background: CREAM, border: `2.5px dashed ${INK}` }}>
                                <div className="text-2xl mb-1">📷</div>
                                <p className="text-[11px] font-black uppercase tracking-wide">No photos yet</p>
                                <p className="text-[10px] font-bold opacity-60">Upload up to 3 cute moments</p>
                              </div>
                            ) : (
                            <div className="grid grid-cols-2 gap-4">
                            {storyData.gallery.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden" style={{ border: `2.5px solid ${INK}`, boxShadow: `5px 5px 0 ${INK}`, background: CREAM }}>
                                    <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-black" style={{ background: YELLOW, border: `2px solid ${INK}` }}>#{String(idx + 1).padStart(2, "0")}</div>
                                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button onClick={() => handleRemovePhoto(idx)} className="p-2 rounded-full transition-transform hover:scale-110" style={{ background: CORAL, border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                            </div>
                            )}
                        </div>
                     </div>
                 )}
              </div>

              {/* ACTION FOOTER */}
              <div className="mt-8 pt-6 sticky bottom-0 z-20 pb-3" style={{ background: CREAM, borderTop: `3px solid ${INK}` }}>
                  {!generatedLink ? (
                      <button
                        onClick={handlePublish}
                        disabled={isSaving}
                        className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed enabled:hover:-translate-y-1 enabled:active:translate-y-0"
                        style={{ background: INK, color: CREAM, border: `3px solid ${INK}`, boxShadow: `6px 6px 0 ${CORAL}` }}
                      >
                        {isSaving ? <><Loader2 className="animate-spin" size={16}/> Saving...</> : "Publish & Generate Link"} 
                        {!isSaving && <Sparkles size={16} style={{ color: YELLOW }} />}
                      </button>
                  ) : (
                      <div className="rounded-3xl p-5 animate-in slide-in-from-bottom duration-300 relative" style={{ background: MINT, border: `3px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}>
                         <div className="absolute -top-3 -right-2 px-3 py-1 rounded-full text-[9px] font-black uppercase rotate-6" style={{ background: YELLOW, border: `2.5px solid ${INK}` }}>Yay! ✿</div>
                         <div className="flex items-center gap-2 font-black text-sm mb-3 uppercase tracking-wide"><Check size={18} /> Story Published!</div>
                         <div className="flex gap-2 mb-3">
                            <input readOnly value={generatedLink} className="flex-1 rounded-full px-3 py-2 text-xs font-bold select-all" style={{ background: CREAM, border: `2.5px solid ${INK}` }} />
                            <button onClick={handleCopyLink} className="p-2.5 rounded-full transition-transform hover:-translate-y-0.5" style={{ background: copied ? YELLOW : CREAM, border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}>
                              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                            </button>
                         </div>
                         <div className="flex gap-2">
                             <a href={generatedLink} target="_blank" className="flex-1 py-2 text-center text-xs font-black uppercase rounded-full transition-transform hover:-translate-y-0.5" style={{ background: INK, color: CREAM, border: `2.5px solid ${INK}` }}>View Story</a>
                             <button onClick={() => setGeneratedLink("")} className="flex-1 py-2 text-center text-xs font-black uppercase rounded-full transition-transform hover:-translate-y-0.5" style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}>New Story</button>
                         </div>
                      </div>
                  )}
              </div>
          </div>
       </div>

       {/* --- RIGHT PANEL: PREVIEW (SCROLLABLE INDEPENDENTLY) --- */}
       <div className="w-full md:w-2/3 h-full overflow-y-auto flex items-center justify-center p-8 relative" style={{ background: SKY }}>
           <div className="absolute top-[-8%] right-[-6%] w-96 h-96 rounded-full fixed dozo-float" style={{ background: LILAC, border: `3px solid ${INK}` }} />
           <div className="absolute bottom-[-12%] left-[-8%] w-80 h-80 rounded-full fixed" style={{ background: MINT, border: `3px solid ${INK}` }} />
           <div className="absolute top-24 left-14 text-4xl fixed dozo-float select-none">✿</div>
           <div className="absolute bottom-24 right-20 text-4xl fixed dozo-float select-none">★</div>

           <div className="relative z-10 flex flex-col items-center my-auto min-h-[700px] justify-center -mt-30">
               <span className="mb-6 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: YELLOW, border: `2.5px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}` }}>Interactive Preview</span>
               <GameboyPreview data={storyData} songs={songs} />
               <p className="mt-8 text-[10px] font-black tracking-[0.18em] uppercase text-center max-w-xs px-4 py-2 rounded-full" style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}` }}>D-Pad: Navigate • A: Select • B: Back</p>
           </div>
       </div>
    </div>
  );
}