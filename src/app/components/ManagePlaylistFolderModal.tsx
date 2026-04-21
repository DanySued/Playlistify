import { useState } from "react";
import { X, Folder, Check } from "lucide-react";
import { Button } from "./ui/button";

interface Folder {
  id: string;
  name: string;
  emoji: string;
  color: string;
  playlistCount: number;
}

interface Playlist {
  id: string;
  name: string;
  imageUrl: string;
  folderId: string | null;
}

interface ManagePlaylistFolderModalProps {
  playlist: Playlist;
  folders: Folder[];
  onClose: () => void;
  onUpdate: (playlistId: string, folderId: string | null) => void;
}

export function ManagePlaylistFolderModal({
  playlist,
  folders,
  onClose,
  onUpdate,
}: ManagePlaylistFolderModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    playlist.folderId,
  );

  const handleSave = () => {
    onUpdate(playlist.id, selectedFolderId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Manage Folder
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[300px]">
              {playlist.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Select a folder for this playlist or remove it from any folder
          </p>

          <div className="space-y-2">
            {/* No folder option */}
            <button
              onClick={() => setSelectedFolderId(null)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selectedFolderId === null
                  ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Folder className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    No Folder
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Remove from all folders
                  </div>
                </div>
              </div>
              {selectedFolderId === null && (
                <Check className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Folder options */}
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedFolderId === folder.id
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: `${folder.color}20`,
                      color: folder.color,
                    }}
                  >
                    {folder.emoji}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {folder.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {folder.playlistCount}{" "}
                      {folder.playlistCount === 1 ? "playlist" : "playlists"}
                    </div>
                  </div>
                </div>
                {selectedFolderId === folder.id && (
                  <Check className="w-5 h-5 text-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-4">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
