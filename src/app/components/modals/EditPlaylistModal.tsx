import { useState, useRef } from "react";
import { X, Upload, Sparkles, Loader2, Images } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppStore } from "../../context/AppStore";
import { toast } from "sonner";
import { getGeminiSuggestion } from "../../../lib/gemini";
import { ImageGallery } from "../tools/ImageGallery";
import type { Playlist } from "../../../types";

interface Props {
  playlist: Playlist;
  onClose: () => void;
}

type CoverTab = "upload" | "browse";

export default function EditPlaylistModal({ playlist, onClose }: Props) {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(playlist.imageUrl || null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<"name" | "desc" | null>(null);
  const [coverTab, setCoverTab] = useState<CoverTab>("upload");
  const fileRef = useRef<HTMLInputElement>(null);
  const { updatePlaylist, accessToken } = useAuth();
  const { settings } = useAppStore();

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleAiSuggest = async (field: "name" | "desc") => {
    if (!settings.geminiApiKey) {
      toast.error("Add your Gemini API key in Settings");
      return;
    }
    setAiLoading(field);
    try {
      const prompt = field === "name"
        ? `Suggest a creative, aesthetic playlist name for a music playlist currently called "${playlist.name}". Just the name, no quotes, max 5 words.`
        : `Write a short, engaging description (under 100 characters) for a Spotify playlist called "${name}". No quotes.`;
      const suggestion = await getGeminiSuggestion(settings.geminiApiKey, prompt);
      if (field === "name") setName(suggestion.trim().replace(/^["']|["']$/g, ""));
      else setDescription(suggestion.trim().replace(/^["']|["']$/g, ""));
    } catch {
      toast.error("AI suggestion failed");
    } finally {
      setAiLoading(null);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updatePlaylist(playlist.id, {
        name: name.trim(),
        description: description.trim(),
        ...(imageBase64 ? { imageBase64 } : {}),
      });
      toast.success("Playlist updated");
      onClose();
    } catch {
      toast.error("Failed to update playlist");
    } finally {
      setSaving(false);
    }
  };

  const tabBtn = (tab: CoverTab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setCoverTab(tab)}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer",
        fontSize: 12, fontWeight: 600, transition: "all .15s",
        background: coverTab === tab ? "var(--bg)" : "transparent",
        color: coverTab === tab ? "var(--text)" : "var(--text2)",
        boxShadow: coverTab === tab ? "0 1px 4px rgba(0,0,0,.1)" : "none",
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="moverlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 520, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-hdr">
          <span className="modal-title">Edit playlist</span>
          <button className="btn-close-sm" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          {/* Cover section */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <label className="fm-label" style={{ marginBottom: 0 }}>Cover image</label>
              <div style={{ display: "flex", background: "var(--bg3)", borderRadius: 8, padding: 3, gap: 2 }}>
                {tabBtn("upload", "Upload", <Upload size={12} />)}
                {tabBtn("browse", "Browse Pexels", <Images size={12} />)}
              </div>
            </div>

            {coverTab === "upload" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: 120, height: 120, borderRadius: 12,
                    background: "var(--bg3)", cursor: "pointer",
                    overflow: "hidden", position: "relative",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Upload size={28} style={{ color: "var(--text2)" }} />
                  )}
                  <div
                    style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <Upload size={22} color="white" />
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleImagePick} />
                <span style={{ fontSize: 13, color: "var(--text2)", marginTop: 8 }}>Click to change cover (JPEG)</span>
              </div>
            ) : (
              <div style={{ margin: "0 -20px", maxHeight: 380, overflowY: "auto", borderRadius: 12 }}>
                <ImageGallery
                  playlistId={playlist.id}
                  playlistName={name || playlist.name}
                  accessToken={accessToken}
                  onCoverUpdated={(url) => {
                    setImagePreview(url);
                    setImageBase64(null);
                  }}
                  onSaved={onClose}
                />
              </div>
            )}
          </div>

          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label className="fm-label" style={{ marginBottom: 0 }}>Name</label>
              <button className="ai-btn" onClick={() => handleAiSuggest("name")} disabled={aiLoading !== null}>
                <Sparkles size={12} />
                {aiLoading === "name" ? <Loader2 size={12} className="animate-spin" /> : "AI"}
              </button>
            </div>
            <input className="fm-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label className="fm-label" style={{ marginBottom: 0 }}>Description</label>
              <button className="ai-btn" onClick={() => handleAiSuggest("desc")} disabled={aiLoading !== null}>
                <Sparkles size={12} />
                {aiLoading === "desc" ? <Loader2 size={12} className="animate-spin" /> : "AI"}
              </button>
            </div>
            <textarea className="fm-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
