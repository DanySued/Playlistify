import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MoreHorizontal, Edit3, Trash2, Copy, BookmarkPlus,
  Tag, Music, Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAppStore } from "../context/AppStore";
import { toast } from "sonner";
import SaveToBoardModal from "./modals/SaveToBoardModal";
import EditPlaylistModal from "./modals/EditPlaylistModal";
import LabelModal from "./modals/LabelModal";
import type { Playlist } from "../../types";

const GRADIENTS = [
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#ffecd2,#fcb69f)",
  "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
  "linear-gradient(135deg,#d4fc79,#96e6a1)",
  "linear-gradient(135deg,#f6d365,#fda085)",
  "linear-gradient(135deg,#11998e,#38ef7d)",
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#30cfd0,#667eea)",
];

const HEIGHTS = [220, 280, 190, 320, 250, 210, 300, 260, 180, 240, 200, 270];

function stableNum(id: string, arr: unknown[]) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % arr.length;
}

function getGradient(id: string) { return GRADIENTS[stableNum(id, GRADIENTS)]; }
function getHeight(id: string) { return HEIGHTS[stableNum(id, HEIGHTS)]; }

interface Props {
  playlist: Playlist;
  selectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDeleted?: () => void;
}

export default function PlaylistCard({ playlist, selectionMode, isSelected, onToggleSelect, onDeleted }: Props) {
  const navigate = useNavigate();
  const { deletePlaylist, duplicatePlaylist } = useAuth();
  const { labels } = useAppStore();
  const [showCtx, setShowCtx] = useState(false);
  const [ctxPos, setCtxPos] = useState({ x: 0, y: 0 });
  const [modal, setModal] = useState<"save" | "edit" | "label" | null>(null);
  const [deleting, setDeleting] = useState(false);
  const ctxRef = useRef<HTMLDivElement>(null);

  const height = getHeight(playlist.id);
  const gradient = getGradient(playlist.id);
  const myLabels = labels.filter((l) => playlist.labelIds.includes(l.id));

  useEffect(() => {
    if (!showCtx) return;
    const handle = (e: MouseEvent) => {
      if (!ctxRef.current?.contains(e.target as Node)) setShowCtx(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showCtx]);

  const openCtx = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = e.clientX;
    let y = e.clientY;
    if (x + 210 > vw) x = vw - 215;
    if (y + 280 > vh) y = vh - 285;
    setCtxPos({ x, y });
    setShowCtx(true);
  };

  const handleDelete = async () => {
    setShowCtx(false);
    if (!window.confirm(`Delete "${playlist.name}"? This removes it from Spotify.`)) return;
    setDeleting(true);
    try {
      await deletePlaylist(playlist.id);
      toast.success(`"${playlist.name}" deleted`);
      onDeleted?.();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    setShowCtx(false);
    toast.loading("Duplicating…", { id: "dup" });
    try {
      await duplicatePlaylist(playlist.id);
      toast.success("Playlist duplicated!", { id: "dup" });
    } catch {
      toast.error("Failed to duplicate", { id: "dup" });
    }
  };

  const handleCardClick = () => {
    if (selectionMode) { onToggleSelect(); return; }
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <>
      <div
        className={`pin${isSelected ? " pin-selected" : ""}${deleting ? " opacity-50 pointer-events-none" : ""}`}
        onClick={handleCardClick}
      >
        {selectionMode && (
          <div
            className={`pin-check${isSelected ? " checked" : ""}`}
            onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
          >
            {isSelected && <Check size={14} color="white" />}
          </div>
        )}

        {playlist.imageUrl ? (
          <img
            src={playlist.imageUrl}
            alt={playlist.name}
            className="pin-img"
            style={{ height }}
            loading="lazy"
          />
        ) : (
          <div className="pin-grad" style={{ height, background: gradient }} />
        )}

        {!selectionMode && (
          <div className="pin-ov">
            <button
              className="btn-save"
              onClick={(e) => { e.stopPropagation(); setModal("save"); }}
            >
              Add to board
            </button>
          </div>
        )}

        {!selectionMode && (
          <button className="pin-more-btn" onClick={openCtx}>
            <MoreHorizontal size={16} />
          </button>
        )}

        <div className="pin-info">
          <div className="pin-name">{playlist.name}</div>
          {playlist.totalTracks !== undefined && (
            <div className="pin-meta" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Music size={11} /> {playlist.totalTracks} tracks
            </div>
          )}
          {myLabels.length > 0 && (
            <div className="pin-labels">
              {myLabels.slice(0, 3).map((l) => (
                <span key={l.id} className="label-chip" style={{ background: `${l.color}22`, color: l.color }}>
                  {l.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCtx && (
        <div ref={ctxRef} className="ctx-menu" style={{ top: ctxPos.y, left: ctxPos.x }}>
          <div className="ctx-it" onClick={() => { setShowCtx(false); setModal("save"); }}>
            <BookmarkPlus size={18} /> Add to board
          </div>
          <div className="ctx-it" onClick={() => { setShowCtx(false); setModal("edit"); }}>
            <Edit3 size={18} /> Edit playlist
          </div>
          <div className="ctx-it" onClick={() => { setShowCtx(false); setModal("label"); }}>
            <Tag size={18} /> Manage labels
          </div>
          <div className="ctx-sep" />
          <div className="ctx-it" onClick={handleDuplicate}>
            <Copy size={18} /> Duplicate
          </div>
          <div className="ctx-sep" />
          <div className="ctx-it danger" onClick={handleDelete}>
            <Trash2 size={18} /> Delete playlist
          </div>
        </div>
      )}

      {modal === "save" && (
        <SaveToBoardModal playlistIds={[playlist.id]} onClose={() => setModal(null)} />
      )}
      {modal === "edit" && (
        <EditPlaylistModal playlist={playlist} onClose={() => setModal(null)} />
      )}
      {modal === "label" && (
        <LabelModal playlistId={playlist.id} onClose={() => setModal(null)} />
      )}
    </>
  );
}
