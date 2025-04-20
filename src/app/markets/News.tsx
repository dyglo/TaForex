"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Markets.module.css";

const News: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "market",
      "market": "forex",
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "regular",
      "width": "100%",
      "height": "400",
      "locale": "en"
    });
    containerRef.current?.appendChild(script);
    return () => { if (containerRef.current) containerRef.current.innerHTML = ""; };
  }, []);

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>Market News</div>
      <div ref={containerRef} className={styles.widgetContainer} />
    </div>
  );
};

export default News;
