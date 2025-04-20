"use client";
import React, { useState } from "react";
import Link from "next/link";
import { X, Menu, LayoutDashboard, Pen, BarChart, PieChart, LineChart, Settings as SettingsIcon } from "lucide-react";

const navItems = [
  { name: "Dashboard", url: "/", icon: LayoutDashboard },
  { name: "Journal", url: "/journal", icon: Pen },
  { name: "Trades", url: "/trades", icon: BarChart },
  { name: "Analytics", url: "/analytics", icon: PieChart },
  { name: "Markets", url: "/markets", icon: LineChart },
  { name: "Settings", url: "/settings", icon: SettingsIcon },
];

import styles from "./mobile-nav-drawer.module.css";

export default function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Hamburger Icon */}
      <button
        className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
      >
        <Menu size={28} />
      </button>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-200"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"} drawer`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold">Menu</span>
          <button
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <ul className="flex flex-col gap-2 mt-4 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.url}
                  className="flex items-center gap-3 py-3 px-2 rounded-lg text-base font-medium text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
