import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  ChartNoAxesCombined,
  LogOut,
  UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

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

        <div className="sidebar-bottom-text">
          <strong>Finance Tracker</strong>
          <p>Управляй своими финансами</p>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          <UserRound size={18} />
        </div>

        <div className="sidebar-user-info">
          <strong>{user?.username || "Пользователь"}</strong>
          <span>{user?.email || "Мой аккаунт"}</span>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={handleLogout}
          title="Выйти"
          aria-label="Выйти из аккаунта"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
