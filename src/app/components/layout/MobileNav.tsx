import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Home, Play, LayoutGrid, Car, Plus } from "lucide-react";
import CreateModal from "../modals/CreateModal";

export default function MobileNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const items = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/discover", icon: Play, label: "Discover" },
    { path: "/boards", icon: LayoutGrid, label: "Boards" },
    { path: "/radio", icon: Car, label: "Drive" },
  ];

  return (
    <>
      <nav className="mobile-nav">
        {items.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            className={`mnav-btn${pathname === path || (path !== "/" && pathname.startsWith(path)) ? " active" : ""}`}
            onClick={() => navigate(path)}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
        <button className="mnav-btn" onClick={() => setShowCreate(true)}>
          <Plus size={22} />
          <span>Create</span>
        </button>
      </nav>
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
