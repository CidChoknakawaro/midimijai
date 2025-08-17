// src/utils/loadMagenta.ts
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // keep available
import "@tensorflow/tfjs-backend-cpu";   // we'll force CPU for stability on Windows
import * as mm from "@magenta/music";

declare global { interface Window { mm?: any } }

let pending: Promise<void> | null = null;

export async function ensureMagentaLoaded() {
  if (window.mm) return;
  if (pending) return pending;

  pending = (async () => {
    // Force CPU to avoid WebGL split bug on some GPUs
    await tf.setBackend("cpu");
    await tf.ready();
    window.mm = mm;
  })();

  await pending;
}
