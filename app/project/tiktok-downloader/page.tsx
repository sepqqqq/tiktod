"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  Video, 
  Music, 
  Search, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  Smartphone,
  Zap,
  FileDown,
  Layers
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TikTokData {
  creator: string;
  status: boolean;
  result: {
    data: {
      id: string;
      title: string;
      hdplay: string;
      wmplay: string;
      play: string;
      music: string;
      music_info: {
        title: string;
        play: string;
        cover: string;
        author: string;
      };
      author: {
        nickname: string;
        avatar: string;
        unique_id: string;
      };
      images?: string[];
      cover: string;
    };
  };
}

export default function TikTokDownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TikTokData | null>(null);
  const [errorLog, setErrorLog] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setErrorLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const handleFetch = async (targetUrl?: string) => {
    const finalUrl = targetUrl || url;
    if (!finalUrl.trim()) return;
    
    setLoading(true);
    setData(null);
    setSelectedPhotos([]);
    setErrorLog([]);

    try {
      const res = await fetch(`/api/tiktok?url=${encodeURIComponent(finalUrl)}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const result = await res.json();

      if (result.status && result.result?.data) {
        setData(result);
        addLog("Data successfully analyzed.");
      } else {
        addLog(`Error: ${result.message || "Invalid data structure"}`);
      }
    } catch (error: any) {
      addLog(`Fetch Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl: string, type: string) => {
    if (!downloadUrl) {
      addLog("Download Error: Link not found.");
      return;
    }
    
    try {
      // Direct anchor download to bypass sequential download issues
      const filename = type === "hd" ? "neipzyyhdvideo" : type === "wm" ? "neipzyywithwm" : type === "audio" ? "neipzyymp3" : "neipzyyslide";
      const downloadApiUrl = `/api/download?url=${encodeURIComponent(downloadUrl)}&filename=${filename}&v=${Date.now()}_${Math.random()}`;
      
      const a = document.createElement('a');
      a.href = downloadApiUrl;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
      }, 150);
      
      addLog(`Download requested: ${type.toUpperCase()}`);
    } catch (error: any) {
      addLog(`Download Exception: ${error.message}`);
    }
  };

  const togglePhotoSelection = (index: number) => {
    setSelectedPhotos(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const downloadSelectedPhotos = async () => {
    if (!data?.result.data.images || selectedPhotos.length === 0) return;
    for (const index of selectedPhotos) {
      const photoUrl = data.result.data.images[index];
      await handleDownload(photoUrl, "slide");
      await new Promise(r => setTimeout(r, 1000)); 
    }
  };

  const downloadAllPhotos = async () => {
    if (!data?.result.data.images) return;
    for (let i = 0; i < data.result.data.images.length; i++) {
      const photoUrl = data.result.data.images[i];
      await handleDownload(photoUrl, "slide");
      await new Promise(r => setTimeout(r, 1000));
    }
  };

  const scrollPhotos = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mx-auto max-w-xl py-8 md:py-16 space-y-10 px-4 pb-20">
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
             <Video className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase leading-none">TikTok <span className="text-primary">PRO</span></h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.25em] mt-1">HD Video & Photo Downloader</p>
          </div>
        </div>
        <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black uppercase tracking-widest px-3 py-1">V3.5 DB ENABLED</Badge>
      </motion.div>

      {/* INPUT SECTION */}
      <Card className="border-primary/10 bg-card/40 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl">
        <CardContent className="p-8 space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              placeholder="Paste TikTok link here..."
              className="h-14 pl-12 bg-background/50 border-primary/10 focus:ring-primary rounded-2xl text-sm font-medium"
            />
          </div>
          <Button 
            onClick={() => handleFetch()} 
            disabled={loading}
            className="w-full h-14 text-[10px] font-black rounded-2xl bg-primary hover:bg-primary/90 text-white transition-all uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : "Analyze Link Now"}
          </Button>
        </CardContent>
      </Card>

      {/* RESULT SECTION */}
      <AnimatePresence mode="wait">
        {data && data.result.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* COMPACT AUTHOR INFO */}
            <div className="space-y-6">
               <div className="flex items-start gap-4 p-5 rounded-3xl bg-card/40 border border-primary/5 shadow-sm">
                  <div className="relative h-24 w-16 rounded-2xl overflow-hidden border border-primary/10 flex-shrink-0 bg-muted shadow-inner">
                    <Image 
                      src={`/api/proxy?url=${encodeURIComponent(data.result.data.cover)}`} 
                      alt="" 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  </div>
                  <div className="space-y-2 py-0.5 flex-1">
                     <div className="flex items-center gap-2">
                        <div className="relative h-6 w-6 rounded-full overflow-hidden ring-2 ring-primary/20">
                          <Image src={`/api/proxy?url=${encodeURIComponent(data.result.data.author.avatar)}`} alt="Avatar" fill className="object-cover" unoptimized />
                        </div>
                        <span className="text-[12px] font-black text-foreground uppercase tracking-tight">{data.result.data.author.nickname}</span>
                        <span className="text-[10px] text-muted-foreground">@{data.result.data.author.unique_id}</span>
                     </div>
                     <p className="text-[13px] font-medium text-muted-foreground leading-relaxed line-clamp-3">
                        {data.result.data.title || "No description provided."}
                     </p>
                  </div>
               </div>

               {/* ACTION BUTTONS (COMPACT) */}
               {(!data.result.data.images || data.result.data.images.length === 0) ? (
                 <div className="grid gap-3">
                    <Button 
                       onClick={() => handleDownload(data.result.data.hdplay || data.result.data.play, "hd")}
                       className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl group flex justify-between px-6"
                    >
                       <span className="flex items-center gap-2">
                          <Video className="h-4 w-4" /> Download Video HD
                       </span>
                       <Download className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                       <Button 
                          variant="outline"
                          onClick={() => handleDownload(data.result.data.wmplay || data.result.data.play, "wm")}
                          className="h-12 border-primary/10 hover:bg-primary/5 text-foreground/80 font-bold uppercase tracking-widest text-[9px] rounded-2xl"
                       >
                          <Smartphone className="h-3.5 w-3.5 mr-2 text-primary" /> With WM
                       </Button>
                       <Button 
                          variant="secondary"
                          onClick={() => handleDownload(data.result.data.music_info?.play || data.result.data.music, "audio")}
                          className="h-12 bg-secondary/50 hover:bg-secondary text-foreground/80 font-bold uppercase tracking-widest text-[9px] rounded-2xl"
                       >
                          <Music className="h-3.5 w-3.5 mr-2 text-primary" /> Audio MP3
                       </Button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                       <Button 
                          onClick={downloadAllPhotos}
                          className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[9px] rounded-2xl"
                       >
                          <FileDown className="h-3.5 w-3.5 mr-2" /> All Photos ({data.result.data.images.length})
                       </Button>
                       <Button 
                          variant="secondary"
                          onClick={() => handleDownload(data.result.data.music_info?.play || data.result.data.music, "audio")}
                          className="h-12 bg-secondary/50 hover:bg-secondary text-foreground/80 font-bold uppercase tracking-widest text-[9px] rounded-2xl"
                       >
                          <Music className="h-3.5 w-3.5 mr-2 text-primary" /> Background MP3
                       </Button>
                    </div>
                    
                    {/* PHOTO SLIDE CAROUSEL */}
                    <div className="space-y-5">
                       <div className="flex items-center justify-between px-2">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Swipe to View & Select</h4>
                          <div className="flex gap-2">
                             <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-primary/10" onClick={() => scrollPhotos('left')}><ChevronLeft size={16} /></Button>
                             <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-primary/10" onClick={() => scrollPhotos('right')}><ChevronRight size={16} /></Button>
                          </div>
                       </div>
                       
                       <div 
                         ref={scrollContainerRef}
                         className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth"
                       >
                         {data.result.data.images.map((img, idx) => (
                           <motion.div 
                             key={idx}
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             className="flex-shrink-0"
                           >
                             <div 
                               className={`relative w-48 h-72 rounded-3xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                                 selectedPhotos.includes(idx) ? 'border-primary ring-4 ring-primary/20' : 'border-primary/5 hover:border-primary/30'
                               }`}
                               onClick={() => togglePhotoSelection(idx)}
                             >
                               <Image src={`/api/proxy?url=${encodeURIComponent(img)}`} alt={`p-${idx}`} fill className="object-cover" unoptimized />
                               <div className="absolute top-4 right-4 bg-background/40 backdrop-blur-md p-1 rounded-lg">
                                  <Checkbox checked={selectedPhotos.includes(idx)} className="h-5 w-5 bg-white/20 border-white/40 data-[state=checked]:bg-primary" />
                               </div>
                               <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                                  <span className="text-[10px] font-black text-white">{idx + 1}</span>
                               </div>
                             </div>
                           </motion.div>
                         ))}
                       </div>
                       <Button 
                          disabled={selectedPhotos.length === 0}
                          onClick={downloadSelectedPhotos}
                          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[9px] rounded-2xl shadow-lg shadow-primary/20"
                       >
                          <Layers className="h-3.5 w-3.5 mr-2" /> Download Selected ({selectedPhotos.length})
                       </Button>
                    </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR LOG CONSOLE */}
      <AnimatePresence>
        {errorLog.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-black/80 border border-primary/20 font-mono text-[9px] space-y-1 overflow-hidden"
          >
            <p className="text-primary font-black border-b border-primary/20 pb-1 mb-2 tracking-tighter uppercase">Developer Log</p>
            {errorLog.map((log, i) => (
              <p key={i} className="text-white/60 lowercase">{log}</p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER INFO */}
      <div className="space-y-4">
         <div className="flex items-center gap-4 p-4 rounded-3xl bg-primary/5 border border-primary/10">
            <Zap className="text-primary h-5 w-5" />
            <div>
               <p className="text-[10px] font-black text-foreground uppercase tracking-wider">Fast & Secure Processing</p>
               <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Built for speed and quality by Hananeipzyy</p>
            </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-card/40 border border-primary/5 flex flex-col items-center gap-2 text-center">
               <Layers size={20} className="text-primary/60" />
               <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Multi-Photo Slide</span>
            </div>
            <div className="p-4 rounded-2xl bg-card/40 border border-primary/5 flex flex-col items-center gap-2 text-center">
               <Smartphone size={20} className="text-primary/60" />
               <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Mobile Optimized</span>
            </div>
         </div>
      </div>
    </div>
  );
}
