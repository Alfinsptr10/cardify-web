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
const RETRO_NAVY = "#16142a";     
const RETRO_PAPER = "#f7f0d8";    
const RETRO_INK = "#111111";      
const RETRO_ORANGE = "#ff6b2b";   
const RETRO_MINT = "#4ec9b0";     
const RETRO_BLUE = "#4da6ff";     
const RETRO_YELLOW = "#f6c445";   

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
  { id: 'grey', label: 'Classic Gray', bg: 'bg-[#d1d1d1]', text: 'text-gray-700', btnBg: 'bg-[#9c1c3c]', dpadBg: 'bg-[#444]', isClear: false },
  { id: 'orange', label: 'Retro Orange', bg: 'bg-[#d47a28]', text: 'text-amber-950', btnBg: 'bg-[#b8232c]', dpadBg: 'bg-[#287d3c]', isClear: false },
  { id: 'pink', label: 'Kawaii Pink', bg: 'bg-[#ec7fa9]', text: 'text-pink-950', btnBg: 'bg-white text-pink-600', dpadBg: 'bg-white text-pink-600', isKawaii: true, isClear: false },
  { id: 'clear', label: 'Clear / Atom', bg: 'bg-[#d1d1d1]/80 backdrop-blur-sm', text: 'text-gray-800', btnBg: 'bg-[#9c1c3c]', dpadBg: 'bg-[#333]', isClear: true },
  { id: 'red', label: 'Loud Red', bg: 'bg-[#b8232c]', text: 'text-rose-100', btnBg: 'bg-[#222222]', dpadBg: 'bg-[#333]', isClear: false },
  { id: 'green', label: 'Loud Green', bg: 'bg-[#3b824a]', text: 'text-emerald-100', btnBg: 'bg-[#1b4324]', dpadBg: 'bg-[#1b4324]', isClear: false },
  { id: 'yellow', label: 'Loud Yellow', bg: 'bg-[#e0b73b]', text: 'text-yellow-950', btnBg: 'bg-[#5c4a16]', dpadBg: 'bg-[#5c4a16]', isClear: false },
  { id: 'black', label: 'Loud Black', bg: 'bg-[#262626]', text: 'text-gray-300', btnBg: 'bg-[#141414]', dpadBg: 'bg-[#141414]', isClear: false },
  { id: 'purple', label: 'Grape', bg: 'bg-[#6b3fa0]', text: 'text-purple-100', btnBg: 'bg-[#3b1d59]', dpadBg: 'bg-[#3b1d59]', isClear: false },
  { id: 'blue', label: 'Racing Blue', bg: 'bg-[#28589c]', text: 'text-blue-100', btnBg: 'bg-[#16345e]', dpadBg: 'bg-[#16345e]', isClear: false },
];

