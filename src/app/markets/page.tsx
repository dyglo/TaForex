import React from "react";
import styles from "./Markets.module.css";
import dynamic from "next/dynamic";

const ForexMajorsTable = dynamic(() => import("./ForexMajorsTable"), { ssr: false });
const MoversTable = dynamic(() => import("./MoversTable"), { ssr: false });
const EconomicIndicatorsPanel = dynamic(() => import("./EconomicIndicatorsPanel"), { ssr: false });
const MarketOverview = dynamic(() => import("./MarketOverview"), { ssr: false });
const Heatmap = dynamic(() => import("./Heatmap"), { ssr: false });
const News = dynamic(() => import("./News"), { ssr: false });
const EconomicCalendar = dynamic(() => import("./EconomicCalendar"), { ssr: false });

const MarketsPage: React.FC = () => {
  return (
    <div className={styles.marketsRoot}>
      <h1 className={styles.pageTitle}>Markets</h1>
      <p className={styles.pageDescription}>
        Explore live forex, indices, and commodities prices, market movers, heatmaps, news, and more. Stay informed and never miss a trading opportunity.
      </p>
      <div className={styles.marketsGrid}>
        <div>
          <ForexMajorsTable />
        </div>
        <div className={styles.marketsGridRow}>
          <div className={styles.marketsGridCol}>
            <Heatmap />
          </div>
          <div className={styles.marketsGridCol}>
            <EconomicCalendar />
          </div>
        </div>
        <MarketOverview />
        <News />
      </div>
    </div>
  );
};

export default MarketsPage;
