import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, FolderPlus, Loader2, Check } from "lucide-react";

const PRESET_COLORS = [
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Green", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Rose", value: "#F43F5E" },
];

const PRESET_ICONS = [
  "🎵", "🎸", "🎹", "🎧", "🎤", "🎺", "🎷", "🎻",
  "💿", "📀", "🎼", "🎶", "🔊", "📻", "🎙️", "🪕",
  "🥁", "🪘", "🎚️", "🎛️", "💫", "⭐", "🌟", "✨",
  "🔥", "💥", "⚡", "💎", "🌈", "🌊", "🌸", "🍀",
  "☀️", "🌙", "⛈️", "❄️", "🎯", "🎨", "🎭", "🎪",
  "🚀", "✈️", "🏃", "💪", "🧘", "🏋️", "⚽", "🏀",
];

export default function NewFolderPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[5].value);
  const [selectedIcon, setSelectedIcon] = useState("📁");
  const [isLoading, setIsLoading] = useState(false);

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
              <FolderPlus className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Sign in to create folders
            </h2>
            <p className="text-gray-500 mb-8">
              Create an account to organize your playlists into folders.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create New Folder
            </h1>
            <p className="text-gray-500">
              Organize your playlists into custom folders
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form - Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Folder Name */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Folder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Workout Playlists"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what kind of playlists belong in this folder..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Color Selection */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Folder Color
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className="relative group"
                      >
                        <div
                          className={`w-full aspect-square rounded-xl transition-all ${
                            selectedColor === color.value
                              ? "ring-2 ring-offset-2 ring-gray-900 scale-105"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          {selectedColor === color.value && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-5 h-5 text-white drop-shadow-md" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          {color.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon Selection */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Folder Icon
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {PRESET_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all ${
                          selectedIcon === icon
                            ? "bg-indigo-100 ring-2 ring-indigo-500 scale-105"
                            : "bg-gray-50 hover:bg-gray-100 hover:scale-105"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview - Right Column */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Preview
                    </h3>
                    
                    {/* Folder Button Preview */}
                    <div className="mb-6">
                      <p className="text-xs text-gray-500 mb-2">As Button</p>
                      <button
                        type="button"
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm shadow-md border"
                        style={{
                          backgroundColor: selectedColor,
                          borderColor: selectedColor,
                          color: "#ffffff",
                        }}
                      >
                        <span className="text-base">{selectedIcon}</span>
                        <span className="flex-1 text-left truncate">
                          {name || "Folder Name"}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
                          0
                        </span>
                      </button>
                    </div>

                    {/* Folder Card Preview */}
                    <div className="mb-6">
                      <p className="text-xs text-gray-500 mb-2">As Card</p>
                      <div
                        className="w-full p-4 rounded-xl border-2 transition-all"
                        style={{
                          borderColor: selectedColor,
                          backgroundColor: `${selectedColor}10`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${selectedColor}30` }}
                          >
                            {selectedIcon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">
                              {name || "Folder Name"}
                            </div>
                          </div>
                        </div>
                        {description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">
                        This folder will appear in your folder list and you can
                        assign playlists to it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-4 justify-end bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <Link to="/">
                <Button
                  type="button"
                  variant="outline"
                  className="px-6"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!name.trim() || isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Create Folder
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
