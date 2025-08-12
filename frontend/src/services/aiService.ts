// frontend/src/services/aiService.ts
import axios from "axios";

const AI_API_URL = "http://localhost:8000/ai";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export type AIMode =
  | "suggest"
  | "generate"
  | "modify-suggest"
  | "modify"
  | "style-suggest"
  | "style";

export interface AIGenerateRequest {
  prompt: string;
  mode?: AIMode;             // <- optional (backend supports it)
  length_beats?: number;
  temperature?: number;
}

export interface AIGenerateResponse {
  suggestions?: string[];
  data?: any;                // project-shaped { bpm, tracks: [...] }
  midi?: string;
}

export const postAIGenerate = async (
  body: AIGenerateRequest
): Promise<AIGenerateResponse> => {
  // FIX: remove duplicate /ai; endpoint is /ai/generate not /ai/ai/generate
  const res = await axios.post(`${AI_API_URL}/generate`, body, getAuthHeader());
  return res.data;
};
