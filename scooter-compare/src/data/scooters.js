// All research conducted 6 July 2026. Prices in GBP, checked against retailer
// pages, idealo and PriceSpy on that date. Real-world figures favour tested
// data (eRideHero, ebiketips, owner reports) over manufacturer claims.

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
      'Peak watts is what the motor can briefly deliver when you ask for everything — pulling away, or halfway up a hill. At 90kg you lean on peak power constantly on climbs: it’s the single best predictor of whether a scooter holds speed up a Southampton gradient or wheezes to walking pace.',
  },
  {
    key: 'nominalPower', group: 'Performance', label: 'Nominal motor power', betterHigh: true,
    explain:
      'The power the motor can sustain continuously without overheating. UK/EU versions are often de-rated versus US models (the G3 E runs 700W nominal vs the US G3’s 850W). Sustained climbs at rider weights near the max load are where nominal power matters more than peak.',
  },
  {
    key: 'batteryWh', group: 'Performance', label: 'Battery capacity', betterHigh: true,
    explain:
      'Watt-hours are the fuel tank. As a rule of thumb a 90kg rider on mixed terrain uses roughly 15–20Wh per mile at 15.5mph — so 597Wh is a realistic ~25–35 miles, 468Wh is ~20–28, and 342Wh is ~12–17. Bigger batteries also age slower for the same mileage because each cell works less hard per trip.',
  },
  {
    key: 'rangeClaimed', group: 'Performance', label: 'Claimed range', betterHigh: true,
    explain:
      'Manufacturer figures come from a light rider at ~15km/h on a flat, windless test loop. Treat them as a marketing ceiling — every scooter here delivers roughly half its claim in real UK commuting. Useful only for comparing scooters against each other on equal terms.',
  },
  {
    key: 'rangeReal', group: 'Performance', label: 'Real-world range (est. @90kg)', betterHigh: true,
    explain:
      'Our estimate for you specifically: ~90kg rider, mixed Southampton terrain with hills, normal riding mode, mild weather. Sources: eRideHero instrumented tests, ebiketips hilly-course tests and heavier-rider owner reports. Knock another 20–30% off in winter — lithium cells hate the cold.',
  },
  {
    key: 'topSpeed', group: 'Performance', label: 'Top speed', betterHigh: true,
    explain:
      'All four are software-capped at 25km/h (15.5mph) for the UK/EU market, so speed doesn’t separate them. What separates them is whether they can hold 25km/h up a hill with 90kg aboard — that’s the peak-power and torque story above.',
  },
  {
    key: 'hillGrade', group: 'Performance', label: 'Max claimed gradient', betterHigh: true,
    explain:
      'The steepest slope the maker says it can climb — usually measured with a light rider, so treat it as relative rather than absolute. For context: a typical steep UK residential street is 10–15%; 20%+ is properly steep. At 90kg, subtract several points from every claim.',
  },
  {
    key: 'chargeTime', group: 'Performance', label: 'Charge time (hours)', betterHigh: false,
    explain:
      'Full 0–100% on the supplied charger. If the scooter is your only transport, slow charging is a genuine lifestyle constraint — a 9–10 hour charge means overnight, every night. The G3 E supports a second charger for ~2.5h; the Xiaomis take an optional Fast Charger 2 (~2h45 on the Max).',
  },
  // Practical
  {
    key: 'weight', group: 'Practicality', label: 'Weight (kg)', betterHigh: false,
    explain:
      'You don’t drive, so this is the "dead scooter / train / stairs / hallway" number. 16kg is liftable one-handed for short bursts. 24kg+ is a two-hand grunt. Nearly 30kg is effectively wheel-it-or-leave-it — fine if it lives in a hallway, brutal if your flat is up stairs.',
  },
  {
    key: 'maxLoad', group: 'Practicality', label: 'Max rider load (kg)', betterHigh: true,
    explain:
      'You + clothing + camera bag. At 90kg plus a few kilos of photography gear you want generous headroom — motors, brakes and range all degrade as you approach the limit. 120kg gives you ~25kg of margin; 130–140kg means the scooter barely notices your kit.',
  },
  {
    key: 'ipRating', group: 'Practicality', label: 'Water resistance', num: false,
    explain:
      'IPX5 = low-pressure water jets (light rain, spray). IPX6 = heavy jets (proper rain, puddle spray). IP65 adds full dust-tightness. IPX7 (the G3 E’s battery) survives temporary immersion. For year-round Southampton commuting anything below IPX5 is a gamble; IPX6+ is where you stop thinking about the forecast. One caveat: several brands have refused water-damage warranty claims regardless of rating, so store it dry.',
  },
  {
    key: 'folded', group: 'Practicality', label: 'Folded size', num: false,
    explain:
      'How much hallway, boot or train luggage-rack it eats. The Flex is the outlier — it folds in half like a Brompton to cabin-bag size and can be rolled while folded. The other three fold flat-stem-to-deck and stay long: over 1.2m of scooter to park.',
  },
  {
    key: 'warranty', group: 'Practicality', label: 'Warranty & UK support', num: false,
    explain:
      'Length is only half the story — who honours it matters more. Buying from a big UK retailer (Currys, Halfords, Argos) adds Consumer Rights Act leverage: your contract is with the shop, not an overseas support inbox. Both Segway’s and Pure’s direct support draw mixed-to-poor Trustpilot reviews; Xiaomi repairs are handled in the UK by their partner SBE with a decent reputation.',
  },
  // Equipment
  {
    key: 'tyres', group: 'Equipment', label: 'Tyres', num: false,
    explain:
      'Bigger pneumatic tyres roll over potholes and grip better in the wet. Tubeless means no inner tube to pinch-puncture; the G3 E adds self-sealing gel that plugs small punctures as you ride — a big deal when the scooter is your only way home. Solid tyres (none here, thankfully) are the wet-grip villain.',
  },
  {
    key: 'brakes', group: 'Equipment', label: 'Brakes', num: false,
    explain:
      'Discs bite hardest but are exposed to grit and need periodic adjustment — one long-term G3 owner had seized calipers at 2,000km. Enclosed drums (Pure’s front) are weaker on paper but shrug off winter grime, which suits a rain commuter. Every scooter here adds regenerative electronic braking on top.',
  },
  {
    key: 'suspension', group: 'Equipment', label: 'Suspension', num: false,
    explain:
      'Suspension is comfort and control — on wet, broken tarmac it keeps the tyres planted instead of skipping. The G3 E has genuinely adjustable front hydraulic + rear dual shocks; the Xiaomis use spring setups with ~45mm travel; the Flex has none and relies on its 10-inch tubeless tyres and wide stance.',
  },
  {
    key: 'lights', group: 'Equipment', label: 'Lights & indicators', num: false,
    explain:
      'All four have indicators — rarer than you’d think and genuinely useful when you can’t safely take a hand off the bar to signal. Headlight quality varies: the Flex’s 150-lumen unit plus footrest tail lights is the most visible package; the G3 E’s auto-on 6W headlight is the brightest single lamp.',
  },
  {
    key: 'extras', group: 'Equipment', label: 'Smart features', num: false,
    explain:
      'Apple Find My matters if the scooter is your primary transport — it turns "stolen" into "trackable". Traction control (TCS) is a real wet-weather feature, cutting power when the driven wheel slips on paint lines and manhole covers. All four pair to an app for lock, firmware and ride stats.',
  },
]

