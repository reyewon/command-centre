// All research conducted 6 July 2026. Prices in GBP, checked against retailer
// pages, idealo and PriceSpy on that date. Real-world figures favour tested
// data (eRideHero, TechGearLab, owner reports) over manufacturer claims.
// Lineup criteria: 11–12″ pneumatic tyres, purchasable in the UK today,
// commuter-grade for a 90kg rider in a hilly, rainy city.

export const META = {
  researched: '6 July 2026',
  legalNote:
    'Reminder: privately-owned e-scooters remain illegal to ride on UK public roads, pavements and cycle lanes — legal use is limited to private land with the landowner’s permission. Rules may change; check before you ride.',
}

export const SPEC_ROWS = [
  // Performance
  {
    key: 'peakPower', group: 'Performance', label: 'Peak motor power', betterHigh: true,
    explain:
      'Peak watts is what the motor can briefly deliver when you ask for everything — pulling away, or halfway up a hill. At 90kg you lean on peak power constantly on climbs. One caution: budget brands quote these numbers loosely (the KuKirin’s "2,000W" is its only published figure, with no verified nominal/peak split; the isinwheel is sold as 800W, 1000W and 1200W on different pages of the same shop).',
  },
  {
    key: 'nominalPower', group: 'Performance', label: 'Nominal motor power', betterHigh: true,
    explain:
      'The power the motor can sustain continuously without overheating. Sustained climbs at rider weights near the max load are where nominal power matters more than peak — and where marketing figures and physics part company.',
  },
  {
    key: 'batteryWh', group: 'Performance', label: 'Battery capacity', betterHigh: true,
    explain:
      'Watt-hours are the fuel tank. A 90kg rider on mixed terrain uses roughly 15–20Wh per mile at 15.5mph — so 597Wh is a realistic ~25–35 miles and 1,200Wh could double that. But cell quality matters as much as size: Segway and Xiaomi use branded cells with battery-management pedigree; KuKirin doesn’t publish who makes its cells.',
  },
  {
    key: 'rangeClaimed', group: 'Performance', label: 'Claimed range', betterHigh: true,
    explain:
      'Manufacturer figures come from a light rider at ~15km/h on a flat, windless test loop. Treat them as a marketing ceiling — every scooter here delivers roughly half to two-thirds of its claim in real UK commuting. Useful only for comparing scooters against each other on equal terms.',
  },
  {
    key: 'rangeReal', group: 'Performance', label: 'Real-world range (est. @90kg)', betterHigh: true,
    explain:
      'Our estimate for you specifically: ~90kg rider, mixed Southampton terrain with hills, normal riding, mild weather. Sources: eRideHero and TechGearLab instrumented tests, Ebike Escape ride data and heavier-rider owner reports. Knock another 20–30% off in winter — lithium cells hate the cold.',
  },
  {
    key: 'topSpeed', group: 'Performance', label: 'Top speed', betterHigh: true,
    explain:
      'The Segway and Xiaomi ship software-capped at 25km/h (15.5mph) for the UK/EU. The isinwheel and KuKirin ship unrestricted (28mph and ~40mph respectively) with selectable modes — academic for legality (private e-scooters are private-land-only in the UK either way), but relevant to insurance, safety and how hard the brakes have to work.',
  },
  {
    key: 'hillGrade', group: 'Performance', label: 'Max claimed gradient', betterHigh: true,
    explain:
      'The steepest slope the maker says it can climb — usually with a light rider, so treat it as relative. For context: a steep UK residential street is 10–15%. The isinwheel’s "35°" claim is physically absurd (that’s a 70% grade) — independent testing found an 82kg rider topping out around 15%. At 90kg, subtract several points from every claim here.',
  },
  {
    key: 'chargeTime', group: 'Performance', label: 'Charge time (hours)', betterHigh: false,
    explain:
      'Full 0–100% on the supplied charger. If the scooter is your only transport, slow charging is a lifestyle constraint. The G3 E charges in 3.5h (2.5h with a second charger); the Xiaomi takes an optional Fast Charger 2 (2¾h); the KuKirin’s 1,200Wh on a 2A brick means 10–12 hours, every time, with no fast option.',
  },
  // Practical
  {
    key: 'weight', group: 'Practicality', label: 'Weight (kg)', betterHigh: false,
    explain:
      'You don’t drive, so this is the "dead scooter / train / stairs / hallway" number. 24–26kg is a two-hand grunt. Nearly 30kg is wheel-it-or-leave-it. The KuKirin at ~37–41kg is furniture — and even its own official pages can’t agree which of those numbers is right.',
  },
  {
    key: 'maxLoad', group: 'Practicality', label: 'Max rider load (kg)', betterHigh: true,
    explain:
      'You + clothing + camera bag. At 90kg plus a few kilos of gear you want generous headroom — motors, brakes and range all degrade as you approach the limit. 120kg gives you ~25kg of margin; 130–150kg means the scooter barely notices your kit.',
  },
  {
    key: 'ipRating', group: 'Practicality', label: 'Water resistance', num: false,
    explain:
      'IPX4 = splashes only. IPX5/6 = water jets (real rain). IPX7 (the G3 E’s battery) survives temporary immersion. Read the small print: the isinwheel’s headline "IP65" applies to the battery pack only — the scooter itself is IPX4–5 — and KuKirin’s warranty explicitly excludes all moisture damage, with their own blog telling you not to ride in heavy rain. For year-round Southampton commuting this row matters more than any other.',
  },
  {
    key: 'folded', group: 'Practicality', label: 'Folded size', num: false,
    explain:
      'How much hallway, boot or train luggage-rack it eats. All four fold flat-stem-to-deck and stay long — 1.2m+ of scooter to park. None of this lineup is a carry-aboard folder; they live in hallways and sheds.',
  },
  {
    key: 'warranty', group: 'Practicality', label: 'Warranty & UK support', num: false,
    explain:
      'Length is only half the story — who honours it matters more. Segway and Xiaomi give 2 years with established UK repair routes (buy the Segway via Currys for Consumer Rights Act leverage; Xiaomi repairs are done in the UK by SBE). The budget brands give 1 year — and isinwheel only covers battery/motor/controller for 6 months, while KuKirin excludes water damage entirely and expects you to fit replacement parts yourself.',
  },
  // Equipment
  {
    key: 'tyres', group: 'Equipment', label: 'Tyres', num: false,
    explain:
      'Your 11–12″ requirement, met four ways. Bigger pneumatic tyres roll over potholes and grip better in the wet. Tubeless means no inner tube to pinch-puncture; the G3 E adds self-sealing gel that plugs small punctures as you ride. Note the isinwheel is the only tubed tyre here — punctures mean removing the wheel and levering out an inner tube whose valve owners describe as awkward to reach.',
  },
  {
    key: 'brakes', group: 'Equipment', label: 'Brakes', num: false,
    explain:
      'Discs bite hardest but are exposed to grit and need periodic adjustment. None of these four has hydraulic brakes — all are cable-actuated. That matters most on the KuKirin, whose ~40mph unrestricted capability sits on the same mechanical discs reviewers call marginal above 30mph. Every scooter here adds regenerative electronic braking on top.',
  },
  {
    key: 'suspension', group: 'Equipment', label: 'Suspension', num: false,
    explain:
      'Suspension is comfort and control — on wet, broken tarmac it keeps the tyres planted instead of skipping. The G3 E has genuinely adjustable front hydraulic + rear dual shocks; the Xiaomi uses a 45mm spring setup; the two budget scooters use undamped coil springs — the isinwheel’s reviewed as stiff and under-damped, the KuKirin’s as decent but bouncy.',
  },
  {
    key: 'lights', group: 'Equipment', label: 'Lights & indicators', num: false,
    explain:
      'All four have indicators — rarer than you’d think and genuinely useful when you can’t safely take a hand off the bar to signal. The G3 E’s auto-on 6W headlight is the brightest single lamp; the isinwheel adds ambient deck lighting, which is more about looks than being seen.',
  },
  {
    key: 'extras', group: 'Equipment', label: 'Smart features', num: false,
    explain:
      'Apple Find My matters if the scooter is your primary transport — it turns "stolen" into "trackable". Only the Segway and Xiaomi have it; they also add traction control (a real wet-weather feature that cuts power when the driven wheel slips on paint lines and manhole covers). The isinwheel has an app with NFC unlock; the KuKirin has no consumer app at all — just a touchscreen dashboard reviewers call unresponsive.',
  },
]

