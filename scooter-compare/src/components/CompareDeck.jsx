import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from './Section.jsx'

function ImageStrip({ scooter }) {
  const [idx, setIdx] = useState(0)
  const imgs = scooter.images
  if (!imgs?.length) return <div className="card-img card-img-empty">No image</div>
  return (
    <div className="card-img-wrap">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          className="card-img"
          src={imgs[idx].src}
          alt={imgs[idx].alt}
          loading="lazy"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      </AnimatePresence>
      {imgs.length > 1 && (
        <div className="img-dots" role="tablist" aria-label={`${scooter.name} photos`}>
          {imgs.map((im, i) => (
            <button
              key={im.src}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Photo ${i + 1}: ${im.alt}`}
              className={i === idx ? 'dot active' : 'dot'}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StatPill({ label, value }) {
  return (
    <div className="stat-pill">
      <span className="stat-pill-value">{value}</span>
      <span className="stat-pill-label">{label}</span>
    </div>
  )
}

export default function CompareDeck({ scooters, selected, onToggle, leaderId }) {
  return (
    <Section
      id="contenders"
      kicker="01 — The shortlist"
      title="Four contenders"
      sub="Tap a card in or out of the comparison — everything below updates. The crown follows your priority sliders."
    >
      <div className="deck">
        {scooters.map((s) => {
          const active = selected.includes(s.id)
          const isLeader = active && s.id === leaderId
          return (
            <motion.article
              key={s.id}
              layout
              className={`card ${active ? 'card-active' : 'card-muted'}`}
              style={{ '--accent': s.color, '--accent-soft': s.colorSoft }}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <AnimatePresence>
                {isLeader && (
                  <motion.div
                    className="crown"
                    initial={{ opacity: 0, y: -8, rotate: -8 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    title="Top pick for your current priorities"
                  >
                    👑 Your pick
                  </motion.div>
                )}
              </AnimatePresence>
              <ImageStrip scooter={s} />
              <div className="card-body">
                <p className="card-brand">{s.brand}</p>
                <h3 className="card-name">{s.shortName}</h3>
                <p className="card-tagline">{s.tagline}</p>
                <div className="card-stats">
                  <StatPill label="real range" value={s.headline.range} />
                  <StatPill label="weight" value={s.headline.weight} />
                  <StatPill label="best price" value={s.headline.price} />
                </div>
                <button
                  className={`card-toggle ${active ? 'on' : ''}`}
                  onClick={() => onToggle(s.id)}
                  aria-pressed={active}
                >
                  {active ? '✓ In comparison' : '+ Add to comparison'}
                </button>
              </div>
            </motion.article>
          )
        })}
      </div>
    </Section>
  )
}
