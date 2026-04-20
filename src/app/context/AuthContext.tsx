import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Playlist } from "../../types";
import {
  initiateSpotifyAuth,
  exchangeCodeForToken,
  refreshAccessToken,
  getSpotifyUser,
  getSpotifyPlaylists,
  type SpotifyAPIPlaylist,
} from "../../lib/spotify";

export interface SpotifyUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  country: string;
  followers: number;
  imageUrl?: string;
  spotifyConnected: boolean;
}

interface AuthContextType {
  user: SpotifyUser | null;
  isAuthenticated: boolean;
  spotifyPlaylists: Playlist[];
  accessToken: string | null;
  loginWithSpotify: () => Promise<void>;
  loginWithCallback: (code: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Repeating 8-item block that tiles perfectly in a 4-column grid with no gaps:
// [large(2×2), med, med, med, med, wide(2×1), med, med]
function assignSize(index: number): Playlist["size"] {
  const pos = index % 8;
  if (pos === 0) return "large";
  if (pos === 5) return "wide";
  return "medium";
}

function apiPlaylistToLocal(
  p: SpotifyAPIPlaylist,
  index: number
): Playlist {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    imageUrl: p.images?.[0]?.url ?? "",
    spotifyUrl: p.external_urls?.spotify ?? "",
    size: assignSize(index),
  };
}

function makeInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Persist helpers ───────────────────────────────────────────────────────

function saveTokens(accessToken: string, refreshToken: string, expiresAt: number) {
  localStorage.setItem("spotify_access_token", accessToken);
  localStorage.setItem("spotify_refresh_token", refreshToken);
  localStorage.setItem("spotify_expires_at", String(expiresAt));
}

function clearTokens() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_expires_at");
  localStorage.removeItem("spotify_user");
  localStorage.removeItem("spotify_playlists");
}

// ───────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SpotifyUser | null>(() => {
    const saved = localStorage.getItem("spotify_user");
    return saved ? (JSON.parse(saved) as SpotifyUser) : null;
  });

  const [spotifyPlaylists, setSpotifyPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem("spotify_playlists");
    return saved ? (JSON.parse(saved) as Playlist[]) : [];
  });

  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("spotify_access_token")
  );

  // ── Proactive token refresh ──────────────────────────────────────────────
  const doRefresh = useCallback(async () => {
    const rt = localStorage.getItem("spotify_refresh_token");
    if (!rt) return;
    try {
      const tokens = await refreshAccessToken(rt);
      const expiresAt = Date.now() + tokens.expires_in * 1000;
      saveTokens(tokens.access_token, tokens.refresh_token ?? rt, expiresAt);
      setAccessToken(tokens.access_token);
    } catch {
      clearTokens();
      setUser(null);
      setSpotifyPlaylists([]);
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    const expiresAt = Number(localStorage.getItem("spotify_expires_at") ?? 0);
    if (!expiresAt || !accessToken) return;

    const msUntilExpiry = expiresAt - Date.now();
    // Refresh 5 minutes before expiry
    const delay = Math.max(msUntilExpiry - 5 * 60 * 1000, 0);
    const timer = setTimeout(doRefresh, delay);
    return () => clearTimeout(timer);
  }, [accessToken, doRefresh]);

  // ── Spotify OAuth: step 1 — redirect to Spotify ─────────────────────────
  const loginWithSpotify = async () => {
    await initiateSpotifyAuth(); // browser redirects — nothing after this runs
  };

  // ── Spotify OAuth: step 2 — called by CallbackPage ──────────────────────
  const loginWithCallback = async (code: string) => {
    const tokens = await exchangeCodeForToken(code);
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    saveTokens(tokens.access_token, tokens.refresh_token, expiresAt);
    setAccessToken(tokens.access_token);

    const apiUser = await getSpotifyUser(tokens.access_token);
    const spotifyUser: SpotifyUser = {
      id: apiUser.id,
      name: apiUser.display_name ?? apiUser.email,
      email: apiUser.email,
      initials: makeInitials(apiUser.display_name ?? apiUser.email),
      country: apiUser.country,
      followers: apiUser.followers?.total ?? 0,
      imageUrl: apiUser.images?.[0]?.url,
      spotifyConnected: true,
    };
    setUser(spotifyUser);
    localStorage.setItem("spotify_user", JSON.stringify(spotifyUser));

    const apiPlaylists = await getSpotifyPlaylists(tokens.access_token);
    const playlists = apiPlaylists.map(apiPlaylistToLocal);
    setSpotifyPlaylists(playlists);
    localStorage.setItem("spotify_playlists", JSON.stringify(playlists));
  };

  // ── Email login (mock) ───────────────────────────────────────────────────
  const loginWithEmail = async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const raw = email.split("@")[0].replace(/[._-]/g, " ");
    const name = raw
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    setUser({
      id: "email-user-1",
      name,
      email,
      initials: makeInitials(name),
      country: "United States",
      followers: 0,
      spotifyConnected: false,
    });
  };

  // ── Signup (mock) ────────────────────────────────────────────────────────
  const signup = async (name: string, email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({
      id: "new-user-1",
      name,
      email,
      initials: makeInitials(name),
      country: "United States",
      followers: 0,
      spotifyConnected: false,
    });
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    clearTokens();
    setUser(null);
    setSpotifyPlaylists([]);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        spotifyPlaylists,
        accessToken,
        loginWithSpotify,
        loginWithCallback,
        loginWithEmail,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
