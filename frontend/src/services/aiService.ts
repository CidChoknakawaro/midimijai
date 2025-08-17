// src/services/aiService.ts
import axios from "axios";

const RAW = import.meta.env.VITE_API_URL || "http://localhost:8000";
const BASE = RAW.replace(/\/+$/, ""); // trim trailing slash(es)

// If someone set VITE_API_URL to ".../ai" already, don't add it again
const POST_PATH = /\/ai$/i.test(BASE) ? "/generate" : "/ai/generate";
const URL = `${BASE}${POST_PATH}`;

// (Once per session) log the resolved URL to make debugging easy
if (typeof window !== "undefined" && !(window as any).__AI_URL_LOGGED__) {
  (window as any).__AI_URL_LOGGED__ = true;
  // eslint-disable-next-line no-console
  console.log("[AI post URL]", URL);
}

export type Mode = "generate" | "suggest" | "modify" | "style";

export async function postAIGenerate(params: {
  prompt: string;
  mode?: Mode;
  length_beats?: number;
  temperature?: number;
}) {
  const token = localStorage.getItem("token") || "";
  const res = await axios.post(
    URL,
    {
      prompt: params.prompt,
      mode: params.mode ?? "generate",
      length_beats: params.length_beats ?? 64,
      temperature: params.temperature ?? 1.0,
    },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );
  return res.data; // {data: project} OR {suggestions: string[]}
}
