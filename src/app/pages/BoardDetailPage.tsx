import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Edit3, Trash2, Archive, X, SquareCheckBig, Plus, Sparkles } from "lucide-react";
import { useAppStore } from "../context/AppStore";
import { useAuth } from "../context/AuthContext";
import PlaylistCard from "../components/PlaylistCard";
import MultiSelectBar from "../components/MultiSelectBar";
import SaveToBoardModal from "../components/modals/SaveToBoardModal";
import { toast } from "sonner";
import { getGeminiSuggestion } from "../../lib/gemini";

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, updateBoard, deleteBoard, archiveBoard, removePlaylistFromBoard, selectedIds, toggleSelect, clearSelection, selectAll, settings } = useAppStore();
  const { playlists } = useAuth();

  const board = boards.find((b) => b.id === id);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(board?.name ?? "");
  const [selectionMode, setSelectionMode] = useState(false);
  const [showAddPlaylists, setShowAddPlaylists] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const boardPlaylists = useMemo(() =>
    board ? playlists.filter((p) => board.playlistIds.includes(p.id)) : [],
    [board, playlists]
  );

  if (!board) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "var(--text2)" }}>
        Board not found.{" "}
        <button className="btn-ghost" onClick={() => navigate("/boards")} style={{ marginTop: 12 }}>
          Go back
        </button>
      </div>
    );
  }

  const handleSaveRename = () => {
    if (!editName.trim()) return;
    updateBoard(board.id, { name: editName.trim() });
    setEditing(false);
    toast.success("Board renamed");
  };

  const handleDeleteBoard = () => {
    if (!window.confirm(`Delete board "${board.name}"? Playlists won't be deleted.`)) return;
    deleteBoard(board.id);
    toast.success("Board deleted");
    navigate("/boards");
  };

  const handleAiName = async () => {
    if (!settings.geminiApiKey) {
      toast.error("Add your Gemini API key in Settings");
      return;
    }
    setAiLoading(true);
    try {
      const suggestion = await getGeminiSuggestion(
        settings.geminiApiKey,
        `Suggest a creative, aesthetic board name for a music playlist collection. Max 4 words, no quotes.`
      );
      setEditName(suggestion.trim().replace(/^["']|["']$/g, ""));
    } catch {
      toast.error("AI failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleRemoveSelected = () => {
    if (!window.confirm(`Remove ${selectedIds.size} playlists from this board?`)) return;
    [...selectedIds].forEach((pid) => removePlaylistFromBoard(board.id, pid));
    clearSelection();
    toast.success("Removed from board");
  };

  return (
    <div style={{ padding: "32px 36px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }} onClick={() => navigate("/boards")}>
          <ArrowLeft size={18} /> Boards
        </button>

        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <input
              className="fm-input"
              style={{ fontSize: 24, fontWeight: 800, maxWidth: 360 }}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveRename()}
              autoFocus
            />
            <button className="ai-btn" onClick={handleAiName} disabled={aiLoading}>
              <Sparkles size={12} /> {aiLoading ? "…" : "AI"}
            </button>
            <button className="btn-primary" onClick={handleSaveRename} style={{ padding: "8px 20px" }}>Save</button>
            <button className="btn-ghost" onClick={() => setEditing(false)} style={{ padding: "8px 16px" }}>Cancel</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>{board.name}</h1>
            <button className="btn-close-sm" onClick={() => { setEditName(board.name); setEditing(true); }} title="Rename">
              <Edit3 size={16} />
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <button
            className="fbtn"
            onClick={() => setShowAddPlaylists(true)}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={14} /> Add playlists
          </button>
          {!selectionMode ? (
            <button className="fbtn" onClick={() => setSelectionMode(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <SquareCheckBig size={14} /> Select
            </button>
          ) : (
            <button className="fbtn" onClick={() => { setSelectionMode(false); clearSelection(); }} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <X size={14} /> Cancel
            </button>
          )}
          <button className="fbtn" onClick={() => { archiveBoard(board.id, !board.archived); toast.success(board.archived ? "Unarchived" : "Archived"); }} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Archive size={14} /> {board.archived ? "Unarchive" : "Archive"}
          </button>
          <button className="fbtn" style={{ color: "#ef4444" }} onClick={handleDeleteBoard}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {board.description && (
        <p style={{ fontSize: 15, color: "var(--text2)", marginBottom: 20, marginTop: -12 }}>{board.description}</p>
      )}

      {/* Empty state */}
      {boardPlaylists.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text2)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>No playlists in this board</h2>
          <p style={{ marginBottom: 20 }}>Add playlists from your library to this board.</p>
          <button
            className="btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            onClick={() => setShowAddPlaylists(true)}
          >
            <Plus size={16} /> Add playlists
          </button>
        </div>
      ) : (
        <div className="masonry">
          {boardPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              selectionMode={selectionMode}
              isSelected={selectedIds.has(playlist.id)}
              onToggleSelect={() => toggleSelect(playlist.id)}
            />
          ))}
        </div>
      )}

      {/* Selection bar for board (remove instead of delete) */}
      {selectionMode && selectedIds.size > 0 && (
        <div className="select-bar">
          <button className="btn-close-sm" onClick={() => { clearSelection(); setSelectionMode(false); }}>
            <X size={18} />
          </button>
          <span className="select-count">{selectedIds.size} selected</span>
          <button
            onClick={handleRemoveSelected}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, border: "none", background: "#fee2e2", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#dc2626" }}
          >
            <Trash2 size={16} /> Remove from board
          </button>
          <button
            onClick={() => selectAll(boardPlaylists.map((p) => p.id))}
            style={{ padding: "8px 14px", borderRadius: 20, border: "none", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--text2)" }}
          >
            Select all
          </button>
        </div>
      )}

      {showAddPlaylists && (
        <SaveToBoardModal
          playlistIds={playlists.filter((p) => !board.playlistIds.includes(p.id)).map((p) => p.id)}
          onClose={() => setShowAddPlaylists(false)}
        />
      )}
    </div>
  );
}
