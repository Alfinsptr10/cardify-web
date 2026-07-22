"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; 
import { Playfair_Display, DM_Sans } from "next/font/google";
import { 
  ArrowLeft, Mail, Lock, Loader2, Github, 
  Gift, AlertCircle
} from "lucide-react";

// Font bawaan tetap dipertahankan agar tidak merusak config jika dipakai di tempat lain
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

// --- KONFIGURASI MATA ---
const EYE_COORDINATES = [
  { id: 1, left: 75.6, top: 25.0, size: 24 }, 
  { id: 2, left: 80.7, top: 25.2, size: 24 },
  { id: 3, left: 76.5, top: 67.5, size: 25 }, 
  { id: 4, left: 82.7, top: 67.5, size: 25 },
  { id: 5, left: 57.8, top: 9.5, size: 25 },
  { id: 6, left: 63.6, top: 10.3, size: 25 },
  { id: 7, left: 57.8, top: 88.7, size: 25 },
  { id: 8, left: 63.5, top: 89.3, size: 25 },
  { id: 9, left: 18.1, top: 25.0, size: 25 },
  { id: 10, left: 23.6, top: 26.2, size: 25 },
  { id: 11, left: 13.3, top: 68.9, size: 25 },
  { id: 12, left: 18.7, top: 69.8, size: 25 },
];

const MOUTH_COORDINATES = [
  { id: 1, left: 78.5, top: 31.0, size: 20 }, 
  { id: 2, left: 79.5, top: 73.0, size: 22 },
];

const NOSE_COORDINATES = [
  { id: 1, left: 78.0, top: 28.0, size: 15, type: 'u-shape' }, 
  { id: 2, left: 79.6, top: 70.0, size: 16, type: 'u-shape' },
];

// --- KOMPONEN MATA ---
const InteractiveEye = ({ x, y, size, mousePos, mood }: { x: number, y: number, size: number, mousePos: { x: number, y: number }, mood: 'normal' | 'reject' }) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mood === 'reject' && pupilRef.current) {
        pupilRef.current.style.transform = `translate(0px, ${size * 0.15}px)`;
        return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current || !pupilRef.current) return;
      
      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      
      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const maxRadius = size / 4; 
      const distance = Math.min(maxRadius, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 6); 
      
      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      pupilRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    };

    if (mood === 'normal') {
        window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size, mood]);

  return (
    <div 
      ref={eyeRef}
      className="absolute bg-white rounded-full flex items-center justify-center overflow-hidden transition-all duration-300"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        border: '3px solid black', // Ditebalkan untuk efek neo-brutalism
        zIndex: 20, 
      }}
    >
      <div 
        ref={pupilRef}
        className="bg-black rounded-full transition-transform duration-200 ease-out relative"
        style={{ 
            width: `${size * 0.55}px`, 
            height: `${size * 0.55}px`, 
        }} 
      >
        <div className="absolute top-1 right-1 w-[30%] h-[30%] bg-white rounded-full opacity-90" />
      </div>
      <div 
        className="absolute top-0 left-0 w-full bg-black transition-all duration-300 ease-in-out"
        style={{
            height: mood === 'reject' ? '45%' : '0%', 
            zIndex: 21
        }}
      />
    </div>
  );
};

// --- KOMPONEN MULUT ---
const StaticMouth = ({ x, y, size, mood }: { x: number, y: number, size: number, mood: 'normal' | 'reject' }) => {
  return (
    <div 
      className="absolute flex items-center justify-center pointer-events-none transition-all duration-300"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size * 1.5}px`, 
        height: `${size}px`,
        transform: `translate(-50%, -50%) ${mood === 'reject' ? 'scale(0.9)' : 'scale(1)'}`,
        zIndex: 19, 
      }}
    >
      {mood === 'normal' ? (
        <svg width="100%" height="100%" viewBox="0 0 40 25" style={{ overflow: 'visible' }}>
            <path d="M2,2 Q20,38 38,2 Z" fill="black" stroke="black" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M4,2 H36 V8 C36,8 20,12 4,8 Z" fill="white" />
            <line x1="14" y1="2" x2="14" y2="8" stroke="black" strokeWidth="2" />
            <line x1="26" y1="2" x2="26" y2="8" stroke="black" strokeWidth="2" />
            <path d="M10,20 Q20,30 30,20" fill="none" stroke="#ff5555" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
        </svg>
      ) : (
        <svg width="100%" height="100%" viewBox="0 0 40 25" style={{ overflow: 'visible' }}>
            <path d="M5,18 Q20,5 35,18" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};

const StaticNose = ({ x, y, size, type }: { x: number, y: number, size: number, type: string }) => {
  return (
    <div 
      className="absolute flex items-center justify-center pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`, 
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 19, 
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8C4 8 8 20 20 16" />
      </svg>
    </div>
  );
};

