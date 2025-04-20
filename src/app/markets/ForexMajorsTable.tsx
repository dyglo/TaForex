"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Markets.module.css";

const ForexMajorsTable: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "420",
      "symbolsGroups": [
        {
          "name": "Majors",
          "symbols": [
            { "name": "FX:EURUSD", "displayName": "EUR/USD" },
            { "name": "FX:GBPUSD", "displayName": "GBP/USD" },
            { "name": "FX:USDJPY", "displayName": "USD/JPY" },
            { "name": "FX:USDCHF", "displayName": "USD/CHF" },
            { "name": "FX:AUDUSD", "displayName": "AUD/USD" },
            { "name": "FX:USDCAD", "displayName": "USD/CAD" },
            { "name": "FX:NZDUSD", "displayName": "NZD/USD" }
          ]
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "locale": "en",
      "showFloatingTooltip": true,
      "scalePosition": "right",
      "fontFamily": "inherit",
      "backgroundColor": "#151f32"
    });
    containerRef.current?.appendChild(script);
    return () => { if (containerRef.current) containerRef.current.innerHTML = ""; };
  }, []);

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>Forex Majors</div>
      <div ref={containerRef} className={styles.widgetContainer} />
    </div>
  );
};

export default ForexMajorsTable;