const g3e = {
  id: 'g3e',
  brand: 'Segway-Ninebot',
  name: 'Segway Ninebot Max G3 E',
  shortName: 'Ninebot Max G3 E',
  color: '#3987e5',
  colorSoft: 'rgba(57, 135, 229, 0.14)',
  tagline: 'The complete commuter — 11″ self-sealing tyres, most power, full suspension.',
  headline: { range: '~25 mi', weight: '24.6 kg', price: '£819' },
  images: [
    { src: '/images/ninebot-max-g3e-1.png', alt: 'Segway Ninebot Max G3 E — front three-quarter studio view' },
    { src: '/images/ninebot-max-g3e-2.png', alt: 'Segway Ninebot Max G3 E — rear view showing dual shocks' },
    { src: '/images/ninebot-max-g3e-3.jpg', alt: 'Two riders on Segway Ninebot Max G3 E scooters' },
  ],
  specs: {
    peakPower: { display: '2,000 W', num: 2000, note: 'De-rated to 700W nominal for the UK/EU, but the full 2,000W peak remains — and unlike the budget brands, Segway’s figures are independently verified.' },
    nominalPower: { display: '700 W', num: 700, note: 'US G3 runs 850W nominal; the E version trades a little sustained power for EU compliance.' },
    batteryWh: { display: '597 Wh', num: 597, note: 'Supports a second charger for ~2.5h full charges. Branded cells, proven BMS.' },
    rangeClaimed: { display: '50 mi / 80 km', num: 50 },
    rangeReal: { display: '~22–28 mi', num: 25, note: 'eRideHero measured 24.9 mi regular / 28.7 mi eco at 79kg on the faster US version; a 90kg+ Reddit owner reports 22–25 mi round trips "with battery to spare". The UK 15.5mph cap helps efficiency.' },
    topSpeed: { display: '15.5 mph (capped)', num: 15.5 },
    hillGrade: { display: '30%', num: 30, note: 'EU spec sheet claims 30%; the US sheet says 23%. Either way it’s the strongest climber here — ESG found it holds speed on steep inclines far better than the old G2, including with 100kg+ riders.' },
    chargeTime: { display: '3.5 h (2.5 h dual)', num: 3.5 },
    weight: { display: '24.6 kg', num: 24.6 },
    maxLoad: { display: '130 kg', num: 130 },
    ipRating: { display: 'IPX6 + IPX7 battery', note: 'Best water-protection combo in the group — the battery itself survives temporary immersion. TCS traction control on top.' },
    folded: { display: '122 × 59 × 59 cm', note: 'Folds flat but stays 1.2m long — it parks rather than packs.' },
    warranty: { display: '2 yr (buy via Currys)', note: 'Segway direct support reviews are poor (warranty denials for "wet road" use reported) — buying from Currys puts the Consumer Rights Act between you and that inbox.' },
    tyres: { display: '11″ tubeless, self-sealing', note: 'Self-healing gel plugs small punctures on the move — the best "only way home" insurance here.' },
    brakes: { display: 'Dual mechanical discs + regen', note: 'Strong but exposed: one 3,600km owner reported corroded, seized discs at 2,000km. Budget occasional adjustment.' },
    suspension: { display: 'Front hydraulic + rear dual, adjustable', note: '"Buttery smooth" is the recurring owner phrase; the best-riding commuter eRideHero has tested short of hyperscooters.' },
    lights: { display: 'Auto 6W headlight, brake light, indicators' },
    extras: { display: 'Find My, TCS, AirLock, cruise', note: 'AirLock keyless unlock + Apple Find My + traction control; app activation is mandatory on first ride.' },
  },
  scores: { range: 8, hills: 9, rain: 9, ride: 9, portability: 3, value: 7 },
  price: {
    rrp: 819,
    retailers: [
      { name: 'Currys', price: 819, url: 'https://www.currys.co.uk/products/segwayninebot-max-g3-e-electric-folding-scooter-black-10287596.html', note: 'In stock; ~5-day delivery. Only retailer on idealo.' },
      { name: 'Segway UK direct', price: 809, url: 'https://uk-en.segway.com/products/max-g3-e', note: 'Listed ~£809 at launch; JS-hidden price — verify at checkout.' },
      { name: 'Ride + Glide', price: null, url: 'https://www.rideandglide.co.uk/product/ninebot-by-segway-max-g3-electric-scooter/', note: 'Specialist stockist, free UK delivery; price on request.' },
      { name: 'Halfords / Argos / Amazon', price: null, url: null, note: 'Not stocked — Halfords only carries the older Max G30.' },
    ],
    deals: [
      { label: 'TopCashback: 10.5% on Currys "selected e-scooters"', verified: true, detail: 'Category verified live 6 Jul 2026; ~£71 back on £819 (paid on ex-VAT price). Model inclusion confirmed at click-through.' },
      { label: 'Quidco: 10% Currys e-scooter rate', verified: true, detail: 'Slightly below TopCashback; same ex-VAT basis (~£68).' },
      { label: 'Currys freebie: up to 2 months Apple Music / Fitness+ / Arcade', verified: false, detail: 'Seen in Currys promo copy; nice-to-have rather than money off.' },
      { label: 'No voucher codes exist', verified: true, detail: 'Segway UK doesn’t sell newsletter codes here (the famous $20 code is US-only). Aggregator "20% off Segway" codes did not check out.' },
    ],
    effectiveBest: { price: 747, how: '£819 at Currys − ~£72 TopCashback' },
  },
  reviews: {
    outlets: [
      { name: 'T3', score: '★ Rec.', quote: 'Smooth full suspension, quick, brilliantly equipped — but heavy and premium-priced.', url: 'https://www.t3.com/active/electric-scooters/segway-max-g3-review' },
      { name: 'eRideHero', score: 'Top pick', quote: 'The best-riding commuter scooter we’ve tested aside from hyperscooters.', url: 'https://eridehero.com/products/segway-ninebot-max-g3/' },
      { name: "Tom's Guide", score: 'Mixed', quote: 'Can go the distance — if you don’t need to carry it. Sport mode drinks the battery.', url: 'https://www.tomsguide.com/home/electric-scooters/segway-ninebot-ekickscooter-max-g3-review' },
    ],
    youtube: 'RK9 Rides: "most polished scooter under $1,200"; ESG calls it a game-changing commuter. Universal gripes: 24.6kg, mechanical (not hydraulic) discs, early jerky-throttle firmware.',
    reddit: 'r/ElectricScooters’ #1-ranked scooter — 75% positive across 217 users (redditrecs). "Takes me up hills like a boss." Complaints: weight, real range below claims, one report of brake corrosion at 2,000km.',
    sentiment: {
      positive: [
        { theme: 'Ride quality & suspension', weight: 5 },
        { theme: 'Hill climbing at any weight', weight: 5 },
        { theme: 'Build quality for the money', weight: 4 },
        { theme: 'Fast (dual) charging', weight: 4 },
      ],
      negative: [
        { theme: 'Heavy to lift (24.6kg)', weight: 4 },
        { theme: 'Throttle tuning / firmware quirks', weight: 3 },
        { theme: 'Segway direct support', weight: 3 },
        { theme: 'Disc brakes need maintenance', weight: 2 },
      ],
    },
  },
  pros: [
    { title: 'Holds 15.5mph up almost any hill', detail: '2,000W peak means Southampton gradients simply don’t register at 90kg.', strength: 3 },
    { title: 'Biggest verified battery + fastest charging', detail: '597Wh of branded cells and 3.5h charges (2.5h dual) — real ~25mi at your weight.', strength: 3 },
    { title: 'Best wet-weather engineering', detail: 'IPX6 body, IPX7 battery, TCS traction control, self-sealing 11″ tubeless tyres.', strength: 3 },
    { title: 'Adjustable full suspension', detail: 'Front hydraulic fork + rear dual shocks — the reference ride in this class.', strength: 2 },
  ],
  cons: [
    { title: '24.6kg — a two-hand lift', detail: 'Fine hallway-to-street; miserable up flights of stairs or onto trains.', strength: 3 },
    { title: 'Priciest of the four', detail: '£819 (~£747 after cashback) — £150+ over the Xiaomi 6 Max.', strength: 2 },
    { title: 'Mechanical discs, not hydraulic', detail: 'Strong but need periodic adjustment; one owner report of winter corrosion.', strength: 2 },
    { title: 'Segway direct aftersales is rough', detail: 'Trustpilot pattern of warranty push-back — buy via Currys for CRA cover.', strength: 2 },
  ],
  verdict: {
    rank: 1,
    headline: 'Still the winner — nothing in the 11–12″ field touches it.',
    text: [
      'Re-running this comparison against genuinely alternative brands only sharpened the conclusion. You’re 90kg, you don’t drive, your city has hills and it rains half the year: the G3 E is the only contender that treats all four of those as solved problems. The 2,000W peak motor makes hills disappear; the 597Wh battery gives honest 20+ mile days with winter margin; IPX6 plus an IPX7-sealed battery and traction control make wet tarmac routine; and the self-sealing 11″ tyres mean a shard of glass doesn’t strand you and your camera gear across town.',
      'What the budget challengers exposed is what you’re actually paying for: verified specs instead of marketing fiction, branded battery cells, a 2-year warranty honoured through Currys, and an owner base big enough that every fault has a known fix. Its flaws are unchanged — it’s heavy, the discs want a seasonal once-over, and Segway direct support is the weak link (so buy from Currys and stack the 10.5% TopCashback, ~£747 effective). Reddit’s most-recommended scooter, eRideHero’s best-riding commuter, and the right tool for your exact job.',
    ],
  },
}

