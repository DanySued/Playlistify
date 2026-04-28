import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Images,
  FileText,
  ExternalLink,
  Trash2,
  FolderPlus,
  X,
  ChevronRight,
} from "lucide-react";
import { ImageGallery } from "./tools/ImageGallery";
import { DescriptionEditor } from "./tools/DescriptionEditor";
import type { Playlist, Folder } from "../../types";

type Tool = "gallery" | "description" | "boards" | null;

function ToolPane({ paneKey, children, className }: { paneKey: string; children: ReactNode; className?: string }) {
  return (
    <motion.div
      key={paneKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface PlaylistToolsPanelProps {
  playlist: Playlist;
  folders: Folder[];
  accessToken: string | null;
  onClose: () => void;
  onCoverUpdated: (playlistId: string, imageUrl: string) => void;
  onUpdatePlaylist: (
    id: string,
    updates: { name?: string; description?: string },
  ) => Promise<void>;
  onDeletePlaylist: (id: string) => Promise<void>;
  onUpdateFolder: (playlistId: string, folderId: string | null) => void;
}

const tools = [
  { id: "gallery" as Tool, icon: Images, label: "Cover" },
  { id: "description" as Tool, icon: FileText, label: "Edit" },
  { id: "boards" as Tool, icon: FolderPlus, label: "Board" },
];

export function PlaylistToolsPanel({
  playlist,
  folders,
  accessToken,
  onClose,
  onCoverUpdated,
  onUpdatePlaylist,
  onDeletePlaylist,
  onUpdateFolder,
}: PlaylistToolsPanelProps) {
  const [activeTool, setActiveTool] = useState<Tool>("gallery");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentFolder = folders.find((f) => f.id === playlist.folderId);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDeletePlaylist(playlist.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />

      {/* Panel */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 320 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-950 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col mx-4"
        style={{ width: "calc(100% - 2rem)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 shrink-0 border-b border-gray-100 dark:border-gray-800">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-800">
            {playlist.imageUrl && (
              <img
                src={playlist.imageUrl}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-white truncate">
              {playlist.name}
            </h2>
            {currentFolder && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                in {currentFolder.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Tool bar */}
        <div className="flex items-center px-4 py-3 gap-2 shrink-0 border-b border-gray-100 dark:border-gray-800">
          {tools.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTool(activeTool === id ? null : id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all flex-1 ${
                activeTool === id
                  ? "bg-[#1DB954] text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}

          {/* Open in Spotify */}
          <a
            href={playlist.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex-1"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="text-xs font-medium">Open</span>
          </a>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-1"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-xs font-medium">Delete</span>
          </button>
        </div>

        {/* Tool content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTool === "gallery" && (
              <ToolPane paneKey="gallery">
                <ImageGallery
                  playlistId={playlist.id}
                  playlistName={playlist.name}
                  accessToken={accessToken}
                  onCoverUpdated={(url) => onCoverUpdated(playlist.id, url)}
                  onSaved={onClose}
                />
              </ToolPane>
            )}

            {activeTool === "description" && (
              <ToolPane paneKey="description">
                <DescriptionEditor
                  playlistId={playlist.id}
                  initialName={playlist.name}
                  initialDescription={playlist.description}
                  onSave={(name, description) =>
                    onUpdatePlaylist(playlist.id, { name, description })
                  }
                />
              </ToolPane>
            )}

            {activeTool === "boards" && (
              <ToolPane paneKey="boards" className="h-full overflow-y-auto p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Add to board
                </p>

                {/* No board option */}
                <button
                  onClick={() => {
                    onUpdateFolder(playlist.id, null);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    !playlist.folderId
                      ? "bg-[#1DB954]/10 text-[#1DB954]"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="font-medium text-sm">No board</span>
                  {!playlist.folderId && <ChevronRight className="w-4 h-4" />}
                </button>

                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      onUpdateFolder(playlist.id, folder.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                      playlist.folderId === folder.id
                        ? "bg-[#1DB954]/10 text-[#1DB954]"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: folder.color }}
                      />
                      <span className="font-medium text-sm">{folder.name}</span>
                    </div>
                    {playlist.folderId === folder.id && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </ToolPane>
            )}
          </AnimatePresence>
        </div>

        {/* Delete confirmation */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white dark:bg-gray-950 rounded-3xl flex flex-col items-center justify-center gap-5 px-8 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Remove this playlist?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  "{playlist.name}" will be unfollowed from your Spotify
                  account.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {deleting ? "Removing..." : "Remove"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
