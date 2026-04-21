import { useState, useEffect } from "react";
import { Loader2, RefreshCw, ImageOff } from "lucide-react";
import { uploadPlaylistCover } from "../../../lib/spotify";
import { toast } from "sonner";

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY as string;

interface ImageGalleryProps {
  playlistId: string;
  playlistName: string;
  accessToken: string | null;
  onCoverUpdated: (newImageUrl: string) => void;
  onSaved: () => void;
}

async function imageUrlToBase64Jpeg(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const MAX = 1000;
      const scale = Math.min(MAX / img.width, MAX / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Spotify requires < 256KB base64 JPEG
      const base64 = canvas
        .toDataURL("image/jpeg", 0.85)
        .replace(/^data:image\/jpeg;base64,/, "");
      resolve(base64);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

export function ImageGallery({
  playlistId,
  playlistName,
  accessToken,
  onCoverUpdated,
  onSaved,
}: ImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    setError(false);
    try {
      const query = encodeURIComponent(`${playlistName} aesthetic`);
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=30&orientation=portrait`,
        { headers: { Authorization: PEXELS_API_KEY } },
      );
      const data = await res.json();
      if (!data.photos?.length) throw new Error("No images");
      setImages(
        data.photos.map((p: { src: { large: string } }) => p.src.large),
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [playlistName]);

  const handleSave = async () => {
    if (!accessToken || !selected) return;
    setSaving(true);
    try {
      const base64 = await imageUrlToBase64Jpeg(selected);
      await uploadPlaylistCover(accessToken, playlistId, base64);
      onCoverUpdated(selected);
      toast.success("Cover updated!");
      onSaved();
    } catch {
      toast.error("Couldn't set this image as cover. Try another one.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Finding images...</p>
      </div>
    );
  }

  if (error || !images.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <ImageOff className="w-10 h-10 text-gray-400" />
        <p className="text-sm text-gray-500 text-center">
          Couldn't load images.
          <br />
          Check your Pexels API key or try again.
        </p>
        <button
          onClick={fetchImages}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 pb-2">
        <p className="text-xs text-gray-500">Pick an image, then hit Save</p>
      </div>
      <div className="px-4 pb-20">
        <div className="columns-2 sm:columns-3 gap-2">
          {images.map((src) => (
            <div key={src} className="break-inside-avoid mb-2">
              <button
                onClick={() => setSelected(src === selected ? null : src)}
                className="relative w-full overflow-hidden rounded-xl group focus:outline-none"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const wrapper = (e.target as HTMLImageElement).closest(
                      ".break-inside-avoid",
                    );
                    if (wrapper)
                      (wrapper as HTMLElement).style.display = "none";
                  }}
                />
                {selected === src ? (
                  <div className="absolute inset-0 ring-3 ring-[#1DB954] rounded-xl bg-[#1DB954]/20 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#1DB954] flex items-center justify-center shadow">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors rounded-xl" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 flex justify-end px-4 py-3 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={handleSave}
          disabled={!selected || saving}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all duration-200 ${
            selected
              ? "bg-[#1DB954] hover:bg-[#1ed760] opacity-100"
              : "bg-[#1DB954] opacity-30 cursor-not-allowed"
          }`}
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
