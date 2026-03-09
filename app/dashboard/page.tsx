"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Github, 
  Mail, 
  ArrowRight, 
  ExternalLink, 
  Code2, 
  Monitor, 
  Database, 
  Palette,
  Heart,
  Rocket,
  Instagram,
  Youtube
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const frontendSkills = [
    { name: "HTML5", level: 95, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", level: 92, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", level: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "React", level: 88, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  ];

  const backendSkills = [
    { name: "Node.js", level: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Python", level: 87, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "PHP", level: 86, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
    { name: "MySQL", level: 89, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  ];

  const uiSkills = [
    { name: "Figma", level: 91, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "Canva", level: 88, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" },
    { name: "Photoshop", level: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg" },
    { name: "Tailwind", level: 94, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-16 space-y-16 px-4">
      {/* Profile Header */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-full blur-2xl opacity-40"
          ></motion.div>
          <div className="relative h-28 w-28 md:h-32 md:w-32 overflow-hidden rounded-full border-4 border-card ring-4 ring-primary/10 shadow-2xl bg-muted">
            <Image
              src="https://files.catbox.moe/lp9boa.jpg"
              alt="Hananeipzyy Profile"
              fill
              className="rounded-full object-cover"
              priority
              unoptimized
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tighter sm:text-4xl text-foreground uppercase">
            Hananeipzyy <span className="text-primary">Dev</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
             <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">
               Software Engineer & Tool Builder
             </p>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <Button asChild size="sm" className="h-10 rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-bold uppercase tracking-widest text-[10px]">
            <Link href="/project">
              Explore Tools <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="h-10 rounded-full px-6 border-primary/20 hover:bg-primary/5 transition-all font-bold uppercase tracking-widest text-[10px]">
            <Link href="https://github.com/domethode-gif">
              GitHub <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* About Me Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
           <div className="h-1 w-10 bg-primary rounded-full" />
           <h2 className="text-lg font-black uppercase tracking-widest text-foreground">About Me</h2>
        </div>
        <Card className="border-primary/10 bg-card/40 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                Haii Namaku <span className="text-primary font-black uppercase tracking-tighter">Neipzyy</span>, Salam kenal! 👋
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                Hobiku coding dan nonton, sekarang aku masih sekolah belum kuliah. Karena sering free, jadi aku manfaatkan waktu untuk terus evaluasi coding dan membangun alat-alat digital yang bermanfaat.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                Berawal dari rasa penasaran tentang bagaimana internet bekerja, kini saya mendedikasikan waktu untuk menguasai berbagai teknologi modern. Saya fokus pada <span className="text-foreground font-bold">pengembangan aplikasi yang efisien</span> dan antarmuka pengguna yang memanjakan mata.
              </p>
            </div>
            
            <div className="pt-4 flex gap-4 border-t border-primary/5">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Location</span>
                  <span className="text-[11px] font-bold text-foreground">Malang, Indonesia</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Experience</span>
                  <span className="text-[11px] font-bold text-foreground">Self-Taught Dev</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Skill Coding Section - Grid 2x2 */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
           <div className="h-1 w-10 bg-primary rounded-full" />
           <h2 className="text-lg font-black uppercase tracking-widest text-foreground">Skill Coding</h2>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-10"
        >
          {/* Frontend Grid 2x2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
               <Monitor size={12} /> Frontend Stack
            </div>
            <div className="grid gap-4 grid-cols-2">
              {frontendSkills.map((skill) => (
                <motion.div key={skill.name} variants={item} className="p-4 rounded-2xl bg-card/40 border border-primary/5 space-y-2.5 transition-all hover:border-primary/20">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="relative h-4 w-4">
                            <Image src={skill.icon} alt={skill.name} fill className="object-contain" unoptimized />
                         </div>
                         <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{skill.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-primary/60">{skill.level}%</span>
                   </div>
                   <Progress value={skill.level} className="h-1.5 bg-primary/5" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Backend Grid 2x2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
               <Database size={12} /> Backend Core
            </div>
            <div className="grid gap-4 grid-cols-2">
              {backendSkills.map((skill) => (
                <motion.div key={skill.name} variants={item} className="p-4 rounded-2xl bg-card/40 border border-primary/5 space-y-2.5 transition-all hover:border-primary/20">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="relative h-4 w-4">
                            <Image src={skill.icon} alt={skill.name} fill className="object-contain" unoptimized />
                         </div>
                         <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{skill.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-primary/60">{skill.level}%</span>
                   </div>
                   <Progress value={skill.level} className="h-1.5 bg-primary/5" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* UI/UX Grid 2x2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
               <Palette size={12} /> Design & Layout
            </div>
            <div className="grid gap-4 grid-cols-2">
              {uiSkills.map((skill) => (
                <motion.div key={skill.name} variants={item} className="p-4 rounded-2xl bg-card/40 border border-primary/5 space-y-2.5 transition-all hover:border-primary/20">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="relative h-4 w-4">
                            <Image src={skill.icon} alt={skill.name} fill className="object-contain" unoptimized />
                         </div>
                         <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{skill.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-primary/60">{skill.level}%</span>
                   </div>
                   <Progress value={skill.level} className="h-1.5 bg-primary/5" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Latest Tool Quick Access */}
      <motion.section
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         viewport={{ once: true }}
         className="pt-8 space-y-4"
      >
        <Link href="/project/tiktok-downloader" className="block group">
           <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all rounded-3xl p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <Rocket size={80} />
              </div>
              <div className="space-y-4 relative z-10">
                 <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black uppercase tracking-widest px-3 py-1">New Release</Badge>
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-foreground">TikTok Downloader v3</h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">HD Video, MP3, and Photo Slide Support</p>
                 </div>
                 <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest group-hover:gap-3 transition-all">
                    Try Now <ArrowRight size={14} />
                 </div>
              </div>
           </Card>
        </Link>

        <Link href="/project/youtube-downloader" className="block group">
           <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all rounded-3xl p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-primary">
                 <Youtube size={80} />
              </div>
              <div className="space-y-4 relative z-10">
                 <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black uppercase tracking-widest px-3 py-1">Hot Tool</Badge>
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-foreground">YouTube Downloader PRO</h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">MP4 1080p, MP3 Audio, and Fast Info Analysis</p>
                 </div>
                 <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest group-hover:gap-3 transition-all">
                    Try Now <ArrowRight size={14} />
                 </div>
              </div>
           </Card>
        </Link>
      </motion.section>

      {/* Footer */}
      <footer className="text-center pt-16 pb-8 border-t border-primary/5">
        <div className="flex justify-center gap-8 mb-6 text-muted-foreground/60">
            <Link href="https://github.com/domethode-gif" className="hover:text-primary transition-all hover:scale-125"><Github size={18} /></Link>
            <Link href="https://www.instagram.com/elesssgipari?igsh=dzJnNWZsZzhzbzV1" className="hover:text-primary transition-all hover:scale-125"><Instagram size={18} /></Link>
            <Link href="mailto:domethode@gmail.com" className="hover:text-primary transition-all hover:scale-125"><Mail size={18} /></Link>
        </div>
        <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-2 font-black uppercase tracking-[0.2em]">
          Made with <Heart size={12} className="text-destructive fill-destructive animate-bounce" /> by <span className="text-primary/80">Hananeipzyy</span>
        </p>
      </footer>
    </div>
  );
}
