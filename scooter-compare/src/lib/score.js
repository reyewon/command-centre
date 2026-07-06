// Weighted scoring for the "what matters to me" system.
// Each scooter carries dimension scores 0–10; weights are 0–10 per dimension.

export const DIMENSIONS = [
  { key: 'range',       label: 'Range',        blurb: 'Real-world miles per charge' },
  { key: 'hills',       label: 'Hills & power', blurb: 'Torque and climbing at 90kg' },
  { key: 'rain',        label: 'Rain-proofing', blurb: 'IP rating + wet braking' },
  { key: 'ride',        label: 'Ride comfort',  blurb: 'Suspension, tyres, stability' },
  { key: 'portability', label: 'Portability',   blurb: 'Weight and folded size' },
  { key: 'value',       label: 'Price & value', blurb: 'What you get per pound' },
]

export function weightedScore(scooter, weights) {
  let total = 0
  let weightSum = 0
  for (const dim of DIMENSIONS) {
    const w = weights[dim.key] ?? 5
    total += (scooter.scores[dim.key] ?? 0) * w
    weightSum += w
  }
  if (weightSum === 0) return 0
  return total / weightSum
}

export function rankScooters(scooters, weights) {
  return [...scooters]
    .map((s) => ({ scooter: s, score: weightedScore(s, weights) }))
    .sort((a, b) => b.score - a.score)
}
