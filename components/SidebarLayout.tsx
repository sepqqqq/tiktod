"use client";

import { useSidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function MenuTrigger() {
  const { toggleSidebar, open, openMobile } = useSidebar();
  const isOpen = open || openMobile;
  
  return (
    <button 
      onClick={toggleSidebar}
      className="flex flex-row gap-1.5 p-2 focus:outline-none group relative h-10 w-10 items-center justify-center rounded-xl bg-card border border-primary/10 transition-all active:scale-95"
    >
      <div className={`transition-all duration-500 rounded-full bg-primary ${isOpen ? "h-5 w-1 opacity-100" : "h-[2px] w-4 opacity-70 group-hover:w-5"}`} />
      <div className={`transition-all duration-500 rounded-full bg-primary ${isOpen ? "h-5 w-1 opacity-100" : "h-[2px] w-4 opacity-70 group-hover:w-5"}`} />
      <div className={`transition-all duration-500 rounded-full bg-primary ${isOpen ? "h-5 w-1 opacity-100" : "h-[2px] w-4 opacity-70 group-hover:w-5"}`} />
      
      {isOpen && (
        <div className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20 animate-pulse" />
      )}
    </button>
  );
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full font-sans relative">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden pt-16 lg:pt-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[state=open]/sidebar-wrapper:translate-x-6 lg:group-data-[state=open]/sidebar-wrapper:translate-x-10">
          <div className="fixed top-6 left-6 z-[60] transition-transform duration-700 group-data-[state=open]/sidebar-wrapper:translate-x-[260px] hidden lg:block">
            <MenuTrigger />
          </div>

          <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-primary/10 bg-background/60 px-5 backdrop-blur-xl lg:hidden">
            <div className="flex items-center gap-4">
              <MenuTrigger />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground">
                Hananeipzyy <span className="text-primary">Dev</span>
              </span>
            </div>
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-primary/30 ring-2 ring-background">
              <Image src="https://files.catbox.moe/lp9boa.jpg" alt="Profile" fill className="object-cover" unoptimized />
            </div>
          </header>

          <div className="relative w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="p-4 md:p-8 lg:p-12"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
