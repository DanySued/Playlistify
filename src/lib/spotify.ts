import type { SpotifyAPIPlaylist, SpotifyAPITrack } from "../types";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;

function getRedirectUri(): string {
  return (
    import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/callback`
  );
}

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "ugc-image-upload",
  "user-library-read",
  "user-follow-read",
  "user-top-read",
].join(" ");

function generateCodeVerifier(length: number): string {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values).reduce(
    (acc, x) => acc + possible[x % possible.length],
    "",
  );
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function initiateSpotifyAuth(): Promise<void> {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem("pkce_verifier", verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const verifier = localStorage.getItem("pkce_verifier");
  if (!verifier) throw new Error("No PKCE verifier found");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: getRedirectUri(),
      code_verifier: verifier,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error_description?: string }).error_description || "Token exchange failed",
    );
  }

  localStorage.removeItem("pkce_verifier");
  return res.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) throw new Error("Token refresh failed");
  return res.json();
}

export interface SpotifyAPIUser {
  id: string;
  display_name: string;
  email: string;
  country: string;
  followers: { total: number };
  images: { url: string }[];
}

export async function getSpotifyUser(accessToken: string): Promise<SpotifyAPIUser> {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export async function getSpotifyPlaylists(accessToken: string): Promise<SpotifyAPIPlaylist[]> {
  const all: SpotifyAPIPlaylist[] = [];
  let url: string | null = "https://api.spotify.com/v1/me/playlists?limit=50";

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) break;
    const data = await res.json();
    all.push(...(data.items ?? []));
    url = data.next ?? null;
  }

  return all;
}

export async function getSpotifyPlaylistTracks(
  accessToken: string,
  playlistId: string,
): Promise<SpotifyAPITrack[]> {
  const all: SpotifyAPITrack[] = [];
  let url: string | null =
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=next,items(added_at,track(id,uri,name,artists,album,duration_ms,preview_url,is_local))`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) break;
    const data = await res.json();
    all.push(...(data.items ?? []));
    url = data.next ?? null;
  }

  return all;
}

export async function getSpotifySavedAlbums(accessToken: string): Promise<SpotifyAPIPlaylist[]> {
  const res = await fetch("https://api.spotify.com/v1/me/albums?limit=50", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items ?? []).map((item: { album: { id: string; name: string; description?: string; images: { url: string }[]; external_urls: { spotify: string }; tracks: { total: number }; artists: { display_name?: string; name?: string }[] } }) => ({
    id: item.album.id,
    name: item.album.name,
    description: item.album.description ?? "",
    images: item.album.images,
    external_urls: item.album.external_urls,
    tracks: item.album.tracks,
    owner: { id: "", display_name: item.album.artists?.[0]?.name ?? "" },
    public: false,
    collaborative: false,
  }));
}

export async function updatePlaylist(
  accessToken: string,
  playlistId: string,
  updates: { name?: string; description?: string; public?: boolean },
): Promise<void> {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update playlist");
}

export async function uploadPlaylistCover(
  accessToken: string,
  playlistId: string,
  base64Jpeg: string,
): Promise<void> {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/images`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "image/jpeg",
      },
      body: base64Jpeg,
    },
  );
  if (!res.ok) throw new Error("Failed to upload playlist cover");
}

export async function unfollowPlaylist(accessToken: string, playlistId: string): Promise<void> {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to unfollow playlist");
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string,
  isPublic: boolean,
): Promise<SpotifyAPIPlaylist> {
  const res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description, public: isPublic }),
  });
  if (!res.ok) throw new Error("Failed to create playlist");
  return res.json();
}

export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  uris: string[],
): Promise<void> {
  for (let i = 0; i < uris.length; i += 100) {
    const chunk = uris.slice(i, i + 100);
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: chunk }),
    });
    if (!res.ok) throw new Error("Failed to add tracks");
  }
}

export async function removeTracksFromPlaylist(
  accessToken: string,
  playlistId: string,
  uris: string[],
): Promise<void> {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tracks: uris.map((uri) => ({ uri })) }),
  });
  if (!res.ok) throw new Error("Failed to remove tracks");
}

export async function searchArtists(
  accessToken: string,
  query: string,
): Promise<{ id: string; name: string; images: { url: string }[] }[]> {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=10`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.artists?.items ?? [];
}