const g3e = {
  id: 'g3e',
  brand: 'Segway-Ninebot',
  name: 'Segway Ninebot Max G3 E',
  shortName: 'Ninebot Max G3 E',
  color: '#3987e5',
  colorSoft: 'rgba(57, 135, 229, 0.14)',
  tagline: 'The complete commuter — biggest battery, most power, full suspension.',
  headline: { range: '~22 mi', weight: '24.6 kg', price: '£819' },
  images: [
    { src: '/images/ninebot-max-g3e-1.png', alt: 'Segway Ninebot Max G3 E — front three-quarter studio view' },
    { src: '/images/ninebot-max-g3e-2.png', alt: 'Segway Ninebot Max G3 E — rear view showing dual shocks' },
    { src: '/images/ninebot-max-g3e-3.jpg', alt: 'Two riders on Segway Ninebot Max G3 E scooters' },
  ],
  specs: {
    peakPower: { display: '2,000 W', num: 2000, note: 'De-rated to 700W nominal for the UK/EU, but the full 2,000W peak remains — it out-punches everything here by a wide margin.' },
    nominalPower: { display: '700 W', num: 700, note: 'US G3 runs 850W nominal; the E version trades a little sustained power for EU compliance.' },
    batteryWh: { display: '597 Wh', num: 597, note: 'Biggest tank in the group, and it supports a second charger for ~2.5h full charges.' },
    rangeClaimed: { display: '50 mi / 80 km', num: 50 },
    rangeReal: { display: '~22–28 mi', num: 25, note: 'eRideHero measured 24.9 mi regular / 28.7 mi eco at 79kg on the faster US version; a 90kg+ Reddit owner reports 22–25 mi round trips "with battery to spare". The UK 15.5mph cap helps efficiency.' },
    topSpeed: { display: '15.5 mph', num: 15.5 },
    hillGrade: { display: '30%', num: 30, note: 'EU spec sheet claims 30%; the US sheet says 23%. Either way it’s the strongest climber here — ESG found it holds speed on steep inclines far better than the old G2.' },
    chargeTime: { display: '3.5 h (2.5 h dual)', num: 3.5 },
    weight: { display: '24.6 kg', num: 24.6 },
    maxLoad: { display: '130 kg', num: 130 },
    ipRating: { display: 'IPX6 + IPX7 battery', note: 'Best water-protection combo in the group — the battery itself survives temporary immersion.' },
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
      { name: 'Halfords / Argos / Pure', price: null, url: null, note: 'Not stocked — Halfords only carries the older Max G30.' },
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
    { title: 'Biggest battery + fastest charging', detail: '597Wh and 3.5h charges (2.5h with a second charger) — real ~22mi at your weight.', strength: 3 },
    { title: 'Best wet-weather engineering', detail: 'IPX6 body, IPX7 battery, TCS traction control, self-sealing tubeless tyres.', strength: 3 },
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
    headline: 'The winner — buy this one.',
    text: [
      'This is the scooter your use case describes. You’re 90kg, you don’t drive, your city has hills and it rains half the year: the G3 E is the only contender that treats all four of those as solved problems rather than compromises. The 2,000W peak motor means hills genuinely disappear; the 597Wh battery gives you honest 20+ mile days with margin for winter; IPX6 plus an IPX7-sealed battery and traction control make wet tarmac routine; and the self-sealing tyres mean a shard of glass doesn’t strand you and your camera gear across town.',
      'Its flaws are real but livable: it’s heavy (you’re parking it, not carrying it), the discs want a seasonal once-over, and Segway’s direct support is the weakest link — so buy it from Currys, stack the 10.5% TopCashback (~£747 effective) and let the Consumer Rights Act do the warranty heavy-lifting. Reddit’s most-recommended scooter, eRideHero’s best-riding commuter, and the right tool for your exact job.',
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
  tagline: 'The value play — 12-inch wheels and IPX6 for under £600.',
  headline: { range: '~28 mi', weight: '29.7 kg', price: '£599' },
  images: [
    { src: '/images/xiaomi-6-max-1.png', alt: 'Xiaomi Electric Scooter 6 Max — official studio render' },
    { src: '/images/xiaomi-6-max-2.jpg', alt: 'Xiaomi Electric Scooter 6 Max — studio hero shot' },
    { src: '/images/xiaomi-6-max-3.jpg', alt: 'Rider on the Xiaomi Electric Scooter 6 Max' },
  ],
  specs: {
    peakPower: { display: '1,100 W', num: 1100, note: '45Nm of torque — strong for the class, though barely half the G3 E’s peak.' },
    nominalPower: { display: '450 W', num: 450 },
    batteryWh: { display: '468 Wh', num: 468, note: 'Slightly smaller than the old 5 Max’s 477Wh, but much more efficient (6.7 vs 8.0 Wh/km claimed).' },
    rangeClaimed: { display: '43.5 mi / 70 km', num: 43.5, note: 'Drops to a claimed 28mi if you sit at top speed the whole way.' },
    rangeReal: { display: '~25–31 mi', num: 28, note: 'ScooterRank found 34–37mi mixed urban at average weight; at 90kg with hills, budget ~25–31mi — still the group’s best real range per pound.' },
    topSpeed: { display: '15.5 mph', num: 15.5 },
    hillGrade: { display: '24%', num: 24, note: 'Validated under load per Xiaomi; expect it to slow but not stall on steep stuff at 90kg. Sustained long climbs can trigger thermal protection.' },
    chargeTime: { display: '9 h (2¾ h fast)', num: 9, note: 'Standard charger is painfully slow — but the Fast Charger 2 (free launch gift while stocks last) cuts it to 2h45.' },
    weight: { display: '29.7 kg', num: 29.7 },
    maxLoad: { display: '130 kg', num: 130 },
    ipRating: { display: 'IPX6 whole scooter' },
    folded: { display: '130 × 61 × 66 cm', note: 'The longest fold here — those 12-inch wheels have to go somewhere.' },
    warranty: { display: '2 yr, UK repairs by SBE', note: 'Mail-in with prepaid label; UK parts stock and quick turnarounds reported. The most reassuring after-sales story of the four.' },
    tyres: { display: '12″ tubeless', note: 'Biggest wheels in the group — +13% contact patch and claimed +40% wet grip vs the 5 Max. Rolls over potholes the others feel.' },
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
      { name: 'T3 (hands-on)', score: 'Positive', quote: 'The pick for a subtler design while only losing a little power to the Ultra.', url: 'https://www.t3.com/active/electric-scooters/i-rode-the-xiaomi-scooter-6-ultra-and-it-gives-segway-and-apollo-a-run-for-their-money' },
      { name: 'ScooterRank', score: '57/100', quote: 'Above-average motor, range and IPX6 — but 29.7kg vs a 23.9kg category average.', url: 'https://scooterrank.com/scooters/xiaomi-electric-scooter-6-max' },
    ],
    youtube: 'Almost all coverage went to the 6 Ultra (very positive on ride and value). The Max itself has near-zero dedicated video coverage — it launched in Feb 2026 and reviewers skipped past it.',
    reddit: 'No meaningful owner threads yet — the model is ~4 months old in the UK. Treat community sentiment as unknown; Xiaomi’s wider scooter history includes stem-wobble complaints on the 4-series that the 6’s reinforced carbon-steel frame appears designed to answer.',
    sentiment: {
      positive: [
        { theme: '12″ wheels — comfort & grip', weight: 4 },
        { theme: 'Range per pound', weight: 5 },
        { theme: 'IPX6 + TCS for wet riding', weight: 4 },
        { theme: 'UK repair network (SBE)', weight: 3 },
      ],
      negative: [
        { theme: '29.7kg — heaviest here', weight: 5 },
        { theme: '9h standard charge', weight: 4 },
        { theme: 'No track record yet', weight: 3 },
        { theme: 'Won’t charge below 8°C', weight: 2 },
      ],
    },
  },
  pros: [
    { title: 'Best real range for the money', detail: '~25–31mi at your weight for under £600 — unbeatable £/mile here.', strength: 3 },
    { title: '12-inch tubeless tyres', detail: 'Biggest contact patch of the four; +40% claimed wet grip. Confidence on greasy tarmac.', strength: 3 },
    { title: 'Free Fast Charger 2 at launch', detail: 'Turns its worst spec (9h charging) into 2¾h — grab it while the gift lasts.', strength: 2 },
    { title: 'Solid UK warranty path', detail: '2 years, repairs done in the UK by SBE with prepaid shipping.', strength: 2 },
  ],
  cons: [
    { title: '29.7kg — properly heavy', detail: 'Heaviest of the four. This is furniture that moves, not luggage.', strength: 3 },
    { title: 'Thermal throttling on long climbs', detail: 'Motor protection can sap power on sustained gradients — relevant to your hills.', strength: 2 },
    { title: 'Zero review/owner track record', detail: 'Launched Feb 2026; no long-term reliability data exists yet.', strength: 2 },
    { title: 'Cold-charging cutoff', detail: 'Refuses to charge below 8°C — a real constraint for unheated storage in winter.', strength: 1 },
  ],
  verdict: {
    rank: 3,
    headline: 'The value pick — most scooter per pound.',
    text: [
      'If the budget conversation wins, buy this and don’t look back. £599 with a free fast charger gets you the biggest wheels, excellent real-world range, IPX6, traction control, Find My and a genuinely good UK repair setup. The catches: a 1,100W peak motor that will feel your steeper climbs at 90kg where the G3 E and 6 Ultra wouldn’t, a 468Wh battery that its own £120-dearer sibling beats by 25%, and the simple fact that nobody — professional or Reddit — has lived with one long enough to vouch for it yet.',
    ],
  },
}

const xiaomi6ultra = {
  id: 'x6ultra',
  brand: 'Xiaomi',
  name: 'Xiaomi Electric Scooter 6 Ultra',
  shortName: 'Xiaomi 6 Ultra',
  color: '#199e70',
  colorSoft: 'rgba(25, 158, 112, 0.14)',
  tagline: 'The flagship tank — biggest range here, plushest suspension, most weight.',
  headline: { range: '~31 mi', weight: '33.7 kg', price: '£719' },
  images: [
    { src: '/images/xiaomi-6-ultra-1.png', alt: 'Xiaomi Electric Scooter 6 Ultra — official studio render in yellow' },
    { src: '/images/xiaomi-6-ultra-2.jpg', alt: 'Xiaomi Electric Scooter 6 Ultra — rear three-quarter action render' },
    { src: '/images/xiaomi-6-ultra-3.jpg', alt: 'Xiaomi Electric Scooter 6 Ultra rear suspension on gravel' },
  ],
  specs: {
    peakPower: { display: '1,200 W', num: 1200, note: '45Nm torque plus an exclusive Boost mode (+200W burst) — official 8–24km/h in 2.4s.' },
    nominalPower: { display: '500 W', num: 500 },
    batteryWh: { display: '585 Wh', num: 585, note: '25% more than the 6 Max and within 2% of the Segway. Non-removable.' },
    rangeClaimed: { display: '46.6 mi / 75 km', num: 46.6, note: 'Claims 55km (34mi) even at constant full speed — the strongest at-speed claim here.' },
    rangeReal: { display: '~28–34 mi', num: 31, note: 'ScooterRank estimates 60–65km real at steady 18–20km/h; 55–60km in cold. At 90kg with hills, ~28–34mi — the group’s longest legs.' },
    topSpeed: { display: '15.5 mph', num: 15.5 },
    hillGrade: { display: '25%', num: 25, note: 'Best in the 6 series; 140kg max load means 90kg leaves huge headroom. "Handles steep grades without drama" — gadreview.' },
    chargeTime: { display: '10.5 h (3⅓ h fast)', num: 10.5, note: 'The bundled 70W charger is glacial for 585Wh — the free Fast Charger 2 launch gift is effectively mandatory.' },
    weight: { display: '33.7 kg', num: 33.7 },
    maxLoad: { display: '140 kg', num: 140 },
    ipRating: { display: 'IPX6' },
    folded: { display: 'Long fold (dims unpublished)', note: 'Xiaomi hasn’t published dimensions in extractable form; it’s larger than the 6 Max’s 130cm-long fold.' },
    warranty: { display: '2 yr, UK repairs by SBE' },
    tyres: { display: '12″ all-terrain tubeless' },
    brakes: { display: 'Dual discs + E-ABS' },
    suspension: { display: 'Dual swing-arm, front & rear', note: 'Proper double-swing-arm elastomer setup — T3: "a lot of give"; the plushest-riding Xiaomi.' },
    lights: { display: 'Headlight, brake light, indicators' },
    extras: { display: 'Find My, TCS, Boost, 3″ TFT', note: 'Apple Find My, traction control, GPS via app, keypad lock, widened 195mm deck with kicktail.' },
  },
  scores: { range: 9, hills: 8, rain: 8, ride: 8, portability: 1, value: 8 },
  price: {
    rrp: 799,
    retailers: [
      { name: 'Xiaomi UK (mi.com)', price: 719.99, url: 'https://www.mi.com/uk/product/xiaomi-electric-scooter-6-ultra/', note: 'In stock (yellow flagship colour); shipping since 30 March 2026.' },
      { name: 'idealo / PriceSpy tracked', price: 719.99, url: 'https://pricespy.co.uk/product.php?p=16245093', note: 'Single-channel pricing — mi.com is the only UK seller tracked.' },
      { name: 'Currys / Argos / Halfords', price: null, url: null, note: 'Not stocked — the 6 series is mi.com-only in the UK so far.' },
    ],
    deals: [
      { label: 'Free Xiaomi Fast Charger 2 (worth ~£50–99)', verified: true, detail: 'Live on the 6-series event page, covers the Ultra — cuts charging from 10.5h to 3h20. First come, first served.' },
      { label: '£50-off 6 Ultra promo', verified: false, detail: 'Seen in Xiaomi 2026 promotion event copy — check the buy page before ordering.' },
      { label: 'New-user coupon: £5 off', verified: true, detail: 'mi.com/uk first-order AIOT coupon.' },
      { label: 'TopCashback: 2% on mi.com', verified: true, detail: '~£12 back on £719.99 (ex-VAT basis). Won’t stack with coupons.' },
    ],
    effectiveBest: { price: 708, how: '£719.99 − 2% cashback, + free Fast Charger 2 (− £50 if promo live)' },
  },
  reviews: {
    outlets: [
      { name: 'T3 (first ride)', score: 'Positive', quote: 'Truly impressive… gives Segway and Apollo a run for their money.', url: 'https://www.t3.com/active/electric-scooters/i-rode-the-xiaomi-scooter-6-ultra-and-it-gives-segway-and-apollo-a-run-for-their-money' },
      { name: 'ScooterRank', score: '65/100', quote: 'Covers the essentials well — real-world 60–65km range, comfort 8.3/10; power lags true performance scooters.', url: 'https://scooterrank.com/scooters/xiaomi-electric-scooter-6-ultra' },
    ],
    youtube: 'MWC first-rides were glowing — plush suspension, punchy Boost acceleration, solid build. "Feels like a legal tank" is the recurring framing: heavy, planted, speed-capped. No long-term tests yet.',
    reddit: 'Too new for meaningful owner threads — launched Feb/Mar 2026. Early mi.com owner reviews praise commuting performance under heavy loads; complaints centre on weight and price.',
    sentiment: {
      positive: [
        { theme: 'Longest real range here', weight: 4 },
        { theme: 'Plush dual suspension', weight: 4 },
        { theme: 'Acceleration & Boost torque', weight: 4 },
        { theme: '140kg load headroom', weight: 3 },
      ],
      negative: [
        { theme: '33.7kg — the heaviest', weight: 5 },
        { theme: '10.5h standard charge', weight: 3 },
        { theme: 'No track record yet', weight: 3 },
        { theme: 'mi.com-only availability', weight: 2 },
      ],
    },
  },
  pros: [
    { title: 'The range king', detail: '585Wh and class-best efficiency: ~28–34 real miles at your weight — multi-day commuting per charge.', strength: 3 },
    { title: 'Nearly matches the Segway on hills', detail: '1,200W peak + Boost mode + 45Nm; 25% claimed gradient with 50kg of load headroom.', strength: 3 },
    { title: 'Plushest Xiaomi ride ever', detail: 'Dual swing-arm suspension front and rear + 12″ all-terrain tyres — T3 loved it.', strength: 2 },
    { title: 'Free Fast Charger 2 at launch', detail: 'Fixes its worst spec (10.5h charging → 3h20) while the gift promotion lasts.', strength: 2 },
  ],
  cons: [
    { title: '33.7kg — the heaviest here', detail: 'Nine kilos more than the Segway. Strictly a wheel-it machine; stairs are out.', strength: 3 },
    { title: 'Zero track record', detail: 'No long-term reviews or owner history anywhere yet — you’d be an early adopter.', strength: 2 },
    { title: 'Single-channel purchase', detail: 'mi.com/uk only — no Currys-style walk-in returns relationship.', strength: 2 },
    { title: 'Glacial standard charging', detail: '10.5 hours if you miss the fast-charger gift.', strength: 1 },
  ],
  verdict: {
    rank: 2,
    headline: 'The range monster — best if miles matter most.',
    text: [
      'The corrected sums make this the proper runner-up: 585Wh (within a whisker of the Segway), the longest real-world range of the four, near-Segway climbing, and genuinely plush dual suspension — for £100 less than the G3 E. If your photography days mean long cross-town mileage, this is the one that never makes you count percent. What holds it back for you: it’s 9kg heavier than the Segway with none of its adjustability or track record, nobody has owned one through a winter yet, and buying is mi.com-only. A very good scooter that asks you to be an early adopter; the Segway asks nothing.',
    ],
  },
}

const flex = {
  id: 'flex',
  brand: 'Pure Electric',
  name: 'Pure Advance Flex',
  shortName: 'Pure Advance Flex',
  color: '#9085e9',
  colorSoft: 'rgba(144, 133, 233, 0.14)',
  tagline: 'The clever one — folds like a Brompton, rides like nothing else.',
  headline: { range: '~12 mi', weight: '16.2 kg', price: '£699' },
  images: [
    { src: '/images/pure-advance-flex-2.jpg', alt: 'Pure Advance Flex unfolded — lifestyle shot' },
    { src: '/images/pure-advance-flex-1.jpg', alt: 'Pure Advance Flex folded to cabin-bag size — studio shot' },
    { src: '/images/pure-advance-flex-3.jpg', alt: 'Pure Advance Flex folded in a living room' },
  ],
  specs: {
    peakPower: { display: '710 W', num: 710, note: 'Pure’s current spec sheet quotes "924W max input power"; 710W peak output is the like-for-like figure. Weakest motor here either way.' },
    nominalPower: { display: '500 W', num: 500 },
    batteryWh: { display: '342 Wh', num: 342, note: 'The smallest tank by far — and it’s not removable, so charging means bringing the whole scooter to a socket.' },
    rangeClaimed: { display: '25 mi / 40 km', num: 25, note: 'Pure’s own page claims up to 52km in "optimal conditions" — reviewers called that figure unrealistic.' },
    rangeReal: { display: '~10–14 mi', num: 12, note: 'ebiketips got ~15mi on a hilly course; a heavier tester managed ~10mi. Enough for a short commute, not for range anxiety-free days.' },
    topSpeed: { display: '15.5 mph', num: 15.5 },
    hillGrade: { display: '19%', num: 19, note: 'ebiketips rated the platform the best hill-climber among comparable commuters they tested — steady rather than explosive at 90kg.' },
    chargeTime: { display: '~6 h', num: 6 },
    weight: { display: '16.2 kg', num: 16.2 },
    maxLoad: { display: '120 kg (incl. luggage)', num: 120 },
    ipRating: { display: 'IP65', note: 'Dust-tight plus water jets — the only full dust rating here, with wraparound mudguards designed for British rain.' },
    folded: { display: '57 × 30 × 62 cm', note: 'Cabin-bag size. Folds in half in 5 steps and rolls while folded — nothing else here is remotely as portable.' },
    warranty: { display: '1 yr (UK company)', note: 'Shortest warranty of the four; support is courier + email based from a UK (Bristol) company. £40 courier/diagnostic fee out of warranty.' },
    tyres: { display: '10″ × 2.5″ tubeless' },
    brakes: { display: 'Front enclosed drum + regen (KERS)', note: 'Weaker outright than discs, but the enclosed drum shrugs off winter grit — a genuinely good wet-climate choice.' },
    suspension: { display: 'None — tyres + stance only' },
    lights: { display: '150-lm headlight, footrest tail lights, indicators', note: 'Indicators in the grips and footpads with audible feedback — the most visible lighting package here.' },
    extras: { display: 'App lock, cruise, Pure Control stability', note: 'No Find My / GPS tracking — a real gap for primary-transport use.' },
  },
  scores: { range: 4, hills: 5, rain: 9, ride: 6, portability: 9, value: 6 },
  price: {
    rrp: 899,
    retailers: [
      { name: 'Pure Electric direct', price: 699, url: 'https://www.pureelectric.com/products/pure-advance-flex-electric-scooter', note: 'In stock, both colours, 0% APR finance. Launched at £1,099 in 2023.' },
      { name: 'Pure "Reboxed" refurb', price: 599, url: 'https://www.pureelectric.com/products/flex-reboxed', note: '6-month warranty, 30-day returns — 22 units in stock at check.' },
      { name: 'Halfords', price: 799, url: 'https://www.halfords.com/scooters/electric-scooters/pure-advance-flex-electric-scooter-platinum-silver-214123.html', note: 'Was £899 — £100 off.' },
      { name: 'Currys', price: 899, url: 'https://www.currys.co.uk/products/pure-electric-pure-advance-flex-electric-folding-scooter-platinum-silver-10250521.html', note: 'Full RRP — but 10.5% TopCashback applies (~£820 effective).' },
      { name: 'Argos', price: 899, url: 'https://www.argos.co.uk/product/4746937', note: 'Full RRP, free delivery.' },
    ],
    deals: [
      { label: 'Newsletter code: 5% off at Pure', code: 'via signup', verified: true, detail: '"GET 5% OFF YOUR NEXT RIDE" banner live on pureelectric.com → £664.05. Don’t stack with cashback.' },
      { label: 'TopCashback: 4.2% new customer (Advance range)', verified: true, detail: '~£24 back on £699 — the newsletter code is worth more; pick one.' },
      { label: 'Blue Light Card: up to 7% at Halfords', verified: false, detail: 'E-scooter eligibility has exclusions — check before relying on it.' },
      { label: 'Reboxed refurb at £599', verified: true, detail: 'The cheapest way into this platform, with a 6-month warranty trade-off.' },
    ],
    effectiveBest: { price: 664, how: '£699 direct − 5% newsletter code' },
  },
  reviews: {
    outlets: [
      { name: 'T3', score: 'Platinum', quote: 'Visibly better — innovative fold, premium build. Only gripe: no carry handle.', url: 'https://www.t3.com/reviews/pure-advance-flex-e-scooter-review' },
      { name: 'Stuff', score: '★★★★★', quote: 'Innovative, safe, packed with premium features — the king of e-scooters.', url: 'https://www.stuff.tv/review/pure-advance-flex-electric-scooter-review/' },
      { name: 'ebiketips', score: '8/10', quote: 'Innovation and sturdy manufacture make for a safe and fun e-scooter.', url: 'https://road.cc/ebiketips/content/reviews/e-scooter/pure-advance-4747' },
    ],
    youtube: 'Strongly positive commuter verdicts — the fold and forward stance are seen as genuinely different and good. Recurring theme: real range is well below the claim; it’s no speed machine.',
    reddit: 'Direct Reddit data unavailable (crawler-blocked); wider community consensus treats Pure as a safe, beginner-friendly UK commuter brand rather than a performance one. Trustpilot (~15k reviews) mixes fast-resolution stories with slow-email complaints.',
    sentiment: {
      positive: [
        { theme: 'Fold & portability', weight: 5 },
        { theme: 'Stability of forward stance', weight: 4 },
        { theme: 'Rain-ready design (IP65)', weight: 4 },
        { theme: 'Safety lighting & indicators', weight: 3 },
      ],
      negative: [
        { theme: 'Real range ~half the claim', weight: 5 },
        { theme: 'Underpowered for big hills', weight: 3 },
        { theme: 'Stem wobble develops with use', weight: 3 },
        { theme: '1-year warranty only', weight: 2 },
      ],
    },
  },
  pros: [
    { title: 'Transforms your storage problem', detail: 'Cabin-bag fold, 16.2kg, rollable when folded — train, café, studio, hallway: it just comes along.', strength: 3 },
    { title: 'Designed for British rain', detail: 'IP65, enclosed drum brake, proper mudguards, grippy tubeless tyres.', strength: 3 },
    { title: 'Uniquely stable stance', detail: 'Feet side-by-side facing forward — better shoulder checks, more natural balance.', strength: 2 },
    { title: 'UK company, UK design', detail: 'Bristol-based, sold via Halfords/Argos/Currys with a refurb programme.', strength: 1 },
  ],
  cons: [
    { title: 'Range is the dealbreaker', detail: '~10–14 real miles at your weight. As sole transport, that’s daily charge anxiety.', strength: 3 },
    { title: 'Weakest motor of the four', detail: '710W peak climbs steadily but slowly at 90kg on real hills.', strength: 3 },
    { title: 'Stem wobble is a known thing', detail: 'Common enough that Pure publishes an official fix guide; needs periodic torquing.', strength: 2 },
    { title: '1-year warranty', detail: 'Half what Segway and Xiaomi offer, from a company still finding profitability.', strength: 2 },
  ],
  verdict: {
    rank: 4,
    headline: 'Brilliant — for a different Ryan.',
    text: [
      'The Flex is the most inventive scooter here and the best rain-proofed by design philosophy. If your commute were 4 flat miles ending at a luggage rack, it would win outright. But as your only vehicle, at 90kg, in a hilly city, its 342Wh battery and 710W motor are simply the wrong numbers: real-world range around 10–14 miles with charge-anxiety, and steady-not-strong climbs. Keep it on the list only if the fold is worth more to you than everything else — and if so, the £599 Reboxed unit is the smart buy.',
    ],
  },
}

export const SCOOTERS = [g3e, xiaomi6max, xiaomi6ultra, flex]

export const VERDICT = {
  intro:
    'Ranked for one specific rider: Ryan, ~90kg, Southampton, no car, camera case in tow, rain and hills non-negotiable. A different rider would get a different order — that’s what the sliders above are for.',
  coda: [
    'One honest footnote on the whole exercise: the Navee GT3 Max and NIU KQi 300X both looked like strong £600–900 contenders on paper, and both fell out of this comparison for the same reason — you can’t actually buy either from a UK retailer right now (Navee’s EU store won’t ship here; NIU’s excludes the UK too). Availability was one of your criteria, and it quietly does a lot of filtering in this market.',
    'And the boring-but-important bit: whichever you choose, buy from a UK retailer rather than direct where possible (Consumer Rights Act beats any warranty inbox), activate cashback before you click, and remember private e-scooters are still only legal on private land in the UK — worth knowing while the long-promised legislation keeps not arriving.',
  ],
}
