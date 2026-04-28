import { useState } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function LoginPage() {
  const { loginWithSpotify } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const PREVIEW_GRADIENTS = [
    "linear-gradient(135deg,#f093fb,#f5576c)",
    "linear-gradient(135deg,#43e97b,#38f9d7)",
    "linear-gradient(135deg,#fa709a,#fee140)",
    "linear-gradient(135deg,#a18cd1,#fbc2eb)",
    "linear-gradient(135deg,#4facfe,#00f2fe)",
    "linear-gradient(135deg,#f6d365,#fda085)",
    "linear-gradient(135deg,#d4fc79,#96e6a1)",
    "linear-gradient(135deg,#667eea,#764ba2)",
    "linear-gradient(135deg,#11998e,#38ef7d)",
    "linear-gradient(135deg,#ffecd2,#fcb69f)",
    "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
    "linear-gradient(135deg,#30cfd0,#667eea)",
  ];

  const handleSpotify = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithSpotify();
    } catch {
      setError("Failed to connect to Spotify. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>

      {/* Left — visual panel */}
      <div
        className="login-left"
        style={{
          background: "#0a0a0a",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Pinterest-style masonry preview */}
        <div style={{
          position: "absolute", inset: 0,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          padding: 8,
          opacity: 0.5,
          overflow: "hidden",
        }}>
          {PREVIEW_GRADIENTS.map((g, i) => (
            <div key={i} style={{
              borderRadius: 12,
              background: g,
              height: i % 3 === 0 ? 180 : i % 3 === 1 ? 140 : 220,
            }} />
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1bd65e", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SpotifyIcon />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "white" }}>Playlistify</span>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 16 }}>
            Your music,<br />beautifully organized.
          </h2>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: 16, lineHeight: 1.6, maxWidth: 380 }}>
            Organize your Spotify playlists into boards by mood, vibe, or occasion. Edit, label, and discover — all in one aesthetic space.
          </p>
        </div>
      </div>

      {/* Right — sign in panel */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Logo (mobile) */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1bd65e", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SpotifyIcon />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "var(--text)" }}>Playlistify</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Sign in</h1>
          <p style={{ color: "var(--text2)", fontSize: 16, marginBottom: 32 }}>
            Connect your Spotify to get started
          </p>

          {error && (
            <div style={{
              background: "#fee2e2", border: "1px solid #fecaca",
              color: "#dc2626", borderRadius: 10,
              padding: "12px 16px", fontSize: 14, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSpotify}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: "#1bd65e",
              color: "white",
              border: "none",
              borderRadius: 30,
              padding: "16px 24px",
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? .7 : 1,
              transition: "background .15s, transform .1s",
            }}
            onMouseEnter={(e) => !loading && ((e.currentTarget as HTMLElement).style.background = "#15ba50")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#1bd65e")}
            onMouseDown={(e) => !loading && ((e.currentTarget as HTMLElement).style.transform = "scale(.98)")}
            onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
          >
            {loading ? (
              <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Connecting to Spotify…</>
            ) : (
              <><SpotifyIcon /> Continue with Spotify</>
            )}
          </button>

          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: "var(--bg2)", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--text)" }}>Note:</strong> Playlistify uses Spotify's official OAuth. We never see your password. The app is currently in developer mode — only approved testers can log in.
            </p>
          </div>

          <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 24, textAlign: "center", lineHeight: 1.5 }}>
            By signing in, you agree to let Playlistify access and manage your Spotify playlists on your behalf.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (min-width: 900px) { .login-left { display: flex !important; width: 50%; } }
      `}</style>
    </div>
  );
}
