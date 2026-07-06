import { useMemo, useState } from 'react'
import { SCOOTERS, META } from './data/scooters.js'
import { DIMENSIONS, rankScooters } from './lib/score.js'
import Hero from './components/Hero.jsx'
import CompareDeck from './components/CompareDeck.jsx'
import Priorities from './components/Priorities.jsx'
import Radar from './components/Radar.jsx'
import SpecArena from './components/SpecArena.jsx'
import Prices from './components/Prices.jsx'
import Reviews from './components/Reviews.jsx'
import Verdict from './components/Verdict.jsx'
import Footer from './components/Footer.jsx'

const DEFAULT_WEIGHTS = {
  range: 8, hills: 8, rain: 9, ride: 6, portability: 4, value: 7,
}

export default function App() {
  const [selected, setSelected] = useState(() => SCOOTERS.map((s) => s.id))
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS)

  const active = useMemo(
    () => SCOOTERS.filter((s) => selected.includes(s.id)),
    [selected],
  )
  const ranking = useMemo(() => rankScooters(active, weights), [active, weights])
  const leaderId = ranking[0]?.scooter.id

  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 2) return prev // keep at least two in play
        return prev.filter((x) => x !== id)
      }
      return SCOOTERS.map((s) => s.id).filter((x) => prev.includes(x) || x === id)
    })
  }

  return (
    <div className="page">
      <Hero />
      <main>
        <CompareDeck
          scooters={SCOOTERS}
          selected={selected}
          onToggle={toggle}
          leaderId={leaderId}
        />
        <Priorities
          weights={weights}
          setWeights={setWeights}
          ranking={ranking}
          dimensions={DIMENSIONS}
        />
        <Radar scooters={active} />
        <SpecArena scooters={active} />
        <Prices scooters={active} />
        <Reviews scooters={active} />
        <Verdict scooters={SCOOTERS} />
      </main>
      <Footer meta={META} />
    </div>
  )
}
