"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Mail,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  ArrowUp,
  Sun,
  Moon,
  Heart,
  BarChart2,
} from "lucide-react";

function handleScrollTop() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

const navigation = [
  {
    title: "App",
    links: [
      { name: "Dashboard", href: "/" },
      { name: "Journal", href: "/journal" },
      { name: "Trades", href: "/trades" },
      { name: "Analytics", href: "/analytics" },
      { name: "Markets", href: "/markets" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "About", href: "/about" },
      { name: "Docs", href: "/docs" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "Contact", href: "/contact" },
      { name: "Terms", href: "/terms" },
      { name: "Privacy", href: "/privacy" },
    ],
  },
];

const socialLinks = [
  {
    href: "mailto:support@tradingjournal.com",
    label: "Email",
    icon: Mail,
  },
  {
    href: "https://github.com/your-org",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://linkedin.com/company/your-org",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://facebook.com/your-org",
    label: "Facebook",
    icon: Facebook,
  },
  {
    href: "https://instagram.com/your-org",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://twitter.com/your-org",
    label: "Twitter",
    icon: Twitter,
  },
];

export default function Footer() {
  const { setTheme, theme } = useTheme();

  return (
    <footer className="border-t border-dotted border-neutral-800 bg-background text-muted-foreground px-2 py-10 mt-8 w-full">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        {/* App Mission/Description */}
        <div className="flex flex-col items-center text-center gap-2 px-2">
          <span className="flex items-center gap-2 text-lg font-bold text-primary">
            <BarChart2 className="w-7 h-7 text-accent" />
            Trading Journal
          </span>
          <p className="max-w-2xl text-xs text-muted-foreground">
            Empowering traders to analyze, reflect, and grow. Track your trades, review performance, and stay ahead with real-time market insights. Your trading journey, organized and optimized.
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left">
          {navigation.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 font-semibold text-primary">{section.title}</h4>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Theme Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 border border-dotted rounded-full px-3 py-1">
            <button
              onClick={() => setTheme("light")}
              className={`p-2 rounded-full ${theme === "light" ? "bg-accent text-background" : ""}`}
            >
              <Sun className="h-5 w-5" />
              <span className="sr-only">Light mode</span>
            </button>
            <button type="button" onClick={handleScrollTop} className="p-2 rounded-full hover:bg-accent/10">
              <ArrowUp className="h-4 w-4" />
              <span className="sr-only">Scroll to top</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-2 rounded-full ${theme === "dark" ? "bg-accent text-background" : ""}`}
            >
              <Moon className="h-5 w-5" />
              <span className="sr-only">Dark mode</span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            &copy; 2025 Made by <span className="font-bold mx-1">Tafar</span>, a fellow trader for your Trading journey
          </div>
        </div>
      </div>
    </footer>
  );
}