const xiaomi6max = {
  id: 'x6max',
  brand: 'Xiaomi',
  name: 'Xiaomi Electric Scooter 6 Max',
  shortName: 'Xiaomi 6 Max',
  color: '#c98500',
  colorSoft: 'rgba(201, 133, 0, 0.14)',
  tagline: 'The value play — the only 12-inch wheels in the field, IPX6, under £600.',
  headline: { range: '~28 mi', weight: '29.7 kg', price: '£599' },
  images: [
    { src: '/images/xiaomi-6-max-1.png', alt: 'Xiaomi Electric Scooter 6 Max — official studio render' },
    { src: '/images/xiaomi-6-max-2.jpg', alt: 'Xiaomi Electric Scooter 6 Max — studio hero shot' },
    { src: '/images/xiaomi-6-max-3.jpg', alt: 'Rider on the Xiaomi Electric Scooter 6 Max' },
  ],
  specs: {
    peakPower: { display: '1,100 W', num: 1100, note: '45Nm of torque — strong for the class, though barely half the G3 E’s peak.' },
    nominalPower: { display: '450 W', num: 450 },
    batteryWh: { display: '468 Wh', num: 468, note: 'Smallest tank here on paper — but class-leading efficiency (6.7Wh/km claimed) means it outranges its size.' },
    rangeClaimed: { display: '43.5 mi / 70 km', num: 43.5, note: 'Drops to a claimed 28mi if you sit at top speed the whole way.' },
    rangeReal: { display: '~25–31 mi', num: 28, note: 'ScooterRank found 34–37mi mixed urban at average weight; at 90kg with hills, budget ~25–31mi — the best real range per pound here.' },
    topSpeed: { display: '15.5 mph (capped)', num: 15.5 },
    hillGrade: { display: '24%', num: 24, note: 'Validated under load per Xiaomi; expect it to slow but not stall on steep stuff at 90kg. Sustained long climbs can trigger thermal protection.' },
    chargeTime: { display: '9 h (2¾ h fast)', num: 9, note: 'Standard charger is painfully slow — but the Fast Charger 2 (free launch gift while stocks last) cuts it to 2h45.' },
    weight: { display: '29.7 kg', num: 29.7 },
    maxLoad: { display: '130 kg', num: 130 },
    ipRating: { display: 'IPX6 whole scooter' },
    folded: { display: '130 × 61 × 66 cm', note: 'The longest fold here — those 12-inch wheels have to go somewhere.' },
    warranty: { display: '2 yr, UK repairs by SBE', note: 'Mail-in with prepaid label; UK parts stock and quick turnarounds reported. The most reassuring after-sales story of the four.' },
    tyres: { display: '12″ tubeless', note: 'The only 12-inch wheels in the field — +13% contact patch and claimed +40% wet grip vs the 5 Max. Rolls over potholes the others feel.' },
    brakes: { display: 'Dual discs + rear E-ABS' },
    suspension: { display: 'Front fork + dual rear springs, 45mm' },
    lights: { display: 'Headlight, brake light, indicators' },
    extras: { display: 'Find My, TCS, 3″ TFT, app', note: 'Apple Find My, traction control, OTA firmware and smart charging modes via Xiaomi Home.' },
  },
  scores: { range: 8, hills: 7, rain: 8, ride: 8, portability: 1, value: 9 },
  price: {
    rrp: 649,
    retailers: [
      { name: 'Xiaomi UK (mi.com)', price: 599.99, url: 'https://www.mi.com/uk/product/xiaomi-electric-scooter-6-max/', note: 'In stock + free Fast Charger 2 launch gift (first come, first served).' },
      { name: 'idealo listing', price: 589.99, url: 'https://www.idealo.co.uk/', note: 'Single third-party offer tracked at £589.99.' },
      { name: 'Currys / Argos / Halfords', price: null, url: null, note: 'Not stocked yet — UK retail for the 6 series is mi.com-only so far.' },
      { name: 'Amazon UK', price: null, url: null, note: 'No verified listing at research time.' },
    ],
    deals: [
      { label: 'Free Xiaomi Fast Charger 2 (worth ~£99)', verified: true, detail: 'Live on the 6-series event page — cuts charging from 9h to 2¾h. The single most valuable freebie in this comparison.' },
      { label: 'New-user coupon: £5 off', code: 'auto', verified: true, detail: 'mi.com/uk new-account coupon, AIOT category ≥£59, first order, 14-day validity.' },
      { label: 'TopCashback: 2% on mi.com', verified: true, detail: '~£10 back (ex-VAT basis). May not stack with coupons — pick one.' },
      { label: 'HotUKDeals "£15 Xiaomi voucher"', verified: false, detail: 'Listed May 2026; could not be verified live.' },
    ],
    effectiveBest: { price: 590, how: '£599.99 − 2% cashback, + free Fast Charger 2' },
  },
  reviews: {
    outlets: [
      { name: 'T3 (hands-on)', score: 'Positive', quote: 'The pick for a subtler design while only losing a little power to the flagship Ultra.', url: 'https://www.t3.com/active/electric-scooters/i-rode-the-xiaomi-scooter-6-ultra-and-it-gives-segway-and-apollo-a-run-for-their-money' },
      { name: 'ScooterRank', score: '57/100', quote: 'Above-average motor, range and IPX6 — but 29.7kg vs a 23.9kg category average.', url: 'https://scooterrank.com/scooters/xiaomi-electric-scooter-6-max' },
    ],
    youtube: 'Almost all coverage went to the flagship 6 Ultra (very positive on ride and value). The Max itself has near-zero dedicated video coverage — it launched in Feb 2026 and reviewers skipped past it.',
    reddit: 'No meaningful owner threads yet — the model is ~4 months old in the UK. Treat community sentiment as unknown; Xiaomi’s wider scooter history includes stem-wobble complaints on the 4-series that the 6’s reinforced carbon-steel frame appears designed to answer.',
    sentiment: {
      positive: [
        { theme: '12″ wheels — comfort & grip', weight: 4 },
        { theme: 'Range per pound', weight: 5 },
        { theme: 'IPX6 + TCS for wet riding', weight: 4 },
        { theme: 'UK repair network (SBE)', weight: 3 },
      ],
      negative: [
        { theme: '29.7kg — heavy', weight: 5 },
        { theme: '9h standard charge', weight: 4 },
        { theme: 'No track record yet', weight: 3 },
        { theme: 'Won’t charge below 8°C', weight: 2 },
      ],
    },
  },
  pros: [
    { title: 'The only true 12-inch wheels here', detail: 'Biggest contact patch of the four; +40% claimed wet grip. Confidence on greasy tarmac.', strength: 3 },
    { title: 'Best real range for the money', detail: '~25–31mi at your weight for under £600 — unbeatable £/mile in this field.', strength: 3 },
    { title: 'Free Fast Charger 2 at launch', detail: 'Turns its worst spec (9h charging) into 2¾h — grab it while the gift lasts.', strength: 2 },
    { title: 'Solid UK warranty path', detail: '2 years, repairs done in the UK by SBE with prepaid shipping.', strength: 2 },
  ],
  cons: [
    { title: '29.7kg — properly heavy', detail: 'This is furniture that moves, not luggage.', strength: 3 },
    { title: 'Thermal throttling on long climbs', detail: 'Motor protection can sap power on sustained gradients — relevant to your hills.', strength: 2 },
    { title: 'Zero review/owner track record', detail: 'Launched Feb 2026; no long-term reliability data exists yet.', strength: 2 },
    { title: 'Cold-charging cutoff', detail: 'Refuses to charge below 8°C — a real constraint for unheated storage in winter.', strength: 1 },
  ],
  verdict: {
    rank: 2,
    headline: 'The runner-up — and the only 12-incher worth buying.',
    text: [
      'If the budget conversation wins, buy this and don’t look back. £599 with a free fast charger gets you the only 12-inch wheels in the UK’s sub-£900 market worth having, excellent real-world range, IPX6, traction control, Find My and a genuinely good UK repair setup. The catches: a 1,100W peak motor that will feel your steeper climbs at 90kg where the G3 E wouldn’t, nearly 30kg of kerb weight, and the simple fact that nobody — professional or Reddit — has lived with one long enough to vouch for it yet. Against the budget brands below, though, its spec sheet is honest and its warranty is real — that’s worth a lot when the machine is your only transport.',
    ],
  },
}

