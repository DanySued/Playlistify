import { PlaylistCard } from "./PlaylistCard";
import { Skeleton } from "./ui/skeleton";
import type { Playlist } from "../../types";

interface BentoGridProps {
  playlists: Playlist[];
  isLoading: boolean;
  folderName?: string | null;
  editMode?: boolean;
  onEditPlaylist?: (playlist: Playlist) => void;
}

// Mirror the size order of mockPlaylists for skeletons
const skeletonSizes: Playlist["size"][] = [
  "large",
  "medium",
  "medium",
  "wide",
  "medium",
  "medium",
  "tall",
  "medium",
  "medium",
  "wide",
  "medium",
  "medium",
];

const skeletonClasses: Record<Playlist["size"], string> = {
  small: "col-span-1 row-span-1",
  medium: "col-span-1 row-span-1",
  large: "col-span-2 row-span-2",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
};

export function BentoGrid({
  playlists,
  isLoading,
  folderName,
  editMode,
  onEditPlaylist,
}: BentoGridProps) {
  return (
    <div>
      {folderName && !isLoading && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing playlists in{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {folderName}
            </span>
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[280px] grid-flow-dense">
        {isLoading ? (
          skeletonSizes.map((size, i) => (
            <Skeleton
              key={i}
              className={`rounded-xl ${skeletonClasses[size]}`}
            />
          ))
        ) : playlists.length > 0 ? (
          playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              editMode={editMode}
              onEditPlaylist={onEditPlaylist}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📁</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              No playlists in this folder
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {folderName
                ? `Add playlists to ${folderName}`
                : "Try selecting a different folder"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
