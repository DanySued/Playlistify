import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { defaultFolders } from "../../data/folders";
import { ManagePlaylistFolderModal } from "../components/ManagePlaylistFolderModal";
import { EditFolderModal } from "../components/EditFolderModal";
import {
  Music,
  Users,
  ListMusic,
  ExternalLink,
  Loader2,
  LogOut,
  Settings,
  Folder,
  FolderPlus,
  Pencil,
} from "lucide-react";

function SpotifyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, spotifyPlaylists, loginWithSpotify, logout } =
    useAuth();
  const [connectingSpotify, setConnectingSpotify] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<any | null>(null);
  const [editingFolder, setEditingFolder] = useState<any | null>(null);
  const [folders, setFolders] = useState(defaultFolders);
  const [playlists, setPlaylists] = useState(spotifyPlaylists);
  const [editMode, setEditMode] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <Navigation />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-20 h-20 bg-[#1DB954]/10 dark:bg-[#1DB954]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-10 h-10 text-[#1DB954] dark:text-[#1DB954]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Sign in to view your profile
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Create an account or sign in to manage your playlists.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login">
                <Button className="bg-[#1DB954] hover:bg-[#1aa34a] text-white px-6">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="px-6">
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleConnectSpotify = async () => {
    setConnectingSpotify(true);
    try {
      await loginWithSpotify();
    } finally {
      setConnectingSpotify(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleUpdatePlaylistFolder = (
    playlistId: string,
    folderId: string | null,
  ) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, folderId } : p)),
    );
  };

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navigation />

      <main className="pt-20 pb-16">
        {/* ── Hero banner ── */}
        <div className="bg-gradient-to-br from-[#0f5a2a] via-[#1DB954] to-[#0d4a22] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1DB954]/20 blur-3xl pointer-events-none" />
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* User info */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#1DB954] to-[#1aa34a] flex items-center justify-center text-2xl sm:text-3xl font-bold text-white border-4 border-white/20 shadow-2xl flex-shrink-0">
                  {user!.initials}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      {user!.name}
                    </h1>
                    {user!.spotifyConnected && (
                      <span className="flex items-center gap-1.5 bg-[#1DB954]/20 text-[#1DB954] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#1DB954]/30">
                        <SpotifyIcon className="w-3 h-3" />
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 mb-4 text-sm">{user!.email}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        {spotifyPlaylists.length}
                      </div>
                      <div className="text-white/50 text-xs">Playlists</div>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        {user!.followers}
                      </div>
                      <div className="text-white/50 text-xs">Followers</div>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        {user!.country}
                      </div>
                      <div className="text-white/50 text-xs">Country</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Link to="/settings">
                  <button
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
                    aria-label="Settings"
                  >
                    <Settings className="w-5 h-5 text-white" />
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 mt-10 space-y-8">
          {/* Spotify connect CTA */}
          {!user!.spotifyConnected && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#1DB954]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <SpotifyIcon className="w-7 h-7 text-[#1DB954]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Connect Spotify
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Import all your playlists and display them in your bento
                    grid.
                  </p>
                </div>
              </div>
              <button
                onClick={handleConnectSpotify}
                disabled={connectingSpotify}
                className="flex items-center gap-2 bg-[#1DB954] hover:bg-[#1aa34a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {connectingSpotify ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <SpotifyIcon className="w-4 h-4" />
                    Connect Spotify
                  </>
                )}
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: ListMusic,
                label: "Total Playlists",
                value: spotifyPlaylists.length,
                color: "text-[#1DB954] dark:text-[#1DB954]",
                bg: "bg-[#1DB954]/10 dark:bg-[#1DB954]/30",
              },
              {
                icon: Music,
                label: "Connected Services",
                value: user!.spotifyConnected ? 1 : 0,
                color: "text-[#1DB954]",
                bg: "bg-green-50 dark:bg-green-900/30",
              },
              {
                icon: Users,
                label: "Followers",
                value: user!.followers,
                color: "text-[#1DB954] dark:text-[#1DB954]",
                bg: "bg-[#1DB954]/10 dark:bg-[#1DB954]/30",
              },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div
                key={label}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Playlists grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {user!.spotifyConnected
                  ? "Your Spotify Playlists"
                  : "Your Playlists"}
              </h2>
              <div className="flex items-center gap-3">
                <Link to="/new-folder">
                  <Button
                    variant="outline"
                    className="text-sm px-4 border-gray-200 dark:border-gray-600 hover:border-[#1DB954] hover:text-[#1DB954]"
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                </Link>
                <Link to="/new-playlist">
                  <Button className="bg-[#1DB954] hover:bg-[#1aa34a] text-white text-sm px-4">
                    + New Playlist
                  </Button>
                </Link>
              </div>
            </div>

            {spotifyPlaylists.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListMusic className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No playlists yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {user!.spotifyConnected
                    ? "Create your first playlist to get started."
                    : "Connect Spotify to import your playlists, or create a new one."}
                </p>
                <Link to="/new-playlist">
                  <Button className="bg-[#1DB954] hover:bg-[#1aa34a] text-white">
                    Create Playlist
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                {playlists.map((playlist) => {
                  const folder = folders.find(
                    (f) => f.id === playlist.folderId,
                  );

                  return (
                    <div
                      key={playlist.id}
                      className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 duration-200 relative"
                    >
                      {/* Pencil button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingPlaylist(playlist);
                        }}
                        className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-gray-200 dark:border-gray-600"
                      >
                        <Pencil className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                      </button>

                      <a
                        href={playlist.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <img
                            src={playlist.imageUrl}
                            alt={playlist.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300";
                            }}
                          />
                        </div>
                        <div className="p-3">
                          <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                            {playlist.name}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1">
                              <ExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                Spotify
                              </span>
                            </div>
                            {folder && (
                              <div
                                className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1"
                                style={{
                                  backgroundColor: `${folder.color}15`,
                                  color: folder.color,
                                }}
                              >
                                <Folder className="w-3 h-3" />
                                <span className="font-medium truncate max-w-[60px]">
                                  {folder.name.split(" ")[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {editingPlaylist && (
        <ManagePlaylistFolderModal
          playlist={editingPlaylist}
          folders={folders}
          onClose={() => setEditingPlaylist(null)}
          onUpdate={handleUpdatePlaylistFolder}
        />
      )}

      {editingFolder && (
        <EditFolderModal
          folder={editingFolder}
          onClose={() => setEditingFolder(null)}
          onUpdate={handleUpdateFolder}
          onDelete={handleDeleteFolder}
        />
      )}
    </div>
  );
}
