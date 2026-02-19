import { create } from 'zustand';

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
  changePercent: number;
  changeAmount: number;
  history: { date: string; price: number }[];
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
  time?: string;
  location?: string;
  type: 'photography' | 'retainer' | 'personal';
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
  stocks: StockHolding[];
  setStocks: (stocks: StockHolding[]) => void;
  addStock: (stock: StockHolding) => void;
  removeStock: (symbol: string) => void;

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

  stocks: [],
  setStocks: (stocks) => set({ stocks }),
  addStock: (stock) => set((state) => ({ stocks: [...state.stocks, stock] })),
  removeStock: (symbol) => set((state) => ({ stocks: state.stocks.filter(s => s.symbol !== symbol) })),

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
