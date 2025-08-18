import axios from "axios";
const RAW = import.meta.env.VITE_API_URL || "http://localhost:10000";
const BASE = RAW.replace(/\/+$/, ""); // trim trailing slash(es)
// If someone set VITE_API_URL to ".../ai" already, don't double-append.
const POST_PATH = /\/ai$/i.test(BASE) ? "/generate" : "/ai/generate";
const URL = `${BASE}${POST_PATH}`;
// (Optional) log once to help debug deployed URL
if (typeof window !== "undefined" && !window.__AI_URL_LOGGED__) {
    window.__AI_URL_LOGGED__ = true;
    // eslint-disable-next-line no-console
    console.log("[AI post URL]", URL);
}
export async function postAIGenerate(params) {
    const token = localStorage.getItem("token") || "";
    const res = await axios.post(URL, {
        prompt: params.prompt,
        mode: params.mode ?? "generate",
        length_beats: params.length_beats ?? 64,
        temperature: params.temperature ?? 1.0,
    }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return res.data;
}
