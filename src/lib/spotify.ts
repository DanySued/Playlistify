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

export async function exchangeCodeForToken(
  code: string,
): Promise<TokenResponse> {
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
      (err as { error_description?: string }).error_description ||
        "Token exchange failed",
    );
  }

  localStorage.removeItem("pkce_verifier");
  return res.json();
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenResponse> {
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

export async function getSpotifyUser(
  accessToken: string,
): Promise<SpotifyAPIUser> {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export interface SpotifyAPIPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: { total: number };
  owner: { display_name: string };
  public: boolean;
  external_urls: { spotify: string };
}

export async function getSpotifyPlaylists(
  accessToken: string,
): Promise<SpotifyAPIPlaylist[]> {
  const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch playlists");
  const data = await res.json();
  return data.items ?? [];
}

export async function updatePlaylist(
  accessToken: string,
  playlistId: string,
  updates: { name?: string; description?: string },
): Promise<void> {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    },
  );
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

export async function unfollowPlaylist(
  accessToken: string,
  playlistId: string,
): Promise<void> {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error("Failed to delete playlist");
}
