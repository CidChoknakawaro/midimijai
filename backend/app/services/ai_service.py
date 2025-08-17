# app/services/ai_service.py
#
# Local Hugging Face "text2midi" integration (no API key).
# - Downloads model files once via hf_hub_download (cached in ~/.cache/huggingface)
# - Runs inference on CUDA / MPS / CPU
# - Converts the generated MIDI to your note schema using pretty_midi
#
# Model: amaai-lab/text2midi  (see README Quickstart)
# Ref: https://github.com/AMAAI-Lab/Text2midi  and HF model card
#
import io
import os
import pickle
from typing import Any, Dict, List

import torch
import torch.nn as nn
from transformers import T5Tokenizer
from huggingface_hub import hf_hub_download
import pretty_midi


# ------------------------------
# One-time engine (lazy singleton)
# ------------------------------
class _Text2MidiEngine:
    def __init__(self):
        self._ready = False
        self.device = "cuda" if torch.cuda.is_available() else (
            "mps" if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available() else "cpu"
        )
        self.repo_id = os.getenv("HF_TEXT2MIDI_REPO", "amaai-lab/text2midi")
        # files per Text2midi Quickstart
        self._model_bin = "pytorch_model.bin"
        self._vocab_pkl = "vocab_remi.pkl"
        self.model = None
        self.r_tokenizer = None
        self.tokenizer = None

    def _load(self):
        # Download weights + tokenizer assets
        model_path = hf_hub_download(repo_id=self.repo_id, filename=self._model_bin)
        vocab_path = hf_hub_download(repo_id=self.repo_id, filename=self._vocab_pkl)

        # Load REMI tokenizer dictionary
        with open(vocab_path, "rb") as f:
            self.r_tokenizer = pickle.load(f)

        vocab_size = len(self.r_tokenizer)

        # Import the model class from the repo structure (matches their README)
        # text2midi/model/transformer_model.py -> class Transformer(...)
        from model.transformer_model import Transformer  # type: ignore

        # Construct and load weights
        self.model = Transformer(
            vocab_size=vocab_size,
            d_model=768,
            nhead=8,
            dim_feedforward=2048,
            num_layers=18,
            max_seq_len=1024,
            use_rel_pos_enc=False,
            num_layers_t5=8,
            device=self.device
        )
        state = torch.load(model_path, map_location=self.device)
        self.model.load_state_dict(state)
        self.model.eval()

        # Conditioning text tokenizer
        self.tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-base")

        self._ready = True

    def ensure_ready(self):
        if not self._ready:
            self._load()

    @torch.inference_mode()
    def generate_mid_bytes(self, prompt: str, max_len: int = 2000, temperature: float = 1.0) -> bytes:
        self.ensure_ready()

        # Encode prompt
        inputs = self.tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
        input_ids = nn.utils.rnn.pad_sequence(inputs.input_ids, batch_first=True, padding_value=0).to(self.device)
        attention_mask = nn.utils.rnn.pad_sequence(inputs.attention_mask, batch_first=True, padding_value=0).to(self.device)

        # Generate token sequence, decode to MIDI object (provided by r_tokenizer)
        output = self.model.generate(input_ids, attention_mask, max_len=max_len, temperature=temperature)
        token_ids = output[0].tolist()
        midi_obj = self.r_tokenizer.decode(token_ids)

        # Dump to in-memory bytes
        buf = io.BytesIO()
        midi_obj.dump_midi(buf)  # text2midi’s REMI tokenizer returns an object with dump_midi()
        return buf.getvalue()


ENGINE = _Text2MidiEngine()


# ------------------------------
# Public API used by routers/ai.py
# ------------------------------
def generate_midi_from_prompt(prompt: str, length_beats: int = 64, temperature: float = 1.0) -> Dict[str, Any]:
    """
    Returns a project-shaped dict:
      { "bpm": <int>, "tracks": [{ id, name, instrument, notes: [{pitch,time,duration,velocity}], ... }] }
    """
    # Generate raw MIDI bytes locally (HF library, no API key)
    mid_bytes = ENGINE.generate_mid_bytes(prompt, max_len=2000, temperature=temperature)

    # Parse MIDI to note events
    pm = pretty_midi.PrettyMIDI(io.BytesIO(mid_bytes))

    # Choose BPM. If no explicit tempo map, pretty_midi can estimate.
    bpm = int(round(pm.estimate_tempo() or 120))

    # Convert seconds -> beats
    def sec_to_beats(t_sec: float) -> float:
        return (t_sec * bpm) / 60.0

    # Build a single combined melody line for now (you can split per instrument later)
    notes_out: List[Dict[str, Any]] = []
    for inst in pm.instruments:
        # treat first non-drum instrument as melody
        if inst.is_drum:
            continue
        for n in inst.notes:
            start_b = round(sec_to_beats(float(n.start)) * 64) / 64.0
            end_b = round(sec_to_beats(float(n.end)) * 64) / 64.0
            dur_b = max(0.125, end_b - start_b)
            vel = int(getattr(n, "velocity", 100))
            notes_out.append({
                "time": start_b,
                "duration": dur_b,
                "pitch": int(n.pitch),
                "velocity": min(127, max(1, vel)),
            })
        # only take the first melodic instrument for now
        if notes_out:
            break

    # Fallback if everything was drums (rare)
    if not notes_out:
        for n in pm.instruments[0].notes if pm.instruments else []:
            start_b = round(sec_to_beats(float(n.start)) * 64) / 64.0
            end_b = round(sec_to_beats(float(n.end)) * 64) / 64.0
            dur_b = max(0.125, end_b - start_b)
            vel = int(getattr(n, "velocity", 100))
            notes_out.append({
                "time": start_b,
                "duration": dur_b,
                "pitch": int(n.pitch),
                "velocity": min(127, max(1, vel)),
            })

    data = {
        "bpm": bpm,
        "tracks": [
            {
                "id": "melody-text2midi",
                "name": f"Melody: {prompt[:48]}",
                "instrument": "piano",
                "notes": sorted(notes_out, key=lambda x: (x["time"], x["pitch"])),
            }
        ],
    }
    return data


# Optional helper stubs you already expose from routers/ai.py
def suggest_from_prompt(prompt: str) -> List[str]:
    return [f"Try a slower tempo ballad of: {prompt[:48]}…"]

def modify_from_prompt(prompt: str) -> Dict[str, Any]:
    return {"ok": True, "details": "Modify not implemented yet."}

def style_from_prompt(prompt: str) -> Dict[str, Any]:
    return {"ok": True, "details": "Style not implemented yet."}
