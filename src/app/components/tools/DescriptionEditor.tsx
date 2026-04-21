import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import {
  suggestPlaylistDescriptions,
  suggestPlaylistName,
} from "../../../lib/gemini";
import { toast } from "sonner";

interface DescriptionEditorProps {
  playlistId: string;
  initialName: string;
  initialDescription: string;
  onSave: (name: string, description: string) => Promise<void>;
}

export function DescriptionEditor({
  initialName,
  initialDescription,
  onSave,
}: DescriptionEditorProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [descSuggestions, setDescSuggestions] = useState<string[]>([]);
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [loadingName, setLoadingName] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSuggestDesc = async () => {
    setLoadingDesc(true);
    setDescSuggestions([]);
    try {
      const suggestions = await suggestPlaylistDescriptions(name);
      setDescSuggestions(suggestions);
    } catch {
      toast.error("Couldn't connect to Gemini. Check your API key.");
    } finally {
      setLoadingDesc(false);
    }
  };

  const handleSuggestName = async () => {
    setLoadingName(true);
    setNameSuggestions([]);
    try {
      const suggestions = await suggestPlaylistName(name);
      setNameSuggestions(suggestions);
    } catch {
      toast.error("Couldn't connect to Gemini. Check your API key.");
    } finally {
      setLoadingName(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(name, description);
      toast.success("Playlist updated!");
    } catch {
      toast.error("Failed to update playlist.");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = name !== initialName || description !== initialDescription;

  return (
    <div className="p-4 space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Playlist name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
        />
        <button
          onClick={handleSuggestName}
          disabled={loadingName}
          className="flex items-center gap-2 text-sm text-[#1DB954] font-medium hover:underline disabled:opacity-50"
        >
          {loadingName ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Suggest names with AI
        </button>
        {nameSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {nameSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setName(s);
                  setNameSuggestions([]);
                }}
                className="px-3 py-1.5 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-sm font-medium hover:bg-[#1DB954]/20 transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          placeholder="What's the vibe of this playlist?"
        />
        <button
          onClick={handleSuggestDesc}
          disabled={loadingDesc}
          className="flex items-center gap-2 text-sm text-[#1DB954] font-medium hover:underline disabled:opacity-50"
        >
          {loadingDesc ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Suggest a description with AI
        </button>
        {descSuggestions.length > 0 && (
          <div className="space-y-2 pt-1">
            {descSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setDescription(s);
                  setDescSuggestions([]);
                }}
                className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-[#1DB954]/10 text-sm text-gray-700 dark:text-gray-300 transition-colors border border-gray-100 dark:border-gray-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!hasChanges || saving}
        className="w-full py-3 rounded-xl bg-[#1DB954] text-white font-semibold text-sm hover:bg-[#1ed760] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        Save changes
      </button>
    </div>
  );
}
