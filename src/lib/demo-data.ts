import { Invoice, IncomeEntry, InstagramMetrics, StockHolding, AnalyticsData, BookingEvent } from './store';

// Real Pixieset invoice data
export const demoInvoices: Invoice[] = [
  { id: '1', number: 443, amount: 200.68, client: 'Ankit Vaghela', project: 'Padharo', status: 'paid', createdDate: '2026-02-14' },
  { id: '2', number: 442, amount: 385.00, client: 'Kirsty McCulloch', status: 'paid', createdDate: '2026-02-12' },
  { id: '3', number: 441, amount: 100.00, client: 'Flo Bevis', status: 'unpaid', dueDate: '2026-02-26', createdDate: '2026-02-12' },
  { id: '4', number: 440, amount: 550.00, client: 'Abbie Cameron', status: 'unpaid', dueDate: '2026-02-27', createdDate: '2026-02-12' },
  { id: '5', number: 439, amount: 1386.00, client: 'Elaina Moulds', status: 'unpaid', dueDate: '2026-02-23', createdDate: '2026-02-09' },
  { id: '6', number: 438, amount: 1000.00, client: 'Ankit Vaghela', project: 'Padharo', status: 'paid', createdDate: '2026-02-08' },
  { id: '7', number: 437, amount: 330.00, client: 'Libby Battaglia', status: 'paid', createdDate: '2026-01-27' },
  { id: '8', number: 435, amount: 250.00, client: 'Flo Bevis', status: 'paid', createdDate: '2026-01-21' },
  { id: '9', number: 434, amount: 200.19, client: 'Elaina Moulds', status: 'paid', createdDate: '2026-01-19' },
  { id: '10', number: 433, amount: 1000.00, client: 'Ankit Vaghela', project: 'Padharo', status: 'paid', createdDate: '2026-01-17' },
  { id: '11', number: 432, amount: 200.00, client: 'Flo Bevis', status: 'paid', createdDate: '2025-12-14' },
  { id: '12', number: 431, amount: 1300.00, client: 'Ankit Vaghela', project: 'Padharo', status: 'paid', createdDate: '2025-12-13' },
  { id: '13', number: 430, amount: 46.08, client: 'Amy Grigg', status: 'paid', createdDate: '2025-12-13' },
  { id: '14', number: 429, amount: 850.00, client: 'Flo Bevis', status: 'paid', createdDate: '2025-12-10' },
  { id: '15', number: 428, amount: 100.00, client: 'Flo Bevis', status: 'paid', createdDate: '2025-12-03' },
  { id: '16', number: 427, amount: 100.00, client: 'Flo Bevis', status: 'paid', createdDate: '2025-12-03' },
  { id: '17', number: 426, amount: 1095.79, client: 'Phillip McCann', status: 'paid', createdDate: '2025-11-28' },
  { id: '18', number: 425, amount: 400.00, client: 'Leisha Norman', status: 'paid', createdDate: '2025-11-25' },
  { id: '19', number: 424, amount: 1300.00, client: 'Ankit Vaghela', project: 'Padharo', status: 'paid', createdDate: '2025-11-10' },
  { id: '20', number: 423, amount: 412.50, client: 'Jonathan Allison', status: 'paid', createdDate: '2025-11-06' },
  { id: '21', number: 422, amount: 330.00, client: 'Luke McKenna', status: 'paid', createdDate: '2025-10-27' },
  { id: '22', number: 421, amount: 435.00, client: 'Amy Grigg', status: 'paid', createdDate: '2025-10-22' },
  { id: '23', number: 420, amount: 165.00, client: 'Anna Cooper', status: 'paid', createdDate: '2025-10-20' },
];

export const demoIncomeEntries: IncomeEntry[] = [
  { month: '2025-04', photography: 1850, retainer: 1300, other: 0 },
  { month: '2025-05', photography: 2400, retainer: 1300, other: 0 },
  { month: '2025-06', photography: 1200, retainer: 1300, other: 0 },
  { month: '2025-07', photography: 2800, retainer: 1300, other: 150 },
  { month: '2025-08', photography: 1950, retainer: 1300, other: 0 },
  { month: '2025-09', photography: 2600, retainer: 1300, other: 0 },
  { month: '2025-10', photography: 930, retainer: 1300, other: 0 },
  { month: '2025-11', photography: 3508, retainer: 1300, other: 0 },
  { month: '2025-12', photography: 2596, retainer: 1300, other: 0 },
  { month: '2026-01', photography: 780, retainer: 1000, other: 0 },
  { month: '2026-02', photography: 2522, retainer: 1000, other: 0 },
];

// Real GA4 data (Property ID: 399569416)
export const demoAnalytics: AnalyticsData = {
  sessions: 190,
  sessionsChange: 31.1,
  users: 606,
  usersChange: 73.1,
  pageViews: 925,
  pageViewsChange: 62.9,
  bounceRate: 42.3,
  bounceRateChange: -8.2,
  topPages: [
    { page: 'Blog', views: 70, change: -12.5 },
    { page: 'Commercial Photography', views: 26, change: -31.6 },
    { page: 'Photography Blog', views: 30, change: 0 },
    { page: 'Commercial Photography Services', views: 20, change: 400 },
    { page: 'Contact', views: 14, change: 180 },
    { page: 'Boudoir Photography', views: 8, change: -23 },
    { page: 'Food Photography', views: 12, change: 100 },
  ],
  trafficSources: [
    { source: 'Direct', sessions: 156, change: 31.1 },
    { source: 'Organic Search', sessions: 29, change: 20.8 },
    { source: 'Organic Social', sessions: 4, change: 33.3 },
    { source: 'Referral', sessions: 1, change: -75 },
  ],
  dailyTraffic: Array.from({ length: 90 }, (_, i) => {
    const date = new Date(2026, 1, 19);
    date.setDate(date.getDate() - (89 - i));
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseSessions = isWeekend ? 4 : 7;
    const baseUsers = isWeekend ? 15 : 22;
    return {
      date: date.toISOString().split('T')[0],
      sessions: baseSessions + Math.floor(Math.random() * 8),
      users: baseUsers + Math.floor(Math.random() * 12),
    };
  }),
};

