export interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  spotifyUrl: string;
  boardIds: string[];
  labelIds: string[];
  isAlbum?: boolean;
  ownerId?: string;
  totalTracks?: number;
  isPublic?: boolean;
  isCollaborative?: boolean;
}

export interface Track {
  id: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  durationMs: number;
  previewUrl?: string;
  isLocal?: boolean;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  playlistIds: string[];
  labelIds: string[];
  archived: boolean;
  createdAt: number;
  secret?: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface RadioStation {
  id: string;
  name: string;
  playlistIds: string[];
  podcasts: PodcastInsert[];
  frequencyMinutes: number;
}

export interface PodcastInsert {
  id: string;
  name: string;
  url: string;
}

export interface ArtistNotification {
  artistId: string;
  artistName: string;
  imageUrl?: string;
  notifyNewRelease: boolean;
  notifyConcert: boolean;
}

export interface AppSettings {
  treatAlbumsAsPlaylists: boolean;
  geminiApiKey: string;
  artistNotifications: ArtistNotification[];
  darkMode: boolean;
}

export interface SpotifyAPIPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: { url: string }[];
  external_urls: { spotify: string };
  tracks: { total: number };
  owner: { id: string; display_name: string };
  public: boolean;
  collaborative: boolean;
}

export interface SpotifyAPITrack {
  track: {
    id: string;
    uri: string;
    name: string;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
    duration_ms: number;
    preview_url: string | null;
    is_local: boolean;
  } | null;
  added_at: string;
}