// --- GAMEBOY COMPONENT (PREVIEW ONLY) ---
const GameboyPreview = ({ data, songs, onToggleColor }: { data: any, songs: any[], onToggleColor: () => void }) => {
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
  const [pressedDpad, setPressedDpad] = useState<string | null>(null);
  const [pressedButton, setPressedButton] = useState<'A' | 'B' | null>(null); // State baru untuk tombol A/B

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key.toLowerCase();
      let dir = null;

      if (e.key === "ArrowUp") { dir = "UP"; }
      else if (e.key === "ArrowDown") { dir = "DOWN"; }
      else if (e.key === "ArrowLeft") { dir = "LEFT"; }
      else if (e.key === "ArrowRight") { dir = "RIGHT"; }

      if (dir) {
        e.preventDefault();
        setPressedDpad(dir);
        handleDpad(dir);
      } else if (key === "a") {
        e.preventDefault();
        setPressedButton('A'); // Menggunakan setPressedButton di sini
        handleButtonA();
      } else if (key === "b") {
        e.preventDefault();
        setPressedButton('B'); // Menggunakan setPressedButton di sini
        handleButtonB();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        setPressedDpad(null);
      }
      if (e.key.toLowerCase() === "a") {
        setPressedButton(null); // Menggunakan setPressedButton di sini
      }
      if (e.key.toLowerCase() === "b") {
        setPressedButton(null); // Menggunakan setPressedButton di sini
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [screenView, activePopup, isGameOver, selectedMenuIndex]);
  
  const startGame = () => {
    setSnakeScore(0);
    setIsGameOver(false);
    snakeRef.current = [{x: 5, y: 5}];
    directionRef.current = "RIGHT";
    placeFood();
    
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    gameIntervalRef.current = setInterval(gameLoop, 150);
  };

  const placeFood = () => {
    if (!canvasRef.current) return;
    const gridSize = 10;
    const cols = canvasRef.current.width / gridSize;
    const rows = canvasRef.current.height / gridSize;
    let newFood: { x: number; y: number };
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
    const gridSize = 10;
    const cols = canvasRef.current.width / gridSize;
    const rows = canvasRef.current.height / gridSize;

    let head = { ...snakeRef.current[0] };
    if (directionRef.current === "UP") head.y -= 1;
    if (directionRef.current === "DOWN") head.y += 1;
    if (directionRef.current === "LEFT") head.x -= 1;
    if (directionRef.current === "RIGHT") head.x += 1;

    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snakeRef.current.some(s => s.x === head.x && s.y === head.y)) {
        setIsGameOver(true);
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
        return;
    }

    let newSnake = [head, ...snakeRef.current];
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setSnakeScore(s => s + 10);
        placeFood();
    } else {
        newSnake.pop();
    }
    snakeRef.current = newSnake;

    ctx.fillStyle = "#0f380f";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "#8bac0f";
    ctx.fillRect(foodRef.current.x * gridSize, foodRef.current.y * gridSize, gridSize - 1, gridSize - 1);
    ctx.fillStyle = "#9bbc0f";
    newSnake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
    });
  };

  const handleStart = () => {
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
     if (screenView === 'intro') return;
     else if (screenView === 'menu' && activePopup === 'none') {
         if (selectedMenuIndex === 0) setActivePopup('message');
         else if (selectedMenuIndex === 1) setActivePopup('music');
         else if (selectedMenuIndex === 2) setActivePopup('gallery');
         else if (selectedMenuIndex === 3) {
             setActivePopup('game');
             setTimeout(startGame, 100); 
         }
     } else if (activePopup === 'music') {
         setIsPlaying(!isPlaying);
     } else if (activePopup === 'game' && isGameOver) {
         startGame();
     }
  };

  const handleDpad = (dir: string) => {
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
      className={`relative ${activeColor.bg} rounded-[2rem] w-[390px] h-[560px] p-6 flex flex-col transform scale-90 sm:scale-100 origin-top select-none sticky top-10 transition-colors duration-300 overflow-hidden`}
      style={{ 
        borderColor: INK, 
        backgroundImage: activeColor.id === 'blue' 
          ? "linear-gradient(90deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%)" 
          : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.06) 100%)",
        backgroundSize: activeColor.id === 'blue' ? "80px 100%" : "auto"
      }}
    >
      {activeColor.isClear && (
        <div className="absolute inset-0 opacity-30 pointer-events-none flex items-center justify-center overflow-hidden">
           <div className="w-full h-full bg-[#1b4324] border-4 border-[#28589c] relative">
              <div className="absolute top-10 left-6 w-16 h-12 bg-[#333] border border-yellow-500 rounded"></div>
              <div className="absolute top-32 right-8 w-20 h-16 bg-[#222] border border-gray-400 rounded-full flex items-center justify-center">
                 <div className="w-8 h-8 rounded-full border border-gray-500"></div>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(#28589c_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
           </div>
        </div>
      )}

      {activeColor.isKawaii && (
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center overflow-hidden font-bold text-white text-9xl select-none">
           🐱 🐾 💖
        </div>
      )}

      <div className="flex flex-col gap-1 w-24 mb-2 relative z-10">
        <div className="h-[2px] bg-black/40 w-full rounded-full"></div>
        <div className="h-[2px] bg-black/40 w-3/4 rounded-full"></div>
      </div>

      <div className="flex justify-between items-center mb-2 px-2 relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_5px_red]"></div>
          <span className={`text-[6px] font-bold ${activeColor.text} font-sans tracking-widest uppercase`}>LIVE</span>
        </div>
        <div className={`font-serif font-black text-[11px] ${activeColor.text} italic opacity-70 tracking-widest`}>CARDIFY</div>
      </div>
      
      <div className="bg-[#38423d] p-3.5 rounded-3xl relative mb-4 shadow-[inset_0_4px_8px_rgba(0,0,0,0.7)] z-10">
         <div className="bg-[#9bbc0f] w-full h-[185px] border-4 border-[#9bbc0f] relative overflow-hidden flex flex-col items-center justify-center font-pixel shadow-inner">
            
            <div className="absolute inset-0 pointer-events-none z-30 opacity-15 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_3px]" />
            
            <div 
              className="absolute inset-x-0 h-[2px] bg-black/15 pointer-events-none z-30 shadow-[0_0_4px_rgba(0,0,0,0.2)]"
              style={{
                animation: "crtScanline 6s linear infinite",
              }}
            />

            {screenView === 'intro' && (
                <div className="text-center w-full animate-in fade-in duration-300 z-10">
                    <div className="text-[#0f380f] text-[15px] leading-tight mb-3 drop-shadow-sm uppercase pixel-font px-2 break-words">
                        {data.title || "CARDIFY"}
                    </div>
                    <div className="text-[#306230] text-[7px] mb-5 animate-pulse uppercase pixel-font">
                        {data.subtitle || "PRESS START TO PLAY"}
                    </div>
                    <div className="flex justify-center gap-3 text-[#0f380f]">
                        <Heart size={14} fill="currentColor" />
                        <Cake size={14} />
                        <Heart size={14} fill="currentColor" />
                    </div>
                </div>
            )}
            {screenView === 'menu' && activePopup === 'none' && (
                <div className="w-full h-full p-2 animate-in slide-in-from-bottom duration-200 z-10">
                    <div className="text-[#0f380f] text-[9px] mb-2 text-center border-b border-[#306230] pb-1 pixel-font">MAIN MENU</div>
                    <div className="grid grid-cols-1 gap-1">
                        <div className={`text-[7.5px] p-1.5 text-left flex items-center gap-2 transition-colors pixel-font ${selectedMenuIndex === 0 ? 'bg-[#306230] text-[#9bbc0f]' : 'bg-[#8bac0f] text-[#0f380f]'}`}>
                            {selectedMenuIndex === 0 && <span className="animate-pulse">▶</span>} <MessageSquare size={9} /> 1. MESSAGE
                        </div>
                        <div className={`text-[7.5px] p-1.5 text-left flex items-center gap-2 transition-colors pixel-font ${selectedMenuIndex === 1 ? 'bg-[#306230] text-[#9bbc0f]' : 'bg-[#8bac0f] text-[#0f380f]'}`}>
                            {selectedMenuIndex === 1 && <span className="animate-pulse">▶</span>} <Music size={9} /> 2. MUSIC
                        </div>
                        <div className={`text-[7.5px] p-1.5 text-left flex items-center gap-2 transition-colors pixel-font ${selectedMenuIndex === 2 ? 'bg-[#306230] text-[#9bbc0f]' : 'bg-[#8bac0f] text-[#0f380f]'}`}>
                            {selectedMenuIndex === 2 && <span className="animate-pulse">▶</span>} <ImageIcon size={9} /> 3. GALLERY
                        </div>
                        <div className={`text-[7.5px] p-1.5 text-left flex items-center gap-2 transition-colors pixel-font ${selectedMenuIndex === 3 ? 'bg-[#306230] text-[#9bbc0f]' : 'bg-[#8bac0f] text-[#0f380f]'}`}>
                            {selectedMenuIndex === 3 && <span className="animate-pulse">▶</span>} <Gamepad2 size={9} /> 4. GAMES
                        </div>
                    </div>
                </div>
            )}
            {activePopup === 'message' && (
                <div className="absolute inset-0 bg-[#f0f0f0] z-40 flex flex-col p-1">
                    <div className="bg-white border-2 border-black p-2 h-full overflow-y-auto">
                        <div className="text-center border-b-2 border-black border-dashed pb-1 mb-2 font-bold text-[9px] pixel-font">💌 MESSAGE</div>
                        <p className="text-[9px] leading-4 text-gray-800 whitespace-pre-wrap pixel-font">{data.message}</p>
                        <p className="text-[7.5px] text-gray-500 mt-3 text-right pixel-font">- {data.sender}</p>
                    </div>
                    <button onClick={() => setActivePopup('none')} className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-[7px] border border-black cursor-pointer">X</button>
                </div>
            )}
            {activePopup === 'music' && (
              <div className="absolute inset-0 bg-[#1a1a1a] z-40 flex flex-col items-center justify-between p-2 text-white">
                <div className="text-[#f0b230] text-[7.5px] pixel-font mt-1">--- MUSIC PLAYER ---</div>
                <div className="flex flex-col items-center justify-center flex-1 gap-1.5">
                  <div className="w-14 h-14 bg-gray-700 border border-gray-500 flex items-center justify-center overflow-hidden relative">
                    {displayCover ? (
                      <img src={displayCover} className={`w-full h-full object-cover ${isPlaying ? 'opacity-90' : 'opacity-100'}`} alt="art" />
                    ) : (
                      isPlaying ? <div className="animate-spin-slow"><Disc size={20} className="text-[#f0b230]" /></div> : <Music size={20} className="text-gray-400" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      {isPlaying ? <Pause className="text-white drop-shadow-md animate-pulse" size={24} /> : <Play className="text-white drop-shadow-md" size={24} />}
                    </div>
                  </div>
                  <div className="text-[#8fdb7f] text-[7.5px] text-center pixel-font max-w-[120px] truncate">{currentSong.title}</div>
                  <div className="text-gray-400 text-[6px] text-center pixel-font">{currentSong.artist}</div>
                </div>
                <div className="text-[6px] text-gray-600 pixel-font mb-1">A: Play/Pause • B: Back</div>
                <audio ref={audioRef} src={currentSong.src} loop />
              </div>
            )}
            {activePopup === 'gallery' && (
                <div className="absolute inset-0 bg-white z-40 flex flex-col items-center justify-center p-2">
                      {data.gallery.length > 0 ? (
                          <div className="w-full h-full bg-gray-100 border border-black relative overflow-hidden flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={data.gallery[photoIndex].url} className="w-full h-full object-cover" alt="Gallery" />
                              
                              {data.gallery.length > 1 && (
                                <>
                                  <button onClick={prevPhoto} className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1 rounded-full cursor-pointer z-10"><ChevronLeft size={10}/></button>
                                  <button onClick={nextPhoto} className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1 rounded-full cursor-pointer z-10"><ChevronRight size={10}/></button>
                                </>
                              )}

                              {/* Caption Menyatu di Bawah Foto (Overlay Transparan) */}
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[2px] p-1.5 text-center">
                                  <span className="text-[7.5px] text-white pixel-font break-words block">
                                      {data.gallery[photoIndex].caption || `Memory #${photoIndex + 1}`}
                                  </span>
                              </div>
                          </div>
                      ) : <div className="text-[7.5px] text-gray-500 pixel-font">NO PHOTOS ADDED</div>}
                </div>
            )}
            {activePopup === 'game' && (
                <div className="absolute inset-0 bg-[#9bbc0f] z-40 flex flex-col items-center justify-center p-1">
                    <div className="text-[#0f380f] text-[9px] mb-1 font-pixel">SNAKE GAME</div>
                    <canvas ref={canvasRef} width={180} height={120} className="border-2 border-[#306230] bg-[#8bac0f]"></canvas>
                    <div className="flex justify-between w-full px-3 mt-1 text-[7.5px] font-pixel text-[#0f380f]">
                       <span>SCORE: {snakeScore}</span>
                       <span className="text-[#306230]">{isGameOver ? "GAME OVER" : "PLAYING"}</span>
                    </div>
                    {isGameOver && <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-pixel text-[8.5px] animate-pulse">PRESS A TO RESTART</div>}
                </div>
            )}
         </div>
      </div>

      <div className={`text-center font-serif italic font-bold text-xs tracking-widest opacity-80 mb-2 relative z-10 ${activeColor.text}`}>2 B I T</div>

      <div className="relative h-[160px] z-10">
          <div className="absolute top-1 left-2 w-[110px] h-[110px]">
               <div className="relative w-full h-full" style={{ filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.4))" }}>
                   
                   <div className="absolute inset-[34%] bg-[#3b3838] shadow-inner z-0"></div>

                   {/* Tombol ATAS (UP) */}
                   <button 
                     onClick={() => handleDpad('UP')} 
                     className={`absolute top-0 left-[35%] w-[30%] h-[34%] border-[1.5px] border-[#1a1a1a] rounded-t-md z-20 flex items-center justify-center transition-all cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] ${
                       pressedDpad === 'UP' ? 'bg-[#1a1a1a] scale-95 brightness-75' : 'bg-[#2b2b2b] hover:bg-[#383838]'
                     }`}
                   >
                     <div className="w-0 h-0 border-x-[4px] border-x-transparent border-b-[6px] border-b-white/40"></div>
                   </button>

                   {/* Tombol KIRI (LEFT) */}
                   <button 
                     onClick={() => handleDpad('LEFT')} 
                     className={`absolute top-[35%] left-0 w-[34%] h-[30%] border-[1.5px] border-[#1a1a1a] rounded-l-md z-20 flex items-center justify-center transition-all cursor-pointer shadow-[inset_1px_0_1px_rgba(255,255,255,0.2)] ${
                       pressedDpad === 'LEFT' ? 'bg-[#1a1a1a] scale-95 brightness-75' : 'bg-[#2b2b2b] hover:bg-[#383838]'
                     }`}
                   >
                     <div className="w-0 h-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-white/40"></div>
                   </button>

                   <div className="absolute top-[35%] left-[35%] w-[30%] h-[30%] bg-[#1a1a1a] border-[1.5px] border-[#111111] z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#111111]"></div>
                   </div>

                   {/* Tombol KANAN (RIGHT) */}
                   <button 
                     onClick={() => handleDpad('RIGHT')} 
                     className={`absolute top-[35%] right-0 w-[34%] h-[30%] border-[1.5px] border-[#1a1a1a] rounded-r-md z-20 flex items-center justify-center transition-all cursor-pointer shadow-[inset_-1px_0_1px_rgba(255,255,255,0.2)] ${
                       pressedDpad === 'RIGHT' ? 'bg-[#1a1a1a] scale-95 brightness-75' : 'bg-[#2b2b2b] hover:bg-[#383838]'
                     }`}
                   >
                     <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white/40"></div>
                   </button>

                   {/* Tombol BAWAH (DOWN) */}
                   <button 
                     onClick={() => handleDpad('DOWN')} 
                     className={`absolute bottom-0 left-[35%] w-[30%] h-[34%] border-[1.5px] border-[#1a1a1a] rounded-b-md z-20 flex items-center justify-center transition-all cursor-pointer shadow-[inset_0_-1px_1px_rgba(255,255,255,0.2)] ${
                       pressedDpad === 'DOWN' ? 'bg-[#1a1a1a] scale-95 brightness-75' : 'bg-[#2b2b2b] hover:bg-[#383838]'
                     }`}
                   >
                     <div className="w-0 h-0 border-x-[4px] border-x-transparent border-t-[6px] border-t-white/40"></div>
                   </button>

               </div>
          </div>

          <div className="absolute top-2 right-2 flex gap-4 transform -rotate-12">
               <div className="flex flex-col items-center gap-0.5 mt-4">
                   <button 
                     onClick={handleButtonB} 
                     className={`w-11 h-11 rounded-full ${activeColor.btnBg} border-[2.5px] border-black transition-all font-bold text-xs pixel-font flex justify-center items-center cursor-pointer ${
                       pressedButton === 'B' ? 'translate-y-1 shadow-none brightness-90' : 'active:translate-y-1'
                     }`} 
                     style={{ boxShadow: pressedButton === 'B' ? 'none' : `3px 4px 0 ${INK}` }}
                   >
                     B
                   </button>
                   <span className={`text-[7px] font-bold ${activeColor.text} uppercase tracking-wider font-sans opacity-95`}>JOIN</span>
               </div>
               <div className="flex flex-col items-center gap-0.5">
                   <button 
                     onClick={handleButtonA} 
                     className={`w-11 h-11 rounded-full ${activeColor.btnBg} border-[2.5px] border-black transition-all font-bold text-xs pixel-font flex justify-center items-center cursor-pointer ${
                       pressedButton === 'A' ? 'translate-y-1 shadow-none brightness-90' : 'active:translate-y-1'
                     }`} 
                     style={{ boxShadow: pressedButton === 'A' ? 'none' : `3px 4px 0 ${INK}` }}
                   >
                     A
                   </button>
                   <span className={`text-[7px] font-bold ${activeColor.text} uppercase tracking-wider font-sans opacity-95`}>HOST</span>
               </div>
          </div>
      </div>

      <div className="mt-auto pt-2 border-t-2 border-black/10 flex items-center justify-between relative z-10">
          <div className="flex gap-4">
              <div className="flex flex-col items-center transform -rotate-25">
                  <button onClick={handleStart} className="w-12 h-3.5 bg-[#555] rounded-full border-2 border-black active:scale-95 cursor-pointer shadow-[0_2px_0_#222]"></button>
                  <span className={`text-[5px] font-black font-sans uppercase mt-1 tracking-tighter opacity-80 ${activeColor.text}`}>SELECT</span>
              </div>
              <div className="flex flex-col items-center transform -rotate-25">
                  <button onClick={handleStart} className="w-12 h-3.5 bg-[#555] rounded-full border-2 border-black active:scale-95 cursor-pointer shadow-[0_2px_0_#222]"></button>
                  <span className={`text-[5px] font-black font-sans uppercase mt-1 tracking-tighter opacity-80 ${activeColor.text}`}>START</span>
              </div>
          </div>

          <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                  <button 
                    onClick={onToggleColor} 
                    className="w-5 h-5 rounded-full bg-gray-600 border-2 border-black active:scale-95 cursor-pointer shadow-[0_2px_0_#222]"
                    title="Change Case Color"
                  ></button>
                  <span className={`text-[5.5px] font-black font-sans uppercase mt-0.5 tracking-tighter opacity-80 ${activeColor.text}`}>CASE</span>
              </div>

              <div className="flex flex-col gap-1 w-12 p-1 rounded bg-black/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-1 bg-black/70 rounded-full w-full shadow-[0_1px_1px_rgba(255,255,255,0.15)]" />)}
              </div>
          </div>
      </div>
    </div>
  );
};

