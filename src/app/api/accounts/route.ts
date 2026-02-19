import { NextResponse } from 'next/server';

const STARLING_TOKEN = process.env.STARLING_ACCESS_TOKEN;
const TRADING212_API_KEY = process.env.TRADING212_API_KEY;

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

// ─── Starling Bank ──────────────────────────────────────────────────────
async function fetchStarlingBalance(): Promise<{
  balance: number;
  currency: string;
  effectiveBalance: number;
} | null> {
  if (!STARLING_TOKEN) return null;

  try {
    // Step 1: Get account UID
    const accountsRes = await fetch('https://api.starlingbank.com/api/v2/accounts', {
      headers: { Authorization: `Bearer ${STARLING_TOKEN}`, 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!accountsRes.ok) {
      console.error('Starling accounts error:', accountsRes.status, await accountsRes.text());
      return null;
    }
    const accountsData = await accountsRes.json();
    const account = accountsData.accounts?.[0];
    if (!account) return null;

    // Step 2: Get balance for this account
    const balanceRes = await fetch(
      `https://api.starlingbank.com/api/v2/accounts/${account.accountUid}/balance`,
      {
        headers: { Authorization: `Bearer ${STARLING_TOKEN}`, 'Content-Type': 'application/json' },
        cache: 'no-store',
      }
    );
    if (!balanceRes.ok) {
      console.error('Starling balance error:', balanceRes.status, await balanceRes.text());
      return null;
    }
    const balanceData = await balanceRes.json();

    return {
      balance: (balanceData.clearedBalance?.minorUnits ?? 0) / 100,
      effectiveBalance: (balanceData.effectiveBalance?.minorUnits ?? 0) / 100,
      currency: balanceData.clearedBalance?.currency ?? 'GBP',
    };
  } catch (error) {
    console.error('Starling fetch error:', error);
    return null;
  }
}

// ─── Trading 212 ────────────────────────────────────────────────────────
async function fetchTrading212Summary(): Promise<{
  totalValue: number;
  cash: number;
  investedValue: number;
  unrealisedPnL: number;
  currency: string;
} | null> {
  if (!TRADING212_API_KEY) return null;

  try {
    const res = await fetch('https://live.trading212.com/api/v0/equity/account/info', {
      headers: { Authorization: TRADING212_API_KEY },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Trading212 info error:', res.status, await res.text());
      return null;
    }
    const info = await res.json();

    // Also try to get the cash balance
    const cashRes = await fetch('https://live.trading212.com/api/v0/equity/account/cash', {
      headers: { Authorization: TRADING212_API_KEY },
      cache: 'no-store',
    });

    let cashData: Record<string, number> = {};
    if (cashRes.ok) {
      cashData = await cashRes.json();
    }

    return {
      totalValue: cashData.total ?? 0,
      cash: cashData.free ?? 0,
      investedValue: cashData.invested ?? 0,
      unrealisedPnL: cashData.ppl ?? 0,
      currency: info.currencyCode ?? 'GBP',
    };
  } catch (error) {
    console.error('Trading212 fetch error:', error);
    return null;
  }
}

// ─── Manual credit card balances from KV ────────────────────────────────
async function getManualBalances(): Promise<Record<string, number>> {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return {};
  try {
    const res = await fetch(`${KV_REST_API_URL}/get/rcc:credit-card-balances`, {
      headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
      cache: 'no-store',
    });
    const data = await res.json();
    if (data.result) {
      try { return JSON.parse(data.result); } catch { return {}; }
    }
    return {};
  } catch {
    return {};
  }
}

// ─── GET /api/accounts ──────────────────────────────────────────────────
export async function GET() {
  const [starling, trading212, manualBalances] = await Promise.all([
    fetchStarlingBalance(),
    fetchTrading212Summary(),
    getManualBalances(),
  ]);

  const now = new Date().toISOString();

  const accounts = [];

  // Starling
  accounts.push({
    id: 'starling',
    name: 'Starling',
    type: 'current' as const,
    balance: starling?.effectiveBalance ?? null,
    currency: starling?.currency ?? 'GBP',
    lastUpdated: starling ? now : null,
    autoSync: true,
    live: !!starling,
  });

  // Trading 212
  accounts.push({
    id: 'trading212',
    name: 'Trading 212',
    type: 'investment' as const,
    balance: trading212?.totalValue ?? null,
    cash: trading212?.cash ?? null,
    investedValue: trading212?.investedValue ?? null,
    unrealisedPnL: trading212?.unrealisedPnL ?? null,
    currency: trading212?.currency ?? 'GBP',
    lastUpdated: trading212 ? now : null,
    autoSync: true,
    live: !!trading212,
  });

  // Credit cards (manual)
  const creditCards = [
    { id: 'capital-one', name: 'Capital One' },
    { id: 'ms-bank', name: 'M&S' },
    { id: 'fluid', name: 'Fluid' },
    { id: 'vanquis', name: 'Vanquis' },
    { id: 'hsbc', name: 'HSBC' },
  ];

  for (const card of creditCards) {
    accounts.push({
      id: card.id,
      name: card.name,
      type: 'credit' as const,
      balance: manualBalances[card.id] ?? null,
      currency: 'GBP',
      lastUpdated: manualBalances[card.id] !== undefined ? (manualBalances[`${card.id}-updated`] ?? null) : null,
      autoSync: false,
      live: false,
    });
  }

  return NextResponse.json({
    accounts,
    timestamp: now,
  });
}
