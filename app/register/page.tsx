"use client";

import { useState, useEffect } from "react";
// MOCK IMPORTS: Use standard HTML/React components
import { 
  ArrowLeft, Mail, Lock, User, Loader2, 
  Flower2, Bird, Gift, Heart, Sparkles, Cloud, Music, CheckCircle, X, AlertCircle
} from "lucide-react";

// --- MAIN CONTENT ---
export default function RegisterPage() {
  // State
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk Modal Sukses & Error
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // <--- State Baru

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [decorations, setDecorations] = useState<any[]>([]);

  // Efek Samping: Dekorasi Background
  useEffect(() => {
    document.title = "Register - Cardify";
    
    const items: any[] = [];
    const types = ['flower', 'bird', 'gift', 'heart', 'sparkle', 'cloud', 'music'];
    const colors = [
      'text-amber-400/20', 'text-stone-300/30', 'text-orange-200/20', 'text-yellow-500/10', 'text-stone-400/20'
    ];

    for (let i = 0; i < 25; i++) {
      items.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 20 + Math.random() * 30,
        rotation: Math.random() * 360,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setDecorations(items);
  }, []);

  const renderIcon = (type: string, size: number) => {
    switch (type) {
      case 'flower': return <Flower2 size={size} />;
      case 'bird': return <Bird size={size} />;
      case 'gift': return <Gift size={size} />;
      case 'heart': return <Heart size={size} fill="currentColor" />;
      case 'sparkle': return <Sparkles size={size} />;
      case 'cloud': return <Cloud size={size} fill="currentColor" />;
      case 'music': return <Music size={size} />;
      default: return <Flower2 size={size} />;
    }
  };

  // --- LOGIC REGISTER DENGAN PENGECEKAN EMAIL ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowErrorModal(false); // Reset error modal sebelum request baru

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Cek apakah errornya karena email sudah terdaftar
        // Sesuaikan kondisi ini dengan respon API kamu. 
        // Biasanya status 409 (Conflict) atau pesan berisi "exist" / "registered"
        if (res.status === 409 || data.message?.toLowerCase().includes("already") || data.message?.toLowerCase().includes("exist")) {
             setShowErrorModal(true); // <--- Munculkan Modal Error
        } else {
             throw new Error(data.message || "Register failed");
        }
        return; // Berhenti di sini, jangan lanjut ke sukses
      }

      // ✅ REGISTER BERHASIL
      setShowSuccessModal(true);
      
    } catch (error: any) {
      alert("Failed to register: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full bg-[#FAFAF9] text-[#1C1917] flex items-center justify-center relative overflow-hidden p-6 font-sans`}>
      
      {/* INJECT FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          .font-dm-sans { font-family: 'DM Sans', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'DM Sans', sans-serif; }
      `}} />

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {decorations.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.color} animate-pulse`}
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              transform: `rotate(${item.rotation}deg)`,
              animationDuration: `${item.duration}s`,
            }}
          >
            {renderIcon(item.type, item.size)}
          </div>
        ))}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-200/40 rounded-full blur-[100px] -z-10" />
      </div>

      {/* Register Card */}
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-t-4 border-amber-400 relative z-10 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="absolute top-6 left-6">
            <a href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-stone-400 hover:text-stone-800 transition-colors uppercase tracking-widest cursor-pointer group">
               <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back
            </a>
          </div>

          <div className="flex justify-center mb-5 mt-2">
             <div className="w-14 h-14 bg-[#FAFAF9] rounded-2xl flex items-center justify-center border border-stone-100 shadow-sm text-amber-500">
                <Gift size={28} strokeWidth={1.5} />
             </div>
          </div>

          <h1 className={`text-3xl font-bold mb-2 text-[#1C1917] font-playfair`}>
            Create Account
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed max-w-[260px] mx-auto">
            Join Cardify to start crafting beautiful digital moments.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-10">
          <form onSubmit={handleRegister} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
                <input 
                  type="text" 
                  required 
                  placeholder="Your Name" 
                  className="w-full bg-[#FAFAF9] border border-stone-200 rounded-xl py-3 pl-12 pr-4 text-sm text-stone-800 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all placeholder:text-stone-300" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
                <input 
                  type="email" 
                  required 
                  placeholder="hello@cardify.id" 
                  className="w-full bg-[#FAFAF9] border border-stone-200 rounded-xl py-3 pl-12 pr-4 text-sm text-stone-800 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all placeholder:text-stone-300" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
                <input 
                  type="password" 
                  required 
                  placeholder="Strong password" 
                  className="w-full bg-[#FAFAF9] border border-stone-200 rounded-xl py-3 pl-12 pr-4 text-sm text-stone-800 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all placeholder:text-stone-300" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#1C1917] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-stone-200 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer">
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Creating Account...</> : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-8 font-medium">
            Already have an account? <a href="/login" className="text-amber-600 font-bold hover:underline cursor-pointer transition-colors">Log in</a>
          </p>

        </div>
      </div>

      {/* --- SUCCESS MODAL POPUP --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center transform scale-100 animate-in zoom-in-95 duration-300 relative border-t-4 border-green-500">
             
             <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4 p-2 text-stone-300 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-50">
                <X size={18} />
             </button>

             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-sm border border-green-100 animate-in zoom-in duration-500 delay-100">
                <CheckCircle size={40} strokeWidth={2.5} />
             </div>
             
             <h3 className={`text-2xl font-bold text-[#1C1917] mb-2 font-playfair`}>Welcome Aboard!</h3>
             <p className="text-sm text-stone-500 mb-8 leading-relaxed px-4 font-medium">
                 Your account has been successfully created. You're ready to start crafting memories.
             </p>
             
             <a href="/login" className="block w-full py-3.5 rounded-xl bg-[#1C1917] text-white font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]">
                 Continue to Login
             </a>
           </div>
        </div>
      )}

      {/* --- ERROR MODAL POPUP (EMAIL SUDAH ADA) --- */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center transform scale-100 animate-in zoom-in-95 duration-300 relative border-t-4 border-red-500">
             
             <button onClick={() => setShowErrorModal(false)} className="absolute top-4 right-4 p-2 text-stone-300 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-50">
                <X size={18} />
             </button>

             {/* Icon Error Merah */}
             <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 shadow-sm border border-red-100 animate-in zoom-in duration-500 delay-100">
                <AlertCircle size={40} strokeWidth={2.5} />
             </div>
             
             <h3 className={`text-2xl font-bold text-[#1C1917] mb-2 font-playfair`}>Account Exists</h3>
             <p className="text-sm text-stone-500 mb-8 leading-relaxed px-4 font-medium">
                 The email <span className="font-bold text-stone-800">{formData.email}</span> is already registered. Would you like to log in instead?
             </p>
             
             <div className="flex flex-col gap-3">
                 <a href="/login" className="block w-full py-3.5 rounded-xl bg-[#1C1917] text-white font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]">
                     Go to Login
                 </a>
                 <button onClick={() => setShowErrorModal(false)} className="block w-full py-3.5 rounded-xl bg-stone-100 text-stone-600 font-bold hover:bg-stone-200 transition-all">
                     Try Different Email
                 </button>
             </div>
           </div>
        </div>
      )}
      
      <div className="absolute bottom-6 text-[10px] text-stone-400 font-bold tracking-widest opacity-60 uppercase">© 2025 Cardify Inc.</div>
    </div>
  );
}