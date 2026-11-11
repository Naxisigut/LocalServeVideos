#!/usr/bin/env python3
"""Generate promo VO with local Kokoro (mlx-audio) into public/voiceover/promo/."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from mlx_audio.tts.utils import load_model

ROOT = Path(__file__).resolve().parents[1]
CUES_PATH = ROOT / "src/compositions/promo/voiceover.ts"
OUT_DIR = ROOT / "public/voiceover/promo"
TOTAL_S = 86.0
VOICE = "af_heart"
LANG = "a"
MAX_SPEED = 1.25
SPEED_STEP = 0.05


def parse_cues(path: Path) -> list[dict]:
    src = path.read_text()
    cues: list[dict] = []
    for match in re.finditer(
        r"\{\s*id:\s*'([^']+)',\s*from:\s*([0-9.]+),\s*text:\s*(?:'((?:\\'|[^'])*)'|\"((?:\\\"|[^\"])*)\")",
        src,
    ):
        raw = match.group(3) if match.group(3) is not None else match.group(4)
        cues.append(
            {
                "id": match.group(1),
                "from": float(match.group(2)),
                "text": raw.replace("\\'", "'").replace('\\"', '"'),
            }
        )
    if not cues:
        raise SystemExit(f"No cues parsed from {path}")
    return cues


def trim_silence(audio: np.ndarray, sample_rate: int, threshold: float = 0.01, pad_s: float = 0.06) -> np.ndarray:
    hits = np.where(np.abs(audio) > threshold)[0]
    if hits.size == 0:
        return audio
    pad = int(pad_s * sample_rate)
    start = max(0, int(hits[0]) - pad)
    end = min(audio.size, int(hits[-1]) + pad + 1)
    return audio[start:end]


def synthesize(model, text: str, speed: float) -> tuple[np.ndarray, int]:
    chunks: list[np.ndarray] = []
    sample_rate = 24000
    for result in model.generate(text, voice=VOICE, speed=speed, lang_code=LANG):
        sample_rate = result.sample_rate
        chunks.append(np.array(result.audio, dtype=np.float32))
    if not chunks:
        raise RuntimeError(f"No audio for: {text}")
    return trim_silence(np.concatenate(chunks), sample_rate), sample_rate


def write_wav(path: Path, audio: np.ndarray, sample_rate: int) -> None:
    tmp = path.with_suffix(".tmp.wav")
    sf.write(tmp, audio, sample_rate)
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(tmp),
            "-ar",
            "48000",
            "-ac",
            "1",
            str(path),
        ],
        check=True,
    )
    tmp.unlink()


def wav_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "csv=p=0",
            str(path),
        ]
    )
    return float(out.decode().strip())


def main() -> None:
    cues = parse_cues(CUES_PATH)
    print(f"Loading Kokoro ({VOICE})…", flush=True)
    model = load_model("mlx-community/Kokoro-82M-bf16")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    overruns = 0
    for i, cue in enumerate(cues):
        slot = (cues[i + 1]["from"] if i + 1 < len(cues) else TOTAL_S) - cue["from"]
        speed = 1.0
        while True:
            audio, sr = synthesize(model, cue["text"], speed)
            dest = OUT_DIR / f"{cue['id']}.wav"
            write_wav(dest, audio, sr)
            duration = wav_duration(dest)
            slack = slot - duration
            if slack >= 0 or speed + SPEED_STEP > MAX_SPEED + 1e-9:
                flag = f"  OVERRUN {(-slack):.2f}s" if slack < 0 else ""
                if slack < 0:
                    overruns += 1
                print(
                    f"{cue['id']}  {cue['from']:.1f}s  @{speed:.2f}  "
                    f"{duration:.2f}s / slot {slot:.2f}s{flag}",
                    flush=True,
                )
                break
            speed = round(speed + SPEED_STEP, 2)
            print(f"{cue['id']}  retry @{speed:.2f} (was {duration:.2f}s > {slot:.2f}s)", flush=True)

    if overruns:
        print(f"\n{overruns} cue(s) still overran the slot (speed capped at {MAX_SPEED}).")
        sys.exit(1)
    print("\nAll cues fit. Wrote", OUT_DIR)


if __name__ == "__main__":
    main()
