import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Playlist, SpotifyAPIPlaylist } from "../../types";
import {
  initiateSpotifyAuth,
  exchangeCodeForToken,
  refreshAccessToken,
  getSpotifyUser,
  getSpotifyPlaylists,
  getSpotifySavedAlbums,
  updatePlaylist as spotifyUpdatePlaylist,
  unfollowPlaylist as spotifyUnfollowPlaylist,
  createPlaylist as spotifyCreatePlaylist,
  addTracksToPlaylist as spotifyAddTracks,
  removeTracksFromPlaylist as spotifyRemoveTracks,
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
  playlists: Playlist[];
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
  accessToken: string | null;
  isLoadingPlaylists: boolean;
  loginWithSpotify: () => Promise<void>;
  loginWithCallback: (code: string) => Promise<void>;
  logout: () => void;
  updatePlaylist: (id: string, updates: { name?: string; description?: string; imageBase64?: string }) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  deleteMultiplePlaylists: (ids: string[]) => Promise<void>;
  createPlaylist: (name: string, description: string, isPublic: boolean) => Promise<Playlist>;
  duplicatePlaylist: (id: string) => Promise<Playlist>;
  refreshPlaylists: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function apiPlaylistToLocal(p: SpotifyAPIPlaylist): Playlist {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    imageUrl: p.images?.[0]?.url ?? "",
    spotifyUrl: p.external_urls?.spotify ?? "",
    boardIds: [],
    labelIds: [],
    isPublic: p.public,
    isCollaborative: p.collaborative,
    ownerId: p.owner?.id ?? "",
    totalTracks: p.tracks?.total ?? 0,
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

async function fetchFreshPlaylists(token: string): Promise<Playlist[]> {
  const rawSettings = JSON.parse(localStorage.getItem("pfy_settings") ?? "{}");
  const [raw, albums] = await Promise.all([
    getSpotifyPlaylists(token),
    rawSettings.treatAlbumsAsPlaylists ? getSpotifySavedAlbums(token) : Promise.resolve([] as SpotifyAPIPlaylist[]),
  ]);
  const playlists = raw.map(apiPlaylistToLocal);
  if (!albums.length) return playlists;
  return [...playlists, ...albums.map((a) => ({ ...apiPlaylistToLocal(a), isAlbum: true }))];
}

function mergePlaylists(fresh: Playlist[], saved: Playlist[]): Playlist[] {
  const savedMap = new Map(saved.map((p) => [p.id, p]));
  return fresh.map((fp) => {
    const sp = savedMap.get(fp.id);
    if (!sp) return fp;
    return {
      ...fp,
      boardIds: sp.boardIds ?? [],
      labelIds: sp.labelIds ?? [],
    };
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SpotifyUser | null>(() => {
    const saved = localStorage.getItem("spotify_user");
    return saved ? (JSON.parse(saved) as SpotifyUser) : null;
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem("spotify_playlists");
    return saved ? (JSON.parse(saved) as Playlist[]) : [];
  });

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("spotify_access_token")
  );

  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

  // ── Token refresh ────────────────────────────────────────────────────────
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
      setPlaylists([]);
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    const expiresAt = Number(localStorage.getItem("spotify_expires_at") ?? 0);
    if (!expiresAt || !accessToken) return;
    const delay = Math.max(expiresAt - Date.now() - 5 * 60 * 1000, 0);
    const timer = setTimeout(doRefresh, delay);
    return () => clearTimeout(timer);
  }, [accessToken, doRefresh]);

  // ── Fetch playlists ──────────────────────────────────────────────────────
  const refreshPlaylists = useCallback(async () => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) return;
    setIsLoadingPlaylists(true);
    try {
      const fresh = await fetchFreshPlaylists(token);
      setPlaylists((prev) => {
        const merged = mergePlaylists(fresh, prev);
        localStorage.setItem("spotify_playlists", JSON.stringify(merged));
        return merged;
      });
    } finally {
      setIsLoadingPlaylists(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) refreshPlaylists();
  }, [accessToken, refreshPlaylists]);

  // ── Spotify OAuth ────────────────────────────────────────────────────────
  const loginWithSpotify = async () => {
    await initiateSpotifyAuth();
  };

  const loginWithCallback = useCallback(async (code: string) => {
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

    const fresh = await fetchFreshPlaylists(tokens.access_token);
    const saved = localStorage.getItem("spotify_playlists");
    const savedList: Playlist[] = saved ? JSON.parse(saved) : [];
    const merged = mergePlaylists(fresh, savedList);
    setPlaylists(merged);
    localStorage.setItem("spotify_playlists", JSON.stringify(merged));
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setPlaylists([]);
    setAccessToken(null);
  }, []);

  // ── Playlist mutations ───────────────────────────────────────────────────
  const updatePlaylist = useCallback(async (
    id: string,
    updates: { name?: string; description?: string; imageBase64?: string },
  ) => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) throw new Error("Not authenticated");
    const { imageBase64, ...rest } = updates;
    if (Object.keys(rest).length) await spotifyUpdatePlaylist(token, id, rest);
    if (imageBase64) {
      const { uploadPlaylistCover } = await import("../../lib/spotify");
      await uploadPlaylistCover(token, id, imageBase64);
    }
    setPlaylists((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, ...rest } : p
      );
      localStorage.setItem("spotify_playlists", JSON.stringify(next));
      return next;
    });
  }, []);

  const deletePlaylist = useCallback(async (id: string) => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) throw new Error("Not authenticated");
    await spotifyUnfollowPlaylist(token, id);
    setPlaylists((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem("spotify_playlists", JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteMultiplePlaylists = useCallback(async (ids: string[]) => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) throw new Error("Not authenticated");
    await Promise.all(ids.map((id) => spotifyUnfollowPlaylist(token, id)));
    setPlaylists((prev) => {
      const next = prev.filter((p) => !ids.includes(p.id));
      localStorage.setItem("spotify_playlists", JSON.stringify(next));
      return next;
    });
  }, []);

  const createPlaylist = useCallback(async (
    name: string,
    description: string,
    isPublic: boolean,
  ): Promise<Playlist> => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token || !user) throw new Error("Not authenticated");
    const created = await spotifyCreatePlaylist(token, user.id, name, description, isPublic);
    const newPl = apiPlaylistToLocal(created);
    setPlaylists((prev) => {
      const next = [newPl, ...prev];
      localStorage.setItem("spotify_playlists", JSON.stringify(next));
      return next;
    });
    return newPl;
  }, [user]);

  const duplicatePlaylist = useCallback(async (id: string): Promise<Playlist> => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token || !user) throw new Error("Not authenticated");
    const { getSpotifyPlaylistTracks } = await import("../../lib/spotify");
    const original = playlists.find((p) => p.id === id);
    if (!original) throw new Error("Playlist not found");
    const tracks = await getSpotifyPlaylistTracks(token, id);
    const uris = tracks
      .map((t) => t.track?.uri)
      .filter((u): u is string => !!u && !u.startsWith("spotify:local:"));
    const created = await spotifyCreatePlaylist(
      token,
      user.id,
      `${original.name} (Copy)`,
      original.description,
      false,
    );
    if (uris.length) await spotifyAddTracks(token, created.id, uris);
    const newPl = { ...apiPlaylistToLocal(created), totalTracks: uris.length };
    setPlaylists((prev) => {
      const next = [newPl, ...prev];
      localStorage.setItem("spotify_playlists", JSON.stringify(next));
      return next;
    });
    return newPl;
  }, [playlists, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        playlists,
        setPlaylists,
        accessToken,
        isLoadingPlaylists,
        loginWithSpotify,
        loginWithCallback,
        logout,
        updatePlaylist,
        deletePlaylist,
        deleteMultiplePlaylists,
        createPlaylist,
        duplicatePlaylist,
        refreshPlaylists,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
