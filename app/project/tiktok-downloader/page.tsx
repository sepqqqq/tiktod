"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Video, 
  Music, 
  Search, 
  Loader2, 
  Smartphone,
  Zap,
  FileDown,
  Layers,
  XCircle,
  CheckCircle2,
  Circle
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- TIKTOK INTERFACES ---
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
  const [dbStatus, setDbStatus] = useState<boolean>(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TikTokData | null>(null);
  const [downloadingStates, setDownloadingStates] = useState<Record<string, boolean>>({});
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [logs, setLogs] = useState<{time: string, msg: string}[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }).toLowerCase();
    setLogs(prev => [{ time, msg }, ...prev].slice(0, 5));
  };

  useEffect(() => {
    fetch("/api/tiktok?check=db")
      .then(r => r.json())
      .then(d => {
        setDbStatus(!!d.enabled);
        if (d.enabled) addLog("Database connection established.");
      })
      .catch(() => setDbStatus(false));
  }, []);

  const setDownloadLoading = (type: string, isLoading: boolean) => {
    setDownloadingStates(prev => ({ ...prev, [type]: isLoading }));
  };

  const cleanUrl = (input: string) => {
    try {
      const urlObj = new URL(input.trim());
      const normalized = urlObj.origin + urlObj.pathname;
      return normalized;
    } catch {
      return input.trim();
    }
  };

  const handleFetch = async () => {
    const rawUrl = url.trim();
    if (!rawUrl) {
      toast.error("Please paste a link first!");
      return;
    }

    const tiktokRegex = /tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com/;
    if (!tiktokRegex.test(rawUrl)) {
      setShowFilterDialog(true);
      return;
    }
    
    const finalUrl = cleanUrl(rawUrl);
    setLoading(true);
    setData(null); 
    setSelectedPhotos([]);
    addLog(`Analyzing link: ${finalUrl.substring(0, 30)}...`);
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/tiktok?url=${encodeURIComponent(finalUrl)}&t=${timestamp}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const result = await res.json();
      if (result.status && result.result?.data) {
        setData(result);
        addLog(`Successfully analyzed content from @${result.result.data.author.unique_id}`);
        toast.success('Content successfully analyzed!');
      } else {
        throw new Error(result.message || "Failed to analyze link.");
      }
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      toast.error(`Analysis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl: string, type: string, index?: number) => {
    if (!downloadUrl || !data) {
      toast.error("Download Error", { description: "Link not found." });
      return;
    }
    
    const stateKey = index !== undefined ? `${type}-${index}` : type;
    setDownloadLoading(stateKey, true);
    addLog(`Preparing ${type.toUpperCase()} download for content ${data.result.data.id}`);
    
    // Immediate feedback for user
    toast.info(`Preparing ${type.toUpperCase()}...`, {
      description: "Your download will start shortly.",
      duration: 2000
    });

    try {
      const videoId = data.result.data.id || "neipzyy";
      let filename = `neipzyyhdvideo-${videoId}`;
      if (type === "wm") filename = `neipzyywithwm-${videoId}`;
      if (type === "audio") filename = `neipzyyttmp3-${videoId}`;
      if (type === "slide") filename = `neipzyyslide-${videoId}-${index}`;
      
      const timestamp = new Date().getTime();
      const downloadApiUrl = `/api/download?url=${encodeURIComponent(downloadUrl)}&filename=${filename}&v=${timestamp}`;
      
      const a = document.createElement('a');
      a.href = downloadApiUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Delay to simulate preparation and reset loading state
      setTimeout(() => {
        setDownloadLoading(stateKey, false);
        addLog(`${type.toUpperCase()} download triggered successfully.`);
      }, 2000);
    } catch (error: any) {
      addLog(`Download error: ${error.message}`);
      toast.error(`Download Failed: ${error.message}`);
      setDownloadLoading(stateKey, false);
    }
  };

  const toggleSelectPhoto = (index: number) => {
    setSelectedPhotos(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const downloadAllPhotos = async () => {
    if (!data?.result.data.images) return;
    setDownloadLoading("all-photos", true);
    addLog(`Preparing to download all ${data.result.data.images.length} photos...`);
    
    toast.info("Preparing All Photos...", {
      description: "Starting batch download sequence.",
      duration: 3000
    });

    for (let i = 0; i < data.result.data.images.length; i++) {
      const photoUrl = data.result.data.images[i];
      await handleDownload(photoUrl, "slide", i);
      // Small delay between downloads to prevent browser blocking
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setDownloadLoading("all-photos", false);
  };

  const downloadSelectedPhotos = async () => {
    if (!data?.result.data.images || selectedPhotos.length === 0) return;
    setDownloadLoading("selected-photos", true);
    addLog(`Batch downloading ${selectedPhotos.length} selected photos...`);
    
    toast.info("Preparing Selection...", {
      description: `Downloading ${selectedPhotos.length} selected photos.`,
      duration: 3000
    });

    for (const index of selectedPhotos) {
      const photoUrl = data.result.data.images[index];
      await handleDownload(photoUrl, "slide", index);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setDownloadLoading("selected-photos", false);
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
             <Layers className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase leading-none">Media <span className="text-primary">PRO</span></h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.25em] mt-1">TikTok Downloader</p>
          </div>
        </div>
        <Badge className={`border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 transition-colors ${dbStatus ? 'bg-primary/20 text-primary' : 'bg-destructive/10 text-destructive'}`}>
          {dbStatus ? "V3.5 DB ENABLED" : "DB OFFLINE"}
        </Badge>
      </motion.div>

      <div className="space-y-8">
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
              onClick={handleFetch} 
              disabled={loading}
              className="w-full h-14 text-[10px] font-black rounded-2xl bg-primary hover:bg-primary/90 text-white transition-all uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : "Analyze TikTok Now"}
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
              className="space-y-6"
            >
              {/* PROFILE CARD */}
              <div className="flex items-start gap-4 p-5 rounded-3xl bg-card/40 border border-primary/5 shadow-sm">
                  <div className="relative aspect-[3/4] w-20 rounded-2xl overflow-hidden border border-primary/10 flex-shrink-0 bg-muted shadow-lg shadow-black/20">
                    <Image 
                      src={`/api/proxy?url=${encodeURIComponent(data.result.data.cover)}`} 
                      alt="Cover" 
                      fill 
                      className="object-cover hover:scale-110 transition-transform duration-500" 
                      unoptimized 
                    />
                  </div>
                  <div className="space-y-3 py-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="relative h-7 w-7 rounded-full overflow-hidden ring-2 ring-primary/20 bg-muted shadow-sm">
                          <Image src={`/api/proxy?url=${encodeURIComponent(data.result.data.author.avatar)}`} alt="Avatar" fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[12px] font-black text-foreground uppercase tracking-tight leading-none">{data.result.data.author.nickname}</span>
                            <span className="text-[9px] text-muted-foreground font-medium">@{data.result.data.author.unique_id}</span>
                        </div>
                      </div>
                      <p className="text-[13px] font-medium text-foreground/80 leading-relaxed line-clamp-3">
                        {data.result.data.title || "No description provided."}
                      </p>
                  </div>
              </div>

              {/* PHOTO SLIDE SECTION */}
              {data.result.data.images && data.result.data.images.length > 0 ? (
                <div className="space-y-6">
                  {/* BUTTONS AT TOP */}
                  <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={downloadAllPhotos} 
                        disabled={downloadingStates["all-photos"]}
                        className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[9px] rounded-2xl shadow-lg shadow-primary/20"
                      >
                        {downloadingStates["all-photos"] ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <FileDown className="h-3.5 w-3.5 mr-2" />} 
                        {downloadingStates["all-photos"] ? "Preparing..." : `All Photos (${data.result.data.images.length})`}
                      </Button>
                      <Button variant="secondary" disabled={downloadingStates["audio"]} onClick={() => handleDownload(data.result.data.music_info?.play || data.result.data.music, "audio")} className="h-12 bg-secondary/50 hover:bg-secondary text-foreground/80 font-bold uppercase tracking-widest text-[9px] rounded-2xl">
                        {downloadingStates["audio"] ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Music className="h-3.5 w-3.5 mr-2 text-primary" />} 
                        {downloadingStates["audio"] ? "Preparing..." : "Background MP3"}
                      </Button>
                  </div>

                  {/* ENLARGED SLIDER WITH CHECKBOXES */}
                  <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide snap-x snap-mandatory">
                    {data.result.data.images.map((img, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => toggleSelectPhoto(i)}
                        className={cn(
                          "relative min-w-[180px] aspect-[4/5] rounded-3xl overflow-hidden border transition-all cursor-pointer snap-center shadow-lg group",
                          selectedPhotos.includes(i) ? "border-primary ring-2 ring-primary/40 shadow-primary/30" : "border-primary/10"
                        )}
                      >
                        <Image 
                          src={`/api/proxy?url=${encodeURIComponent(img)}`} 
                          alt={`Photo ${i + 1}`} 
                          fill 
                          className="object-cover transition-transform group-hover:scale-105" 
                          unoptimized 
                        />
                        
                        {/* SELECTION CHECKMARK OVERLAY */}
                        <div className="absolute top-4 right-4 z-10">
                           {selectedPhotos.includes(i) ? (
                             <div className="bg-primary p-1.5 rounded-full shadow-lg border border-white/20 animate-in zoom-in-50 duration-200">
                               <CheckCircle2 className="h-5 w-5 text-white" />
                             </div>
                           ) : (
                             <div className="bg-black/30 backdrop-blur-md p-1.5 rounded-full border border-white/20">
                               <Circle className="h-5 w-5 text-white/70" />
                             </div>
                           )}
                        </div>

                        <div className="absolute bottom-4 left-4">
                           <Badge className="bg-black/40 backdrop-blur-sm text-[8px] font-black border-none uppercase tracking-widest">{i + 1}</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* BOLD SELECT BUTTON (FULL WIDTH - PREPARING STATE) */}
                  <Button 
                    onClick={downloadSelectedPhotos}
                    disabled={selectedPhotos.length === 0 || downloadingStates["selected-photos"]}
                    className="h-14 w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl group flex justify-between px-6 shadow-lg shadow-primary/20"
                  >
                    <span className="flex items-center gap-2">
                      {downloadingStates["selected-photos"] ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />} 
                      {downloadingStates["selected-photos"] ? "Preparing Selection..." : `Download Selected (${selectedPhotos.length})`}
                    </span>
                    <Layers className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                /* VIDEO RESULT (STAYS THE SAME FOR QUALITY) */
                <div className="grid gap-3">
                  <Button 
                    disabled={downloadingStates["hd"]}
                    onClick={() => handleDownload(data.result.data.hdplay || data.result.data.play, "hd")}
                    className="h-14 w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl group flex justify-between px-6 shadow-lg shadow-primary/20"
                  >
                    <span className="flex items-center gap-2">
                      <Video className="h-4 w-4" /> {downloadingStates["hd"] ? "Preparing HD Video..." : "Download Video HD"}
                    </span>
                    {downloadingStates["hd"] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" disabled={downloadingStates["wm"]} onClick={() => handleDownload(data.result.data.wmplay || data.result.data.play, "wm")} className="h-12 border-primary/10 hover:bg-primary/5 text-foreground/80 font-bold uppercase tracking-widest text-[9px] rounded-2xl">
                        {downloadingStates["wm"] ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Smartphone className="h-3.5 w-3.5 mr-2 text-primary" />} 
                        {downloadingStates["wm"] ? "Preparing..." : "With WM"}
                      </Button>
                      <Button variant="secondary" disabled={downloadingStates["audio"]} onClick={() => handleDownload(data.result.data.music_info?.play || data.result.data.music, "audio")} className="h-12 bg-secondary/50 hover:bg-secondary text-foreground/80 font-bold uppercase tracking-widest text-[9px] rounded-2xl">
                        {downloadingStates["audio"] ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Music className="h-3.5 w-3.5 mr-2 text-primary" />} 
                        {downloadingStates["audio"] ? "Preparing..." : "Audio MP3"}
                      </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* FOOTER INFO */}
      <div className="space-y-6 pt-4">
         {/* DEVELOPER LOG */}
         <AnimatePresence>
           {logs.length > 0 && (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="rounded-3xl border border-primary/10 bg-card/30 p-6 backdrop-blur-xl"
             >
               <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary">Developer Log</h4>
               <div className="space-y-2 font-mono text-[9px] text-muted-foreground/80">
                 {logs.map((log, i) => (
                   <div key={i} className="flex gap-2">
                     <span className="text-primary/60">[{log.time}]</span>
                     <span className="break-all">{log.msg}</span>
                   </div>
                 ))}
               </div>
             </motion.div>
           )}
         </AnimatePresence>

         <div className="flex items-center gap-4 p-5 rounded-3xl bg-primary/5 border border-primary/10">
            <Zap className="text-primary h-5 w-5" />
            <div>
               <p className="text-[10px] font-black text-foreground uppercase tracking-wider">Fast & Secure Processing</p>
               <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Built for speed and quality by Hananeipzyy</p>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-card/40 border border-primary/5 text-center">
               <Layers className="h-5 w-5 text-primary/60" />
               <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Multi-Photo Slide</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-card/40 border border-primary/5 text-center">
               <Smartphone className="h-5 w-5 text-primary/60" />
               <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Mobile Optimized</p>
            </div>
         </div>
      </div>

      {/* FILTER DIALOG */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="max-w-[350px] rounded-3xl border-primary/20 bg-card/95 backdrop-blur-xl">
           <DialogHeader className="items-center text-center space-y-4">
              <div className="p-4 bg-destructive/10 rounded-full">
                 <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <DialogTitle className="text-xl font-black uppercase tracking-tight">Invalid Link!</DialogTitle>
              <DialogDescription className="text-[11px] font-medium leading-relaxed uppercase tracking-wider text-muted-foreground">
                 Please make sure you copy a valid TikTok URL.
              </DialogDescription>
           </DialogHeader>
           <DialogFooter className="sm:justify-center mt-4">
              <DialogClose asChild>
                 <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest">
                    I Understand
                 </Button>
              </DialogClose>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
