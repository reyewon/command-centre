import { motion } from 'framer-motion'
import Section from './Section.jsx'
import { VERDICT } from '../data/scooters.js'

function ProConMeter({ items, kind }) {
  return (
    <ul className={`pc-list ${kind}`}>
      {items.map((it) => (
        <li key={it.title} className="pc-item">
          <div className="pc-meter" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <span key={n} className={`pc-seg ${n <= it.strength ? 'on' : ''}`} />
            ))}
          </div>
          <div>
            <p className="pc-title">{it.title}</p>
            <p className="pc-detail">{it.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function Verdict({ scooters }) {
  const ordered = [...scooters].sort((a, b) => a.verdict.rank - b.verdict.rank)

  return (
    <Section
      id="verdict"
      kicker="07 — The honest bit"
      title="Ryan's verdict"
      sub={VERDICT.intro}
    >
      <div className="verdict-list">
        {ordered.map((s, i) => (
          <motion.article
            key={s.id}
            className={`verdict-card ${i === 0 ? 'verdict-winner' : ''}`}
            style={{ '--accent': s.color }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <header className="verdict-head">
              <span className="verdict-rank">{i === 0 ? '🏆' : `#${i + 1}`}</span>
              <div>
                <h3>{s.name}</h3>
                <p className="verdict-headline">{s.verdict.headline}</p>
              </div>
              {i === 0 && <span className="winner-badge">Winner</span>}
            </header>
            {s.verdict.text.map((para) => (
              <p key={para.slice(0, 32)} className="verdict-text">{para}</p>
            ))}
            <div className="pc-grid">
              <div>
                <h4 className="pc-h pos">Why you would</h4>
                <ProConMeter items={s.pros} kind="pros" />
              </div>
              <div>
                <h4 className="pc-h neg">Why you wouldn't</h4>
                <ProConMeter items={s.cons} kind="cons" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      <motion.aside
        className="verdict-coda"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {VERDICT.coda.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </motion.aside>
    </Section>
  )
}
