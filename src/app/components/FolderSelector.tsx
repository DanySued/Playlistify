import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import type { Folder } from "../../types";

interface FolderSelectorProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  playlistCounts: Record<string, number>;
  onEditFolder?: (folder: Folder) => void;
  editMode?: boolean;
  onToggleEditMode?: () => void;
}

export function FolderSelector({
  folders,
  selectedFolderId,
  onSelectFolder,
  playlistCounts,
  onEditFolder,
  editMode,
}: FolderSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link to="/new-folder">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          title="New board"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </Link>

      <motion.button
        onClick={() => onSelectFolder(null)}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
          selectedFolderId === null
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        All
      </motion.button>

      {folders.map((folder) => (
        <motion.button
          key={folder.id}
          onClick={() => {
            onSelectFolder(folder.id);
            if (editMode && onEditFolder) onEditFolder(folder);
          }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            selectedFolderId === folder.id
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {folder.name}
          {playlistCounts[folder.id] ? (
            <span className="ml-1.5 opacity-60 font-normal">
              {playlistCounts[folder.id]}
            </span>
          ) : null}
        </motion.button>
      ))}
    </div>
  );
}
