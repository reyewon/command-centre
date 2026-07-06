import { useState } from 'react'
import { motion } from 'framer-motion'
import Section from './Section.jsx'
import { DIMENSIONS } from '../lib/score.js'

const SIZE = 460
const CX = SIZE / 2
const CY = SIZE / 2
const R = 168
const RINGS = [2.5, 5, 7.5, 10]

function polar(angleIdx, value, total) {
  const angle = (Math.PI * 2 * angleIdx) / total - Math.PI / 2
  const r = (value / 10) * R
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)]
}

function pathFor(scooter, total) {
  const pts = DIMENSIONS.map((d, i) => polar(i, scooter.scores[d.key], total))
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z'
}

export default function Radar({ scooters }) {
  const [focus, setFocus] = useState(null)
  const total = DIMENSIONS.length

  return (
    <Section
      id="radar"
      kicker="03 — Shape of each machine"
      title="The radar"
      sub="Six dimensions, rated 0–10 from tested specs and owner reports. Hover or tap a name to isolate its shape."
    >
      <div className="radar-wrap">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="radar-svg"
          role="img"
          aria-label={`Radar chart comparing ${scooters.map((s) => s.name).join(', ')} across ${DIMENSIONS.map((d) => d.label).join(', ')}`}
        >
          {RINGS.map((v) => (
            <polygon
              key={v}
              className="radar-ring"
              points={DIMENSIONS.map((_, i) => polar(i, v, total).join(',')).join(' ')}
            />
          ))}
          {DIMENSIONS.map((d, i) => {
            const [x, y] = polar(i, 10, total)
            return <line key={d.key} className="radar-spoke" x1={CX} y1={CY} x2={x} y2={y} />
          })}
          {DIMENSIONS.map((d, i) => {
            const [x, y] = polar(i, 12.2, total)
            return (
              <text
                key={d.key}
                x={x}
                y={y}
                className="radar-label"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {d.label}
              </text>
            )
          })}
          {scooters.map((s) => {
            const dim = focus && focus !== s.id
            return (
              <motion.path
                key={s.id}
                d={pathFor(s, total)}
                fill={s.color}
                stroke={s.color}
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: dim ? 0.06 : 1, fillOpacity: dim ? 0.02 : 0.14 }}
                transition={{ duration: 0.3 }}
              />
            )
          })}
          {scooters.map((s) =>
            (focus === null || focus === s.id) &&
            DIMENSIONS.map((d, i) => {
              const [x, y] = polar(i, s.scores[d.key], total)
              return (
                <circle
                  key={`${s.id}-${d.key}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={s.color}
                  stroke="var(--surface)"
                  strokeWidth="2"
                >
                  <title>{`${s.shortName} — ${d.label}: ${s.scores[d.key]}/10`}</title>
                </circle>
              )
            }),
          )}
        </svg>
        <div className="radar-legend" role="list">
          {scooters.map((s) => (
            <button
              key={s.id}
              role="listitem"
              className={`legend-chip ${focus === s.id ? 'focused' : ''}`}
              style={{ '--accent': s.color }}
              onMouseEnter={() => setFocus(s.id)}
              onMouseLeave={() => setFocus(null)}
              onClick={() => setFocus(focus === s.id ? null : s.id)}
            >
              <span className="legend-swatch" aria-hidden="true" />
              {s.shortName}
            </button>
          ))}
        </div>
      </div>
    </Section>
  )
}
