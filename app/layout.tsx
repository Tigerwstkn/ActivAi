import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppBackground } from "@/components/ui/AppBackground";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { StoreHydration } from "@/components/StoreHydration";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ACTIVAI — Your AI Coach. Your Fitness Ally.",
  description:
    "ACTIVAI is a next-gen fitness ecosystem: an AI coach, real-time social competition, and a global community that keep you moving.",
};

export const viewport: Viewport = {
  themeColor: "#0A0E1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">
        <AppBackground />
        <StoreHydration />
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />
            <main className="flex-1 px-6 pb-12 pt-4 md:px-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
