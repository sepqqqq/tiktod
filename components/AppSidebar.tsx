"use client";

import React, { useState, useEffect } from "react";
import { Home, Video, Github, Mail, Instagram, Rocket, ExternalLink, LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Project",
    url: "/project",
    icon: Rocket,
  },
];

const projects = [
  {
    title: "TikTok Downloader",
    url: "/project/tiktok-downloader",
    icon: Video,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Use standard pathname for SSR/Initial state 
  // and mounted state for client-side specific tweaks
  const activeUrl = mounted ? pathname : "";

  const isActive = (url: string) => activeUrl === url;
  const isProjectActive = (url: string) => activeUrl.startsWith(url);

  return (
    <Sidebar className="border-r border-border bg-card/60 backdrop-blur-2xl">
      <SidebarHeader className="flex flex-col items-center gap-6 py-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative group cursor-pointer"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-background ring-2 ring-primary/20">
            <Image
              src="/api/proxy?url=https://files.catbox.moe/lp9boa.jpg"
              alt="Profile"
              fill
              className="rounded-full object-cover transition duration-500 group-hover:scale-110"
              priority
              unoptimized
            />
          </div>
        </motion.div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black tracking-tight text-foreground uppercase">
            Hananeipzyy <span className="text-primary">Dev</span>
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span className="h-1 w-1 rounded-full bg-primary" /> Fullstack Engineer
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 pl-4">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      onClick={handleLinkClick}
                      className={`h-11 rounded-xl transition-all duration-300 ${
                        isActive(item.url)
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                        : "hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-4 px-4">
                        <item.icon className={`h-4.5 w-4.5 ${isActive(item.url) ? "text-white" : "text-primary/70"}`} />
                        <span className="font-bold uppercase tracking-wider text-[11px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 pl-4">
              Active Tools
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {projects.map((project) => (
                  <SidebarMenuItem key={project.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isProjectActive(project.url)}
                      onClick={handleLinkClick}
                      className={`h-11 rounded-xl transition-all duration-300 ${
                        isProjectActive(project.url)
                          ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                          : "hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Link href={project.url} className="flex items-center gap-4 px-4">
                        <project.icon className={`h-4.5 w-4.5 ${isProjectActive(project.url) ? "text-white" : "text-primary/70"}`} />
                        <span className="font-bold uppercase tracking-wider text-[11px]">{project.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
      </SidebarContent>

      <SidebarFooter className="border-t border-primary/5 p-6 mt-auto">
        <div className="flex justify-center gap-5 text-muted-foreground/60">
          <Link href="https://github.com/domethode-gif" className="transition-all hover:text-primary hover:scale-125" target="_blank">
            <Github className="h-5 w-5" />
          </Link>
          <Link href="https://www.instagram.com/elesssgipari?igsh=dzJnNWZsZzhzbzV1" className="transition-all hover:text-primary hover:scale-125" target="_blank">
            <Instagram className="h-5 w-5" />
          </Link>
          <Link href="mailto:domethode@gmail.com" className="transition-all hover:text-primary hover:scale-125">
            <Mail className="h-5 w-5" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
