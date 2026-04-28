import { X } from "lucide-react";
import { useAppStore } from "../../context/AppStore";
import { useAuth } from "../../context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GRADIENTS = [
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
];

export default function NotificationsPanel({ isOpen, onClose }: Props) {
  const { settings } = useAppStore();
  const { playlists } = useAuth();

  const recent = playlists.slice(0, 8);

  return (
    <div className={`lpanel${isOpen ? " open" : ""}`} id="notifPanel">
      <div className="lp-top">
        <span className="lp-title">Updates</span>
        <button className="btn-close-sm" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="lp-body">
        {settings.artistNotifications.length === 0 && recent.length === 0 && (
          <div style={{ padding: "24px 20px", color: "var(--text2)", fontSize: 14 }}>
            No notifications yet. Add artists to track in Settings.
          </div>
        )}

        {settings.artistNotifications.length > 0 && (
          <>
            <div className="lp-section">Tracked Artists</div>
            {settings.artistNotifications.map((a, i) => (
              <div className="notif-item" key={a.artistId}>
                <div className="notif-thumb">
                  {a.imageUrl ? (
                    <img src={a.imageUrl} alt={a.artistName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                  ) : (
                    <div style={{ background: GRADIENTS[i % GRADIENTS.length], width: "100%", height: "100%", borderRadius: 8 }} />
                  )}
                </div>
                <div className="notif-text">
                  <p><strong>{a.artistName}</strong></p>
                  <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                    {a.notifyNewRelease ? "New releases" : ""}
                    {a.notifyNewRelease && a.notifyConcert ? " · " : ""}
                    {a.notifyConcert ? "Concerts" : ""}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

        {recent.length > 0 && (
          <>
            <div className="lp-section">Recent playlists</div>
            {recent.map((p, i) => (
              <div className="notif-item" key={p.id}>
                <div className="notif-thumb">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                  ) : (
                    <div style={{ background: GRADIENTS[i % GRADIENTS.length], width: "100%", height: "100%", borderRadius: 8 }} />
                  )}
                </div>
                <div className="notif-text">
                  <p><strong>{p.name}</strong></p>
                  <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{p.totalTracks ?? 0} tracks</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
