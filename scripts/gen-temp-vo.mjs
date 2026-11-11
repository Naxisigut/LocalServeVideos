// Placeholder VO via macOS `say`. Usage: node scripts/gen-temp-vo.mjs [voice] [rate]
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PROMO_VO_CUES } from '../src/compositions/promo/voiceover.ts';

const voice = process.argv[2] ?? 'Samantha';
const rate = process.argv[3] ?? '185';
const total = 74;
const outDir = join(import.meta.dirname, '..', 'public', 'voiceover', 'promo');
mkdirSync(outDir, { recursive: true });

PROMO_VO_CUES.forEach((cue, i) => {
  const aiff = join(tmpdir(), `${cue.id}.aiff`);
  const wav = join(outDir, `${cue.id}.wav`);
  const cueRate = String(cue.rate ?? rate);
  execFileSync('say', ['-v', voice, '-r', cueRate, '-o', aiff, cue.text]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff, '-ar', '48000', '-ac', '1', wav]);
  rmSync(aiff);
  const duration = Number(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]).toString(),
  );
  const next = PROMO_VO_CUES[i + 1]?.from ?? total;
  const slack = next - cue.from - duration;
  const flag = slack < 0 ? `  OVERRUN ${(-slack).toFixed(2)}s` : '';
  console.log(`${cue.id}  ${cue.from.toFixed(1)}s  @${cueRate}  ${duration.toFixed(2)}s / slot ${(next - cue.from).toFixed(2)}s${flag}`);
});