const gt2 = {
  id: 'gt2',
  brand: 'isinwheel',
  name: 'isinwheel GT2',
  shortName: 'isinwheel GT2',
  color: '#199e70',
  colorSoft: 'rgba(25, 158, 112, 0.14)',
  tagline: 'The budget 11-incher — a lot of scooter for £539, if you get a good one.',
  headline: { range: '~22 mi', weight: '~25 kg', price: '£539' },
  images: [
    { src: '/images/isinwheel-gt2-1.jpg', alt: 'isinwheel GT2 — front three-quarter studio view with red front forks' },
    { src: '/images/isinwheel-gt2-2.jpg', alt: 'isinwheel GT2 — side profile showing suspension and off-road tread' },
    { src: '/images/isinwheel-gt2-3.jpg', alt: 'isinwheel GT2 parked in a field' },
  ],
  specs: {
    peakPower: { display: '1,200 W (claimed)', num: 1200, note: 'Sold as "800W", "1000W" and "1200W" on different isinwheel pages — multiple hardware batches ship under one name. No torque figure published; no independent verification.' },
    nominalPower: { display: '800 W', num: 800, note: 'The 2026 "upgraded" listing claims 1000W rated. Confirm which batch you’re getting before ordering.' },
    batteryWh: { display: '720 Wh', num: 720, note: '48V 15Ah, removable. Cell brand unpublished; 6-month warranty on the battery tells its own story.' },
    rangeClaimed: { display: '31–37 mi / 50–60 km', num: 34, note: 'A cheaper "Weekly Deal" listing of the same scooter claims only 45km — more batch chaos.' },
    rangeReal: { display: '~20–24 mi', num: 22, note: 'Battery-capacity analysis puts real commuting range at 20–24mi; ~32mi is achievable at eco pace for an 82kg rider.' },
    topSpeed: { display: '28 mph unrestricted', num: 28, note: 'TechGearLab tested 26.3mph. Has a 15.5mph limited mode; ships unlocked-capable.' },
    hillGrade: { display: '"35°" (≈15% real)', num: 15, note: 'The 35° claim is physically absurd (that’s a 70% grade). Independent testing: an 82kg rider maxed out around 15% — expect a little less at 90kg.' },
    chargeTime: { display: '7–9 h', num: 8, note: '2A charger on a 720Wh pack. Official pages disagree (5–7h vs 7–9h); the physics says 7½h+.' },
    weight: { display: '~24–26 kg', num: 25, note: 'Listed as both 22.5kg and 25.8kg on isinwheel’s own pages.' },
    maxLoad: { display: '150 kg', num: 150, note: 'Joint-biggest load rating here — genuine headroom for you plus camera kit.' },
    ipRating: { display: 'IPX4–5 (battery IP65)', note: 'The headline "IP65" is the battery pack only. Whole-scooter rating is IPX4 (spec sheet) or IPX5 (FAQ) — splash-resistant, not rain-proof. isinwheel’s own FAQ: "we do not recommend the scooter be wet outdoors for a long time".' },
    folded: { display: '122 × 22 × 57 cm', note: 'Slim when folded but still 1.22m long.' },
    warranty: { display: '1 yr frame / 6 mo electrics', note: 'Battery, motor, controller and charger are classed "consumable" — 6 months only. No free replacement policy; repairs-first, often self-fit parts. Trustpilot 3.6/5 with return-battle stories.' },
    tyres: { display: '11″ pneumatic off-road, tubed', note: 'The only tubed tyres here — punctures mean levering out an inner tube, and owners report the valve is awkward to reach.' },
    brakes: { display: 'Disc + E-ABS regen', note: 'Official pages disagree on one disc or two. Reviewers: mechanical, adequate, and needing "significant adjustment out of the box".' },
    suspension: { display: '4 coil springs (undamped)', note: 'Reviewed as stiff and under-damped — "doesn’t handle bumps very well" at speed.' },
    lights: { display: 'Front/rear, deck ambient, indicators' },
    extras: { display: 'App + NFC unlock (2026 batch)', note: 'No Find My, no traction control. Thumb throttle criticised for hand cramp; cruise control implementation called "dangerous" by one reviewer.' },
  },
  scores: { range: 7, hills: 5, rain: 5, ride: 6, portability: 3, value: 8 },
  price: {
    rrp: 799,
    retailers: [
      { name: 'isinwheel.co.uk', price: 539, url: 'https://www.isinwheel.co.uk/products/isinwheel-gt2-800w-off-road-electric-scooter', note: 'In stock, includes "waterproof" bag. RRP £799 is a soft anchor.' },
      { name: 'isinwheel "Weekly Deal"', price: 499, url: 'https://www.isinwheel.co.uk/products/gt2-800w-off-road-electric-scooter-isinwheel', note: 'Same name, quotes older 800W/45km spec — possibly old-batch stock. Ask before buying.' },
      { name: 'Gleeride UK', price: 549, url: 'https://uk.gleeride.com/products/isinwheel-gt2-11-folding-off-road-electric-scooter-800w-motor-48v-15ah-battery', note: 'Currently backordered.' },
      { name: 'Amazon UK', price: null, url: 'https://www.amazon.co.uk/isinwheel-Electric-GT2-Scooters-Scooter/dp/B0CQ4MB6NV', note: 'Listing exists but rated just 2.6/5 (4 reviews); price unverified.' },
    ],
    deals: [
      { label: 'TopCashback: 3.15% on isinwheel', verified: true, detail: '~£15 back on £499 (ex-VAT basis). Quidco also lists isinwheel. Voided if you stack an unlisted code.' },
      { label: 'Newsletter: £10–20 off first order', verified: false, detail: 'Sources conflict on the amount; likely can’t combine with sale prices.' },
      { label: 'Code BACTSL50 (£50 off)', code: 'BACTSL50', verified: true, detail: 'Minimum spend £699 — useless at the current sale price. Listed for completeness.' },
    ],
    effectiveBest: { price: 483, how: '£499 Weekly Deal − 3.15% TopCashback (confirm batch spec first)' },
  },
  reviews: {
    outlets: [
      { name: 'TechGearLab (via meta-review)', score: 'Tested', quote: '26.3mph top speed measured — but "goes much slower up hills".', url: 'https://www.duodianbike.com/blogs/blog/isinwheel-gt2-deep-review-a-budget-off-roader-with-caveats' },
      { name: 'DuoDian (meta-review)', score: 'Caveats', quote: 'Good top-speed value… falls short of its all-terrain marketing. QC lottery: flat tyres on arrival, missing hooks, peeling grip tape.', url: 'https://www.duodianbike.com/blogs/blog/isinwheel-gt2-deep-review-a-budget-off-roader-with-caveats' },
    ],
    youtube: '"This Off-Road Scooter Shouldn’t Be This Fast" is the tone — impressed by speed-per-pound on flat ground, unconvinced by the off-road/climbing marketing. Beware: many top-ranking GT2 "reviews" are isinwheel’s own blog posts.',
    reddit: 'Essentially absent from r/ElectricScooters — no substantive owner threads found. Low community presence means a weak peer-support and modding knowledge base if something goes wrong. Amazon US owners (4.4/5, 1,200+ reviews) are much happier than Amazon UK’s tiny sample (2.6/5).',
    sentiment: {
      positive: [
        { theme: 'Speed & spec per pound', weight: 4 },
        { theme: 'Big 720Wh battery at £539', weight: 4 },
        { theme: '150kg load headroom', weight: 3 },
        { theme: 'Fast UK delivery', weight: 3 },
      ],
      negative: [
        { theme: 'QC lottery out of the box', weight: 4 },
        { theme: 'Hill claim vs 15% reality', weight: 4 },
        { theme: 'Support & returns battles', weight: 3 },
        { theme: '6-month electrics warranty', weight: 3 },
      ],
    },
  },
  pros: [
    { title: 'Aggressive value', detail: '720Wh, 11″ rubber, suspension and indicators for ~£483 effective — half the Segway’s money.', strength: 3 },
    { title: '150kg max load', detail: 'You plus full camera kit is barely two-thirds load — frame headroom the price doesn’t suggest.', strength: 2 },
    { title: 'Removable battery', detail: 'The only scooter here where the battery comes out to charge indoors.', strength: 2 },
    { title: 'Genuinely quick on the flat', detail: '26.3mph tested (private land only) — the motor isn’t the bottleneck on level ground.', strength: 1 },
  ],
  cons: [
    { title: 'Marketing you can’t trust', detail: '"35°" hills ≈ 15% real; "IP65" is battery-only; three different motor ratings for one product name.', strength: 3 },
    { title: 'Splash-proof, not rain-proof', detail: 'IPX4–5 overall and isinwheel advises against prolonged wet exposure — a gamble as sole transport in Southampton.', strength: 3 },
    { title: '6-month warranty on everything that matters', detail: 'Battery, motor, controller — the expensive failures — get half the cover, and Trustpilot shows returns can be a fight.', strength: 3 },
    { title: 'QC lottery', detail: 'Arrivals with flat tyres, missing parts, maladjusted brakes; UK OPSS recalled an earlier isinwheel model over a fire risk (2021).', strength: 2 },
  ],
  verdict: {
    rank: 3,
    headline: 'The gamble — fine weather value, wrong tool for your winters.',
    text: [
      'Judged purely on the spec sheet, the GT2 embarrasses scooters costing £300 more. Judged on the evidence, it’s a different machine: the hill claim collapses from "35°" to about 15% real at your weight, the waterproofing headline covers only the battery, the electrics carry a 6-month warranty, and delivery is a QC coin-flip that Trustpilot suggests you don’t want to lose. If you were a 70kg fair-weather rider with £500, this would be a genuinely smart buy. As a 90kg, all-weather, no-backup-vehicle commuter in a hilly city, you’d be betting your daily mobility on the exact scenarios — steep, wet, warranty — where this scooter is weakest.',
    ],
  },
}

