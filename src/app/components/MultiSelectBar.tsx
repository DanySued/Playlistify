import { Trash2, BookmarkPlus, X, Music2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppStore } from "../context/AppStore";
import { toast } from "sonner";
import SaveToBoardModal from "./modals/SaveToBoardModal";

interface Props {
  selectedIds: string[];
  onClear: () => void;
  onSelectAll: () => void;
  totalCount: number;
}

export default function MultiSelectBar({ selectedIds, onClear, onSelectAll, totalCount }: Props) {
  const { deleteMultiplePlaylists } = useAuth();
  const [showSave, setShowSave] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleDeleteAll = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} playlists from Spotify? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteMultiplePlaylists(selectedIds);
      toast.success(`${selectedIds.length} playlists deleted`);
      onClear();
    } catch {
      toast.error("Failed to delete some playlists");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="select-bar">
        <button className="btn-close-sm" onClick={onClear} title="Clear selection">
          <X size={18} />
        </button>
        <span className="select-count">{selectedIds.length} selected</span>

        <button
          onClick={() => setShowSave(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, border: "none", background: "var(--bg3)", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--text)" }}
        >
          <BookmarkPlus size={16} /> Add to board
        </button>

        <button
          onClick={handleDeleteAll}
          disabled={deleting}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, border: "none", background: "#fee2e2", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#dc2626" }}
        >
          <Trash2 size={16} /> {deleting ? "Deleting…" : "Delete all"}
        </button>

        <button
          onClick={onSelectAll}
          style={{ padding: "8px 14px", borderRadius: 20, border: "none", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--text2)" }}
        >
          Select all ({totalCount})
        </button>
      </div>

      {showSave && (
        <SaveToBoardModal playlistIds={selectedIds} onClose={() => setShowSave(false)} />
      )}
    </>
  );
}
