# app/services/ai_service.py
from __future__ import annotations
from typing import Dict, Any, List, Tuple
import json, os, re

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

# ========= Configuration =========
_MODEL_ID = os.getenv("FLAN_MODEL_ID", "google/flan-t5-small")
_DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Debug raw model output: set AI_DEBUG=1
_AI_DEBUG = os.getenv("AI_DEBUG", "0") == "1"

# Use robust 2-phase composer: default to ON
_USE_PLAN = True  # was env-driven before; force ON to avoid fallback JSON issues

# ========= Model bootstrap =========
_tokenizer = None
_model = None

def _ensure_model() -> Tuple[AutoTokenizer, AutoModelForSeq2SeqLM]:
    global _tokenizer, _model
    if _tokenizer is None or _model is None:
        _tokenizer = AutoTokenizer.from_pretrained(_MODEL_ID)
        _model = AutoModelForSeq2SeqLM.from_pretrained(_MODEL_ID).to(_DEVICE)
    return _tokenizer, _model

def _generate_text(prompt: str, max_new_tokens: int = 256) -> str:
    tok, mdl = _ensure_model()
    inputs = tok(prompt, return_tensors="pt").to(_DEVICE)
    out = mdl.generate(
        **inputs,
        do_sample=False,
        temperature=1.0,
        top_p=1.0,
        num_beams=1,
        max_new_tokens=max_new_tokens,
        repetition_penalty=1.0,
    )
    text = tok.decode(out[0], skip_special_tokens=True).strip()
    if _AI_DEBUG:
        print("\n[AI RAW OUTPUT]\n", text[:1200], "\n---\n")
    return text

# ========= Helpers =========
def _parse_json_maybe(raw: str) -> Dict[str, Any] | None:
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    m = re.search(r"\{.*\}", raw, flags=re.S)
    if m:
        try:
            return json.loads(m.group(0))
        except Exception:
            pass
    return None

PITCH_CLASS = {"C":0,"C#":1,"Db":1,"D":2,"D#":3,"Eb":3,"E":4,"F":5,"F#":6,"Gb":6,"G":7,"G#":8,"Ab":8,"A":9,"A#":10,"Bb":10,"B":11}
CHORD_TEMPLATES = {
    "maj":[0,4,7], "min":[0,3,7], "7":[0,4,7,10], "maj7":[0,4,7,11],
    "min7":[0,3,7,10], "dim":[0,3,6], "m7b5":[0,3,6,10], "sus2":[0,2,7], "sus4":[0,5,7]
}

def _root_pc(symbol: str) -> int:
    m = re.match(r"([A-G][b#]?)", symbol)
    return PITCH_CLASS.get(m.group(1), 0) if m else 0

def _quality(symbol: str) -> str:
    s = symbol.lower()
    if "m7b5" in s or "ø" in s: return "m7b5"
    if "dim" in s or "°" in s:  return "dim"
    if "maj7" in s:             return "maj7"
    if "min7" in s or "m7" in s:return "min7"
    if "min" in s or "m" in s:  return "min"
    if "sus2" in s:             return "sus2"
    if "sus4" in s:             return "sus4"
    if "7" in s:                return "7"
    return "maj"

def _notes_for_chord(symbol: str, octave_base: int) -> List[int]:
    root = _root_pc(symbol)
    tpl = CHORD_TEMPLATES.get(_quality(symbol), CHORD_TEMPLATES["maj"])
    return [octave_base + ((root + iv) % 12) for iv in tpl]

def _plan_from_llm(idea: str) -> dict:
    schema = """Return ONLY compact JSON (no prose) with:
{
  "bpm": int (60-180),
  "key": string like "C minor" or "A major",
  "instrument": string,
  "groove": "straight"|"swing",
  "pattern": "arp"|"chords"|"bass"|"melody",
  "chords": ["Am7","Dm7","G7","Cmaj7"]    // 4-8 symbols
}"""
    raw = _generate_text(schema + f"\nIdea: {idea}\nReturn JSON now.", max_new_tokens=200)
    data = _parse_json_maybe(raw) or {}
    bpm = int(float(data.get("bpm", 120)) if str(data.get("bpm","")).strip() else 120)
    bpm = max(60, min(180, bpm))
    key = (data.get("key") or "C major").strip()
    instrument = (data.get("instrument") or "Piano").strip()
    groove = "swing" if "swing" in str(data.get("groove","")).lower() else "straight"
    pattern = str(data.get("pattern","arp")).lower()
    if pattern not in {"arp","chords","bass","melody"}: pattern = "arp"
    chords = data.get("chords") or ["Am7","Dm7","G7","Cmaj7"]
    chords = [str(c)[:8] for c in chords][:8]
    if not chords: chords = ["Am7","Dm7","G7","Cmaj7"]
    return {"bpm": bpm, "key": key, "instrument": instrument or "Piano",
            "groove": groove, "pattern": pattern, "chords": chords}