const g4 = {
  id: 'g4',
  brand: 'KuKirin',
  name: 'KuKirin G4',
  shortName: 'KuKirin G4',
  color: '#9085e9',
  colorSoft: 'rgba(144, 133, 233, 0.14)',
  tagline: 'The range monster — 1,200Wh and real 35-mile days, but allergic to rain.',
  headline: { range: '~32 mi', weight: '~37–41 kg', price: '£739' },
  images: [
    { src: '/images/kukirin-g4-1.jpg', alt: 'KuKirin G4 — side profile studio view' },
    { src: '/images/kukirin-g4-2.jpg', alt: 'KuKirin G4 — front three-quarter view showing headlight cluster' },
    { src: '/images/kukirin-g4-3.jpg', alt: 'Rider posing with the KuKirin G4 at night' },
  ],
  specs: {
    peakPower: { display: '2,000 W (rated)', num: 2000, note: 'KuKirin publishes only one figure — "rated 2000W" — with no verified nominal/peak split. Real-world it behaves like a strong single motor: ≥38Nm, GPS-verified 38–41mph unrestricted.' },
    nominalPower: { display: 'Unpublished', num: 0, note: 'No honest nominal figure exists. Torque ≥38Nm is the only published performance number.' },
    batteryWh: { display: '1,200 Wh', num: 1200, note: '60V 20Ah — double the Segway. Cell brand unpublished (assume generic); ~500 cycles claimed.' },
    rangeClaimed: { display: '46 mi / 75 km', num: 46 },
    rangeReal: { display: '~30–36 mi', num: 32, note: 'Ebike Escape: 30 miles used ~70% battery (75kg rider, hills). Hard riding at speed drops it to 25–30mi. Still the longest legs here by a distance.' },
    topSpeed: { display: '~40 mph unrestricted', num: 40, note: 'Three modes: 12.5/25/43mph. GPS tests show 38–41mph. No 15.5mph UK mode — and mechanical brakes reviewers call marginal above 30mph.' },
    hillGrade: { display: '20° claimed', num: 20, note: 'Community verdict: holds momentum on moderate climbs but "lacks torque to launch uphill from a standstill" — hills are the G4’s known weakness for heavier riders.' },
    chargeTime: { display: '10–12 h', num: 11, note: 'A 2A charger into 1,200Wh. No dual-charger or fast-charge option exists. Overnight, every night.' },
    weight: { display: '~37–41.5 kg', num: 39, note: 'KuKirin’s own pages list 35.5, 37 and 41.5kg. Whichever is true: this is not a scooter you lift.' },
    maxLoad: { display: '120 kg', num: 120 },
    ipRating: { display: 'IPX4 — splash only', note: 'KuKirin’s own blog: fine for "light rain, road splashes, morning dew"; avoid downpours and puddles. Warranty explicitly excludes ALL moisture damage. Loco Scooters sells £59/yr water-damage cover — read that as a confession.' },
    folded: { display: '134 × 55 × 66 cm', note: 'Big even folded, and with no stem latch to hold it shut for carrying.' },
    warranty: { display: '1 yr (water excluded)', note: 'Claims handled by shipping you parts to fit yourself; no UK repair centre. Buying from Loco Scooters (Trustpilot 5★, own repair centre) is the smarter route.' },
    tyres: { display: '11″ tubeless off-road, 90mm wide', note: 'Wide, cushioned and tubeless — genuinely good rubber for broken tarmac.' },
    brakes: { display: 'Cable discs + regen', note: '140–160mm mechanical discs. Reviewers: adequate at commuter speeds, inadequate above 30mph; community fits upgraded pads on day one.' },
    suspension: { display: 'Front + rear springs', note: 'Comfortable at cruise; speed-wobble reports around 30mph from some owners.' },
    lights: { display: '6-LED set: head, brake, indicators' },
    extras: { display: 'Touchscreen dash, key-start — no app', note: 'No Find My, no traction control, no consumer app. The touchscreen is reviewed as unresponsive.' },
  },
  scores: { range: 9, hills: 6, rain: 3, ride: 7, portability: 1, value: 7 },
  price: {
    rrp: 849,
    retailers: [
      { name: 'KuKirin UK official', price: 739, url: 'https://kukirin.co.uk/products/kukirin-g4-electric-scooter', note: '"Was £1,059" is an inflated anchor — street price elsewhere is £759–850. UK warehouse, free shipping.' },
      { name: 'Loco Scooters', price: 759, url: 'https://locoscooters.co.uk/products/kugoo-g4', note: 'Trustpilot 5★ specialist with own repair centre + optional £59/yr water-damage cover. Worth the £20.' },
      { name: 'Rapid Scooter (London)', price: 849.99, url: 'https://rapidscooter.co.uk', note: 'Two London branches, Klarna finance.' },
      { name: 'Amazon UK', price: null, url: 'https://www.amazon.co.uk/dp/B0GS1V4LRM', note: 'Prime-eligible listing exists; price unverified at research time.' },
    ],
    deals: [
      { label: 'Mid-Year sale: £739 at kukirin.co.uk', verified: true, detail: 'Live 6 Jul 2026. Newsletter promises coupons but states no percentage.' },
      { label: 'Loco water-damage warranty £59/yr', verified: true, detail: 'Unique among all retailers in this comparison — and for a rainy city, arguably essential with this scooter.' },
      { label: 'No cashback exists', verified: true, detail: 'Neither TopCashback nor Quidco lists KuKirin or Loco Scooters.' },
    ],
    effectiveBest: { price: 739, how: '£739 at kukirin.co.uk (or £818 at Loco with water cover — the honest price for your use)' },
  },
  reviews: {
    outlets: [
      { name: 'Ebike Escape', score: '8.7/10', quote: 'Smooth acceleration, great suspension and value — but mechanical discs are inadequate above 30mph.', url: 'https://ebikeescape.com/kukirin-g4-review/' },
      { name: 'Hobarts', score: 'Positive', quote: 'Unbeatable combination of speed, range and affordability — with an unresponsive touchscreen and 10–12h charging.', url: 'https://hobartsreviews.com/e-scooters/kukirin-g4-review/' },
      { name: 'DuoDian (2026)', score: 'Mixed', quote: 'Speed on a budget for flatland commuters comfortable with DIY maintenance — not recommended for hilly terrain.', url: 'https://www.duodianbike.com' },
    ],
    youtube: 'GPS consensus: 38–41mph real top speed. Reviewers like the ride and value; every serious one flags the brakes, the weight and the charge time.',
    reddit: 'Genuinely mixed (redditrecs): "5,000+ miles, solid AF" sits next to "pretty shit… sluggish, an ugly brick" and 30mph speed-wobble reports. Brand-level: "Kukirin skimps on quality and reliability, not on marketing" — but parts availability gets consistent praise.',
    sentiment: {
      positive: [
        { theme: 'Range — 1,200Wh is real', weight: 5 },
        { theme: 'Comfort at cruise (11″ + springs)', weight: 4 },
        { theme: 'Spare parts actually available', weight: 3 },
        { theme: 'Value vs performance brands', weight: 3 },
      ],
      negative: [
        { theme: 'Rain sensitivity (IPX4)', weight: 5 },
        { theme: '10–12h charging, no fast option', weight: 4 },
        { theme: 'QC variability & display faults', weight: 3 },
        { theme: 'Brakes marginal for its speed', weight: 3 },
      ],
    },
  },
  pros: [
    { title: 'Twice the battery of anything here', detail: '1,200Wh = real 30–36 mile days at your weight. Multi-day photography rounds on one charge.', strength: 3 },
    { title: 'Comfortable, planted cruiser', detail: 'Wide 11″ tubeless rubber, dual springs, big deck — very stable at commuter speeds.', strength: 2 },
    { title: 'Fixable', detail: 'Controllers, displays, throttles all purchasable in the UK (even on Amazon) — rare at this price.', strength: 2 },
    { title: 'Indicators and a proper light set', detail: '6-LED system with turn signals front and rear.', strength: 1 },
  ],
  cons: [
    { title: 'Splash-proof only — in your rainiest use case', detail: 'IPX4, moisture damage excluded from warranty, known connector-corrosion failure path (E-003/E-006 errors).', strength: 3 },
    { title: 'Weak uphill from a standstill', detail: 'Community consensus: hills are its weakness — holds momentum, bogs on steep starts at 90kg+.', strength: 3 },
    { title: '10–12 hour charges', detail: 'The price of 1,200Wh on a 2A brick. Miss a night and you’re grounded.', strength: 2 },
    { title: '~40kg and no stem latch', detail: 'Heaviest here by miles; effectively immovable except on its wheels.', strength: 2 },
  ],
  verdict: {
    rank: 4,
    headline: 'Magnificent range, but Southampton rain is its kryptonite.',
    text: [
      'The G4 does one thing better than anything in this comparison: distance. 1,200Wh is honest 30-plus-mile days at your weight, and owners rack up thousands of miles on them. But look at it through your constraints and it unravels: splash-only IPX4 with a warranty that names moisture as excluded (its most committed UK dealer literally sells rain insurance for it), hills-from-standstill as its acknowledged weak point, half-day charge times, and 40kg of scooter with mechanical brakes rated for less speed than it delivers. If you had a dry garage, flat terrain and a second vehicle, the G4 would be a bargain workhorse. You have none of those three.',
    ],
  },
}

export const SCOOTERS = [g3e, xiaomi6max, gt2, g4]

export const VERDICT = {
  intro:
    'Ranked for one specific rider: Ryan, ~90kg, Southampton, no car, camera case in tow, rain and hills non-negotiable, 11–12″ tyres required. A different rider would get a different order — that’s what the sliders above are for.',
  coda: [
    'What this second pass proved: the 11–12″ tyre requirement plus "buyable in the UK today" is a brutal filter. The Navee GT3 Max and NIU KQi 300X fell at availability (no UK channel ships them right now). The only true 12-inch alternative brand — the British 8TEV B12 Classic, £699, IPX6 and a lovely 17kg — runs a 250W-nominal motor that has no business hauling 90kg up a Southampton hill, so it never made the cut. And the budget 11-inchers that did make the cut (isinwheel, KuKirin) both turned out to trade exactly the things your use case can’t trade: honest waterproofing, honest hill figures, and warranties that mean something.',
    'The boring-but-important bit stands: whichever you choose, buy through a UK retailer with Consumer Rights Act standing (Currys for the Segway; Loco Scooters if you insist on the G4), activate cashback before you click, and remember private e-scooters remain legal only on private land in the UK while the long-promised legislation keeps not arriving.',
  ],
}
