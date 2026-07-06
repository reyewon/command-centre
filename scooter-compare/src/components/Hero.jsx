import { motion } from 'framer-motion'

const CONTEXT = [
  { icon: '📍', label: 'Southampton, UK' },
  { icon: '🚋', label: 'Primary transport — no car' },
  { icon: '⚖️', label: '~90kg rider' },
  { icon: '📷', label: 'Photography gear in tow' },
  { icon: '🌧️', label: 'Rain is non-negotiable' },
  { icon: '⛰️', label: 'Hills on the route' },
  { icon: '🛞', label: '11–12″ tyres only' },
]

const NAV = [
  ['#contenders', 'Contenders'],
  ['#priorities', 'Priorities'],
  ['#radar', 'Radar'],
  ['#specs', 'Specs'],
  ['#prices', 'Prices & deals'],
  ['#reviews', 'Reviews'],
  ['#verdict', 'Verdict'],
]

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <motion.p
        className="hero-kicker"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Four contenders · one commute · July 2026
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        Which e-scooter,
        <br />
        <span className="hero-accent">Ryan?</span>
      </motion.h1>
      <motion.p
        className="hero-sub"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.16 }}
      >
        A decision engine for your next daily driver — researched specs, live UK
        prices, review sentiment and an honest verdict, tuned to how you actually
        ride.
      </motion.p>
      <motion.ul
        className="hero-chips"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
      >
        {CONTEXT.map((c) => (
          <motion.li
            key={c.label}
            variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
          >
            <span aria-hidden="true">{c.icon}</span> {c.label}
          </motion.li>
        ))}
      </motion.ul>
      <motion.nav
        className="hero-nav"
        aria-label="Sections"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {NAV.map(([href, label]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </motion.nav>
    </header>
  )
}
