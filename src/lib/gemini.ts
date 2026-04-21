const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function suggestPlaylistDescriptions(
  playlistName: string,
  trackCount?: number,
): Promise<string[]> {
  const prompt = `You are writing short, fun, personality-filled descriptions for a Spotify playlist called "${playlistName}"${trackCount ? ` with ${trackCount} songs` : ""}.

Write exactly 3 short descriptions (max 60 words each). Make them feel personal, not like marketing copy. Each one should have a slightly different vibe — one moody, one energetic, one poetic or witty. Use casual language. No bullet points, no numbering. Separate each description with the exact string "|||".`;

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1.1, maxOutputTokens: 400 },
    }),
  });

  if (!res.ok) throw new Error("Gemini API error");

  const data = await res.json();
  const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return raw
    .split("|||")
    .map((s: string) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export async function suggestPlaylistName(
  currentName: string,
): Promise<string[]> {
  const prompt = `Suggest 3 creative, short alternative names for a Spotify playlist currently called "${currentName}". Make them catchy and personal-feeling. No generic names. Separate each with "|||".`;

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1.2, maxOutputTokens: 150 },
    }),
  });

  if (!res.ok) throw new Error("Gemini API error");

  const data = await res.json();
  const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return raw
    .split("|||")
    .map((s: string) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}
