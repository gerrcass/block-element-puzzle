export interface Rng {
  /** Uniform float in [0, 1). */
  next(): number;
}

export function mulberry32(seed: number): Rng {
  let t = seed >>> 0;
  return {
    next() {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    },
  };
}

export function sequenceRng(values: number[]): Rng {
  let i = 0;
  return {
    next() {
      if (i >= values.length) throw new Error(`sequenceRng exhausted at index ${i}`);
      return values[i++] as number;
    },
  };
}

export function randomInt(rng: Rng, maxExclusive: number): number {
  if (maxExclusive <= 0) throw new Error('maxExclusive must be > 0');
  return Math.floor(rng.next() * maxExclusive);
}

export function pickWeightedIndex(weights: readonly number[], rng: Rng): number {
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) throw new Error('total weight must be > 0');
  let roll = rng.next() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i] ?? 0;
    if (roll < 0) return i;
  }
  return weights.length - 1;
}
