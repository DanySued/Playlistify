import { useState } from "react";
import { X, Plus, Tag } from "lucide-react";
import { useAppStore } from "../../context/AppStore";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

const LABEL_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#14b8a6", "#84cc16",
];

interface Props {
  playlistId: string;
  onClose: () => void;
}

export default function LabelModal({ playlistId, onClose }: Props) {
  const { labels, createLabel, addLabelToPlaylist, removeLabelFromPlaylist, deleteLabel } = useAppStore();
  const { playlists, setPlaylists } = useAuth();
  const playlist = playlists.find((p) => p.id === playlistId);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(LABEL_COLORS[0]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const label = createLabel(newName.trim(), newColor);
    addLabelToPlaylist(playlistId, label.id, playlists, setPlaylists);
    setNewName("");
    toast.success(`Label "${label.name}" created`);
  };

  const toggleLabel = (labelId: string) => {
    if (playlist?.labelIds.includes(labelId)) {
      removeLabelFromPlaylist(playlistId, labelId, playlists, setPlaylists);
    } else {
      addLabelToPlaylist(playlistId, labelId, playlists, setPlaylists);
    }
  };

  return (
    <div className="moverlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 360, maxHeight: "80vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-hdr">
          <span className="modal-title">Labels</span>
          <button className="btn-close-sm" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>
          {labels.length === 0 && (
            <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 16 }}>No labels yet. Create your first one below.</p>
          )}
          {labels.map((label) => {
            const active = playlist?.labelIds.includes(label.id);
            return (
              <div key={label.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  onClick={() => toggleLabel(label.id)}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                    background: active ? `${label.color}22` : "var(--bg2)",
                    border: active ? `1.5px solid ${label.color}` : "1.5px solid transparent",
                    transition: "all .15s",
                  }}
                >
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: label.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{label.name}</span>
                  {active && <span style={{ marginLeft: "auto", color: label.color, fontSize: 16 }}>✓</span>}
                </div>
                <button
                  onClick={() => deleteLabel(label.id)}
                  style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text2)", padding: "4px 8px", borderRadius: 6 }}
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)", marginBottom: 8 }}>NEW LABEL</div>
            <input
              className="fm-input"
              type="text"
              placeholder="Label name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              style={{ marginBottom: 10 }}
            />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {LABEL_COLORS.map((c) => (
                <div
                  key={c}
                  onClick={() => setNewColor(c)}
                  style={{
                    width: 24, height: 24, borderRadius: "50%", background: c,
                    cursor: "pointer", flexShrink: 0,
                    outline: newColor === c ? `2px solid ${c}` : "none",
                    outlineOffset: 2, transition: "outline .1s",
                  }}
                />
              ))}
            </div>
            <button
              className="btn-primary"
              onClick={handleCreate}
              disabled={!newName.trim()}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <Plus size={16} /> Create label
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