export default function GameboyEditor() {
  const [activeTab, setActiveTab] = useState<'message' | 'music' | 'gallery'>('message');
  const [generatedLink, setGeneratedLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [songs, setSongs] = useState(SONGS_LIBRARY); 
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false); 
  const [storyData, setStoryData] = useState({
     title: "HAPPY BIRTHDAY",
     subtitle: "PRESS START BUTTON",
     message: "Happy birthday! May you have a long and healthy life. Wishing you all the best on your special day!",
     sender: "Your friend",
     music: "default-happy",
     musicCover: null as string | null,
     gallery: [
       { url: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400", caption: "Sweet memory #1" }
     ] as Array<{ url: string; caption: string }>,
     color: 'grey'
  });

  const [tempAudioFile, setTempAudioFile] = useState<File | null>(null);
  const [tempCoverFile, setTempCoverFile] = useState<File | null>(null);
  const [tempSongTitle, setTempSongTitle] = useState("");

  const handleChange = (field: string, value: any) => setStoryData(prev => ({ ...prev, [field]: value }));

  const handleToggleColor = () => {
    const currentIndex = GAMEBOY_COLORS.findIndex(c => c.id === storyData.color);
    const nextIndex = (currentIndex + 1) % GAMEBOY_COLORS.length;
    handleChange('color', GAMEBOY_COLORS[nextIndex].id);
  };

  const handleCombinedUpload = async () => {
    if (!tempAudioFile) {
      alert("Mohon pilih file lagu terlebih dahulu.");
      return;
    }

    if (tempAudioFile.size > 10 * 1024 * 1024) return alert("Ukuran lagu max 10MB");
    if (tempCoverFile && tempCoverFile.size > 5 * 1024 * 1024) return alert("Ukuran cover max 5MB");

    setIsUploading(true);

    try {
      const audioUrl = await uploadToCloudinary(tempAudioFile, "music");
      let coverUrl = storyData.musicCover || "/cat.jpg";
      if (tempCoverFile) {
        coverUrl = await uploadToCloudinary(tempCoverFile, "covers");
      }

      const newSong: Song = {
        id: crypto.randomUUID(),
        title: tempSongTitle || tempAudioFile.name.replace(/\.[^/.]+$/, "").substring(0, 20),
        artist: "Custom Upload",
        src: audioUrl,
        cover: coverUrl
      };

      setSongs(prev => [newSong, ...prev]);
      setStoryData(prev => ({
        ...prev,
        music: newSong.id,
        musicCover: coverUrl 
      }));

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

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (storyData.gallery.length >= 3) {
        alert("Maksimal hanya boleh upload 3 foto di galeri!");
        e.target.value = "";
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
        gallery: [...prev.gallery, { url, caption: "" }]
      }));
    } catch (err) {
      console.error(err);
      alert("Gagal upload foto");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setStoryData(prev => {
      const updatedGallery = [...prev.gallery];
      updatedGallery[index] = { ...updatedGallery[index], caption };
      return { ...prev, gallery: updatedGallery };
    });
  };

  const handleRemovePhoto = (index: number) => setStoryData(prev => ({...prev, gallery: prev.gallery.filter((_, i) => i !== index)}));

  const handlePublish = async () => {
    setIsSaving(true);
    
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
            gallery: storyData.gallery.map(item => item.url), // Kompatibilitas database
            galleryCaptions: storyData.gallery.map(item => item.caption),
            color: storyData.color || "grey",
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
        
        const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'gameboy-stories'), payload);
        
        await saveUserCard({
            title: storyData.title || "Retro Gameboy Story",
            template: "gameboy",
            bg: storyData.color === 'purple' ? '#6b3fa0' : storyData.color === 'red' ? '#b8232c' : storyData.color === 'green' ? '#3b824a' : storyData.color === 'yellow' ? '#e0b73b' : storyData.color === 'black' ? '#262626' : storyData.color === 'blue' ? '#28589c' : storyData.color === 'orange' ? '#d47a28' : storyData.color === 'pink' ? '#ec7fa9' : '#d1d1d1',
            status: "saved",
        });

        const link = `${window.location.protocol}//${window.location.host}/gameboy-app/${docRef.id}`;
