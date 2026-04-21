import { motion, AnimatePresence } from "motion/react";
import { Folder as FolderIcon, FolderOpen, Plus, Pencil } from "lucide-react";
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
  editMode = false,
  onToggleEditMode,
}: FolderSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* Create New Folder Button */}
      <Link to="/new-folder">
        <motion.button
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Create new folder"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </Link>

      {/* Edit Mode Toggle Button */}
      {onToggleEditMode && (
        <motion.button
          onClick={onToggleEditMode}
          className={`flex items-center justify-center w-10 h-10 rounded-xl font-medium text-sm transition-all ${
            editMode
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={editMode ? "Exit edit mode" : "Enter edit mode"}
        >
          <Pencil className="w-5 h-5" />
        </motion.button>
      )}

      {/* All Playlists Button */}
      <motion.button
        onClick={() => onSelectFolder(null)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
          selectedFolderId === null
            ? "bg-indigo-600 text-white shadow-md"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-indigo-300"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {selectedFolderId === null ? (
          <FolderOpen className="w-4 h-4" />
        ) : (
          <FolderIcon className="w-4 h-4" />
        )}
        <span>All Playlists</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            selectedFolderId === null
              ? "bg-white/20 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          {Object.values(playlistCounts).reduce((a, b) => a + b, 0)}
        </span>
      </motion.button>

      {/* Folder Buttons */}
      {folders.map((folder) => (
        <motion.div key={folder.id} className="relative">
          <motion.button
            onClick={() => onSelectFolder(folder.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all border ${
              selectedFolderId === folder.id
                ? "shadow-md"
                : "bg-white dark:bg-gray-800 hover:shadow-sm"
            }`}
            style={{
              backgroundColor:
                selectedFolderId === folder.id ? folder.color : undefined,
              color: selectedFolderId === folder.id ? "#ffffff" : undefined,
              borderColor:
                selectedFolderId === folder.id ? folder.color : undefined,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span
              className={
                selectedFolderId === folder.id
                  ? ""
                  : "text-gray-700 dark:text-gray-200"
              }
              style={
                selectedFolderId === folder.id
                  ? { color: "#ffffff" }
                  : undefined
              }
            >
              <span className="text-base mr-1">{folder.icon}</span>
              {folder.name}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                selectedFolderId === folder.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {playlistCounts[folder.id] || 0}
            </span>
          </motion.button>

          {/* Folder Edit Button (appears in edit mode) */}
          <AnimatePresence>
            {editMode && onEditFolder && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: -10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditFolder(folder);
                }}
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 rounded-lg flex items-center justify-center transition-colors shadow-sm"
              >
                <Pencil className="w-3 h-3 text-gray-600 dark:text-gray-300" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
