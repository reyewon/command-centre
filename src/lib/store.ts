import { create } from 'zustand';

// localStorage helpers for stock watchlist persistence
const STOCK_SYMBOLS_KEY = 'rcc-stock-symbols';

function getPersistedSymbols(): string[] {
  if (typeof window === 'undefined') return ['QDEL'];
  try {
    const stored = localStorage.getItem(STOCK_SYMBOLS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return ['QDEL'];
}

function persistSymbols(symbols: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STOCK_SYMBOLS_KEY, JSON.stringify(symbols));
  } catch {}
  // Fire-and-forget server sync
  syncToServer('stock-symbols', symbols);
}

// Server sync helpers (fire-and-forget)
export function syncToServer(key: string, value: unknown) {
  fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  }).catch(() => {});
}

export async function syncFromServer(key: string): Promise<unknown | null> {
  try {
    const res = await fetch(`/api/sync?key=${key}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.value;
  } catch {
    return null;
  }
}

export interface Invoice {
  id: string;
  number: number;
  amount: number;
  client: string;
  project?: string;
  status: 'paid' | 'unpaid' | 'draft' | 'cancelled';
  dueDate?: string;
  createdDate: string;
}

export interface IncomeEntry {
  month: string; // YYYY-MM
  photography: number;
  retainer: number;
  other: number;
}

export interface InstagramMetrics {
  account: string;
  displayName: string;
  followers: number;
  followersChange: number;
  engagement: number;
  engagementChange: number;
  impressions: number;
  impressionsChange: number;
  reach: number;
  reachChange: number;
  posts: number;
  topPosts: { caption: string; likes: number; comments: number; date: string }[];
  weeklyFollowers: { date: string; count: number }[];
}

export interface StockHolding {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose?: number;
  changePercent: number;
  changeAmount: number;
  currency?: string;
  marketState?: string;
  history: { date: string; price: number }[];
  intraday?: { date: string; price: number }[];
  hourly?: { date: string; price: number }[];
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  forecast: { date: string; high: number; low: number; description: string; icon: string }[];
}

export interface AnalyticsData {
  sessions: number;
  sessionsChange: number;
  users: number;
  usersChange: number;
  pageViews: number;
  pageViewsChange: number;
  bounceRate: number;
  bounceRateChange: number;
  topPages: { page: string; views: number; change: number }[];
  trafficSources: { source: string; sessions: number; change: number }[];
  dailyTraffic: { date: string; sessions: number; users: number }[];
}

export interface BookingEvent {
  id: string;
  title: string;
  client: string;
  date: string;
  endDate?: string;
  time?: string;
  endTime?: string;
  location?: string;
  description?: string;
  type: 'photography' | 'retainer' | 'personal' | 'meeting' | 'travel';
  calendarSource?: string;
  allDay?: boolean;
}

interface DashboardStore {
  // Invoices
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;

  // Income
  incomeEntries: IncomeEntry[];
  setIncomeEntries: (entries: IncomeEntry[]) => void;

  // Tax
  taxPercentage: number;
  setTaxPercentage: (pct: number) => void;

  // Instagram
  instagramAccounts: InstagramMetrics[];
  setInstagramAccounts: (accounts: InstagramMetrics[]) => void;

  // Stocks
  stockSymbols: string[]; // persisted watchlist order
  stocks: StockHolding[];
  setStocks: (stocks: StockHolding[]) => void;
  addStock: (stock: StockHolding) => void;
  removeStock: (symbol: string) => void;
  reorderStocks: (fromIndex: number, toIndex: number) => void;
  getStockSymbols: () => string[];

  // Weather
  weather: WeatherData | null;
  setWeather: (weather: WeatherData) => void;

  // Analytics
  analytics: AnalyticsData | null;
  setAnalytics: (analytics: AnalyticsData) => void;

  // Bookings
  bookings: BookingEvent[];
  setBookings: (bookings: BookingEvent[]) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  invoices: [],
  setInvoices: (invoices) => set({ invoices }),

  incomeEntries: [],
  setIncomeEntries: (incomeEntries) => set({ incomeEntries }),

  taxPercentage: 25,
  setTaxPercentage: (taxPercentage) => set({ taxPercentage }),

  instagramAccounts: [],
  setInstagramAccounts: (instagramAccounts) => set({ instagramAccounts }),

  stockSymbols: getPersistedSymbols(),
  stocks: [],
  setStocks: (stocks) => set((state) => {
    // Maintain the persisted order when setting stocks
    const symbolOrder = state.stockSymbols;
    const sorted = [...stocks].sort((a, b) => {
      const ai = symbolOrder.indexOf(a.symbol);
      const bi = symbolOrder.indexOf(b.symbol);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return { stocks: sorted };
  }),
  addStock: (stock) => set((state) => {
    const newSymbols = [...state.stockSymbols, stock.symbol];
    persistSymbols(newSymbols);
    return { stocks: [...state.stocks, stock], stockSymbols: newSymbols };
  }),
  removeStock: (symbol) => set((state) => {
    const newSymbols = state.stockSymbols.filter(s => s !== symbol);
    persistSymbols(newSymbols);
    return { stocks: state.stocks.filter(s => s.symbol !== symbol), stockSymbols: newSymbols };
  }),
  reorderStocks: (fromIndex, toIndex) => set((state) => {
    const newStocks = [...state.stocks];
    const [moved] = newStocks.splice(fromIndex, 1);
    newStocks.splice(toIndex, 0, moved);
    const newSymbols = newStocks.map(s => s.symbol);
    persistSymbols(newSymbols);
    return { stocks: newStocks, stockSymbols: newSymbols };
  }),
  getStockSymbols: () => getPersistedSymbols(),

  weather: null,
  setWeather: (weather) => set({ weather }),

  analytics: null,
  setAnalytics: (analytics) => set({ analytics }),

  bookings: [],
  setBookings: (bookings) => set({ bookings }),

  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  activeSection: 'overview',
  setActiveSection: (activeSection) => set({ activeSection }),
}));
