"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pen, BarChart, PieChart, LineChart, Settings as SettingsIcon } from "lucide-react";
import TFXLogo from "../TFXLogo";
import MobileNavDrawer from "./MobileNavDrawer";

const navItems = [
  { name: "Dashboard", url: "/", icon: LayoutDashboard },
  { name: "Journal", url: "/journal", icon: Pen },
  { name: "Trades", url: "/trades", icon: BarChart },
  { name: "Analytics", url: "/analytics", icon: PieChart },
  { name: "Markets", url: "/markets", icon: LineChart },
];

import { SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-transparent flex justify-center sm:mb-6">
      <div className="w-full max-w-screen-lg flex items-center justify-between px-2 sm:px-4 md:px-8 py-2 mt-2">
        {/* Logo on the left */}
        <div className="flex-shrink-0 flex items-center">
          <TFXLogo width={120} height={40} className="h-10 w-auto" />
        </div>
        {/* Desktop menu on the right */}
        <ul className="hidden sm:flex items-center gap-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;
            return (
              <li key={item.name}>
                <Link
                  href={item.url}
                  className={`relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors
                    text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400
                    ${isActive ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : ""}`}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={20} />
                  </span>
                </Link>
              </li>
            );
          })}
          {/* Auth section: Sign up or User avatar */}
          <li>
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>

              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </li>
        </ul>
        {/* Mobile hamburger menu and auth at top right */}
        <div className="sm:hidden flex items-center ml-auto gap-2">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                Sign up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <MobileNavDrawer />
        </div>
      </div>
    </nav>
  );
}
