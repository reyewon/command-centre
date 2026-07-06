import { motion, AnimatePresence } from 'framer-motion'
import Section from './Section.jsx'

const PRESETS = [
  { label: 'Ryan default', weights: { range: 8, hills: 8, rain: 9, ride: 6, portability: 4, value: 7 } },
  { label: 'Range obsessive', weights: { range: 10, hills: 5, rain: 5, ride: 4, portability: 3, value: 5 } },
  { label: 'Wet & hilly', weights: { range: 6, hills: 10, rain: 10, ride: 6, portability: 3, value: 5 } },
  { label: 'Budget first', weights: { range: 5, hills: 5, rain: 5, ride: 4, portability: 5, value: 10 } },
]

export default function Priorities({ weights, setWeights, ranking, dimensions }) {
  const max = ranking[0]?.score ?? 1

  return (
    <Section
      id="priorities"
      kicker="02 — What matters to you"
      title="Tune the recommendation"
      sub="Drag the sliders and watch the podium re-rank in real time. Scores blend each scooter's 0–10 dimension ratings with your weights."
    >
      <div className="prio-grid">
        <div className="prio-sliders">
          <div className="prio-presets" role="group" aria-label="Weight presets">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                className="preset-btn"
                onClick={() => setWeights(p.weights)}
              >
                {p.label}
              </button>
            ))}
          </div>
          {dimensions.map((dim) => (
            <label key={dim.key} className="slider-row">
              <div className="slider-meta">
                <span className="slider-label">{dim.label}</span>
                <span className="slider-blurb">{dim.blurb}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={weights[dim.key]}
                onChange={(e) =>
                  setWeights({ ...weights, [dim.key]: Number(e.target.value) })
                }
                aria-label={`${dim.label} importance`}
              />
              <span className="slider-value">{weights[dim.key]}</span>
            </label>
          ))}
        </div>

        <div className="podium" aria-live="polite">
          <AnimatePresence initial={false}>
            {ranking.map(({ scooter, score }, i) => (
              <motion.div
                key={scooter.id}
                layout
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className={`podium-row ${i === 0 ? 'podium-leader' : ''}`}
                style={{ '--accent': scooter.color }}
              >
                <span className="podium-rank">{i + 1}</span>
                <div className="podium-info">
                  <span className="podium-name">
                    {scooter.shortName}
                    {i === 0 && <span className="podium-crown"> 👑</span>}
                  </span>
                  <div className="podium-bar-track">
                    <motion.div
                      className="podium-bar"
                      animate={{ width: `${(score / max) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                    />
                  </div>
                </div>
                <span className="podium-score">{score.toFixed(1)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <p className="podium-note">
            Score = weighted mean of dimension ratings (0–10), weighted by your sliders.
          </p>
        </div>
      </div>
    </Section>
  )
}
