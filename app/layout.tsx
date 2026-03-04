import { Toaster } from "@/components/ui/sonner";
import { SidebarLayout } from "@/components/SidebarLayout";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hananeipzyy Dev",
  description: "Portofolio and Digital Tools by Hananeipzyy",
  icons: {
    icon: "https://files.catbox.moe/wpn1w3.jpg",
    shortcut: "https://files.catbox.moe/wpn1w3.jpg",
    apple: "https://files.catbox.moe/wpn1w3.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary overflow-x-hidden">
        <SidebarLayout>{children}</SidebarLayout>
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
