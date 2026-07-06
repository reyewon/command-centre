import { motion } from 'framer-motion'

export default function Section({ id, kicker, title, sub, children, wide }) {
  return (
    <section id={id} className={`section ${wide ? 'section-wide' : ''}`}>
      <motion.div
        className="section-head"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-kicker">{kicker}</p>
        <h2>{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </motion.div>
      {children}
    </section>
  )
}
