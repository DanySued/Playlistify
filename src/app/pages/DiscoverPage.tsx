import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const DISCOVER_PROMPTS = [
  { cat: "Vibes", title: "Your late night playlist" },
  { cat: "Energy", title: "Feel-good anthems" },
  { cat: "Focus", title: "Deep work mode" },
  { cat: "Throwback", title: "Nostalgia hits" },
  { cat: "Chill", title: "Sunday morning easy" },
  { cat: "Hype", title: "Pre-workout fire" },
];

const GRADIENTS = [
  "linear-gradient(135deg,#1a1a2e,#e96c1e)",
  "linear-gradient(135deg,#f6d365,#fda085)",
  "linear-gradient(135deg,#30cfd0,#667eea)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#ffecd2,#fcb69f)",
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#11998e,#38ef7d)",
];

export default function DiscoverPage() {
  const { playlists } = useAuth();
  const navigate = useNavigate();

  // Pick random playlists to feature
  const featured = useMemo(() => {
    const shuffled = [...playlists].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 9);
  }, [playlists]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 4 }}>{today}</p>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Discover your sound</h1>
        <p style={{ fontSize: 15, color: "var(--text2)", marginTop: 8, maxWidth: 480, margin: "8px auto 0" }}>
          Explore your library in a new way. Rediscover playlists you haven't played in a while.
        </p>
      </div>

      {/* Featured playlists */}
      {featured.length > 0 && (
        <>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>From your library</h2>
          <div className="today-grid" style={{ marginBottom: 40 }}>
            {featured.map((playlist, i) => (
              <div
                key={playlist.id}
                className="today-card"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                {playlist.imageUrl ? (
                  <img src={playlist.imageUrl} alt={playlist.name} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, background: GRADIENTS[i % GRADIENTS.length] }} />
                )}
                <div className="tc-ov" />
                <div className="tc-txt">
                  <div className="tc-cat">{playlist.totalTracks ?? "?"} tracks</div>
                  <div className="tc-title">{playlist.name}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Discover prompts */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Explore moods</h2>
      <div className="today-grid">
        {DISCOVER_PROMPTS.map((item, i) => (
          <div key={item.title} className="today-card">
            <div style={{ position: "absolute", inset: 0, background: GRADIENTS[(i + 3) % GRADIENTS.length] }} />
            <div className="tc-ov" />
            <div className="tc-txt">
              <div className="tc-cat">{item.cat}</div>
              <div className="tc-title">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
