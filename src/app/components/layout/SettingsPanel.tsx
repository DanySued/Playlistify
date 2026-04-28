import { X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppStore } from "../../context/AppStore";
import { searchArtists } from "../../../lib/spotify";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: Props) {
  const { logout, accessToken } = useAuth();
  const { settings, updateSettings } = useAppStore();
  const [artistQuery, setArtistQuery] = useState("");
  const [artistResults, setArtistResults] = useState<{ id: string; name: string; images: { url: string }[] }[]>([]);
  const [searching, setSearching] = useState(false);
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey);

  const handleArtistSearch = async () => {
    if (!artistQuery.trim() || !accessToken) return;
    setSearching(true);
    try {
      const results = await searchArtists(accessToken, artistQuery);
      setArtistResults(results);
    } finally {
      setSearching(false);
    }
  };

  const addArtist = (artist: { id: string; name: string; images: { url: string }[] }) => {
    if (settings.artistNotifications.find((a) => a.artistId === artist.id)) return;
    updateSettings({
      artistNotifications: [
        ...settings.artistNotifications,
        {
          artistId: artist.id,
          artistName: artist.name,
          imageUrl: artist.images?.[0]?.url,
          notifyNewRelease: true,
          notifyConcert: false,
        },
      ],
    });
    setArtistResults([]);
    setArtistQuery("");
    toast.success(`Tracking ${artist.name}`);
  };

  const removeArtist = (artistId: string) => {
    updateSettings({
      artistNotifications: settings.artistNotifications.filter((a) => a.artistId !== artistId),
    });
  };

  const saveGeminiKey = () => {
    updateSettings({ geminiApiKey: geminiKey });
    toast.success("Gemini API key saved");
  };

  return (
    <div className={`lpanel${isOpen ? " open" : ""}`} id="settingsPanel">
      <div className="lp-top">
        <span className="lp-title">Settings</span>
        <button className="btn-close-sm" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="lp-body">

        {/* Gemini API Key */}
        <div className="settings-section">AI Suggestions</div>
        <div style={{ padding: "12px 20px" }}>
          <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 6 }}>
            Gemini API Key
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIza…"
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--text)",
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              onClick={saveGeminiKey}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                background: "var(--gr)",
                border: "none",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section">Preferences</div>
        <div className="settings-item">
          <span>Treat albums as playlists</span>
          <button
            className={`tog-sm${settings.treatAlbumsAsPlaylists ? " on" : ""}`}
            onClick={() => updateSettings({ treatAlbumsAsPlaylists: !settings.treatAlbumsAsPlaylists })}
          />
        </div>

        {/* Artist Notifications */}
        <div className="settings-section">Artist Notifications</div>
        <div style={{ padding: "8px 20px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              value={artistQuery}
              onChange={(e) => setArtistQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleArtistSearch()}
              placeholder="Search artist…"
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--text)",
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              onClick={handleArtistSearch}
              disabled={searching}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                background: "var(--bg3)",
                border: "none",
                color: "var(--text)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {searching ? "…" : "Search"}
            </button>
          </div>
          {artistResults.map((a) => (
            <div
              key={a.id}
              onClick={() => addArtist(a)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                cursor: "pointer",
              }}
            >
              {a.images?.[0]?.url ? (
                <img src={a.images[0].url} alt={a.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg3)" }} />
              )}
              <span style={{ fontSize: 14 }}>{a.name}</span>
            </div>
          ))}
        </div>

        {settings.artistNotifications.length > 0 && (
          <div style={{ padding: "0 20px 8px" }}>
            {settings.artistNotifications.map((a) => (
              <div
                key={a.artistId}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {a.imageUrl ? (
                    <img src={a.imageUrl} alt={a.artistName} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg3)" }} />
                  )}
                  <span style={{ fontSize: 14 }}>{a.artistName}</span>
                </div>
                <button
                  onClick={() => removeArtist(a.artistId)}
                  style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text2)", fontSize: 18 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Account */}
        <div className="settings-section">Account</div>
        <div className="settings-item" style={{ cursor: "pointer" }} onClick={logout}>
          Sign out
        </div>

        <div className="settings-section">Resources</div>
        <div className="settings-links">
          <span onClick={() => window.open("https://developer.spotify.com", "_blank")}>
            Spotify Docs <ExternalLink size={11} style={{ display: "inline" }} />
          </span>
        </div>
      </div>
    </div>
  );
}
