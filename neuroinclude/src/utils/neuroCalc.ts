/**
 * Neuropsychological Metrics & Statistical Calculators
 * Rigorous formulas for Signal Detection Theory (d-prime), Corsi span & reaction times
 */

// Inverse standard normal cumulative distribution (Winitzki approximation for probit)
function invNormCDF(p: number): number {
  const a = 0.147;
  const clamped = Math.max(0.001, Math.min(0.999, p));
  const sign = clamped < 0.5 ? -1 : 1;
  const pVal = clamped < 0.5 ? clamped : 1 - clamped;
  const y = Math.log(4 * pVal * (1 - pVal));
  const term1 = 2 / (Math.PI * a) + y / 2;
  const term2 = y / a;
  const insideSqrt = term1 * term1 - term2;
  const erfInv = sign * Math.sqrt(Math.max(0, Math.sqrt(insideSqrt) - term1));
  return erfInv * Math.SQRT2;
}

/**
 * Calculates d' (d-prime) sensitivity index in Go/No-Go / CPT tasks
 */
export function calculateDPrime(hits: number, totalTargets: number, falseAlarms: number, totalDistractors: number): number {
  if (totalTargets === 0 || totalDistractors === 0) return 0;

  // Hautus (1995) 0.5 correction to avoid infinite values
  const hitRate = (hits + 0.5) / (totalTargets + 1);
  const faRate = (falseAlarms + 0.5) / (totalDistractors + 1);

  const zHit = invNormCDF(hitRate);
  const zFA = invNormCDF(faRate);

  const dPrime = zHit - zFA;
  return Math.round(Math.max(-1, Math.min(4.5, dPrime)) * 100) / 100;
}

/**
 * Realistic synthetic profile for rapid demo / presentation mode
 */
export const SAMPLE_TEST_RESULTS = {
  cpt: {
    totalTrials: 20,
    hits: 11,
    misses: 1,
    falseAlarms: 1,
    meanLatencyMs: 342,
    dPrime: 2.85,
    latencies: [320, 345, 310, 360, 335, 350, 340, 330, 355, 365, 348],
  },
  corsi: {
    blockSpan: 6,
    maxSequence: 6,
    accuracyPercent: 88,
    reactionTimeMs: 420,
    trialsCompleted: 6,
  },
  trailFlex: {
    switchesCompleted: 12,
    perseverationErrors: 1,
    accuracyPercent: 92,
    avgSwitchLatencyMs: 510,
    trialsCompleted: 14,
  },
  sensory: {
    visual: 4.2,
    auditory: 4.5,
    tactile: 2.8,
    proprioceptive: 3.8,
    comfortPreference: 'Sensibilidad alta a estímulos acústicos y lumínicos; beneficio notable con luz cálida y reducción de reverberación.',
  },
  matrices: {
    solved: 4,
    total: 4,
    accuracyPercent: 100,
    avgLatencyMs: 2850,
  },
  eegMetrics: {
    dominantBand: 'Alpha' as const,
    alphaBetaRatio: 1.45,
    engagementIndex: 0.62,
    signalStabilityPercent: 96,
    isSynthetic: true,
    channels: {
      delta: 18,
      theta: 24,
      alpha: 42,
      beta: 22,
      gamma: 12,
    },
  },
};
