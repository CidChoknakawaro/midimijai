// frontend/src/services/aiService.ts
import axios from "axios";

// Base URL for your AI router
const AI_API_URL = "http://localhost:8000/ai";

// helper to attach JWT
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * The request body you send to /ai/ai/generate
 */
export interface AIGenerateRequest {
  /**
   * The user prompt, e.g. "Generate chord progression in C minor"
   */
  prompt: string;
  /**
   * Which mode: 
   *  - "suggest" for suggestions list, 
   *  - "generate" for a fresh MIDI, 
   *  - "modify-suggest" / "modify", 
   *  - "style-suggest" / "style"
   */
  mode: 
    | "suggest" 
    | "generate" 
    | "modify-suggest" 
    | "modify" 
    | "style-suggest" 
    | "style";
}

/**
 * The shape of whatever your AI endpoint returns.
 * Adjust fields once your backend returns real data.
 */
export interface AIGenerateResponse {
  suggestions: string[];
  /**
   * If mode was "generate"/"modify"/"style", you might return
   * a URL or base64 for the new MIDI file
   */
  midi?: string;
}

/**
 * Call the AI endpoint. 
 * Returns suggestions (and maybe a MIDI payload).
 */
export const postAIGenerate = async (
  body: AIGenerateRequest
): Promise<AIGenerateResponse> => {
  const res = await axios.post(
    `${AI_API_URL}/ai/generate`,
    body,
    getAuthHeader()
  );
  return res.data;
};
