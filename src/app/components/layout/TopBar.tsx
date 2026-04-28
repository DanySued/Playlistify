import { Search, RefreshCw, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CreateModal from "../modals/CreateModal";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function TopBar({ searchQuery, onSearchChange }: Props) {
  const { user, refreshPlaylists, isLoadingPlaylists } = useAuth();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <header className="tb">
        <div className="search">
          <Search size={18} className="text-[var(--text2)]" />
          <input
            type="text"
            placeholder="Search playlists, boards, labels…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="tb-r">
          <button
            className="btn-cr"
            onClick={() => setShowCreate(true)}
          >
            Create
          </button>
          <button
            className="icon-btn"
            onClick={refreshPlaylists}
            title="Sync Spotify"
            disabled={isLoadingPlaylists}
          >
            <RefreshCw
              size={18}
              className={isLoadingPlaylists ? "animate-spin" : ""}
            />
          </button>
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.name}
              className="avatar"
              onClick={() => {}}
            />
          ) : (
            <div className="avatar" title={user?.name}>
              {user?.initials ?? "?"}
            </div>
          )}
        </div>
      </header>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
