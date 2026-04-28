import { Outlet, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppStore } from "../../context/AppStore";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import NotificationsPanel from "./NotificationsPanel";
import SettingsPanel from "./SettingsPanel";

export type Panel = "notifications" | "settings" | null;

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  const { settings } = useAppStore();
  const navigate = useNavigate();
  const [openPanel, setOpenPanel] = useState<Panel>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  const togglePanel = (panel: Panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <div className="pfy-root" data-dark={settings.darkMode}>
      {openPanel && (
        <div
          className="panel-overlay"
          onClick={() => setOpenPanel(null)}
        />
      )}

      <Sidebar openPanel={openPanel} togglePanel={togglePanel} />

      <NotificationsPanel
        isOpen={openPanel === "notifications"}
        onClose={() => setOpenPanel(null)}
      />
      <SettingsPanel
        isOpen={openPanel === "settings"}
        onClose={() => setOpenPanel(null)}
      />

      <div className="pfy-main">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="pfy-content">
          <Outlet context={{ searchQuery }} />
        </div>
      </div>
    </div>
  );
}
