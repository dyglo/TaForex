"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Markets.module.css";

const MoversTable: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-movers.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "420",
      "market": "forex",
      "colorTheme": "dark",
      "isTransparent": true,
      "locale": "en"
    });
    containerRef.current?.appendChild(script);
    return () => { if (containerRef.current) containerRef.current.innerHTML = ""; };
  }, []);

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>Forex Movers</div>
      <div ref={containerRef} className={styles.widgetContainer} />
    </div>
  );
};

export default MoversTable;
