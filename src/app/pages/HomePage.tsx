import { useState, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router";
import { Loader2, SquareCheckBig, X, RefreshCw, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAppStore } from "../context/AppStore";
import PlaylistCard from "../components/PlaylistCard";
import MultiSelectBar from "../components/MultiSelectBar";

type Context = { searchQuery: string };

export default function HomePage() {
  const { searchQuery } = useOutletContext<Context>();
  const { playlists, isLoadingPlaylists, refreshPlaylists } = useAuth();
  const { labels, selectedIds, toggleSelect, clearSelection, selectAll } = useAppStore();

  const [selectionMode, setSelectionMode] = useState(false);
  const [activeLabels, setActiveLabels] = useState<Set<string>>(new Set());

  const toggleLabelFilter = (id: string) => {
    setActiveLabels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = playlists;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      );
    }
    if (activeLabels.size > 0) {
      result = result.filter((p) =>
        [...activeLabels].some((lid) => p.labelIds.includes(lid))
      );
    }
    return result;
  }, [playlists, searchQuery, activeLabels]);

  const handleEnterSelection = () => {
    setSelectionMode(true);
    clearSelection();
  };

  const handleExitSelection = () => {
    setSelectionMode(false);
    clearSelection();
  };

  const selectedArr = [...selectedIds];

  return (
    <div>
      {/* Sub-header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px 8px", flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Label filters */}
          {labels.length > 0 && (
            <>
              <Filter size={14} style={{ color: "var(--text2)" }} />
              {labels.map((l) => (
                <button
                  key={l.id}
                  onClick={() => toggleLabelFilter(l.id)}
                  className={`fbtn${activeLabels.has(l.id) ? " active-filter" : ""}`}
                  style={{ borderLeft: `3px solid ${l.color}` }}
                >
                  {l.name}
                </button>
              ))}
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isLoadingPlaylists && (
            <span style={{ fontSize: 13, color: "var(--text2)", display: "flex", alignItems: "center", gap: 4 }}>
              <Loader2 size={14} className="animate-spin" /> Syncing…
            </span>
          )}
          {!selectionMode ? (
            <button
              className="fbtn"
              onClick={handleEnterSelection}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <SquareCheckBig size={14} /> Select
            </button>
          ) : (
            <button
              className="fbtn"
              onClick={handleExitSelection}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!isLoadingPlaylists && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text2)" }}>
          {playlists.length === 0 ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>No playlists yet</h2>
              <p style={{ fontSize: 15 }}>Sync your Spotify account to see your playlists here.</p>
              <button
                className="btn-primary"
                style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 6 }}
                onClick={refreshPlaylists}
              >
                <RefreshCw size={16} /> Sync Spotify
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p>No playlists match your search.</p>
            </>
          )}
        </div>
      )}

      {/* Masonry grid */}
      {filtered.length > 0 && (
        <div className="masonry">
          {filtered.map((playlist) => (
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

      {/* Multi-select action bar */}
      {selectionMode && (
        <MultiSelectBar
          selectedIds={selectedArr}
          onClear={handleExitSelection}
          onSelectAll={() => selectAll(filtered.map((p) => p.id))}
          totalCount={filtered.length}
        />
      )}
    </div>
  );
}
