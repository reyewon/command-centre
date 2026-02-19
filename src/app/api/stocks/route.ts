import { NextResponse } from 'next/server';

// Fetch stock data from Yahoo Finance API (free, no key required)
async function fetchYahooFinanceQuote(symbol: string) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=3mo`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    // Build history
    const history = timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split('T')[0],
      price: closes[i] != null ? parseFloat(closes[i].toFixed(2)) : null,
    })).filter((h: any) => h.price !== null);

    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose || meta.previousClose;
    const changeAmount = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? (changeAmount / previousClose) * 100 : 0;

    return {
      symbol: meta.symbol,
      name: meta.longName || meta.shortName || symbol,
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      previousClose: parseFloat(previousClose.toFixed(2)),
      changeAmount: parseFloat(changeAmount.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      regularMarketTime: meta.regularMarketTime,
      marketState: meta.marketState, // PRE, REGULAR, POST, CLOSED
      currency: meta.currency,
      history,
    };
  } catch (error) {
    console.error(`Failed to fetch ${symbol}:`, error);
    return null;
  }
}

// Fetch intraday data for 1D view
async function fetchIntradayData(symbol: string) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=1d`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 60 }, // Cache for 1 minute for intraday
    });

    if (!res.ok) return [];
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return [];

    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    return timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      price: closes[i] != null ? parseFloat(closes[i].toFixed(2)) : null,
    })).filter((h: any) => h.price !== null);
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get('symbols')?.split(',') || ['QDEL'];
  const includeIntraday = searchParams.get('intraday') === 'true';

  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const quote = await fetchYahooFinanceQuote(symbol.trim().toUpperCase());
      if (!quote) return null;

      if (includeIntraday) {
        const intraday = await fetchIntradayData(symbol.trim().toUpperCase());
        return { ...quote, intraday };
      }

      return quote;
    })
  );

  return NextResponse.json({
    stocks: results.filter(Boolean),
    timestamp: new Date().toISOString(),
  });
}
