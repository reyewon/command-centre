import { motion } from 'framer-motion'
import Section from './Section.jsx'

function SentimentBar({ positive, negative }) {
  const total = positive + negative
  const pct = total ? Math.round((positive / total) * 100) : 50
  return (
    <div className="senti-bar" role="img" aria-label={`${pct}% positive sentiment`}>
      <motion.div
        className="senti-pos"
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="senti-pct">{pct}% positive</span>
    </div>
  )
}

function ReviewPanel({ scooter }) {
  const r = scooter.reviews
  const posWeight = r.sentiment.positive.reduce((a, t) => a + t.weight, 0)
  const negWeight = r.sentiment.negative.reduce((a, t) => a + t.weight, 0)

  return (
    <motion.article
      className="review-panel"
      style={{ '--accent': scooter.color }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
    >
      <h3>{scooter.shortName}</h3>
      <SentimentBar positive={posWeight} negative={negWeight} />

      <div className="senti-themes">
        <div className="senti-col">
          <h4 className="senti-h pos">Loved</h4>
          {r.sentiment.positive.map((t) => (
            <div key={t.theme} className="theme-chip pos" style={{ '--w': t.weight }}>
              <span className="theme-label">{t.theme}</span>
              <span className="theme-dots" aria-label={`strength ${t.weight} of 5`}>
                {'●'.repeat(t.weight)}{'○'.repeat(5 - t.weight)}
              </span>
            </div>
          ))}
        </div>
        <div className="senti-col">
          <h4 className="senti-h neg">Gripes</h4>
          {r.sentiment.negative.map((t) => (
            <div key={t.theme} className="theme-chip neg" style={{ '--w': t.weight }}>
              <span className="theme-label">{t.theme}</span>
              <span className="theme-dots" aria-label={`strength ${t.weight} of 5`}>
                {'●'.repeat(t.weight)}{'○'.repeat(5 - t.weight)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {r.outlets.length > 0 && (
        <ul className="outlet-list">
          {r.outlets.map((o) => (
            <li key={o.name}>
              <span className="outlet-score">{o.score}</span>
              <div>
                <a href={o.url} target="_blank" rel="noreferrer" className="outlet-name">{o.name} ↗</a>
                <p className="outlet-quote">“{o.quote}”</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="voice-notes">
        <p><strong>YouTube:</strong> {r.youtube}</p>
        <p><strong>Reddit:</strong> {r.reddit}</p>
      </div>
    </motion.article>
  )
}

export default function Reviews({ scooters }) {
  return (
    <Section
      id="reviews"
      kicker="06 — What everyone else thinks"
      title="Review sentiment"
      sub="Themes distilled from professional reviews, YouTube coverage and owner communities. Dot strength = how consistently the theme comes up."
      wide
    >
      <div className="review-grid">
        {scooters.map((s) => (
          <ReviewPanel key={s.id} scooter={s} />
        ))}
      </div>
    </Section>
  )
}
