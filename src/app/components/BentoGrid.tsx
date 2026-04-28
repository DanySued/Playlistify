import { PlaylistCard } from "./PlaylistCard";
import { Folder } from "lucide-react";
import type { Playlist } from "../../types";

interface BentoGridProps {
  playlists: Playlist[];
  isLoading: boolean;
  folderName?: string | null;
  onCardClick: (playlist: Playlist) => void;
}

const skeletonAspects = [
  "aspect-[2/3]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[2/3]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[2/3]",
  "aspect-square",
  "aspect-[2/3]",
  "aspect-[3/4]",
  "aspect-square",
];

export function BentoGrid({
  playlists,
  isLoading,
  folderName,
  onCardClick,
}: BentoGridProps) {
  return (
    <div>
      {folderName && !isLoading && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Showing playlists in{" "}
            <span className="font-semibold text-gray-700">{folderName}</span>
          </p>
        </div>
      )}

      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {isLoading ? (
          skeletonAspects.map((aspect, i) => (
            <div key={i} className="break-inside-avoid mb-4">
              <div
                className={`${aspect} rounded-2xl bg-gray-200 animate-pulse`}
              />
              <div className="mt-2 h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))
        ) : playlists.length > 0 ? (
          playlists.map((playlist, i) => (
            <div key={playlist.id} className="break-inside-avoid mb-4">
              <PlaylistCard
                playlist={playlist}
                index={i}
                onCardClick={onCardClick}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No playlists found
            </h3>
            <p className="text-sm text-gray-500">
              {folderName
                ? `Add playlists to ${folderName}`
                : "Try a different search"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
