import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppStore } from "../../context/AppStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getGeminiSuggestion } from "../../../lib/gemini";

type Tab = "board" | "playlist";

interface Props {
  onClose: () => void;
}

export default function CreateModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>("board");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSecret, setIsSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const { createPlaylist } = useAuth();
  const { createBoard, settings } = useAppStore();
  const navigate = useNavigate();

  const canCreate = name.trim().length > 0;

  const handleAiSuggest = async () => {
    if (!settings.geminiApiKey) {
      toast.error("Add your Gemini API key in Settings to use AI suggestions");
      return;
    }
    setAiLoading(true);
    try {
      const prompt = tab === "board"
        ? `Suggest a creative, aesthetic board name for organizing Spotify playlists. Just the name, no quotes, max 4 words.`
        : `Suggest a creative playlist name for music lovers. Just the name, no quotes, max 4 words.`;
      const suggestion = await getGeminiSuggestion(settings.geminiApiKey, prompt);
      setName(suggestion.trim().replace(/^["']|["']$/g, ""));
    } catch {
      toast.error("AI suggestion failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!canCreate) return;
    setLoading(true);
    try {
      if (tab === "board") {
        const board = createBoard(name, description, isSecret);
        toast.success(`Board "${board.name}" created`);
        navigate(`/boards/${board.id}`);
      } else {
        const playlist = await createPlaylist(name, description, isPublic);
        toast.success(`Playlist "${playlist.name}" created on Spotify`);
        navigate(`/playlist/${playlist.id}`);
      }
      onClose();
    } catch {
      toast.error("Failed to create. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="moverlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 480, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-hdr">
          <span className="modal-title">Create</span>
          <button className="btn-close-sm" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          {(["board", "playlist"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "12px 0", border: "none", cursor: "pointer",
                background: "transparent", fontSize: 15, fontWeight: 600,
                color: tab === t ? "var(--text)" : "var(--text2)",
                borderBottom: tab === t ? "2px solid var(--text)" : "2px solid transparent",
                marginBottom: -1, transition: "all .15s",
              }}
            >
              {t === "board" ? "Board" : "Playlist"}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {/* Board preview */}
          {tab === "board" && (
            <div style={{ width: 120, height: 100, margin: "0 auto 16px", borderRadius: 12, display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2, overflow: "hidden", background: "var(--bg3)" }}>
              <div style={{ gridRow: "1/3", background: "var(--bg2)" }} />
              <div style={{ background: "var(--bg2)" }} />
              <div style={{ background: "var(--bg2)" }} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label className="fm-label" style={{ marginBottom: 0 }}>Name</label>
              <button className="ai-btn" onClick={handleAiSuggest} disabled={aiLoading}>
                <Sparkles size={12} />
                {aiLoading ? "…" : "AI suggest"}
              </button>
            </div>
            <input
              className="fm-input"
              type="text"
              placeholder={tab === "board" ? "Give your board a name" : "Playlist name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="fm-label">Description (optional)</label>
            <textarea
              className="fm-input"
              rows={3}
              placeholder="What's this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {tab === "board" && (
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Keep this board secret</div>
                <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>Only you will see this board</div>
              </div>
              <button className={`tog${isSecret ? " on" : ""}`} onClick={() => setIsSecret(!isSecret)} />
            </div>
          )}

          {tab === "playlist" && (
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Public playlist</div>
                <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>Visible to everyone on Spotify</div>
              </div>
              <button className={`tog${isPublic ? " on" : ""}`} onClick={() => setIsPublic(!isPublic)} />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={handleCreate}
            disabled={!canCreate || loading}
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