setGeneratedLink(link);
    } catch (error) {
        console.error("Save Error:", error);
        alert("Gagal menyimpan ke server. Data mungkin terlalu besar (>1MB). Kurangi ukuran file.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TAB_COLORS: Record<string, string> = {
    message: CORAL,
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
          @keyframes crtScanline {
            0% { top: 0%; }
            100% { top: 100%; }
          }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #111111; border-radius: 99px; }
      `}} />

       {/* --- LEFT PANEL: RETRO WEB EDITOR --- */}
       <div className="w-full md:w-1/3 h-full overflow-y-auto z-25 relative flex flex-col" style={{ background: RETRO_NAVY, color: RETRO_PAPER, borderRight: `3px solid ${RETRO_INK}` }}>
          <div className="p-6 md:p-8 max-w-lg mx-auto w-full flex-1 flex flex-col pb-28">
              
              <a
                href="/"
                className="inline-flex items-center gap-2 self-start text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-4 py-2 rounded-lg transition-all group hover:-translate-y-0.5"
                style={{ background: RETRO_PAPER, color: RETRO_INK, border: `2.5px solid ${RETRO_INK}`, boxShadow: `3px 3px 0 ${RETRO_INK}` }}
              >
                 <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> BACK TO DASHBOARD
              </a>
              
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2.5 rounded-xl" style={{ background: RETRO_ORANGE, border: `2.5px solid ${RETRO_INK}`, boxShadow: `3px 3px 0 ${RETRO_INK}` }}>
                    <Gamepad2 size={20} color="#111" />
                 </div>
                 <h1 className="text-xl font-black leading-tight uppercase font-pixel tracking-wide" style={{ color: RETRO_PAPER }}>GAMEBOY CONFIG</h1>
              </div>
              <p className="mb-6 text-xs font-bold pl-14 opacity-70 font-mono">RETRO VIBES • CUSTOM CARTRIDGE STUDIO</p>

              <div
                className="flex gap-1.5 p-1.5 rounded-xl mb-6 sticky top-4 z-30"
                style={{ background: RETRO_PAPER, border: `2.5px solid ${RETRO_INK}`, boxShadow: `4px 4px 0 ${RETRO_INK}` }}
              >
                 {['message', 'music', 'gallery'].map((tab) => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab as any)} 
                        className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer font-pixel"
                        style={
                          activeTab === tab
                            ? { background: RETRO_ORANGE, color: RETRO_INK, border: `2px solid ${RETRO_INK}`, boxShadow: `2px 2px 0 ${RETRO_INK}` }
                            : { background: 'transparent', color: RETRO_INK, border: "2px solid transparent", opacity: 0.6 }
                        }
                    >
                        {tab}
                    </button>
                 ))}
              </div>

              <div className="space-y-5 flex-1">
                 {activeTab === 'message' && (
                     <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.18em] mb-2 ml-1 font-pixel" style={{ color: RETRO_PAPER }}>TITLE (MAX 20 CHARS)</label>
                            <input 
                              type="text" 
                              value={storyData.title} 
                              onChange={(e) => handleChange('title', e.target.value)} 
                              className="w-full rounded-xl px-4 py-3 text-sm outline-none font-bold transition-all placeholder:font-medium placeholder:text-black/30 focus:-translate-y-0.5"
                              style={{ background: RETRO_PAPER, border: `2.5px solid ${RETRO_INK}`, color: RETRO_INK, boxShadow: `3px 3px 0 ${RETRO_INK}` }} 
                              placeholder="e.g. HAPPY BIRTHDAY" 
                              maxLength={20} 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.18em] mb-2 ml-1 font-pixel" style={{ color: RETRO_PAPER }}>SUBTITLE</label>
                            <input 
                              type="text" 
                              value={storyData.subtitle} 
                              onChange={(e) => handleChange('subtitle', e.target.value)} 
                              className="w-full rounded-xl px-4 py-3 text-sm outline-none font-bold transition-all placeholder:font-medium placeholder:text-black/30 focus:-translate-y-0.5"
                              style={{ background: RETRO_PAPER, border: `2.5px solid ${RETRO_INK}`, color: RETRO_INK, boxShadow: `3px 3px 0 ${RETRO_INK}` }} 
                              placeholder="e.g. PRESS START" 
                              maxLength={25} 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.18em] mb-2 ml-1 font-pixel" style={{ color: RETRO_PAPER }}>MESSAGE BODY</label>
                            <textarea 
                              rows={5} 
                              value={storyData.message} 
                              onChange={(e) => handleChange('message', e.target.value)} 
                              className="w-full rounded-xl px-4 py-3 text-sm outline-none font-bold transition-all placeholder:font-medium placeholder:text-black/30 focus:-translate-y-0.5 resize-none leading-relaxed" 
                              style={{ background: RETRO_PAPER, border: `2.5px solid ${RETRO_INK}`, color: RETRO_INK, boxShadow: `3px 3px 0 ${RETRO_INK}` }} 
                              placeholder="Write your heartfelt message here..." 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.18em] mb-2 ml-1 font-pixel" style={{ color: RETRO_PAPER }}>SENDER NAME</label>
                            <input 
                              type="text" 
                              value={storyData.sender} 
                              onChange={(e) => handleChange('sender', e.target.value)} 
                              className="w-full rounded-xl px-4 py-3 text-sm outline-none font-bold transition-all placeholder:font-medium placeholder:text-black/30 focus:-translate-y-0.5"
                              style={{ background: RETRO_PAPER, border: `2.5px solid ${RETRO_INK}`, color: RETRO_INK, boxShadow: `3px 3px 0 ${RETRO_INK}` }} 
                              placeholder="e.g. Your Bestie" 
                            />
                        </div>
                     </div>
                 )}

                 {activeTab === 'music' && (
                    <div className="space-y-5 animate-in slide-in-from-left-2 duration-300">
                        <div className="p-5 rounded-2xl space-y-4 relative overflow-hidden" style={{ background: RETRO_PAPER, border: `3px solid ${RETRO_INK}`, color: RETRO_INK, boxShadow: `5px 5px 0 ${RETRO_INK}` }}>
                            <div className="absolute -top-3 -right-3 p-6 opacity-10"><Music size={70} color="#111" /></div>
                            <div className="flex items-center gap-2 mb-2 pb-3 relative z-10" style={{ borderBottom: `2px dashed ${RETRO_INK}` }}>
                                <div className="p-1.5 rounded-lg" style={{ background: RETRO_YELLOW, border: `2px solid ${RETRO_INK}` }}><Upload size={14} color="#111" /></div>
                                <span className="text-xs font-black uppercase tracking-wide font-pixel">UPLOAD CUSTOM TRACK</span>
                            </div>

                            <div className="relative z-10">
                                <label className="block text-[10px] font-black uppercase tracking-[0.18em] mb-1 font-pixel">TRACK TITLE</label>
                                <input 
                                    type="text" 
                                    value={tempSongTitle}
                                    onChange={(e) => setTempSongTitle(e.target.value)}
                                    placeholder="e.g. Our Favorite Song"
                                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none font-bold"
                                    style={{ background: '#fff', border: `2px solid ${RETRO_INK}`, color: RETRO_INK }}
                                />
                            </div>

                            <div className="flex gap-3 relative z-10">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.18em] mb-1 font-pixel">AUDIO FILE</label>
                                    <label
                                      className="flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5"
                                      style={{ background: tempAudioFile ? RETRO_MINT : '#fff', border: `2px dashed ${RETRO_INK}` }}
                                    >
                                        <Music size={20} color="#111" />
                                        <span className="text-[9px] text-center px-2 truncate w-full font-black uppercase">
                                            {tempAudioFile ? tempAudioFile.name : "SELECT MP3"}
                                        </span>
                                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => setTempAudioFile(e.target.files?.[0] || null)} />
                                    </label>
                                </div>

                                <div className="w-28">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.18em] mb-1 font-pixel">COVER ART</label>
                                    <label
                                      className="flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl cursor-pointer transition-all overflow-hidden relative hover:-translate-y-0.5"
                                      style={{ background: tempCoverFile ? RETRO_MINT : '#fff', border: `2px dashed ${RETRO_INK}` }}
                                    >
                                        {tempCoverFile ? (
                                            <img src={URL.createObjectURL(tempCoverFile)} className="absolute inset-0 w-full h-full object-cover" alt="preview" />
                                        ) : (
                                            <>
                                                <ImageIcon size={20} color="#111" />
                                                <span className="text-[9px] font-black uppercase">IMAGE</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setTempCoverFile(e.target.files?.[0] || null)} />
                                    </label>
                                </div>
                            </div>

                            <button 
                                onClick={handleCombinedUpload} 
                                disabled={isUploading || !tempAudioFile}
                                className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 relative z-10 disabled:opacity-40 cursor-pointer font-pixel"
                                style={{ background: RETRO_INK, color: RETRO_PAPER, border: `2px solid ${RETRO_INK}`, boxShadow: `3px 3px 0 ${RETRO_ORANGE}` }}
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={14}/> : <Plus size={14}/>}
                                {isUploading ? "UPLOADING..." : "ADD TO LIBRARY"}
                            </button>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.18em] mb-2 ml-1 font-pixel" style={{ color: RETRO_PAPER }}>YOUR LIBRARY</label>
                            <div className="space-y-2.5">
                                {songs.map((song) => (
                                    <div 
                                        key={song.id} 
                                        onClick={() => handleChange('music', song.id)} 
                                        className="p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all hover:-translate-y-0.5"
                                        style={{
                                          background: storyData.music === song.id ? RETRO_YELLOW : RETRO_PAPER,
                                          border: `2.5px solid ${RETRO_INK}`,
                                          color: RETRO_INK,
                                          boxShadow: storyData.music === song.id ? `3px 3px 0 ${RETRO_INK}` : `2px 2px 0 ${RETRO_INK}`,
                                        }}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden" style={{ border: `2px solid ${RETRO_INK}`, background: '#fff' }}>
                                                <img src={song.cover} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} alt="cover" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-xs font-black truncate uppercase">{song.title}</span>
                                                <span className="text-[9px] truncate font-bold opacity-60">{song.artist}</span>
                                            </div>
                                        </div>
                                        {storyData.music === song.id && (
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: RETRO_INK, color: RETRO_PAPER, border: `2px solid ${RETRO_INK}` }}>
                                                <Check size={10} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                 )}

                 {activeTab === 'gallery' && (
                     <div className="space-y-5 animate-in slide-in-from-left-2 duration-300">
                         <label
                           className={`flex flex-col items-center justify-center gap-3 w-full p-6 rounded-2xl cursor-pointer transition-all group ${storyData.gallery.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                           style={{ background: storyData.gallery.length >= 3 ? "#f8d7da" : RETRO_PAPER, border: `3px dashed ${RETRO_INK}`, color: RETRO_INK, boxShadow: `4px 4px 0 ${RETRO_INK}` }}
                         >
                            <div className="p-2.5 rounded-full" style={{ background: RETRO_YELLOW, border: `2px solid ${RETRO_INK}` }}>
                                <Upload size={20} color="#111" />
                            </div>
                            <div className="text-center">
                                <span className="text-xs font-black uppercase block tracking-wide font-pixel">
                                    {storyData.gallery.length >= 3 ? "GALLERY FULL (3/3)" : "CLICK TO UPLOAD PHOTO"}
                                </span>
                                <span className="text-[9px] font-bold opacity-70">
                                    {storyData.gallery.length >= 3 ? "Delete a photo to add more" : "JPG/PNG • MAX 20MB"}
                                </span>
                            </div>
                            <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleGalleryUpload} disabled={storyData.gallery.length >= 3} />
                         </label>
                        
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.18em] mb-2 ml-1 font-pixel" style={{ color: RETRO_PAPER }}>GALLERY PREVIEW ({storyData.gallery.length}/3)</label>
                            {storyData.gallery.length === 0 ? (
                              <div className="rounded-xl p-5 text-center" style={{ background: RETRO_PAPER, border: `2.5px dashed ${RETRO_INK}`, color: RETRO_INK }}>
                                <div className="text-xl mb-1">📷</div>
                                <p className="text-[10px] font-black uppercase tracking-wide">No photos yet</p>
                              </div>
                            ) : (
                            <div className="space-y-3">
                            {storyData.gallery.map((item, idx) => (
                                <div key={idx} className="p-3 rounded-xl flex gap-3 items-center" style={{ border: `2.5px solid ${RETRO_INK}`, boxShadow: `3px 3px 0 ${RETRO_INK}`, background: RETRO_PAPER }}>
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ border: `2px solid ${RETRO_INK}` }}>
                                        <img src={item.url} className="w-full h-full object-cover" />
                                        <div className="absolute top-0.5 left-0.5 px-1 rounded text-[7px] font-black font-pixel bg-[#f6c445] text-black border border-black">#{String(idx + 1).padStart(2, "0")}</div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <label className="text-[8px] font-black uppercase font-pixel">CAPTION PHOTO #{idx + 1}</label>
                                        <input 
                                            type="text" 
                                            value={item.caption} 
                                            onChange={(e) => handleCaptionChange(idx, e.target.value)}
                                            placeholder="Write caption here..." 
                                            className="w-full rounded-lg px-2.5 py-1 text-xs font-bold outline-none"
                                            style={{ background: '#fff', border: `2px solid ${RETRO_INK}`, color: RETRO_INK }}
                                            maxLength={50}
                                        />
                                    </div>
                                    <button onClick={() => handleRemovePhoto(idx)} className="p-2 rounded-lg cursor-pointer self-center" style={{ background: RETRO_ORANGE, border: `2px solid ${RETRO_INK}`, color: '#fff' }}><Trash2 size={14} /></button>
                                </div>
                            ))}
                            </div>
                            )}
                        </div>
                     </div>
                 )}
              </div>
          </div>

          <div className="sticky bottom-0 left-0 right-0 p-5 z-40" style={{ background: RETRO_NAVY, borderTop: `3px solid ${RETRO_INK}`, boxShadow: `0 -4px 20px rgba(0,0,0,0.3)` }}>
              <div className="max-w-lg mx-auto">
                  {!generatedLink ? (
                      <button
                        onClick={handlePublish}
                        disabled={isSaving}
                        className="w-full py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer font-pixel"
                        style={{ background: RETRO_YELLOW, color: RETRO_INK, border: `2.5px solid ${RETRO_INK}`, boxShadow: `3px 3px 0 ${RETRO_INK}` }}
                      >
                        {isSaving ? <><Loader2 className="animate-spin" size={14}/> SAVING...</> : "PUBLISH & GENERATE LINK"} 
                        {!isSaving && <Sparkles size={14} color="#111" />}
                      </button>
                  ) : (
                      <div className="rounded-xl p-4 animate-in slide-in-from-bottom duration-300 relative" style={{ background: RETRO_PAPER, border: `2.5px solid ${RETRO_INK}`, color: RETRO_INK, boxShadow: `3px 3px 0 ${RETRO_INK}` }}>
                         <div className="absolute -top-3 -right-2 px-2.5 py-0.5 rounded text-[8px] font-black uppercase rotate-6 font-pixel" style={{ background: RETRO_ORANGE, color: '#fff', border: `2px solid ${RETRO_INK}` }}>YAY! ✿</div>
                         <div className="flex items-center gap-2 font-black text-xs mb-2 uppercase tracking-wide font-pixel"><Check size={14} /> STORY PUBLISHED!</div>
                         <div className="flex gap-2 mb-2.5">
                            <input readOnly value={generatedLink} className="flex-1 rounded-lg px-3 py-1.5 text-xs font-bold select-all" style={{ background: '#fff', border: `2px solid ${RETRO_INK}`, color: RETRO_INK }} />
                            <button onClick={handleCopyLink} className="p-2 rounded-lg cursor-pointer" style={{ background: RETRO_YELLOW, border: `2px solid ${RETRO_INK}` }}>
                              {copied ? <Check size={14} color="#111" /> : <LinkIcon size={14} color="#111" />}
                            </button>
                         </div>
                         <div className="flex gap-2">
                             <a href={generatedLink} target="_blank" className="flex-1 py-2 text-center text-xs font-black uppercase rounded-lg transition-transform hover:-translate-y-0.5 font-pixel" style={{ background: RETRO_INK, color: RETRO_PAPER, border: `2px solid ${RETRO_INK}` }}>VIEW STORY</a>
                             <button onClick={() => setGeneratedLink("")} className="flex-1 py-2 text-center text-xs font-black uppercase rounded-lg transition-transform hover:-translate-y-0.5 cursor-pointer font-pixel" style={{ background: RETRO_PAPER, color: RETRO_INK, border: `2px solid ${RETRO_INK}` }}>NEW STORY</button>
                         </div>
                      </div>
                  )}
              </div>
          </div>
       </div>

       {/* --- RIGHT PANEL: RETRO WEB PREVIEW --- */}
       <div className="w-full md:w-2/3 h-full overflow-hidden flex items-center justify-center p-8 relative" style={{ background: RETRO_NAVY }}>
           
           <div className="absolute inset-0 opacity-15 pointer-events-none w-full h-full" style={{ backgroundImage: "linear-gradient(#4da6ff 1px, transparent 1px), linear-gradient(90deg, #4da6ff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
           
           <div className="absolute top-12 right-20 text-2xl animate-pulse select-none">✦</div>
           <div className="absolute bottom-16 left-16 text-2xl animate-pulse select-none">★</div>

           <div className="relative z-10 flex flex-col items-center my-auto min-h-[700px] justify-center -mt-36">
               <GameboyPreview data={storyData} songs={songs} onToggleColor={handleToggleColor} />
               <p className="mt-8 text-[10px] font-black tracking-[0.18em] uppercase text-center max-w-xs px-4 py-2 rounded-xl font-pixel" style={{ background: RETRO_PAPER, color: RETRO_INK, border: `2.5px solid ${RETRO_INK}`, boxShadow: `4px 4px 0 ${RETRO_INK}` }}>D-PAD: NAVIGATE • A: SELECT • B: BACK</p>
           </div>
       </div>
    </div>
  );
}