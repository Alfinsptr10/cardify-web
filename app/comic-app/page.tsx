"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/app/lib/cloudinary";
import { 
  ArrowLeft, Plus, Trash2, Image as ImageIcon, MessageSquare, 
  Sparkles, Check, Link as LinkIcon, Loader2, BookOpen, Layers
} from "lucide-react";

type ComicPanel = {
  id: string;
  image: string;
  dialogue: string;
  caption: string;
  badge: string;
};

type ComicPage = {
  id: string;
  title: string;
  panels: ComicPanel[];
};

export default function ComicEditor() {
  const [comicTitle, setComicTitle] = useState("NINJA STRIKE");
  const [pages, setPages] = useState<ComicPage[]>([
    {
      id: "page-1",
      title: "CHAPTER 1",
      panels: [
        { id: "p1", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", dialogue: "Look at us! What a wild journey!", caption: "MEANWHILE...", badge: "NEW!" },
        { id: "p2", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9", dialogue: "POW! Action time!", caption: "BATTLE", badge: "EPIC" },
        { id: "p3", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f", dialogue: "To be continued...", caption: "THE END", badge: "HOT" }
      ]
    }
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddPage = () => {
    const newPage: ComicPage = {
      id: `page-${pages.length + 1}`,
      title: `CHAPTER ${pages.length + 1}`,
      panels: [
        { id: crypto.randomUUID(), image: "", dialogue: "New dialogue...", caption: "SCENE", badge: "START" }
      ]
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const handleAddPanel = () => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex].panels.push({
      id: crypto.randomUUID(),
      image: "",
      dialogue: "Speech bubble text...",
      caption: "PANEL",
      badge: "ACTION"
    });
    setPages(updatedPages);
  };

  const handlePanelChange = (panelId: string, field: 'dialogue' | 'caption' | 'badge', value: string) => {
    const updatedPages = [...pages];
    const panel = updatedPages[currentPageIndex].panels.find(p => p.id === panelId);
    if (panel) {
      panel[field] = value;
      setPages(updatedPages);
    }
  };

  const handlePanelImageUpload = async (panelId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, "comic-panels");
      const updatedPages = [...pages];
      const panel = updatedPages[currentPageIndex].panels.find(p => p.id === panelId);
      if (panel) {
        panel.image = url;
        setPages(updatedPages);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengupload gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row font-sans bg-[#fbf5e6] text-[#111111]">
       <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Boldonse&family=DM+Sans:wght@700;900&display=swap');
          .font-comic { font-family: 'Bangers', cursive, sans-serif; letter-spacing: 1.5px; }
          .halftone-bg {
            background-image: radial-gradient(#111111 1.5px, transparent 1.5px);
            background-size: 16px 16px;
          }
      `}} />

       {/* --- LEFT PANEL: STUDIO EDITOR --- */}
       <div className="w-full md:w-1/3 h-full overflow-y-auto p-6 bg-[#fbf5e6] border-r-4 border-[#111111] flex flex-col z-20">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-3 border-[#111111]">
             <a href="/" className="px-3 py-1.5 rounded-lg bg-[#ff6b2b] text-white text-xs font-bold border-2 border-[#111] shadow-[2px_2px_0_0_#111]">
               <ArrowLeft size={16} />
             </a>
             <h1 className="text-xl font-comic text-[#111111]">COMIC CREATOR STUDIO</h1>
          </div>

          <div className="space-y-5 flex-1 pb-20">
             <div>
                <label className="block text-xs font-bold uppercase mb-1">COMIC TITLE</label>
                <input 
                  type="text" 
                  value={comicTitle} 
                  onChange={(e) => setComicTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white text-black font-bold border-3 border-[#111] shadow-[3px_3px_0_0_#111] outline-none"
                />
             </div>

             <div className="flex items-center justify-between pt-4 border-t-2 border-[#111] border-dashed">
                <span className="text-xs font-bold uppercase">PAGE {currentPageIndex + 1} OF {pages.length}</span>
                <button 
                  onClick={handleAddPage}
                  className="px-3 py-1.5 bg-[#4ec9b0] text-black text-xs font-bold rounded-lg border-2 border-[#111] shadow-[2px_2px_0_0_#111]"
                >
                  + ADD PAGE
                </button>
             </div>

             <div className="space-y-4 pt-2">
                {pages[currentPageIndex].panels.map((panel, idx) => (
                   <div key={panel.id} className="p-4 rounded-2xl bg-white text-black border-3 border-[#111] shadow-[4px_4px_0_0_#111] space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold font-comic text-[#ff6b2b]">PANEL #{idx + 1}</span>
                         <label className="px-3 py-1 bg-[#ff6b2b] text-white text-[10px] font-bold rounded-lg border-2 border-[#111] cursor-pointer">
                            {panel.image ? "CHANGE" : "UPLOAD"}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePanelImageUpload(panel.id, e)} />
                         </label>
                      </div>

                      {panel.image && (
                         <div className="w-full h-20 rounded-lg overflow-hidden border-2 border-[#111] relative">
                            <img src={panel.image} className="w-full h-full object-cover" alt="preview" />
                         </div>
                      )}

                      <div>
                         <label className="block text-[9px] font-bold uppercase mb-1">SPEECH BUBBLE</label>
                         <input 
                           type="text" 
                           value={panel.dialogue}
                           onChange={(e) => handlePanelChange(panel.id, 'dialogue', e.target.value)}
                           className="w-full px-3 py-2 text-xs rounded-xl bg-[#fbf5e6] border-2 border-[#111] font-bold outline-none"
                         />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                         <div>
                            <label className="block text-[9px] font-bold uppercase mb-1">CAPTION</label>
                            <input 
                              type="text" 
                              value={panel.caption}
                              onChange={(e) => handlePanelChange(panel.id, 'caption', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded-lg bg-[#fbf5e6] border-2 border-[#111] font-bold outline-none"
                            />
                         </div>
                         <div>
                            <label className="block text-[9px] font-bold uppercase mb-1">RIBBON BADGE</label>
                            <input 
                              type="text" 
                              value={panel.badge}
                              onChange={(e) => handlePanelChange(panel.id, 'badge', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded-lg bg-[#fbf5e6] border-2 border-[#111] font-bold outline-none"
                            />
                         </div>
                      </div>
                   </div>
                ))}

                <button 
                  onClick={handleAddPanel}
                  className="w-full py-3 bg-[#f6c445] text-black text-xs font-bold uppercase rounded-xl border-3 border-[#111] shadow-[3px_3px_0_0_#111]"
                >
                  + ADD PANEL
                </button>
             </div>
          </div>
       </div>

       {/* --- RIGHT PANEL: VERTICAL COMIC BOOK PREVIEW (Sesuai Referensi) --- */}
      <div className="w-full md:w-2/3 h-screen overflow-hidden flex flex-col items-center justify-center p-8 relative bg-[#16142a]">
         <div className="absolute inset-0 opacity-20 halftone-bg pointer-events-none" />

         {/* Buku Komik Utama Format Vertikal */}
         <div className="relative z-10 w-full max-w-md bg-[#fbf5e6] text-[#111111] rounded-[2rem] p-6 border-4 border-[#111] shadow-[14px_14px_0_0_#ff6b2b] flex flex-col h-[720px]">
            
            {/* Header Komik */}
            <div className="flex justify-between items-center pb-3 border-b-3 border-[#111] mb-4">
               <div className="bg-[#ff6b2b] text-white px-4 py-1 rounded-xl border-2 border-[#111] font-comic text-lg tracking-wider shadow-[2px_2px_0_0_#111]">
                  {comicTitle}
               </div>
               <div className="bg-[#f6c445] text-black px-3 py-1 rounded-lg border-2 border-[#111] font-comic text-xs shadow-[2px_2px_0_0_#111]">
                  PAGE {currentPageIndex + 1} / {pages.length}
               </div>
            </div>

            {/* Comic Multi-Row Grid Layout (Mirip Referensi Gambar) */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
               
               {/* BARIS 1: Dua Panel Atas (Hijau & Kuning) */}
               <div className="grid grid-cols-2 gap-3 h-36">
                  {/* Panel 1 */}
                  <div className="relative bg-[#4da6ff]/20 rounded-xl border-3 border-[#111] p-2 shadow-[4px_4px_0_0_#111] bg-white overflow-hidden flex flex-col justify-between">
                     <span className="absolute top-1 left-2 z-20 bg-[#ff6b2b] text-white px-2 py-0.5 text-[8px] font-comic border border-[#111] uppercase">POW!</span>
                     <div className="w-full h-20 rounded-lg bg-stone-200 border-2 border-[#111] overflow-hidden relative mt-4">
                        {pages[currentPageIndex]?.panels[0]?.image ? (
                           <img src={pages[currentPageIndex].panels[0].image} className="w-full h-full object-cover" alt="panel 1" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center font-comic text-stone-400 text-xs">PANEL 1</div>
                        )}
                     </div>
                     {pages[currentPageIndex]?.panels[0]?.dialogue && (
                        <p className="text-[9px] font-bold text-center truncate">"{pages[currentPageIndex].panels[0].dialogue}"</p>
                     )}
                  </div>

                  {/* Panel 2 */}
                  <div className="relative bg-[#f6c445]/20 rounded-xl border-3 border-[#111] p-2 shadow-[4px_4px_0_0_#111] bg-white overflow-hidden flex flex-col justify-between">
                     <span className="absolute top-1 right-2 z-20 bg-[#f6c445] text-black px-2 py-0.5 text-[8px] font-comic border border-[#111] uppercase">!</span>
                     <div className="w-full h-20 rounded-lg bg-stone-200 border-2 border-[#111] overflow-hidden relative mt-4">
                        {pages[currentPageIndex]?.panels[1]?.image ? (
                           <img src={pages[currentPageIndex].panels[1].image} className="w-full h-full object-cover" alt="panel 2" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center font-comic text-stone-400 text-xs">PANEL 2</div>
                        )}
                     </div>
                     {pages[currentPageIndex]?.panels[1]?.dialogue && (
                        <p className="text-[9px] font-bold text-center truncate">"{pages[currentPageIndex].panels[1].dialogue}"</p>
                     )}
                  </div>
               </div>

               {/* BARIS 2: Panel Memanjang Tengah (Efek Sunburst Merah) */}
               <div className="relative bg-red-500 rounded-xl border-3 border-[#111] p-2.5 shadow-[4px_4px_0_0_#111] h-40 overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,_#ffeb3b_10%,_transparent_10%)] bg-[size:16px_16px]"></div>
                  <span className="relative z-10 bg-black text-white px-2 py-0.5 text-[8px] font-comic border border-white self-start uppercase">ZOOM!</span>
                  
                  <div className="relative z-10 w-full h-20 rounded-lg bg-stone-200 border-2 border-[#111] overflow-hidden">
                     {pages[currentPageIndex]?.panels[2]?.image ? (
                        <img src={pages[currentPageIndex].panels[2].image} className="w-full h-full object-cover" alt="panel 3" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center font-comic text-stone-400 text-xs">PANEL 3 (WIDE)</div>
                     )}
                  </div>
                  {pages[currentPageIndex]?.panels[2]?.dialogue && (
                     <div className="relative z-10 bg-white text-black px-2 py-1 rounded-xl border border-[#111] text-[9px] font-bold text-center shadow">
                        "{pages[currentPageIndex].panels[2].dialogue}"
                     </div>
                  )}
               </div>

               {/* BARIS 3: Dua Panel Bawah Diagonal/Split */}
               <div className="grid grid-cols-2 gap-3 h-36">
                  {/* Panel 4 */}
                  <div className="relative bg-[#4ec9b0]/20 rounded-xl border-3 border-[#111] p-2 shadow-[4px_4px_0_0_#111] bg-white overflow-hidden flex flex-col justify-between">
                     <div className="w-full h-20 rounded-lg bg-stone-200 border-2 border-[#111] overflow-hidden relative">
                        {pages[currentPageIndex]?.panels[3]?.image ? (
                           <img src={pages[currentPageIndex].panels[3].image} className="w-full h-full object-cover" alt="panel 4" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center font-comic text-stone-400 text-xs">PANEL 4</div>
                        )}
                     </div>
                     {pages[currentPageIndex]?.panels[3]?.dialogue && (
                        <p className="text-[9px] font-bold text-center truncate">"{pages[currentPageIndex].panels[3].dialogue}"</p>
                     )}
                  </div>

                  {/* Panel 5 */}
                  <div className="relative bg-[#ff8a72]/20 rounded-xl border-3 border-[#111] p-2 shadow-[4px_4px_0_0_#111] bg-white overflow-hidden flex flex-col justify-between">
                     <div className="w-full h-20 rounded-lg bg-stone-200 border-2 border-[#111] overflow-hidden relative">
                        {pages[currentPageIndex]?.panels[4]?.image ? (
                           <img src={pages[currentPageIndex].panels[4].image} className="w-full h-full object-cover" alt="panel 5" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center font-comic text-stone-400 text-xs">PANEL 5</div>
                        )}
                     </div>
                     {pages[currentPageIndex]?.panels[4]?.dialogue && (
                        <p className="text-[9px] font-bold text-center truncate">"{pages[currentPageIndex].panels[4].dialogue}"</p>
                     )}
                  </div>
               </div>

            </div>

            {/* Footer Pagination */}
            <div className="flex justify-between items-center pt-3 border-t-3 border-[#111] mt-3">
               <button 
                 disabled={currentPageIndex === 0}
                 onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                 className="px-3 py-1.5 bg-black text-white text-xs font-comic tracking-wider rounded-xl border-2 border-black disabled:opacity-30 shadow-[2px_2px_0_0_#ff6b2b]"
               >
                 ← PREV
               </button>
               <span className="text-xs font-comic tracking-widest text-[#ff6b2b]">CH. {currentPageIndex + 1}</span>
               <button 
                 disabled={currentPageIndex === pages.length - 1}
                 onClick={() => setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1))}
                 className="px-3 py-1.5 bg-[#ff6b2b] text-white text-xs font-comic tracking-wider rounded-xl border-2 border-black disabled:opacity-30 shadow-[2px_2px_0_0_#111]"
               >
                 NEXT →
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}