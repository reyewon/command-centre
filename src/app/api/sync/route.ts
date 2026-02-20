import { NextResponse } from 'next/server';

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

// Allowed keys that can be synced
const ALLOWED_KEYS = ['overview-order', 'stock-symbols', 'credit-card-balances', 'credit-card-limits', 'pixieset-invoices'];

async function kvGet(key: string): Promise<string | null> {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return null;
  const res = await fetch(`${KV_REST_API_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
    cache: 'no-store',
  });
  const data = await res.json();
  return data.result;
}

async function kvSet(key: string, value: string): Promise<boolean> {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return false;
  const res = await fetch(`${KV_REST_API_URL}/set/${key}/${encodeURIComponent(value)}`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
    cache: 'no-store',
  });
  const data = await res.json();
  return data.result === 'OK';
}

// GET /api/sync?key=overview-order
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key || !ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    return NextResponse.json({ error: 'KV not configured' }, { status: 503 });
  }

  try {
    const value = await kvGet(`rcc:${key}`);
    if (value === null) {
      return NextResponse.json({ value: null });
    }
    // Try to parse as JSON, return raw if not possible
    try {
      return NextResponse.json({ value: JSON.parse(value) });
    } catch {
      return NextResponse.json({ value });
    }
  } catch (error) {
    console.error('KV GET error:', error);
    return NextResponse.json({ error: 'Failed to read' }, { status: 500 });
  }
}

// POST /api/sync  body: { key: 'overview-order', value: [...] }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || !ALLOWED_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }

    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 503 });
    }

    const serialised = typeof value === 'string' ? value : JSON.stringify(value);
    const ok = await kvSet(`rcc:${key}`, serialised);

    if (!ok) {
      return NextResponse.json({ error: 'Failed to write' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('KV POST error:', error);
    return NextResponse.json({ error: 'Failed to write' }, { status: 500 });
  }
}
