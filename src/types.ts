export interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  spotifyUrl: string;
  size: "small" | "medium" | "large" | "wide" | "tall";
  folderId?: string; // Optional folder assignment
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  color: string; // Hex color for the folder
  icon?: string; // Optional emoji or icon identifier
}