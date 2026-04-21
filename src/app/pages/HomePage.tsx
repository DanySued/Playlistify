import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router";
import { Navigation } from "../components/Navigation";
import { BentoGrid } from "../components/BentoGrid";
import { FolderSelector } from "../components/FolderSelector";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { EditFolderModal } from "../components/EditFolderModal";
import { ManagePlaylistFolderModal } from "../components/ManagePlaylistFolderModal";
import { AlertCircle } from "lucide-react";
import type { Playlist } from "../../types";
import { mockPlaylists } from "../../data/playlists";
import { defaultFolders } from "../../data/folders";
import { useAuth } from "../context/AuthContext";

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function HomePage() {
  const { isAuthenticated, spotifyPlaylists, user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState(defaultFolders);
  const [editingFolder, setEditingFolder] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  const loadPlaylists = useCallback(async () => {
    setPlaylists([]);
    setIsLoading(true);
    setError(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPlaylists(
        isAuthenticated && spotifyPlaylists.length > 0
          ? spotifyPlaylists
          : mockPlaylists,
      );
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, spotifyPlaylists]);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  // Filter playlists by selected folder
  const filteredPlaylists = useMemo(() => {
    if (selectedFolderId === null) {
      return playlists;
    }
    return playlists.filter((p) => p.folderId === selectedFolderId);
  }, [playlists, selectedFolderId]);

  // Calculate playlist counts per folder
  const playlistCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    folders.forEach((folder) => {
      counts[folder.id] = playlists.filter(
        (p) => p.folderId === folder.id,
      ).length;
    });
    return counts;
  }, [playlists, folders]);

  // Get current folder name for display
  const currentFolderName = useMemo(() => {
    if (selectedFolderId === null) return null;
    const folder = folders.find((f) => f.id === selectedFolderId);
    return folder ? folder.name : null;
  }, [selectedFolderId, folders]);

  const handleUpdateFolder = (
    folderId: string,
    name: string,
    emoji: string,
    color: string,
  ) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name, emoji, color } : f)),
    );
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setPlaylists((prev) =>
      prev.map((p) => (p.folderId === folderId ? { ...p, folderId: null } : p)),
    );
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  const handleUpdatePlaylistFolder = (
    playlistId: string,
    folderId: string | null,
  ) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, folderId } : p)),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isAuthenticated
                ? `Welcome back, ${user?.name}!`
                : "Discover Your Sound"}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              {isAuthenticated && spotifyPlaylists.length > 0
                ? `${spotifyPlaylists.length} playlists imported from your Spotify account.`
                : "Explore curated playlists across all genres. Click any playlist to open it in Spotify."}
            </p>

            {/* Spotify connect nudge for logged-in users without Spotify */}
            {isAuthenticated && !spotifyPlaylists.length && (
              <div className="mt-6 inline-flex items-center gap-3 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-xl px-5 py-3">
                <span className="text-[#1DB954]">
                  <SpotifyIcon />
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  <strong className="font-semibold text-gray-900 dark:text-white">
                    Connect Spotify
                  </strong>{" "}
                  to sync your personal playlists
                </span>
                <Link to="/profile">
                  <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white shadow-sm">
                    Connect now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Failed to load playlists
                </h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Something went wrong. Please try again.
                  </p>
                </div>
              </div>
              <Button
                onClick={loadPlaylists}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Retry
              </Button>
            </div>
          )}

          {!error && (
            <>
              <FolderSelector
                folders={folders}
                playlistCounts={playlistCounts}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
                onEditFolder={setEditingFolder}
                editMode={editMode}
                onToggleEditMode={() => setEditMode(!editMode)}
              />
              <BentoGrid
                playlists={filteredPlaylists}
                isLoading={isLoading}
                folderName={currentFolderName}
                editMode={editMode}
                onEditPlaylist={setEditingPlaylist}
              />
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {editingFolder && (
        <EditFolderModal
          folder={editingFolder}
          onClose={() => setEditingFolder(null)}
          onUpdate={handleUpdateFolder}
          onDelete={handleDeleteFolder}
        />
      )}

      {editingPlaylist && (
        <ManagePlaylistFolderModal
          playlist={editingPlaylist}
          folders={folders}
          onClose={() => setEditingPlaylist(null)}
          onUpdate={handleUpdatePlaylistFolder}
        />
      )}
    </div>
  );
}
