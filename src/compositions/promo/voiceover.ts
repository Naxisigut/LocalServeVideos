export type VoCue = {
  id: string;
  /** Seconds into the promo. */
  from: number;
  text: string;
  /** Placeholder TTS words per minute; falls back to the script's default rate. */
  rate?: number;
};

/** VO cues for PromoSample; files live in public/voiceover/promo/<id>.wav. */
export const PROMO_VO_CUES: VoCue[] = [
  { id: 'vo01', from: 0.2, text: 'With AI, anyone can build little web apps —' },
  { id: 'vo02', from: 3.5, text: 'just for themselves.' },
  { id: 'vo03', from: 6, text: "But they're scattered all over your Mac." },
  { id: 'vo04', from: 8.3, text: 'Some pages just open and work.' },
  { id: 'vo05', from: 12.2, text: 'Others only load through a local server.' },
  { id: 'vo06', from: 14.4, text: 'What if they all had one home?' },
  { id: 'vo07', from: 17.2, text: 'Meet LocalServe. It turns any folder into a local site — no terminal, no cloud.' },
  { id: 'vo08', from: 22.5, text: 'Pick the folder, choose a port…' },
  { id: 'vo09', from: 29, text: "…and hit start. That's it." },
  { id: 'vo10', from: 32, text: 'That blank page from before? Now it just works.' },
  { id: 'vo11', from: 36.2, text: 'Need more? Here are a few power features.' },
  { id: 'vo12', from: 39.2, text: 'When your local site calls a remote server directly, it usually gets blocked by CORS.' },
  { id: 'vo13', from: 44.3, text: 'Add a proxy rule in LocalServe, and it goes through.' },
  { id: 'vo14', from: 51.2, text: 'You can give each site a memorable domain name. LocalServe manages hosts for you.' },
  { id: 'vo15', from: 59.2, text: "You can also open your sites on any device by scanning the QR code, as long as it's on the same Wi‑Fi." },
  { id: 'vo16', from: 67.2, text: 'Same goes for file sharing. Pick. Scan. Done. No cables, no cloud.' },
  { id: 'vo17', from: 75.2, text: "Try it free for seven days — no account needed. Then buy once, and it's yours forever." },
  { id: 'vo18', from: 82.8, text: 'LocalServe. All your little apps, one home.' },
];
