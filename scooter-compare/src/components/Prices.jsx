import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from './Section.jsx'

function gbp(n) {
  return n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: n % 1 ? 2 : 0 })
}

function PricePanel({ scooter }) {
  const [showDeals, setShowDeals] = useState(true)
  const p = scooter.price
  const cheapest = Math.min(...p.retailers.filter((r) => r.price).map((r) => r.price))

  return (
    <motion.article
      className="price-panel"
      style={{ '--accent': scooter.color }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
    >
      <header className="price-head">
        <div>
          <h3>{scooter.shortName}</h3>
          <p className="price-rrp">RRP {gbp(p.rrp)}</p>
        </div>
        <div className="price-best">
          <span className="price-best-label">effective best</span>
          <span className="price-best-value">{gbp(p.effectiveBest.price)}</span>
          <span className="price-best-how">{p.effectiveBest.how}</span>
        </div>
      </header>

      <table className="price-table">
        <thead>
          <tr><th scope="col">Retailer</th><th scope="col">Price</th><th scope="col">Notes</th></tr>
        </thead>
        <tbody>
          {p.retailers.map((r) => (
            <tr key={r.name} className={r.price === cheapest ? 'cheapest' : ''}>
              <td>
                {r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.name} ↗</a> : r.name}
              </td>
              <td className="price-cell">{r.price ? gbp(r.price) : '—'}</td>
              <td className="price-note">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="deals-toggle" onClick={() => setShowDeals(!showDeals)} aria-expanded={showDeals}>
        {showDeals ? '− Hide' : '+ Show'} deals &amp; cashback ({p.deals.length})
      </button>
      <AnimatePresence initial={false}>
        {showDeals && (
          <motion.ul
            className="deals-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {p.deals.map((d) => (
              <li key={d.label} className={`deal ${d.verified ? 'verified' : 'unverified'}`}>
                <span className="deal-badge">{d.verified ? '✓ live' : '? unverified'}</span>
                <div>
                  <p className="deal-label">
                    {d.label}
                    {d.code && <code className="deal-code">{d.code}</code>}
                  </p>
                  <p className="deal-detail">{d.detail}</p>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

export default function Prices({ scooters }) {
  return (
    <Section
      id="prices"
      kicker="05 — The damage"
      title="Prices, codes &amp; cashback"
      sub="UK retailer prices checked 6 July 2026. Cashback is paid on the ex-VAT price and is voided if you stack an unapproved voucher code — so each 'effective best' picks the single strongest route."
      wide
    >
      <div className="price-grid">
        {scooters.map((s) => (
          <PricePanel key={s.id} scooter={s} />
        ))}
      </div>
    </Section>
  )
}
