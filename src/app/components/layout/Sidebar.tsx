import { useNavigate, useLocation } from "react-router";
import { Home, Play, LayoutGrid, Plus, Bell, Settings, Car, Moon, Sun } from "lucide-react";
import type { Panel } from "./AppLayout";
import { useState } from "react";
import { useAppStore } from "../../context/AppStore";
import CreateModal from "../modals/CreateModal";

interface Props {
  openPanel: Panel;
  togglePanel: (p: Panel) => void;
}

const NAV = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "discover", label: "Discover", icon: Play, path: "/discover" },
  { id: "boards", label: "Boards", icon: LayoutGrid, path: "/boards" },
  { id: "daily-drive", label: "Daily Drive", icon: Car, path: "/radio" },
];

export default function Sidebar({ openPanel, togglePanel }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { settings, updateSettings } = useAppStore();
  const [showCreate, setShowCreate] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const toggleDark = () => updateSettings({ darkMode: !settings.darkMode });

  return (
    <>
      <nav className="sb">
        {/* Music note logo — original design */}
        <div className="sb-logo" onClick={() => navigate("/")} title="Playlistify">
          <svg viewBox="0 0 32 32" width="22" height="22" fill="white">
            <path d="M21 9v9.27A3 3 0 1 1 19 16V11l-8 1.5V20a3 3 0 1 1-2-2.83V11.5L21 9z" />
          </svg>
        </div>

        {NAV.map(({ id, label, icon: Icon, path }) => (
          <div
            key={id}
            className={`sbi${isActive(path) ? " active" : ""}`}
            onClick={() => navigate(path)}
            title={label}
          >
            <Icon size={22} />
          </div>
        ))}

        <div
          className="sbi"
          onClick={() => setShowCreate(true)}
          title="Create"
        >
          <Plus size={22} />
        </div>

        <div className="sb-sp" />

        <div
          className="sbi"
          onClick={toggleDark}
          title={settings.darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </div>

        <div
          className={`sbi${openPanel === "notifications" ? " active" : ""}`}
          onClick={() => togglePanel("notifications")}
          title="Notifications"
        >
          <Bell size={22} />
        </div>

        <div
          className={`sb-gear${openPanel === "settings" ? " active" : ""}`}
          onClick={() => togglePanel("settings")}
          title="Settings"
        >
          <Settings size={22} />
        </div>
      </nav>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
