"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Markets.module.css";

const EconomicIndicatorsPanel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-economic-indicators.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "300",
      "colorTheme": "dark",
      "isTransparent": true,
      "locale": "en",
      "indicators": [
        "USINTR",
        "USINFL",
        "USUNEM",
        "USGDP",
        "EURINTR",
        "EURINFL",
        "EURUNEM",
        "EURGDP"
      ]
    });
    containerRef.current?.appendChild(script);
    return () => { if (containerRef.current) containerRef.current.innerHTML = ""; };
  }, []);

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>Key Economic Indicators</div>
      <div ref={containerRef} className={styles.widgetContainer} />
    </div>
  );
};

export default EconomicIndicatorsPanel;
