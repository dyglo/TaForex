import {
  LayoutDashboard,
  NotebookPen,
  BarChart,
  PieChart,
  LineChart,
  Settings as SettingsIcon,
} from "lucide-react";
import NavBar from './tubelight-navbar';

export function NavBarDemo() {
  const navItems = [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { name: "Journal", url: "/journal", icon: NotebookPen },
    { name: "Trades", url: "/trades", icon: BarChart },
    { name: "Analytics", url: "/analytics", icon: PieChart },
    { name: "Markets", url: "/markets", icon: LineChart },
    { name: "Settings", url: "/settings", icon: SettingsIcon },
  ];

  return <NavBar items={navItems} />;
}