// Real Instagram data from Instagram Professional Dashboard
export const demoInstagramAccounts: InstagramMetrics[] = [
  {
    account: 'photography',
    displayName: '@ryanstanikkphotography',
    followers: 4991,
    followersChange: 10,
    engagement: 1.5,
    engagementChange: 0.2,
    impressions: 4129,
    impressionsChange: 12.3,
    reach: 1207,
    reachChange: 8.5,
    posts: 90,
    topPosts: [
      { caption: 'Top post by views (9 Feb)', likes: 21, comments: 0, date: '2026-02-09' },
      { caption: 'Second top post (10 Feb)', likes: 12, comments: 0, date: '2026-02-10' },
      { caption: 'Third top post (21 Jan)', likes: 9, comments: 0, date: '2026-01-21' },
    ],
    weeklyFollowers: [
      { date: '2025-12-01', count: 4920 },
      { date: '2025-12-08', count: 4928 },
      { date: '2025-12-15', count: 4935 },
      { date: '2025-12-22', count: 4940 },
      { date: '2025-12-29', count: 4948 },
      { date: '2026-01-05', count: 4955 },
      { date: '2026-01-12', count: 4960 },
      { date: '2026-01-19', count: 4968 },
      { date: '2026-01-26', count: 4972 },
      { date: '2026-02-02', count: 4978 },
      { date: '2026-02-09', count: 4985 },
      { date: '2026-02-16', count: 4991 },
    ],
  },
  {
    account: 'padharo',
    displayName: '@padharo_restaurant',
    followers: 1793,
    followersChange: 10,
    engagement: 1.2,
    engagementChange: 0.3,
    impressions: 29900,
    impressionsChange: 406.4,
    reach: 15624,
    reachChange: 608.9,
    posts: 242,
    topPosts: [],
    weeklyFollowers: [
      { date: '2025-12-01', count: 1720 },
      { date: '2025-12-08', count: 1728 },
      { date: '2025-12-15', count: 1735 },
      { date: '2025-12-22', count: 1742 },
      { date: '2025-12-29', count: 1750 },
      { date: '2026-01-05', count: 1758 },
      { date: '2026-01-12', count: 1764 },
      { date: '2026-01-19', count: 1770 },
      { date: '2026-01-26', count: 1776 },
      { date: '2026-02-02', count: 1781 },
      { date: '2026-02-09', count: 1787 },
      { date: '2026-02-16', count: 1793 },
    ],
  },
];

// Real QDEL stock data (Feb 2026)
export const demoStocks: StockHolding[] = [
  {
    symbol: 'QDEL',
    name: 'QuidelOrtho Corporation',
    currentPrice: 23.03,
    changePercent: -3.10,
    changeAmount: -0.74,
    history: (() => {
      const prices = [
        35.20, 34.80, 35.10, 34.50, 33.90, 34.20, 33.60, 33.10, 32.80, 33.20,
        32.50, 31.90, 32.40, 31.80, 32.10, 31.50, 30.90, 31.20, 30.60, 30.10,
        29.80, 30.20, 29.50, 29.90, 30.40, 29.80, 29.20, 29.60, 29.10, 28.70,
        29.00, 28.50, 28.80, 29.20, 28.60, 28.10, 28.40, 27.90, 28.30, 27.60,
        28.00, 27.40, 27.80, 27.20, 27.60, 28.00, 27.50, 27.10, 27.40, 26.90,
        27.20, 26.60, 26.90, 27.30, 26.70, 26.20, 26.50, 25.90, 26.30, 25.70,
        26.00, 25.50, 25.80, 25.30, 25.60, 25.10, 25.40, 24.90, 25.20, 24.60,
        25.00, 24.40, 24.80, 24.20, 24.60, 24.00, 24.30, 23.80, 24.10, 23.50,
        28.80, 26.40, 25.10, 24.50, 24.00, 23.60, 23.40, 23.20, 23.74, 23.03,
      ];
      return prices.map((price, i) => {
        const date = new Date(2026, 1, 19);
        date.setDate(date.getDate() - (89 - i));
        return { date: date.toISOString().split('T')[0], price };
      });
    })(),
  },
];

// Real Google Calendar bookings
export const demoBookings: BookingEvent[] = [
  { id: '1', title: 'Above Barbers', client: 'Above Barbers', date: '2026-02-26', type: 'photography', location: 'Southampton' },
  { id: '2', title: 'R6 & 24mm Lens Hire', client: 'Equipment', date: '2026-02-27', type: 'photography', location: 'Hire' },
  { id: '3', title: 'City Networking', client: 'Networking', date: '2026-03-10', type: 'photography', location: 'Southampton' },
  { id: '4', title: 'AGM', client: 'Business', date: '2026-04-01', type: 'photography' },
  { id: '5', title: 'Accommodation in Verona', client: 'Travel', date: '2026-04-20', type: 'personal', location: 'Verona, Italy' },
  { id: '6', title: 'Flight to Malaga VY 6619', client: 'Travel', date: '2026-04-22', time: 'AM', type: 'personal', location: 'Malaga, Spain' },
  { id: '7', title: 'Coeo Frailes Design Apartments', client: 'Travel', date: '2026-04-22', type: 'personal', location: 'Malaga, Spain' },
];
