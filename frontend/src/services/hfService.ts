// src/services/hfService.ts
import { HfInference } from "@huggingface/inference";

const HF_MODEL = "Qwen/Qwen2.5-1.5B-Instruct"; // small, free, flexible
const token = import.meta.env.VITE_HF_TOKEN as string | undefined;

// Fallback if no token: we'll still attempt; HF allows limited anon for some models.
// You can also switch to a tiny text-classifier if desired.
const hf = new HfInference(token);

export type PromptAnalysis = {
  genre: string;      // e.g., "lofi", "pop", "house", "jazz"
  mood: string;       // e.g., "chill", "happy", "dark"
  bpm: number;        // suggested BPM
  bars: number;       // length in bars
  temperature: number;// 0.2..1.5
  key: string;        // "C", "D#", "F", etc. (used just for display; Magenta is key-agnostic)
};

const SYSTEM = `You are a music prompt analyzer. 
Given a short text from a user, return STRICT JSON with keys:
genre (string), mood (string), bpm (int), bars (int), temperature (float), key (capital letter with optional #/b).
Keep bpm between 70 and 150, bars between 4 and 64, temperature between 0.2 and 1.5. No extra text.`;

export async function analyzePromptToJSON(userPrompt: string): Promise<PromptAnalysis> {
  try {
    const res = await hf.chatCompletion({
      model: HF_MODEL,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 200,
      temperature: 0.5,
    });

    const content = res.choices?.[0]?.message?.content ?? "{}";
    // Some models return JSON fenced in code blocks. Strip if needed:
    const json = content.replace(/^```json|```$/g, "").trim();
    const parsed = JSON.parse(json);

    // lightweight sanity defaults
    return {
      genre: parsed.genre || "pop",
      mood: parsed.mood || "bright",
      bpm: Math.min(150, Math.max(70, Number(parsed.bpm) || 120)),
      bars: Math.min(64, Math.max(4, Number(parsed.bars) || 8)),
      temperature: Math.min(1.5, Math.max(0.2, Number(parsed.temperature) || 1.0)),
      key: parsed.key || "C",
    };
  } catch {
    // Offline fallback if HF is unavailable
    return {
      genre: "pop",
      mood: "bright",
      bpm: 120,
      bars: 8,
      temperature: 0.9,
      key: "C",
    };
  }
}
