import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Upload,
  Lock,
  Globe,
  Music,
  Loader2,
  Plus,
  X,
  FolderOpen,
} from "lucide-react";
import type { Playlist } from "../../types";
import { defaultFolders } from "../../data/folders";

const GENRES = [
  "Electronic",
  "Jazz",
  "Indie Rock",
  "Classical",
  "Hip Hop",
  "Pop",
  "Acoustic",
  "Reggae",
  "Blues",
  "Country",
  "Latin",
  "Metal",
  "R&B",
  "Folk",
  "Soul",
  "Punk",
  "Dance",
  "Ambient",
];

const SIZES: { label: string; value: Playlist["size"] }[] = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large (2×2)", value: "large" },
  { label: "Wide (2×1)", value: "wide" },
  { label: "Tall (1×2)", value: "tall" },
];

export default function NewPlaylistPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [size, setSize] = useState<Playlist["size"]>("medium");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleGenre = (genre: string) =>
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Sign in to create playlists
            </h2>
            <p className="text-gray-500 mb-8">
              Create an account to start building your music library.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
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

  const previewHeight =
    size === "large"
      ? "h-64"
      : size === "tall"
        ? "h-80"
        : size === "wide"
          ? "h-32"
          : size === "small"
            ? "h-28"
            : "h-48";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                New Playlist
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Create and customize your playlist
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ── Left: preview column ── */}
              <div className="space-y-6">
                {/* Cover art upload */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">
                    Cover Art
                  </h2>
                  <label className="block cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative border-2 border-dashed border-gray-200 group-hover:border-indigo-400 transition-colors">
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-indigo-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Upload cover art
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG up to 10 MB
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Bento preview */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">
                    Bento Preview
                  </h2>
                  <div
                    className={`relative rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 w-full ${previewHeight}`}
                  >
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 p-4">
                      <p className="text-white font-bold text-lg truncate">
                        {name || "Playlist Name"}
                      </p>
                      {description && (
                        <p className="text-white/70 text-sm truncate">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>
                      Size: {SIZES.find((s) => s.value === size)?.label}
                    </span>
                    <span>{isPublic ? "Public" : "Private"}</span>
                  </div>
                </div>
              </div>

              {/* ── Right: form column ── */}
              <div className="space-y-6">
                {/* Basic details */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h2 className="font-semibold text-gray-900">
                    Playlist Details
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Playlist name{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Give your playlist a name…"
                      maxLength={100}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {name.length}/100
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What's this playlist about?"
                      rows={3}
                      maxLength={300}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {description.length}/300
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Spotify playlist URL{" "}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="url"
                      value={spotifyUrl}
                      onChange={(e) => setSpotifyUrl(e.target.value)}
                      placeholder="https://open.spotify.com/playlist/…"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Visibility */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">
                    Visibility
                  </h2>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPublic(true)}
                      className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        isPublic
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Globe
                        className={`w-5 h-5 ${isPublic ? "text-indigo-600" : "text-gray-400"}`}
                      />
                      <div className="text-left">
                        <div
                          className={`text-sm font-medium ${isPublic ? "text-indigo-600" : "text-gray-700"}`}
                        >
                          Public
                        </div>
                        <div className="text-xs text-gray-400">
                          Anyone can see
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPublic(false)}
                      className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        !isPublic
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Lock
                        className={`w-5 h-5 ${!isPublic ? "text-indigo-600" : "text-gray-400"}`}
                      />
                      <div className="text-left">
                        <div
                          className={`text-sm font-medium ${!isPublic ? "text-indigo-600" : "text-gray-700"}`}
                        >
                          Private
                        </div>
                        <div className="text-xs text-gray-400">
                          Only you can see
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Grid size */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">
                    Grid Size
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {SIZES.map(({ label, value }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSize(value)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all ${
                          size === value
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genres */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          selectedGenres.includes(genre)
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                        }`}
                      >
                        {selectedGenres.includes(genre) && (
                          <X className="w-3 h-3" />
                        )}
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Folder Selection */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FolderOpen className="w-5 h-5 text-gray-700" />
                    <h2 className="font-semibold text-gray-900">Organize in Folder</h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Choose a folder to organize this playlist
                  </p>
                  <div className="space-y-2">
                    {/* No folder option */}
                    <button
                      type="button"
                      onClick={() => setSelectedFolderId(null)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        selectedFolderId === null
                          ? "border-gray-400 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FolderOpen className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          No folder
                        </span>
                      </div>
                      {selectedFolderId === null && (
                        <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>

                    {/* Folder options */}
                    {defaultFolders.map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => setSelectedFolderId(folder.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          selectedFolderId === folder.id
                            ? "bg-opacity-10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{
                          borderColor:
                            selectedFolderId === folder.id
                              ? folder.color
                              : undefined,
                          backgroundColor:
                            selectedFolderId === folder.id
                              ? `${folder.color}10`
                              : undefined,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                            style={{ backgroundColor: `${folder.color}20` }}
                          >
                            {folder.icon}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-gray-900">
                              {folder.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {folder.description}
                            </div>
                          </div>
                        </div>
                        {selectedFolderId === folder.id && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: folder.color }}
                          >
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    ))}

                    {/* Create New Folder Option */}
                    <Link to="/new-folder">
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-gray-600 hover:text-indigo-600"
                      >
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Plus className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium">
                          Create New Folder
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 rounded-xl font-semibold text-base shadow-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating playlist…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      Create Playlist
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}