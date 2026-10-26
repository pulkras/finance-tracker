import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  ChartNoAxesCombined,
} from "lucide-react";

const navigation = [
  {
    to: "/",
    label: "Обзор",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/transactions",
    label: "Операции",
    icon: ArrowLeftRight,
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Wallet size={23} />
        </div>

        <div>
          <h1>Finance</h1>
          <span>Личный бюджет</span>
        </div>
      </div>

      <div className="sidebar-section-title">МЕНЮ</div>

      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-bottom-icon">
          <ChartNoAxesCombined size={20} />
        </div>

        <div>
          <strong>Finance Tracker</strong>
          <p>Управляй своими финансами</p>
        </div>
      </div>
    </aside>
  );
}
