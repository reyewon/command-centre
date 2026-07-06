export default function Footer({ meta }) {
  return (
    <footer className="footer">
      <p>
        Built for Ryan Stanikk · researched &amp; priced {meta.researched} · all prices GBP and
        subject to change.
      </p>
      <p className="footer-legal">{meta.legalNote}</p>
      <p className="footer-sources">
        Sources include manufacturer spec sheets, idealo/PriceSpy price indexes, T3, Tom's Guide,
        eRideHero, Electric Scooter Guide, ScooterRank, redditrecs (r/ElectricScooters), Trustpilot,
        TopCashback &amp; Quidco merchant pages.
      </p>
    </footer>
  )
}
