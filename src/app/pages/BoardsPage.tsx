import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Sparkles } from "lucide-react";
import { useAppStore } from "../context/AppStore";
import { useAuth } from "../context/AuthContext";
import CreateModal from "../components/modals/CreateModal";

const GRADIENTS = [
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#ffecd2,#fcb69f)",
  "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
  "linear-gradient(135deg,#11998e,#38ef7d)",
];

function getBoardGradients(boardId: string) {
  let hash = 0;
  for (let i = 0; i < boardId.length; i++) hash = boardId.charCodeAt(i) + ((hash << 5) - hash);
  const base = Math.abs(hash) % GRADIENTS.length;
  return [
    GRADIENTS[base % GRADIENTS.length],
    GRADIENTS[(base + 1) % GRADIENTS.length],
    GRADIENTS[(base + 2) % GRADIENTS.length],
  ];
}

export default function BoardsPage() {
  const navigate = useNavigate();
  const { boards, deleteBoard, archiveBoard } = useAppStore();
  const { playlists } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState<"boards" | "archived">("boards");

  const active = boards.filter((b) => !b.archived);
  const archived = boards.filter((b) => b.archived);

  const getBoardCoverImages = (board: typeof boards[0]) => {
    const covers = board.playlistIds
      .slice(0, 3)
      .map((pid) => playlists.find((p) => p.id === pid)?.imageUrl)
      .filter(Boolean) as string[];
    return covers;
  };

  const BoardCard = ({ board }: { board: typeof boards[0] }) => {
    const covers = getBoardCoverImages(board);
    const gradients = getBoardGradients(board.id);

    return (
      <div className="board-card" onClick={() => navigate(`/boards/${board.id}`)}>
        <div className="board-thumb">
          {/* Main (left, full height) */}
          <div className="bt-main" style={{ overflow: "hidden" }}>
            {covers[0] ? (
              <img src={covers[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: gradients[0] }} />
            )}
          </div>
          {/* Top right */}
          <div style={{ overflow: "hidden" }}>
            {covers[1] ? (
              <img src={covers[1]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: gradients[1] }} />
            )}
          </div>
          {/* Bottom right */}
          <div style={{ overflow: "hidden" }}>
            {covers[2] ? (
              <img src={covers[2]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: gradients[2] }} />
            )}
          </div>
        </div>
        <div className="board-info">
          <div className="board-name">{board.name}</div>
          <div className="board-meta">
            {board.playlistIds.length} playlist{board.playlistIds.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "32px 36px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Your boards</h1>
          <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 4 }}>
            Organize your playlists by mood, style, or occasion
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
          onClick={() => setShowCreate(true)}
        >
          <Plus size={18} /> Create board
        </button>
      </div>

      {/* Tabs */}
      <div className="boards-tabs">
        <div className={`b-tab${activeTab === "boards" ? " active" : ""}`} onClick={() => setActiveTab("boards")}>
          Boards ({active.length})
        </div>
        <div className={`b-tab${activeTab === "archived" ? " active" : ""}`} onClick={() => setActiveTab("archived")}>
          Archived ({archived.length})
        </div>
      </div>

      {/* Active boards */}
      {activeTab === "boards" && (
        <>
          {active.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text2)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🗂️</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>No boards yet</h2>
              <p style={{ fontSize: 15, marginBottom: 20 }}>Create your first board to start organizing your playlists.</p>
              <button
                className="btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                onClick={() => setShowCreate(true)}
              >
                <Plus size={18} /> Create your first board
              </button>
            </div>
          ) : (
            <div className="boards-grid">
              {active.map((board) => <BoardCard key={board.id} board={board} />)}

              {/* Create card */}
              <div onClick={() => setShowCreate(true)}>
                <div className="create-card-thumb">
                  <Plus size={32} />
                </div>
                <div className="board-info">
                  <div className="board-name" style={{ color: "var(--text2)" }}>Create board</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Archived boards */}
      {activeTab === "archived" && (
        <>
          {archived.length === 0 ? (
            <p style={{ color: "var(--text2)", fontSize: 15, padding: "20px 0" }}>No archived boards.</p>
          ) : (
            <div className="boards-grid">
              {archived.map((board) => (
                <div key={board.id} style={{ position: "relative" }}>
                  <BoardCard board={board} />
                  <button
                    onClick={(e) => { e.stopPropagation(); archiveBoard(board.id, false); }}
                    style={{ position: "absolute", top: 8, right: 8, padding: "4px 10px", borderRadius: 20, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 12, cursor: "pointer" }}
                  >
                    Unarchive
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
