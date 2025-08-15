export type PromptAnalysis = {
  genre: string;
  mood: string;
  bpm: number;
  bars: number;
  temperature: number;
  key: string;
  meta?: { source: "huggingface" | "fallback" };
};

const HF_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small";
const TOKEN = import.meta.env.VITE_HF_TOKEN;

const promptTemplate = (user: string) => `
You are a music assistant. Convert the user's idea into strict JSON with keys:
genre, mood, bpm, bars, temperature, key.
bpm: int 70..160, bars: int 4..64, temperature: float 0.2..1.5
User: "${user}"
JSON ONLY:
`;

export async function analyzePromptToJSON(userPrompt: string): Promise<PromptAnalysis> {
  try {
    if (!TOKEN) throw new Error("no-token");
    const res = await fetch(HF_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: promptTemplate(userPrompt) }),
    });
    const data = await res.json();

    const text =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : typeof data === "string"
        ? data
        : JSON.stringify(data);

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    const parsed = JSON.parse(text.slice(start, end + 1));

    return {
      genre: parsed.genre || "pop",
      mood: parsed.mood || "bright",
      bpm: Math.min(160, Math.max(70, Number(parsed.bpm) || 120)),
      bars: Math.min(64, Math.max(4, Number(parsed.bars) || 8)),
      temperature: Math.min(1.5, Math.max(0.2, Number(parsed.temperature) || 0.9)),
      key: parsed.key || "C",
      meta: { source: "huggingface" },
    };
  } catch {
    // safe local defaults (used when no token or API fails)
    return {
      genre: "pop",
      mood: "bright",
      bpm: 120,
      bars: 8,
      temperature: 0.9,
      key: "C",
      meta: { source: "fallback" },
    };
  }
}