const ImageDoodleWall = ({ mood }: { mood: 'normal' | 'reject' }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (mood === 'reject') return; 

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mood]);

  return (
    <div className="absolute inset-0 bg-[#FDE68A] overflow-hidden">
      <div className="relative w-full h-full transition-all duration-300">
         <Image 
            src="/doodles.jpeg" 
            alt="Doodle Background"
            fill
            className={`object-cover opacity-90 transition-all duration-300 ${mood === 'reject' ? 'grayscale-0 contrast-125 sepia-[.3]' : 'grayscale'}`} 
            priority
         />
      </div>

      {EYE_COORDINATES.map((eye) => (
        <InteractiveEye 
          key={`eye-${eye.id}`}
          x={eye.left}
          y={eye.top}
          size={eye.size}
          mousePos={mousePos}
          mood={mood} 
        />
      ))}
      {NOSE_COORDINATES.map((nose) => (
        <StaticNose 
          key={`nose-${nose.id}`}
          x={nose.left}
          y={nose.top}
          size={nose.size}
          type={nose.type}
        />
      ))}
      {MOUTH_COORDINATES.map((mouth) => (
        <StaticMouth 
          key={`mouth-${mouth.id}`}
          x={mouth.left}
          y={mouth.top}
          size={mouth.size}
          mood={mood} 
        />
      ))}
      
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${mood === 'reject' ? 'bg-red-500/20' : 'bg-transparent'}`} />
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); 
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  
  const [doodleMood, setDoodleMood] = useState<'normal' | 'reject'>('normal');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const triggerRejectAnimation = () => {
    setDoodleMood('reject');
    setTimeout(() => {
        setDoodleMood('normal');
    }, 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        triggerRejectAnimation();
        setErrorMessage("Email atau password salah.");
        return;
      }

      window.location.href = "/";

    } catch (err) {
      triggerRejectAnimation();
      setErrorMessage("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };


  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    await signIn("github", { callbackUrl: "/" });
  };


  return (
    // Background Pink Playful untuk sisi Kanan/Utama
    <div className={`min-h-screen w-full flex bg-[#FBCFE8] font-sans ${dmSans.className}`}>
      
      {/* INJECT FONTS UNTUK KONSISTENSI */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');
          .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}} />

      {/* --- SISI KIRI (ANIMASI DOODLE) --- */}
      <div className="hidden lg:block w-1/2 relative border-r-[3px] border-black overflow-hidden bg-[#FDE68A]">
         <ImageDoodleWall mood={doodleMood} />
      </div>

      {/* --- SISI KANAN (LOGIN FORM) --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 relative">
        
        {/* Tombol Back Mobile */}
        <Link href="/" className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-bold text-black bg-[#FDE68A] px-3 py-1.5 rounded-full border-2 border-black hover:bg-[#FCD34D] hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-widest z-20">
           <ArrowLeft size={14} /> Back
        </Link>
        
        {/* Card Login Neo-Brutalism */}
        <div className="w-full max-w-[420px] bg-white rounded-3xl border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative z-10">
          
          <div className="lg:hidden flex justify-center mb-6">
             <div className="w-14 h-14 bg-[#D8B4E2] rounded-full flex items-center justify-center border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                <Gift size={28} strokeWidth={2.5} />
             </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2 text-black font-boldonse uppercase tracking-tight">
              Welcome<br/>Back
            </h1>
            <p className="text-black/70 font-medium text-sm">sign in to continue designing your cards.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-bold text-black uppercase tracking-wider ml-1">Email Address</label>
                 {errorMessage && (
                    <div className="flex items-center gap-1 text-red-600 text-xs font-bold animate-pulse">
                       <AlertCircle size={14} strokeWidth={2.5} />
                       {errorMessage}
                    </div>
                 )}
              </div>
              
              {/* Wrapper Input dengan efek Neo-Brutalism */}
              <div className={`relative flex items-center border-2 rounded-xl transition-all group ${
                  errorMessage 
                    ? 'border-red-500 bg-red-50 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] focus-within:translate-y-[2px] focus-within:translate-x-[2px] focus-within:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]' 
                    : 'border-black bg-[#FAFAF9] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:translate-y-[2px] focus-within:translate-x-[2px] focus-within:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:bg-white'
                }`}>
                <Mail size={20} className={`absolute left-4 transition-colors ${errorMessage ? 'text-red-500' : 'text-black/40 group-focus-within:text-black'}`} />
                <input 
                  type="email" 
                  required
                  placeholder="hello@cardify.id"
                  className="w-full bg-transparent py-3 pl-12 pr-4 text-sm font-bold text-black outline-none placeholder:text-black/30 placeholder:font-normal"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(""); 
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Password</label>
                <a href="/forgot-password" className="text-xs font-bold text-black/50 hover:text-black hover:underline underline-offset-2 transition-colors cursor-pointer">forget password?</a>
              </div>
              <div className={`relative flex items-center border-2 rounded-xl transition-all group ${
                  errorMessage 
                    ? 'border-red-500 bg-red-50 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] focus-within:translate-y-[2px] focus-within:translate-x-[2px] focus-within:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]' 
                    : 'border-black bg-[#FAFAF9] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:translate-y-[2px] focus-within:translate-x-[2px] focus-within:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:bg-white'
                }`}>
                <Lock size={20} className={`absolute left-4 transition-colors ${errorMessage ? 'text-red-500' : 'text-black/40 group-focus-within:text-black'}`} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3 pl-12 pr-4 text-sm font-bold text-black outline-none placeholder:text-black/30 placeholder:font-normal"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(""); 
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-[15px] border-2 border-black transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-[0.98] ${
                errorMessage 
                  ? 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none' 
                  : 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-800 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form> 

          {/* Garis Pemisah Neo-Brutalism */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-[3px] border-black"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
              <span className="bg-[#A5E3C8] px-4 py-1 border-2 border-black rounded-full text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                OR
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
               type="button"
               onClick={handleGoogleLogin}
               disabled={isGoogleLoading || isGithubLoading}
               className="flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-black rounded-xl font-bold text-sm text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FDE68A] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
               {isGoogleLoading ? (
                 <Loader2 size={20} className="animate-spin text-black" />
               ) : (
                 <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
               )}
               {isGoogleLoading ? "Wait..." : "Google"}
            </button>

            <button 
              type="button"
              onClick={handleGithubLogin}
              disabled={isGithubLoading || isGoogleLoading}
              className="flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-black rounded-xl font-bold text-sm text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FDE68A] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
               {isGithubLoading ? (
                 <Loader2 size={20} className="animate-spin text-black" />
               ) : (
                 <Github size={20} />
               )}
               {isGithubLoading ? "Wait..." : "GitHub"}
            </button>
          </div>

          <p className="text-center text-sm text-black/60 mt-8 font-medium">
            Don't have an account? <Link href="/register" className="text-black font-bold hover:underline decoration-2 underline-offset-2 cursor-pointer transition-colors">Sign Up Free</Link>
          </p>

        </div>

        {/* Footer Text */}
        <div className="absolute bottom-6 left-0 w-full text-center text-xs font-bold text-black/30 uppercase tracking-widest">
           © 2025 Cardify Inc. Secure Login.
        </div>

      </div>
      
    </div>
  );
}