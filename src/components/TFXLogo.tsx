"use client";

import { useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  darkMode?: boolean;
}

export default function TFXLogo({ width = 200, height = 80, className = "", darkMode = false }: LogoProps) {
  const [hovered, setHovered] = useState(false);

  // Primary colors - conditional based on dark mode
  const primaryColor = darkMode ? "#4D9FFF" : "#0066CC";
  const secondaryColor = darkMode ? "#00D7FF" : "#00A3E0";
  const accentColor = darkMode ? "#00FFCC" : "#00CC99";
  const bgOpacity = darkMode ? "0.2" : "0.1";
  const textColor = darkMode ? "#FFFFFF" : primaryColor;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-labelledby="tfx-logo-title"
      role="img"
    >
      <title id="tfx-logo-title">TaForex TFX Logo</title>

      {/* Background shape */}
      <rect
        x="10"
        y="15"
        width="180"
        height="50"
        rx="8"
        fill={hovered ? secondaryColor : primaryColor}
        fillOpacity={bgOpacity}
        stroke={hovered ? secondaryColor : primaryColor}
        strokeWidth="2"
        className="transition-all duration-300"
      />

      {darkMode && (
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      )}

      {/* Apply the filter to the paths if in dark mode */}
      <g filter={darkMode ? "url(#glow)" : ""}>
        {/* T */}
        <path
          d="M40 25 H70 V30 H60 V55 H50 V30 H40 V25 Z"
          fill={hovered ? secondaryColor : primaryColor}
          className="transition-colors duration-300"
        />

        {/* F */}
        <path
          d="M80 25 H110 V30 H90 V35 H105 V40 H90 V55 H80 V25 Z"
          fill={hovered ? secondaryColor : primaryColor}
          className="transition-colors duration-300"
        />

        {/* X */}
        <path
          d="M120 25 L130 25 L140 40 L150 25 L160 25 L145 45 L160 55 L150 55 L140 45 L130 55 L120 55 L135 40 L120 25 Z"
          fill={hovered ? accentColor : secondaryColor}
          className="transition-colors duration-300"
        />
      </g>

      {/* Tagline */}
      <text
        x="100"
        y="70"
        fontSize="10"
        textAnchor="middle"
        fill={textColor}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        TAFOREX
      </text>

      {/* Dynamic graph line */}
      <path
        d="M30 50 Q50 35, 70 45 T110 40 T150 45 T170 35"
        fill="none"
        stroke={accentColor}
        strokeWidth="2"
        strokeDasharray={hovered ? "0" : "2,2"}
        className="transition-all duration-300"
      />
    </svg>
  );
}
