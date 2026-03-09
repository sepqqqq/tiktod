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
  Tv,
  Clock,
  User,
  Zap,
  Layers,
  XCircle,
  ChevronDown
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// --- YOUTUBE INTERFACES ---
interface YoutubeResolution {
  resolution: string;
  ext: string;
  size: number;
}

interface YoutubeInfo {
  is_playlist: boolean;
  title: string;
  channel: string;
  channelurl: string;
  duration: string;
  sizemb: number;
  thumbnail: string;
  webpageurl: string;
  resolutions: YoutubeResolution[];
}

export default function YoutubeDownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<YoutubeInfo | null>(null);
  const [downloadingStates, setDownloadingStates] = useState<Record<string, boolean>>({});
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [logs, setLogs] = useState<{time: string, msg: string}[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }).toLowerCase();
    setLogs(prev => [{ time, msg }, ...prev].slice(0, 5));
  };

  const setDownloadLoading = (type: string, isLoading: boolean) => {
    setDownloadingStates(prev => ({ ...prev, [type]: isLoading }));
  };

  const handleFetch = async () => {
    const rawUrl = url.trim();
    if (!rawUrl) {
      toast.error("Please paste a link first!");
      return;
    }

    const youtubeRegex = /youtube\.com|youtu\.be/;
    if (!youtubeRegex.test(rawUrl)) {
      setShowFilterDialog(true);
      return;
    }
    
    setLoading(true);
    setData(null);
    addLog(`Analyzing link: ${rawUrl.substring(0, 30)}...`);

    try {
      const res = await fetch(`/api/youtube/info?url=${encodeURIComponent(rawUrl)}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const result = await res.json();
      if (result.title) {
        setData(result);
        addLog(`Successfully analyzed: ${result.title.substring(0, 30)}...`);
        toast.success('Video info successfully analyzed!');
      } else {
        throw new Error("Failed to analyze link.");
      }
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      toast.error(`Analysis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVideo = async (resolution: string) => {
    setDownloadLoading(`video-${resolution}`, true);
    addLog(`Preparing ${resolution}p video download...`);
    try {
      const res = await fetch(`/api/youtube/download?url=${encodeURIComponent(url)}&resolution=${resolution}&type=video`);
      const result = await res.json();
      
      if (result.download_url) {
        toast.info(`Preparing ${resolution}p...`, { description: "Download will start shortly." });
        
        // Extract video ID for filename
        const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : "neipzyy";
        const filename = `neipzyyytvideo-${videoId}`;
        
        const a = document.createElement('a');
        a.href = `/api/download?url=${encodeURIComponent(result.download_url)}&filename=${filename}`;
        a.download = `${filename}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => {
          setDownloadLoading(`video-${resolution}`, false);
          addLog(`${resolution}p video download triggered.`);
        }, 2000);
      } else {
        throw new Error("Failed to get download link");
      }
    } catch (error: any) {
      addLog(`Download error: ${error.message}`);
      toast.error(`Download Failed: ${error.message}`);
      setDownloadLoading(`video-${resolution}`, false);
    }
  };

  const handleDownloadAudio = async () => {
    setDownloadLoading("audio", true);
    addLog(`Preparing MP3 audio download...`);
    try {
      const res = await fetch(`/api/youtube/download?url=${encodeURIComponent(url)}&type=audio`);
      const result = await res.json();
      
      if (result.download_url) {
        toast.info(`Preparing MP3...`, { description: "Download will start shortly." });
        
        const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : "neipzyy";
        const filename = `neipzyyyymusic-${videoId}`;

        const a = document.createElement('a');
        a.href = `/api/download?url=${encodeURIComponent(result.download_url)}&filename=${filename}`;
        a.download = `${filename}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => {
          setDownloadLoading("audio", false);
          addLog(`MP3 audio download triggered.`);
        }, 2000);
      } else {
        throw new Error("Failed to get download link");
      }
    } catch (error: any) {
      addLog(`Download error: ${error.message}`);
      toast.error(`Download Failed: ${error.message}`);
      setDownloadLoading("audio", false);
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
             <Layers className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase leading-none">Media <span className="text-primary">PRO</span></h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.25em] mt-1">YouTube Downloader</p>
          </div>
        </div>
        <Badge className="border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-primary/20 text-primary">
          ULTRA HIGH PERFORMANCE
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
                placeholder="Paste YouTube link here..."
                className="h-14 pl-12 bg-background/50 border-primary/10 focus:ring-primary rounded-2xl text-sm font-medium"
              />
            </div>
            <Button 
              onClick={handleFetch} 
              disabled={loading}
              className="w-full h-14 text-[10px] font-black rounded-2xl bg-primary hover:bg-primary/90 text-white transition-all uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : "Analyze YouTube Now"}
            </Button>
          </CardContent>
        </Card>

        {/* RESULT SECTION */}
        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-5 p-5 rounded-3xl bg-card/40 border border-primary/5 shadow-sm">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-primary/10 bg-muted shadow-lg shadow-black/20">
                    <Image 
                      src={`/api/proxy?url=${encodeURIComponent(data.thumbnail)}`} 
                      alt="Thumbnail" 
                      fill 
                      className="object-cover hover:scale-105 transition-transform duration-500" 
                      unoptimized 
                    />
                  </div>
                  <div className="space-y-4 flex-1 min-w-0">
                      <div className="flex flex-col gap-1">
                         <h3 className="text-[14px] font-black text-foreground uppercase tracking-tight leading-tight line-clamp-2">{data.title}</h3>
                         <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded-lg">
                               <User className="h-3 w-3 text-primary" />
                               <span className="text-[10px] font-bold text-primary uppercase">{data.channel}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-lg">
                               <Clock className="h-3 w-3 text-muted-foreground" />
                               <span className="text-[10px] font-bold text-muted-foreground uppercase">{data.duration}</span>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button 
                                  className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[9px] rounded-2xl flex justify-between px-5"
                                  disabled={Object.keys(downloadingStates).some(k => k.startsWith('video'))}
                               >
                                  <span className="flex items-center gap-2">
                                     <Tv className="h-4 w-4" /> Video (MP4)
                                  </span>
                                  <ChevronDown className="h-4 w-4" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 rounded-2xl border-primary/20 bg-card/95 backdrop-blur-xl">
                               {data.resolutions.map((res) => (
                                 <DropdownMenuItem 
                                   key={res.resolution}
                                   onClick={() => handleDownloadVideo(res.resolution)}
                                   className="h-10 text-[10px] font-bold uppercase tracking-widest flex justify-between"
                                 >
                                   <span>{res.resolution}P</span>
                                   <span className="text-muted-foreground">{res.size} MB</span>
                                 </DropdownMenuItem>
                               ))}
                            </DropdownMenuContent>
                         </DropdownMenu>

                         <Button 
                            variant="secondary"
                            disabled={downloadingStates["audio"]}
                            onClick={handleDownloadAudio}
                            className="h-12 bg-secondary/50 hover:bg-secondary text-foreground/80 font-bold uppercase tracking-widest text-[9px] rounded-2xl"
                         >
                            {downloadingStates["audio"] ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Music className="h-3.5 w-3.5 mr-2 text-primary" />}
                            Audio (MP3)
                         </Button>
                      </div>
                  </div>
              </div>
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
               <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Multi Resolution</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-card/40 border border-primary/5 text-center">
               <Zap className="h-5 w-5 text-primary/60" />
               <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-nowrap">Bitrate Optimized</p>
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
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-primary">YouTube Link Only!</DialogTitle>
              <DialogDescription className="text-[11px] font-medium leading-relaxed uppercase tracking-wider text-muted-foreground">
                 This page is for YouTube links only. Please use the TikTok page for TikTok videos.
              </DialogDescription>
           </DialogHeader>
           <DialogFooter className="sm:justify-center mt-4">
              <DialogClose asChild>
                 <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest">
                    Got it
                 </Button>
              </DialogClose>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
