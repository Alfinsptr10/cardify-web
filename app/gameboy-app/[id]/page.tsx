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

// --- CONFIG & CONSTANTS ---
const SONGS_LIBRARY = [
  { title: "Happy Birthday", artist: "Traditional", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "/cat.jpg" },
];

const GAMEBOY_COLORS = [
  { id: 'white', label: 'Classic White', bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-400' },
  { id: 'grey', label: 'Retro Grey', bg: 'bg-gray-300', border: 'border-gray-400', text: 'text-gray-600' },
  { id: 'purple', label: 'Atomic Purple', bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-purple-200' },
  { id: 'teal', label: 'Teal', bg: 'bg-teal-400', border: 'border-teal-600', text: 'text-teal-800' },
  { id: 'yellow', label: 'Dandelion', bg: 'bg-yellow-400', border: 'border-yellow-600', text: 'text-yellow-800' },
  { id: 'pink', label: 'Berry', bg: 'bg-rose-400', border: 'border-rose-500', text: 'text-rose-200' },
];

// --- INTERACTIVE GAMEBOY COMPONENT (VIEWER) ---
const GameboyViewer = ({ data }: { data: any }) => {
  const [screenView, setScreenView] = useState<'intro' | 'menu'>('intro');
  const [activePopup, setActivePopup] = useState<'none' | 'message' | 'music' | 'gallery' | 'game'>('none');
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0); 
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

    // --- SNAKE GAME STATE ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snakeScore, setSnakeScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  // Menggunakan Ref untuk game state agar tidak perlu re-render setiap frame
  const snakeRef = useRef([{x: 5, y: 5}]);
  const foodRef = useRef({x: 10, y: 10});
  const directionRef = useRef("RIGHT");
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Merge default songs with custom uploaded songs from data
  const songs = [...(data.customSongs || []), ...SONGS_LIBRARY];

  const currentSong = songs.find(s => s.title === data.music) || songs[0];
  const displayCover = data.musicCover || currentSong.cover;
  const activeColor = GAMEBOY_COLORS.find(c => c.id === data.color) || GAMEBOY_COLORS[0];

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Audio play failed (user interaction needed)", e));
        } else {
            audioRef.current.pause();
        }
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
    foodRef.current = {
      x: Math.floor(Math.random() * 20), // Grid size 20x20 estimasi
      y: Math.floor(Math.random() * 20)
    };
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
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current); // Stop game if exit
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
      if (screenView === 'intro') return;

      if (screenView === 'menu' && activePopup === 'none') {
          if (dir === 'UP') setSelectedMenuIndex(prev => (prev > 0 ? prev - 1 : 3));
          else if (dir === 'DOWN') setSelectedMenuIndex(prev => (prev < 3 ? prev + 1 : 0));
      }
      if (activePopup === 'gallery') {
          if (dir === 'LEFT') prevPhoto();
          if (dir === 'RIGHT') nextPhoto();
      }
       // Game Controls
      if (activePopup === 'game' && !isGameOver) {
          if (dir === "UP" && directionRef.current !== "DOWN") directionRef.current = "UP";
          if (dir === "DOWN" && directionRef.current !== "UP") directionRef.current = "DOWN";
          if (dir === "LEFT" && directionRef.current !== "RIGHT") directionRef.current = "LEFT";
          if (dir === "RIGHT" && directionRef.current !== "LEFT") directionRef.current = "RIGHT";
      }
  };

  return (
    <div className={`relative ${activeColor.bg} rounded-[2rem] w-[340px] h-[600px] p-5 flex flex-col shadow-2xl border-4 ${activeColor.border} select-none transition-colors duration-300`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="flex flex-col items-center">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]"></div>
             <span className={`text-[6px] font-bold ${activeColor.text} mt-0.5 font-sans`}>BATTERY</span>
        </div>
        <div className={`font-serif font-bold text-xs ${activeColor.text} italic opacity-80`}>CARDIFY </div>
      </div>
      
      {/* Screen Container */}
      <div className="bg-[#788a82] p-2.5 rounded-md border-2 border-gray-400 relative mb-4 shadow-inner">
         <div className="flex justify-between items-center px-1 mb-0.5">
             <div className="flex gap-0.5">
                <div className="w-1 h-1 rounded-full bg-red-500/80"></div>
                <div className="w-1 h-1 rounded-full bg-red-500/80"></div>
             </div>
             <span className="text-[6px] text-gray-700 font-bold font-sans opacity-60">DOT MATRIX WITH STEREO SOUND</span>
         </div>

         {/* LCD SCREEN */}
         <div className="bg-[#0f380f] w-full h-[200px] border-4 border-[#0f380f] relative overflow-hidden flex flex-col items-center justify-center font-pixel shadow-inner">
            
            {/* 1. INTRO SCREEN */}
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

            {/* 2. MENU SCREEN */}
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

            {/* 3. MESSAGE POPUP */}
            {activePopup === 'message' && (
                <div className="absolute inset-0 bg-[#f0f0f0] z-20 flex flex-col p-1 animate-in zoom-in duration-200">
                    <div className="bg-white border-2 border-black p-2 h-full overflow-y-auto">
                        <div className="text-center border-b-2 border-black border-dashed pb-1 mb-2 font-bold text-[10px] pixel-font">💌 MESSAGE</div>
                        <p className="text-[10px] leading-4 text-gray-800 whitespace-pre-wrap pixel-font">{data.message}</p>
                        <p className="text-[8px] text-gray-500 mt-4 text-right pixel-font">- {data.sender}</p>
                    </div>
                    <button onClick={() => setActivePopup('none')} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-[8px] border border-black">X</button>
                </div>
            )}

            {/* 4. MUSIC POPUP */}
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

            {/* 5. GALLERY POPUP */}
            {activePopup === 'gallery' && (
                <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-2 animate-in zoom-in duration-200">
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
                     ) : (
                         <div className="text-[8px] text-gray-500 pixel-font">NO PHOTOS ADDED</div>
                     )}
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

      {/* CONTROLS (UPSIZED BUTTONS) */}
      <div className="relative h-[220px]">
          {/* D-PAD */}
          <div className="absolute top-4 left-4 w-[110px] h-[110px]">
               <div className="relative w-full h-full">
                   <div className="absolute top-0 left-1/3 w-1/3 h-full bg-[#333] rounded-sm shadow-md"></div>
                   <div className="absolute top-1/3 left-0 w-full h-1/3 bg-[#333] rounded-sm shadow-md"></div>
                   <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-[#2a2a2a] rounded-full"></div>
                   {/* Buttons */}
                   <button onClick={() => handleDpad('UP')} className="absolute top-0 left-1/3 w-1/3 h-1/3 z-10 active:bg-white/10 rounded-t-sm" />
                   <button onClick={() => handleDpad('DOWN')} className="absolute bottom-0 left-1/3 w-1/3 h-1/3 z-10 active:bg-white/10 rounded-b-sm" />
                   <button onClick={() => handleDpad('LEFT')} className="absolute top-1/3 left-0 w-1/3 h-1/3 z-10 active:bg-white/10 rounded-l-sm" />
                   <button onClick={() => handleDpad('RIGHT')} className="absolute top-1/3 right-0 w-1/3 h-1/3 z-10 active:bg-white/10 rounded-r-sm" />
               </div>
          </div>

          {/* A B Buttons */}
          <div className="absolute top-6 right-1 flex gap-5 transform -rotate-12">
               <div className="flex flex-col items-center gap-1 mt-6">
                   <button onClick={handleButtonB} className="w-12 h-12 rounded-full bg-[#d33c3c] border-b-4 border-[#8f2121] active:border-b-0 active:translate-y-1 transition-all shadow-lg text-[#5e1616] font-bold text-sm pixel-font flex justify-center items-center">B</button>
               </div>
               <div className="flex flex-col items-center gap-1">
                   <button onClick={handleButtonA} className="w-12 h-12 rounded-full bg-[#d33c3c] border-b-4 border-[#8f2121] active:border-b-0 active:translate-y-1 transition-all shadow-lg text-[#5e1616] font-bold text-sm pixel-font flex justify-center items-center">A</button>
               </div>
          </div>

          {/* Start Select */}
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
          
          {/* Speaker */}
          <div className="absolute bottom-6 right-6 flex gap-1 transform -rotate-12 opacity-30 pointer-events-none">
               {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-8 bg-black/20 rounded-full inset-shadow" />)}
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
     // Parse ID manually for compatibility
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
             // READ FROM 'gameboy-stories'
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

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
         <Loader2 className="animate-spin text-stone-400" size={32} />
      </div>
  );

  if (error || !data) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 p-4 text-center font-sans">
         <h1 className="text-xl font-bold text-stone-800 mb-2">Story Not Found</h1>
         <p className="text-stone-500 mb-6 text-sm">Cerita tidak ditemukan atau link salah.</p>
         <a href="/" className="px-6 py-2 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black">
             Buat Sendiri
         </a>
      </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#FAFAF9] flex items-center justify-center p-4 overflow-hidden relative">
       {/* Inject Font */}
       <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          .pixel-font { font-family: 'Press Start 2P', cursive; }
          .font-pixel { font-family: 'Press Start 2P', cursive; }
          .animate-spin-slow { animation: spin 3s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />

        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
            {/* Back Button */}
            <div className="absolute top-0 left-0 -mt-12 md:-ml-24">
                <a href="/" className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-800 transition-colors uppercase tracking-widest bg-white/50 backdrop-blur px-4 py-2 rounded-full">
                    <ArrowLeft size={12} /> Make Your Own
                </a>
            </div>

            {/* Viewer Component */}
            <GameboyViewer data={data} />
            
            <p className="mt-8 text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase opacity-60">
                Created with Cardify
            </p>
        </div>
    </div>
  );
}