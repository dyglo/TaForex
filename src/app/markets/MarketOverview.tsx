"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Markets.module.css";

const MarketOverview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      width: "100%",
      height: "400",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      plotLineColorGrowing: "#00b060",
      plotLineColorFalling: "#f23645",
      gridLineColor: "rgba(42, 46, 57, 0.5)",
      scaleFontColor: "#AAA",
      belowLineFillColorGrowing: "rgba(0, 176, 96, 0.12)",
      belowLineFillColorFalling: "rgba(242, 54, 69, 0.12)",
      symbolActiveColor: "#4bafe9",
      tabs: [
        {
          title: "Forex",
          symbols: [
            { s: "FX:EURUSD", d: "EUR/USD" },
            { s: "FX:GBPUSD", d: "GBP/USD" },
            { s: "FX:USDJPY", d: "USD/JPY" },
            { s: "FX:USDCHF", d: "USD/CHF" },
            { s: "FX:AUDUSD", d: "AUD/USD" },
            { s: "FX:USDCAD", d: "USD/CAD" }
          ],
          originalTitle: "Forex"
        },
        {
          title: "Indices",
          symbols: [
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
            { s: "FOREXCOM:DJI", d: "Dow 30" },
            { s: "INDEX:NKY", d: "Nikkei 225" },
            { s: "INDEX:DEU40", d: "DAX" }
          ],
          originalTitle: "Indices"
        },
        {
          title: "Commodities",
          symbols: [
            { s: "OANDA:XAUUSD", d: "Gold" },
            { s: "OANDA:XAGUSD", d: "Silver" },
            { s: "NYMEX:CL1!", d: "Crude Oil" },
            { s: "NYMEX:NG1!", d: "Natural Gas" }
          ],
          originalTitle: "Commodities"
        }
      ]
    });
    containerRef.current?.appendChild(script);
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>Market Overview</div>
      <div ref={containerRef} className={styles.widgetContainer} />
    </div>
  );
};

export default MarketOverview;
