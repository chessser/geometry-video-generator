// Tiny deterministic hash → number seed (placeholder; replace with a better hash later)
export function hashToSeed(s: string): number {
  let h = 2166136261 >>> 0; // FNV-ish
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
