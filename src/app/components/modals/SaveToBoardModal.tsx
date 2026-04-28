import { useState } from "react";
import { X, Search, Plus, Check } from "lucide-react";
import { useAppStore } from "../../context/AppStore";
import { toast } from "sonner";

interface Props {
  playlistIds: string[];
  onClose: () => void;
}

export default function SaveToBoardModal({ playlistIds, onClose }: Props) {
  const { boards, addPlaylistToBoard, createBoard } = useAppStore();
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = boards.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  const isSaved = (boardId: string) => saved.has(boardId) ||
    playlistIds.every((pid) => boards.find((b) => b.id === boardId)?.playlistIds.includes(pid));

  const handlePick = (boardId: string) => {
    playlistIds.forEach((pid) => addPlaylistToBoard(boardId, pid));
    setSaved((prev) => new Set([...prev, boardId]));
    const board = boards.find((b) => b.id === boardId);
    toast.success(`Added to "${board?.name}"`);
  };

  const handleCreateNew = () => {
    const name = query.trim() || "New Board";
    const board = createBoard(name);
    playlistIds.forEach((pid) => addPlaylistToBoard(board.id, pid));
    setSaved((prev) => new Set([...prev, board.id]));
    toast.success(`Created board "${board.name}" and added`);
    setQuery("");
  };

  return (
    <div className="moverlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 360, maxHeight: "78vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "18px 20px 14px", textAlign: "center", fontSize: 18, fontWeight: 700, borderBottom: "1px solid var(--border)" }}>
          Add to board
        </div>

        <div style={{ margin: "12px 16px", display: "flex", alignItems: "center", gap: 8, background: "var(--bg2)", borderRadius: 30, padding: "10px 14px" }}>
          <Search size={17} style={{ color: "var(--text2)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search boards…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "var(--text)" }}
            autoFocus
          />
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.length === 0 && !query && (
            <div style={{ padding: "24px", color: "var(--text2)", fontSize: 14, textAlign: "center" }}>
              No boards yet. Create one below.
            </div>
          )}
          {filtered.map((board) => {
            const already = isSaved(board.id);
            const covers = board.playlistIds.slice(0, 1);
            return (
              <div
                key={board.id}
                onClick={() => !already && handlePick(board.id)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: already ? "default" : "pointer", transition: "background .12s" }}
                onMouseEnter={(e) => !already && ((e.currentTarget as HTMLElement).style.background = "var(--bg2)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
              >
                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "var(--bg3)", position: "relative" }}>
                  {covers[0] && <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#43e97b,#38f9d7)" }} />}
                  {already && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                      <Check size={22} color="white" />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{board.name}</span>
              </div>
            );
          })}

          <div
            onClick={handleCreateNew}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", borderTop: "1px solid var(--border)", transition: "background .12s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg2)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
          >
            <div style={{ width: 48, height: 48, borderRadius: 8, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Plus size={22} style={{ color: "var(--text)" }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 600 }}>
              {query.trim() ? `Create "${query.trim()}"` : "Create board"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
