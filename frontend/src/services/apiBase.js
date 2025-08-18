// Decides which API base URL to use (dev vs prod) and trims trailing slashes.
const isDev = import.meta.env.DEV;

const RAW =
  isDev
    ? (import.meta.env.VITE_DEV_API_BASE ?? "http://localhost:10000") // local backend in dev
    : import.meta.env.VITE_API_URL;                                   // Render URL in prod (Vercel build)

if (!RAW && !isDev) {
  // Optional: warn if Vercel build forgot to set VITE_API_URL
  // eslint-disable-next-line no-console
  console.warn("VITE_API_URL is not set for production build.");
}

export const API_BASE = (RAW || "").replace(/\/+$/, "");
