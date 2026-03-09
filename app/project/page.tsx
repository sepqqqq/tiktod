"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Info, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const projectList = [
  {
    id: "tiktok",
    title: "TikTok Downloader",
    description: "Download TikTok videos (HD/No Watermark) and Photo Slides instantly.",
    icon: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/1200px-TikTok_logo.svg.png",
    url: "/project/tiktok-downloader",
    status: "Active",
    features: ["HD (No-WM)", "Original (WM)", "Photo Slides", "MP3 Audio"]
  },
  {
    id: "youtube",
    title: "YouTube PRO",
    description: "High-performance YouTube video and audio downloader (FHD/MP3).",
    icon: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png",
    url: "/project/youtube-downloader",
    status: "Active",
    features: ["MP4 (1080p)", "MP3 Audio", "Fast Analysis"]
  },
  {
    id: "facebook",
    title: "Facebook Tools",
    description: "Save Facebook videos and stories with a single click.",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
    url: "#",
    status: "Planned",
    features: ["HD Quality", "Story Support"]
  }
];

export default function ProjectPage() {
  return (
    <div className="mx-auto max-w-xl py-6 md:py-12 space-y-8 px-4">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2 text-center"
      >
        <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">
          Tools <span className="text-primary">& Projects</span>
        </h1>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] max-w-xs mx-auto">
          High-performance digital utilities for content creators.
        </p>
      </motion.div>

      {/* Project Grid - Vertical Stack (Ref: MyKisah) */}
      <div className="grid gap-4">
        {projectList.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group border-primary/5 bg-card/40 backdrop-blur-md hover:border-primary/20 transition-all rounded-2xl overflow-hidden">
              <CardContent className="p-5 flex items-center gap-5">
                <div className="relative h-12 w-12 flex-shrink-0 flex items-center justify-center p-2 rounded-xl bg-background/50 border border-primary/5 group-hover:scale-105 transition-transform">
                  <Image
                    src={project.icon}
                    alt={project.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex-1 space-y-1.5 overflow-hidden">
                   <div className="flex items-center justify-between">
                     <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                        {project.title}
                     </h3>
                     <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-tighter border-none ${
                       project.status === "Active" ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted/20"
                     }`}>
                        {project.status}
                     </Badge>
                   </div>
                   <p className="text-[10px] text-muted-foreground font-medium line-clamp-1">
                      {project.description}
                   </p>
                   <div className="flex flex-wrap gap-1.5">
                      {project.features.slice(0, 2).map(f => (
                         <span key={f} className="text-[7px] font-black uppercase text-primary/60 tracking-widest">{f}</span>
                      ))}
                   </div>
                </div>

                {project.status === "Active" ? (
                  <Button asChild size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-primary hover:text-white transition-all active:scale-90">
                    <Link href={project.url}>
                      <ArrowRight size={14} />
                    </Link>
                  </Button>
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center text-muted-foreground/30">
                    <Zap size={14} />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center pt-4"
      >
        <span className="text-primary">&bull;</span> Fast Proxy Servers <span className="text-primary">&bull;</span> Free Forever
      </motion.div>
    </div>
  );
}
