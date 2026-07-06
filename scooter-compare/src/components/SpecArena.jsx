import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from './Section.jsx'
import { SPEC_ROWS } from '../data/scooters.js'

function BarRow({ row, scooters, open, onToggle }) {
  const numeric = row.num !== false
  const values = scooters.map((s) => s.specs[row.key])
  const nums = numeric ? values.map((v) => v?.num ?? 0) : []
  const best = numeric ? (row.betterHigh ? Math.max(...nums) : Math.min(...nums.filter((n) => n > 0))) : null
  const maxNum = numeric ? Math.max(...nums, 0.0001) : 1

  return (
    <div className={`spec-row ${open ? 'open' : ''}`}>
      <button className="spec-row-head" onClick={onToggle} aria-expanded={open}>
        <span className="spec-row-label">{row.label}</span>
        <span className="spec-row-hint">{open ? '− close' : '+ what does this mean?'}</span>
      </button>
      <div className="spec-bars">
        {scooters.map((s) => {
          const v = s.specs[row.key]
          const isBest = numeric && v?.num != null && v.num === best
          return (
            <div key={s.id} className="spec-bar-line" style={{ '--accent': s.color }}>
              <span className="spec-bar-name">{s.shortName}</span>
              <div className="spec-bar-track">
                {numeric ? (
                  <motion.div
                    className={`spec-bar-fill ${isBest ? 'best' : ''}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.max(4, ((v?.num ?? 0) / maxNum) * 100)}%` }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : (
                  <div className="spec-bar-fill textonly" />
                )}
              </div>
              <span className={`spec-bar-value ${isBest ? 'best-text' : ''}`}>
                {v?.display ?? '—'}
                {isBest && <span className="best-dot" title="Best in group"> ●</span>}
              </span>
            </div>
          )
        })}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="spec-explain"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p>{row.explain}</p>
            {scooters.map((s) =>
              s.specs[row.key]?.note ? (
                <p key={s.id} className="spec-note" style={{ '--accent': s.color }}>
                  <strong>{s.shortName}:</strong> {s.specs[row.key].note}
                </p>
              ) : null,
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SpecArena({ scooters }) {
  const [openKey, setOpenKey] = useState(null)
  const groups = [...new Set(SPEC_ROWS.map((r) => r.group))]

  return (
    <Section
      id="specs"
      kicker="04 — Under the deck"
      title="Spec arena"
      sub="Every number that matters, drawn to scale. The dot marks best-in-group; tap any spec for what it actually means for your ride."
      wide
    >
      {groups.map((g) => (
        <div key={g} className="spec-group">
          <h3 className="spec-group-title">{g}</h3>
          {SPEC_ROWS.filter((r) => r.group === g).map((row) => (
            <BarRow
              key={row.key}
              row={row}
              scooters={scooters}
              open={openKey === row.key}
              onToggle={() => setOpenKey(openKey === row.key ? null : row.key)}
            />
          ))}
        </div>
      ))}
    </Section>
  )
}
