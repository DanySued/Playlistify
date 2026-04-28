import { useNavigate, useLocation } from "react-router";
import { Home, Play, LayoutGrid, Plus, Bell, Settings, Radio } from "lucide-react";
import type { Panel } from "./AppLayout";
import { useState } from "react";
import CreateModal from "../modals/CreateModal";

interface Props {
  openPanel: Panel;
  togglePanel: (p: Panel) => void;
}

const NAV = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "discover", label: "Discover", icon: Play, path: "/discover" },
  { id: "boards", label: "Boards", icon: LayoutGrid, path: "/boards" },
  { id: "radio", label: "Radio", icon: Radio, path: "/radio" },
];

export default function Sidebar({ openPanel, togglePanel }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showCreate, setShowCreate] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <>
      <nav className="sb">
        <div className="sb-logo" onClick={() => navigate("/")} title="Playlistify">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
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
