import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Music, ExternalLink, Edit3, Trash2, Copy, BookmarkPlus, Loader2, Trash, Check, GripVertical } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { useAuth } from "../context/AuthContext";
import { useAppStore } from "../context/AppStore";
import { getSpotifyPlaylistTracks, removeTracksFromPlaylist, reorderPlaylistTrack } from "../../lib/spotify";
import { toast } from "sonner";
import EditPlaylistModal from "../components/modals/EditPlaylistModal";
import SaveToBoardModal from "../components/modals/SaveToBoardModal";
import type { Track, Playlist } from "../../types";

function formatDuration(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface TrackRowProps {
  track: Track;
  index: number;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  selected: boolean;
  onToggle: () => void;
  isOwner: boolean;
  playlistId: string;
  accessToken: string | null;
}

function TrackRow({ track, index, tracks, setTracks, selected, onToggle, isOwner, playlistId, accessToken }: TrackRowProps) {
  const [, dragRef] = useDrag({
    type: "TRACK",
    item: { index },
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: "TRACK",
    drop: async (item: { index: number }) => {
      if (item.index === index) return;
      const newTracks = [...tracks];
      newTracks.splice(index, 0, newTracks.splice(item.index, 1)[0]);
      setTracks(newTracks);
      const insertBefore = index > item.index ? index + 1 : index;
      try {
        await reorderPlaylistTrack(accessToken!, playlistId, item.index, insertBefore);
      } catch {
        toast.error("Failed to save track order");
        setTracks(tracks);
      }
    },
    collect: (m) => ({ isOver: m.isOver() }),
  });

  const rowRef = useCallback((node: HTMLDivElement | null) => {
    dragRef(node); dropRef(node);
  }, [dragRef, dropRef]);

  return (
    <div
      ref={rowRef}
      className="track-row"
      style={{
        background: selected ? "var(--bg2)" : isOver ? "var(--bg3)" : "",
        cursor: isOwner ? "grab" : "default",
      }}
      onClick={onToggle}
    >
      {selected ? (
        <div style={{ width: 20, display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <Check size={16} color="var(--gr)" />
        </div>
      ) : isOwner ? (
        <div style={{ width: 20, display: "flex", justifyContent: "center", flexShrink: 0, color: "var(--text2)" }}>
          <GripVertical size={16} />
        </div>
      ) : (
        <span className="track-num">{index + 1}</span>
      )}
      {track.albumImageUrl ? (
        <img src={track.albumImageUrl} alt="" className="track-art" />
      ) : (
        <div className="track-art" />
      )}
      <div className="track-info">
        <div className="track-name" style={{ color: selected ? "var(--gr)" : "var(--text)" }}>{track.name}</div>
        <div className="track-artist">{track.artist}</div>
      </div>
      <span className="track-dur">{formatDuration(track.durationMs)}</span>
    </div>
  );
}

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playlists, setPlaylists, accessToken, deletePlaylist, duplicatePlaylist, user, logout } = useAuth();
  const { settings } = useAppStore();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<"edit" | "save" | null>(null);
  const [removingTracks, setRemovingTracks] = useState(false);

  const playlist = playlists.find((p) => p.id === id) as Playlist | undefined;

  useEffect(() => {
    if (!id || !accessToken) return;
    const expiresAt = Number(localStorage.getItem("spotify_expires_at") ?? 0);
    if (expiresAt && expiresAt < Date.now()) return;
    setLoadingTracks(true);
    getSpotifyPlaylistTracks(accessToken, id)
      .then((raw) => {
        setTracks(
          raw
            .filter((t) => t.track && !t.track.is_local)
            .map((t) => ({
              id: t.track!.id,
              uri: t.track!.uri,
              name: t.track!.name,
              artist: t.track!.artists.map((a) => a.name).join(", "),
              album: t.track!.album.name,
              albumImageUrl: t.track!.album.images?.[0]?.url ?? "",
              durationMs: t.track!.duration_ms,
              previewUrl: t.track!.preview_url ?? undefined,
            }))
        );
      })
      .catch((err: Error) => {
        if (err.message === "Spotify 403") {
          logout();
          navigate("/login");
        } else {
          toast.error("Failed to load tracks");
        }
      })
      .finally(() => setLoadingTracks(false));
  }, [id, accessToken]);

  if (!playlist) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "var(--text2)" }}>
        Playlist not found.{" "}
        <button className="btn-ghost" onClick={() => navigate("/")} style={{ marginTop: 12 }}>Go home</button>
      </div>
    );
  }

  const toggleTrack = (uri: string) => {
    setSelectedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(uri)) next.delete(uri);
      else next.add(uri);
      return next;
    });
  };

  const handleRemoveTracks = async () => {
    if (!accessToken || selectedTracks.size === 0) return;
    if (!window.confirm(`Remove ${selectedTracks.size} tracks from "${playlist.name}"?`)) return;
    setRemovingTracks(true);
    try {
      await removeTracksFromPlaylist(accessToken, playlist.id, [...selectedTracks]);
      setTracks((prev) => prev.filter((t) => !selectedTracks.has(t.uri)));
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlist.id
            ? { ...p, totalTracks: Math.max(0, (p.totalTracks ?? 0) - selectedTracks.size) }
            : p
        )
      );
      setSelectedTracks(new Set());
      toast.success(`${selectedTracks.size} tracks removed`);
    } catch {
      toast.error("Failed to remove tracks");
    } finally {
      setRemovingTracks(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${playlist.name}" from Spotify?`)) return;
    await deletePlaylist(playlist.id);
    toast.success("Playlist deleted");
    navigate("/");
  };

  const handleDuplicate = async () => {
    toast.loading("Duplicating…", { id: "dup" });
    try {
      const copy = await duplicatePlaylist(playlist.id);
      toast.success("Duplicated!", { id: "dup" });
      navigate(`/playlist/${copy.id}`);
    } catch {
      toast.error("Failed to duplicate", { id: "dup" });
    }
  };

  const gradient = (() => {
    let hash = 0;
    for (let i = 0; i < playlist.id.length; i++) hash = playlist.id.charCodeAt(i) + ((hash << 5) - hash);
    const GRADS = ["linear-gradient(135deg,#f093fb,#f5576c)", "linear-gradient(135deg,#43e97b,#38f9d7)", "linear-gradient(135deg,#667eea,#764ba2)"];
    return GRADS[Math.abs(hash) % GRADS.length];
  })();

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960, margin: "0 auto" }}>
      {/* Back */}
      <button
        className="btn-ghost"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24, padding: "10px 16px" }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Hero */}
      <div style={{ display: "flex", gap: 28, marginBottom: 32, flexWrap: "wrap" }}>
        <div style={{ width: 180, height: 180, borderRadius: 16, overflow: "hidden", flexShrink: 0, background: "var(--bg3)" }}>
          {playlist.imageUrl ? (
            <img src={playlist.imageUrl} alt={playlist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: gradient }} />
          )}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--text2)", letterSpacing: ".5px" }}>Playlist</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1 }}>{playlist.name}</h1>
          {playlist.description && (
            <p style={{ fontSize: 14, color: "var(--text2)", maxWidth: 500 }}>{playlist.description}</p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text2)" }}>
            <Music size={14} />
            <span>{tracks.length || playlist.totalTracks || "?"} tracks</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px" }} onClick={() => setModal("edit")}>
              <Edit3 size={16} /> Edit
            </button>
            <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px" }} onClick={() => setModal("save")}>
              <BookmarkPlus size={16} /> Add to board
            </button>
            <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px" }} onClick={handleDuplicate}>
              <Copy size={16} /> Duplicate
            </button>
            {playlist.spotifyUrl && (
              <a href={playlist.spotifyUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", textDecoration: "none", color: "var(--text)" }}>
                <ExternalLink size={16} /> Open in Spotify
              </a>
            )}
            <button className="btn-danger" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px" }} onClick={handleDelete}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Track controls */}
      {tracks.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Tracks</div>
          <div style={{ display: "flex", gap: 8 }}>
            {selectedTracks.size > 0 && (
              <button
                onClick={handleRemoveTracks}
                disabled={removingTracks}
                className="btn-danger"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 14 }}
              >
                {removingTracks ? <Loader2 size={14} className="animate-spin" /> : <Trash size={14} />}
                Remove {selectedTracks.size} selected
              </button>
            )}
            {selectedTracks.size > 0 && (
              <button
                onClick={() => setSelectedTracks(new Set())}
                className="btn-ghost"
                style={{ padding: "8px 14px", fontSize: 14 }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tracks */}
      {loadingTracks ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text2)", padding: 20 }}>
          <Loader2 size={18} className="animate-spin" /> Loading tracks…
        </div>
      ) : (
        <div>
          {tracks.map((track, i) => (
            <TrackRow
              key={track.uri}
              track={track}
              index={i}
              tracks={tracks}
              setTracks={setTracks}
              selected={selectedTracks.has(track.uri)}
              onToggle={() => toggleTrack(track.uri)}
              isOwner={playlist.ownerId === user?.id}
              playlistId={playlist.id}
              accessToken={accessToken}
            />
          ))}
        </div>
      )}

      {modal === "edit" && <EditPlaylistModal playlist={playlist} onClose={() => setModal(null)} />}
      {modal === "save" && <SaveToBoardModal playlistIds={[playlist.id]} onClose={() => setModal(null)} />}
    </div>
  );
}
