import { useState } from "react";
import { X, Check, Trash2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface Folder {
  id: string;
  name: string;
  emoji: string;
  color: string;
  playlistCount: number;
}

interface EditFolderModalProps {
  folder: Folder;
  onClose: () => void;
  onUpdate: (
    folderId: string,
    name: string,
    emoji: string,
    color: string,
  ) => void;
  onDelete: (folderId: string) => void;
}

const EMOJI_OPTIONS = [
  "🎵",
  "🎸",
  "🎹",
  "🎤",
  "🎧",
  "🎼",
  "🎺",
  "🎷",
  "🥁",
  "🎻",
  "💪",
  "🔥",
  "⚡",
  "🌊",
  "🌙",
  "☀️",
  "🎯",
  "💎",
  "🚀",
  "✨",
  "🌟",
  "💫",
  "🎨",
  "🎭",
];

const COLOR_OPTIONS = [
  { name: "Indigo", value: "#6366F1" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Green", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Cyan", value: "#06B6D4" },
];

export function EditFolderModal({
  folder,
  onClose,
  onUpdate,
  onDelete,
}: EditFolderModalProps) {
  const [name, setName] = useState(folder.name);
  const [selectedEmoji, setSelectedEmoji] = useState(folder.emoji);
  const [selectedColor, setSelectedColor] = useState(folder.color);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onUpdate(folder.id, name, selectedEmoji, selectedColor);
    onClose();
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${folder.name}"? This will remove the folder but keep all playlists.`,
      )
    ) {
      return;
    }
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onDelete(folder.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Edit Folder
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {/* Preview */}
          <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide font-medium">
              Preview
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                style={{
                  backgroundColor: `${selectedColor}20`,
                  color: selectedColor,
                }}
              >
                {selectedEmoji}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {name || "Folder Name"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {folder.playlistCount}{" "}
                  {folder.playlistCount === 1 ? "playlist" : "playlists"}
                </div>
              </div>
            </div>
          </div>

          {/* Folder Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              maxLength={30}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {name.length}/30 characters
            </p>
          </div>

          {/* Icon Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Icon
            </label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`aspect-square flex items-center justify-center text-xl rounded-lg transition-all ${
                    selectedEmoji === emoji
                      ? "bg-indigo-100 dark:bg-indigo-900/40 ring-2 ring-indigo-500 scale-110"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className="relative group"
                >
                  <div
                    className={`w-full aspect-square rounded-xl transition-all ${
                      selectedColor === color.value
                        ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-gray-100 scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                  {selectedColor === color.value && (
                    <Check className="absolute inset-0 m-auto w-5 h-5 text-white" />
                  )}
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 text-center">
                    {color.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Delete Section */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="outline"
              className="w-full border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Folder
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Playlists in this folder will not be deleted
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-4">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
