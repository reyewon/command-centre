# Scooter Decision — Ryan's E-Scooter Comparison

An interactive comparison site for four UK commuter e-scooters (July 2026):
Segway Ninebot Max G3 E, Xiaomi Electric Scooter 6 Max, Xiaomi Electric
Scooter 6 Ultra and Pure Advance Flex.

Built with React + Vite. All data researched 6 July 2026 from manufacturer
spec sheets, UK retailer pages, idealo/PriceSpy, professional reviews
(T3, Tom's Guide, eRideHero, ScooterRank, ebiketips…), owner communities
and cashback portals.

> The Navee GT3 Max and NIU KQi 300X were evaluated as candidate
> contenders but excluded: neither is purchasable from a UK retailer
> right now.

## Run locally

```bash
npm install
npm run dev
```

## Build & deploy

```bash
npm run build          # outputs to dist/
npx wrangler deploy    # deploys dist/ as a Cloudflare Worker static site (see wrangler.jsonc)
```
