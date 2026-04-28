import { useState, useEffect } from "react";
import { Plus, Car, Trash2, Edit3, X, Sparkles, Loader2, Headphones, ExternalLink } from "lucide-react";
import { useAppStore } from "../context/AppStore";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { getGeminiSuggestion } from "../../lib/gemini";
import type { RadioStation } from "../../types";

interface PodcastEpisode {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  showName: string;
  durationMs: number;
  releaseDate: string;
  externalUrl: string;
}

async function fetchTrendingEpisodes(accessToken: string): Promise<PodcastEpisode[]> {
  const queries = ["technology trending 2025", "true crime popular", "business insights", "science discovery"];
  const query = queries[Math.floor(Math.random() * queries.length)];
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=episode&market=US&limit=12`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return (data.episodes?.items ?? []).map((ep: {
    id: string; name: string; description: string;
    images: { url: string }[]; show: { name: string };
    duration_ms: number; release_date: string;
    external_urls: { spotify: string };
  }) => ({
    id: ep.id,
    name: ep.name,
    description: ep.description,
    imageUrl: ep.images?.[0]?.url ?? "",
    showName: ep.show?.name ?? "",
    durationMs: ep.duration_ms,
    releaseDate: ep.release_date,
    externalUrl: ep.external_urls?.spotify ?? "",
  }));
}

function formatDuration(ms: number) {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function CreateDriveModal({
  onClose,
  initial,
}: {
  onClose: () => void;
  initial?: RadioStation;
}) {
  const { playlists } = useAuth();
  const { createRadioStation, updateRadioStation, settings } = useAppStore();
  const [name, setName] = useState(initial?.name ?? "");
  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(
    new Set(initial?.playlistIds ?? [])
  );
  const [frequency, setFrequency] = useState(initial?.frequencyMinutes ?? 30);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const togglePlaylist = (id: string) => {
    setSelectedPlaylists((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    if (!name.trim() || selectedPlaylists.size === 0) return;
    setSaving(true);
    if (initial) {
      updateRadioStation(initial.id, {
        name: name.trim(),
        playlistIds: [...selectedPlaylists],
        frequencyMinutes: frequency,
      });
    } else {
      createRadioStation(name.trim(), [...selectedPlaylists]);
    }
    toast.success(initial ? "Drive updated" : "Daily Drive created");
    setSaving(false);
    onClose();
  };

  const handleAiName = async () => {
    if (!settings.geminiApiKey) { toast.error("Add Gemini key in Settings"); return; }
    setAiLoading(true);
    try {
      const s = await getGeminiSuggestion(settings.geminiApiKey, "Suggest a creative daily drive mix name for a commute playlist. Max 4 words, no quotes.");
      setName(s.trim().replace(/^["']|["']$/g, ""));
    } catch { toast.error("AI failed"); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="moverlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 520, maxHeight: "88vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-hdr">
          <span className="modal-title">{initial ? "Edit" : "Create"} Daily Drive</span>
          <button className="btn-close-sm" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ overflowY: "auto", flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label className="fm-label" style={{ marginBottom: 0 }}>Drive name</label>
              <button className="ai-btn" onClick={handleAiName} disabled={aiLoading}>
                <Sparkles size={12} /> {aiLoading ? "…" : "AI suggest"}
              </button>
            </div>
            <input className="fm-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Morning Commute" autoFocus />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="fm-label">Podcast break frequency</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[15, 30, 45, 60].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`fbtn${frequency === f ? " active-filter" : ""}`}
                >
                  Every {f}m
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 6 }}>
              How often a podcast episode plays between songs
            </p>
          </div>

          <div>
            <label className="fm-label">Select playlists for this drive</label>
            <div style={{ maxHeight: 280, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
              {playlists.map((p) => {
                const sel = selectedPlaylists.has(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => togglePlaylist(p.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 12px", borderRadius: 10, cursor: "pointer",
                      background: sel ? "var(--gr)22" : "var(--bg2)",
                      border: sel ? "1.5px solid var(--gr)" : "1.5px solid transparent",
                      transition: "all .15s",
                    }}
                  >
                    {p.imageUrl && <img src={p.imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} />}
                    <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{p.name}</span>
                    {sel && <span style={{ color: "var(--gr)", fontWeight: 700 }}>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving || !name.trim() || selectedPlaylists.size === 0}>
            {saving ? "Saving…" : initial ? "Update" : "Create drive"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RadioPage() {
  const { radioStations, deleteRadioStation } = useAppStore();
  const { playlists, accessToken } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [editStation, setEditStation] = useState<RadioStation | null>(null);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    setLoadingEpisodes(true);
    fetchTrendingEpisodes(accessToken)
      .then(setEpisodes)
      .catch(() => {})
      .finally(() => setLoadingEpisodes(false));
  }, [accessToken]);

  const GRADIENTS = [
    "linear-gradient(135deg,#1a1a2e,#e96c1e)",
    "linear-gradient(135deg,#667eea,#764ba2)",
    "linear-gradient(135deg,#11998e,#38ef7d)",
    "linear-gradient(135deg,#f093fb,#f5576c)",
  ];

  return (
    <div style={{ padding: "32px 36px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, display: "flex", alignItems: "center", gap: 10 }}>
            <Car size={26} style={{ color: "var(--gr)" }} /> Daily Drive
          </h1>
          <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 4 }}>
            Mix your playlists with podcast breaks — your personalized commute experience.
          </p>
        </div>
        <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={() => setShowCreate(true)}>
          <Plus size={18} /> Create drive
        </button>
      </div>

      {/* Stations */}
      {radioStations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text2)" }}>
          <Car size={52} style={{ color: "var(--gr)", margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>No drives yet</h2>
          <p style={{ fontSize: 15, marginBottom: 20 }}>
            Create a Daily Drive that mixes your playlists with podcast episodes — like Spotify's Daily Drive, but yours.
          </p>
          <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }} onClick={() => setShowCreate(true)}>
            <Plus size={18} /> Create your first drive
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
          {radioStations.map((station, i) => {
            const stationPlaylists = playlists.filter((p) => station.playlistIds.includes(p.id));
            return (
              <div key={station.id} className="radio-card">
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {stationPlaylists.slice(0, 3).map((p, j) => (
                    <div key={p.id} style={{ flex: 1, aspectRatio: "1", borderRadius: 8, overflow: "hidden" }}>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: GRADIENTS[(i + j) % GRADIENTS.length] }} />
                      )}
                    </div>
                  ))}
                  {stationPlaylists.length === 0 && (
                    <div style={{ width: 80, height: 80, borderRadius: 8, background: GRADIENTS[i % GRADIENTS.length], display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Car size={28} color="white" />
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{station.name}</div>
                <div style={{ fontSize: 13, color: "var(--text2)" }}>
                  {station.playlistIds.length} playlist{station.playlistIds.length !== 1 ? "s" : ""} · Podcast every {station.frequencyMinutes}m
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button className="fbtn" style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={() => setEditStation(station)}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button className="fbtn" style={{ display: "flex", alignItems: "center", gap: 6, color: "#ef4444" }} onClick={() => { deleteRadioStation(station.id); toast.success("Drive deleted"); }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trending podcast episodes */}
      <div style={{ marginTop: radioStations.length > 0 ? 0 : 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Headphones size={18} style={{ color: "var(--gr)" }} />
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Trending episodes to add to your drive</h2>
        </div>

        {loadingEpisodes ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text2)", padding: "20px 0" }}>
            <Loader2 size={18} className="animate-spin" /> Loading trending episodes…
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {episodes.map((ep) => (
              <div
                key={ep.id}
                style={{
                  display: "flex", gap: 12, padding: 12,
                  borderRadius: 12, background: "var(--bg2)",
                  border: "1px solid var(--border)", transition: "background .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg3)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg2)")}
              >
                {ep.imageUrl ? (
                  <img src={ep.imageUrl} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 60, height: 60, borderRadius: 8, background: "var(--bg3)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Headphones size={22} style={{ color: "var(--text2)" }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>
                    {ep.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>{ep.showName}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "var(--text2)" }}>{formatDuration(ep.durationMs)}</span>
                    {ep.externalUrl && (
                      <a
                        href={ep.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--gr)", display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} /> Listen
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && <CreateDriveModal onClose={() => setShowCreate(false)} />}
      {editStation && <CreateDriveModal initial={editStation} onClose={() => setEditStation(null)} />}
    </div>
  );
}
