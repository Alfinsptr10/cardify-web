"use client";

import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Heart, Cake, Music, Image as ImageIcon, MessageSquare, 
  Play, Pause, SkipBack, SkipForward, Gamepad2, 
  ArrowUp, ArrowDown, ArrowRight as IconArrowRight, ArrowLeft as IconArrowLeft, Disc, Loader2, Check,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

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

if (firebaseConfig && firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase Init Error:", e);
  }
}

// --- TOKENS ---
const INK = "#111111";

// --- CONFIG & CONSTANTS ---
const SONGS_LIBRARY = [
  { title: "Happy Birthday", artist: "Traditional", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "/cat.jpg" },
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

// --- INTERACTIVE GAMEBOY COMPONENT (VIEWER) ---
const GameboyViewer = ({ data }: { data: any }) => {
  const [screenView, setScreenView] = useState<'intro' | 'menu'>('intro');
  const [activePopup, setActivePopup] = useState<'none' | 'message' | 'music' | 'gallery' | 'game'>('none');
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0); 
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [pressedDpad, setPressedDpad] = useState<string | null>(null);
  const [pressedButton, setPressedButton] = useState<'A' | 'B' | null>(null); // State baru untuk tombol A/B

  // --- SNAKE GAME STATE ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snakeScore, setSnakeScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const snakeRef = useRef([{x: 5, y: 5}]);
  const foodRef = useRef({x: 10, y: 10});
  const directionRef = useRef("RIGHT");
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Merge default songs with custom uploaded songs from data
  const songs = [...(data.customSongs || []), ...SONGS_LIBRARY];

  const currentSong = songs.find(s => s.title === data.music || s.id === data.music) || songs[0];
  const displayCover = data.musicCover || currentSong.cover;
  const activeColor = GAMEBOY_COLORS.find(c => c.id === data.color) || GAMEBOY_COLORS[0];

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Audio play failed", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, currentSong]);

  // Normalisasi data gallery agar aman membaca format string ataupun object
  const galleryItems = (data.gallery || []).map((item: any, idx: number) => {
    if (typeof item === 'string') {
      return {
        url: item,
        caption: data.galleryCaptions?.[idx] || `Memory #${idx + 1}`
      };
    }
    return {
      url: item.url || "",
      caption: item.caption || data.galleryCaptions?.[idx] || `Memory #${idx + 1}`
    };
  });

  const nextPhoto = () => {
    if (galleryItems.length > 0) setPhotoIndex(prev => (prev + 1) % galleryItems.length);
  };
  const prevPhoto = () => {
    if (galleryItems.length > 0) setPhotoIndex(prev => (prev - 1 + galleryItems.length) % galleryItems.length);
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

  // --- GAME LOGIC ---
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

  // --- BUTTON HANDLERS ---
  const handleStart = () => {
    setScreenView(prev => prev === 'intro' ? 'menu' : 'intro');
    if (activePopup === 'game' && gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
    }
  };

  const handleButtonB = () => {
    if (activePopup !== 'none') {
        setActivePopup('none');
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    } else if (screenView === 'menu') {
        setScreenView('intro');
    }
  };

  const handleButtonA = () => {
     if (screenView === 'intro') {
         return; 
     } else if (screenView === 'menu' && activePopup === 'none') {
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
      className={`relative ${activeColor.bg} rounded-[2rem] w-[390px] h-[590px] p-6 flex flex-col justify-between border-[3px] select-none transition-colors duration-300 overflow-hidden`}
      style={{ 
        borderColor: INK, 
        backgroundImage: activeColor.id === 'blue' 
          ? "linear-gradient(90deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%)" 
          : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.06) 100%)",
        backgroundSize: activeColor.id === 'blue' ? "80px 100%" : "auto"
      }}
    >
      {/* Background ilustrasi PCB khusus untuk mode Clear */}
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

      {/* Background pola kucing untuk Kawaii Pink */}
      {activeColor.isKawaii && (
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center overflow-hidden font-bold text-white text-9xl select-none">
           🐱 🐾 💖
        </div>
      )}

      {/* Garis Dekorasi Atas */}
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
      
      {/* Layar Konsol */}
      <div className="bg-[#38423d] p-3.5 rounded-3xl relative mb-4 shadow-[inset_0_4px_8px_rgba(0,0,0,0.7)] z-10">
         <div className="bg-[#9bbc0f] w-full h-[185px] relative overflow-hidden flex flex-col items-center justify-center font-pixel shadow-inner">
            
            {/* Efek Garis Horizontal Scanline Tetap */}
            <div className="absolute inset-0 pointer-events-none z-30 opacity-15 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_3px]" />
            
            {/* Efek Garis Putih Scanline Transparan Berjalan Lembut */}
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
                      {galleryItems.length > 0 ? (
                          <div className="w-full h-full bg-gray-100 border border-black relative overflow-hidden flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={galleryItems[photoIndex].url} className="w-full h-full object-cover" alt="Gallery" />
                              
                              {galleryItems.length > 1 && (
                                <>
                                  <button onClick={prevPhoto} className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1 rounded-full cursor-pointer z-10"><ChevronLeft size={10}/></button>
                                  <button onClick={nextPhoto} className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1 rounded-full cursor-pointer z-10"><ChevronRight size={10}/></button>
                                </>
                              )}

                              {/* Caption Menyatu di Bawah Foto (Overlay Transparan) */}
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[2px] p-1.5 text-center">
                                  <span className="text-[7.5px] text-white pixel-font break-words block">
                                      {galleryItems[photoIndex].caption}
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

      {/* Bagian Tengah: Teks Logo & Kontrol */}
      <div className={`text-center font-serif italic font-bold text-xs tracking-widest opacity-80 mb-2 relative z-10 ${activeColor.text}`}>2 B I T</div>

      {/* Kontrol Utama: D-Pad & Tombol A/B */}
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

      {/* Bagian Bawah: Select & Start Miring, Case, & Speaker */}
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
                  <div className="w-5 h-5 rounded-full bg-gray-600 border-2 border-black cursor-default"></div>
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

// --- MAIN PAGE WRAPPER ---
export default function WebStoryViewerPage() {
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
             const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'gameboy-stories', id);
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

  const styleTag = (
    <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Boldonse&family=DM+Sans:wght@400;500;700;900&display=swap');
        .pixel-font { font-family: 'Press Start 2P', cursive; }
        .font-pixel { font-family: 'Press Start 2P', cursive; }
        .dozo-display { font-family: 'Boldonse', 'Archivo Black', sans-serif; }
        .dozo-body { font-family: 'DM Sans', sans-serif; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes crtScanline {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        html, body {
          overflow: hidden !important;
          height: 100vh !important;
          margin: 0;
          padding: 0;
        }
    `}} />
  );

  if (loading) return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#16142a] p-4 overflow-hidden">
         {styleTag}
         <div className="bg-[#f7f0d8] border-[2.5px] border-black rounded-3xl px-8 py-7 shadow-[6px_6px_0_0_#111] flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#ff6b2b] border-[2.5px] border-black flex items-center justify-center shadow-[3px_3px_0_0_#111]">
              <Loader2 className="animate-spin text-black" size={24} />
            </div>
            <p className="dozo-body text-[11px] font-black uppercase tracking-[0.2em] text-black">Loading story…</p>
         </div>
      </div>
  );

  if (error || !data) return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#16142a] p-4 text-center overflow-hidden">
         {styleTag}
         <div className="relative bg-[#f7f0d8] border-[2.5px] border-black rounded-[2rem] px-8 py-10 max-w-sm shadow-[10px_10px_0_0_#111]">
            <div className="absolute -top-4 -right-4 rotate-12 bg-[#ff6b2b] border-[2.5px] border-black rounded-full px-3 py-1 shadow-[3px_3px_0_0_#111]">
              <span className="dozo-body text-[10px] font-black uppercase tracking-widest text-black">oops!</span>
            </div>
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-[#f6c445] border-[2.5px] border-black flex items-center justify-center shadow-[4px_4px_0_0_#111]">
              <Gamepad2 size={28} className="text-black" />
            </div>
            <h1 className="dozo-display text-xl uppercase text-black mb-3 leading-tight">Story Not Found</h1>
            <p className="dozo-body text-sm text-black/60 mb-7">Cerita tidak ditemukan atau link salah.</p>
            <a href="/" className="inline-block px-7 py-3 bg-black text-white rounded-full text-[11px] dozo-body font-black uppercase tracking-[0.2em] border-[2.5px] border-black shadow-[5px_5px_0_0_#f6c445] hover:translate-y-0.5 hover:shadow-[3px_3px_0_0_#f6c445] transition-all">
                Buat Sendiri
            </a>
         </div>
      </div>
  );

  return (
    <div className="h-screen w-screen bg-[#16142a] flex items-center justify-center p-4 overflow-hidden relative">
       {styleTag}

        {/* Retro Web Background Grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none w-full h-full" style={{ backgroundImage: "linear-gradient(#4da6ff 1px, transparent 1px), linear-gradient(90deg, #4da6ff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-12 right-20 text-2xl animate-pulse select-none text-white">✦</div>
        <div className="absolute bottom-16 left-16 text-2xl animate-pulse select-none text-white">★</div>

        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <GameboyViewer data={data} />
        </div>
    </div>
  );
}