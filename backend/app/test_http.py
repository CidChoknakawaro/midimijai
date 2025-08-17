# test_http.py
import requests
import json
import sys

API = "http://localhost:8000"
PROMPT = "lofi hiphop with warm Rhodes chords, mellow, slow"

def assert_project_shape(data):
    assert isinstance(data, dict)
    assert isinstance(data.get("bpm"), int)
    assert isinstance(data.get("tracks"), list) and data["tracks"]
    t0 = data["tracks"][0]
    assert isinstance(t0.get("name"), str)
    assert isinstance(t0.get("instrument"), str)
    assert isinstance(t0.get("notes"), list)
    if t0["notes"]:
        n0 = t0["notes"][0]
        assert all(k in n0 for k in ("midi", "time", "duration", "velocity"))

def main():
    s = requests.Session()

    # 1) register (ignore errors if user exists; you can also /auth/login)
    r = s.post(f"{API}/auth/register", json={"username": "testai", "password": "testai"})
    if r.status_code not in (200, 201):
        # try login
        r = s.post(f"{API}/auth/login", json={"username": "testai", "password": "testai"})
        r.raise_for_status()
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2) call generate
    payload = {"prompt": PROMPT, "mode": "generate", "length_beats": 64}
    r = s.post(f"{API}/ai/generate", json=payload, headers=headers)
    r.raise_for_status()
    resp = r.json()

    # response can be either {"data": project} or directly the project (depends on your router)
    project = resp.get("data") if isinstance(resp, dict) and "data" in resp else resp
    assert_project_shape(project)

    track = project["tracks"][0]
    print(json.dumps(project, indent=2)[:1200], "...\n")
    print("🎚️ BPM:", project["bpm"])
    print("🎵 Track:", track["name"])
    print("🎼 Notes:", len(track["notes"]))

    if track["name"].lower().startswith("fallback arp") or len(track["notes"]) == 0:
        print("⚠️ Warning: Fallback detected or zero notes.")
        sys.exit(2)

    print("✅ End‑to‑end OK.")
    sys.exit(0)

if __name__ == "__main__":
    main()
