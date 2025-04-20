"use client";
import { ReactNode } from "react";
import NavBar from "../components/ui/tubelight-navbar";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/ui/theme-provider";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  // Hide footer on /settings
  const showFooter = pathname !== "/settings";
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Show NavBar except on /login and /signup */}
      {!(pathname.startsWith("/login") || pathname.startsWith("/signup")) && (
        <NavBar />
      )}
      <main className="w-full max-w-screen-lg mx-auto px-2 sm:px-4 md:px-8 pt-16 sm:pt-28 pb-20 sm:pb-0 py-4">
        {children}
      </main>
      {showFooter && <Footer />}
    </ThemeProvider>
  );
}