def _compose_from_plan(plan: dict, length_beats: int = 64) -> Dict[str, Any]:
    base_oct = 60  # around C4
    swing = (plan["groove"] == "swing")
    pattern = plan["pattern"]
    chords = plan["chords"]
    notes: List[Dict[str, Any]] = []
    t = 0.0
    bar = 4.0
    i = 0

    def swing_offset(ts: float, amt: float = 0.55) -> float:
        frac = ts % 1.0
        if 0.5 <= frac < 1.0: return (amt - 0.5) * 0.5
        return 0.0

    import random

    while t < length_beats:
      chord = chords[i % len(chords)]
      chord_pitches = _notes_for_chord(chord, base_oct)

      if pattern == "chords":
        dur = 2.0
        for p in chord_pitches[:3]:
          notes.append({"midi": p, "time": round(t,4), "duration": dur, "velocity": 0.8})
        t += dur

      elif pattern == "bass":
        root = chord_pitches[0] - 12
        for k in range(8):
          ts = t + 0.5*k
          if swing: ts += swing_offset(ts)
          notes.append({"midi": root, "time": round(ts,4), "duration": 0.45, "velocity": 0.9})
        t += bar

      elif pattern == "melody":
        for k in range(8):
          ts = t + 0.5*k
          if swing: ts += swing_offset(ts)
          pitch = random.choice(chord_pitches[:3])
          if random.random() < 0.3:
            pitch += random.choice([-2,-1,1,2])
          notes.append({"midi": pitch, "time": round(ts,4), "duration": 0.5, "velocity": 0.85})
        t += bar

      else:  # arp
        arp = chord_pitches[:3] + chord_pitches[:3][::-1]
        for k in range(8):
          ts = t + 0.5*k
          if swing: ts += swing_offset(ts)
          pitch = arp[k % len(arp)]
          notes.append({"midi": pitch, "time": round(ts,4), "duration": 0.45, "velocity": 0.83})
        t += bar

      i += 1

    notes = [n for n in notes if 24 <= n["midi"] <= 96 and 0 <= n["time"] <= length_beats + 1]
    if not notes:
      notes = [{"midi": 60, "time": 0.0, "duration": 0.5, "velocity": 0.85}]
    name = f'{plan["key"]} {plan["pattern"].capitalize()}'
    return {"bpm": plan["bpm"], "name": name[:48], "instrument": plan["instrument"] or "Piano", "notes": notes[:256]}

# ========= Public API =========
def generate_midi_from_prompt(
    prompt: str,
    length_beats: int = 64,
    temperature: float = 1.0,
) -> Dict[str, Any]:
    # Always use robust plan → compose (no fallback arp)
    plan = _plan_from_llm(prompt)
    track = _compose_from_plan(plan, length_beats=length_beats)
    return {"bpm": track["bpm"], "tracks": [{"id": "ai1", **track}]}

def suggest_from_prompt(prompt: str) -> List[str]:
    jprompt = (
        "Return ONLY a compact JSON array of 5 short production suggestions for the idea. No prose.\n"
        f"Idea: {prompt}"
    )
    raw = _generate_text(jprompt, max_new_tokens=200)
    try:
        arr = json.loads(raw)
        if isinstance(arr, list):
            return [str(x) for x in arr][:5]
    except Exception:
        pass
    return [
        f"Develop a motif around: {prompt}",
        "Try 0.5 beat rests between phrases.",
        "Automate a lowpass filter in the intro.",
        "Layer octave doubles to add width.",
        "Humanize timing ±10 ms.",
    ]

def modify_from_prompt(prompt: str) -> Dict[str, Any]:
    data = generate_midi_from_prompt(prompt)
    data["tracks"][0]["name"] = f"Modified · {data['tracks'][0]['name'][:36]}"
    return data

def style_from_prompt(prompt: str) -> Dict[str, Any]:
    data = generate_midi_from_prompt(prompt)
    data["tracks"][0]["name"] = f"Style · {data['tracks'][0]['name'][:40]}"
    return data
