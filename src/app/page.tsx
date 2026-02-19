'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useDashboardStore, IncomeEntry } from '@/lib/store';
import {
  demoInvoices, demoIncomeEntries, demoAnalytics,
  demoInstagramAccounts, demoStocks, demoBookings
} from '@/lib/demo-data';
import { cn, formatCurrency, formatNumber, formatPercent, formatDate, formatShortDate, getMonthName, daysUntil, getGreeting } from '@/lib/utils';
import {
  BarChart3, Camera, ChefHat, TrendingUp, TrendingDown, DollarSign,
  Calendar, Cloud, Sun, Moon, CloudRain, Eye, Users, MousePointerClick,
  Instagram, Globe, Receipt, Clock, MapPin, ArrowUpRight, ArrowDownRight,
  Menu, X, Home, PieChart, Wallet, CalendarDays, Store, Settings,
  Plus, Minus, RefreshCw, ExternalLink, CreditCard, Plane, Building2,
  Search, Command, Target, Zap, Keyboard, Sparkles, Navigation, CloudSun
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell
} from 'recharts';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'finances', label: 'Finances', icon: Wallet },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays },
  { id: 'stocks', label: 'Stocks', icon: TrendingUp },
  { id: 'clients', label: 'Clients', icon: Store },
];

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#f59e0b', '#10b981', '#6b7280'];

// ==================== ANIMATED NUMBER ====================

function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = prevTarget.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + (target - start) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevTarget.current = target;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return value;
}

// ==================== LIVE CLOCK ====================

function useLiveClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return { time, date };
}

// ==================== PROGRESS RING ====================

function ProgressRing({ progress, size = 120, strokeWidth = 8, color = 'var(--accent)', children }: {
  progress: number; size?: number; strokeWidth?: number; color?: string; children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useAnimatedNumber(Math.min(progress, 100), 1500);
  const offset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ==================== COMMAND PALETTE ====================

function CommandPalette({ open, onClose, onNavigate }: {
  open: boolean; onClose: () => void; onNavigate: (section: string) => void;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const commands = [
    { id: 'overview', label: 'Go to Overview', shortcut: '1', icon: Home, section: 'overview' },
    { id: 'analytics', label: 'Go to Analytics', shortcut: '2', icon: BarChart3, section: 'analytics' },
    { id: 'finances', label: 'Go to Finances', shortcut: '3', icon: Wallet, section: 'finances' },
    { id: 'instagram', label: 'Go to Instagram', shortcut: '4', icon: Instagram, section: 'instagram' },
    { id: 'bookings', label: 'Go to Bookings', shortcut: '5', icon: CalendarDays, section: 'bookings' },
    { id: 'stocks', label: 'Go to Stocks', shortcut: '6', icon: TrendingUp, section: 'stocks' },
    { id: 'clients', label: 'Go to Clients', shortcut: '7', icon: Store, section: 'clients' },
    { id: 'pixieset', label: 'Open Pixieset', shortcut: '', icon: ExternalLink, action: () => window.open('https://studio.pixieset.com/invoices', '_blank') },
    { id: 'ga', label: 'Open Google Analytics', shortcut: '', icon: ExternalLink, action: () => window.open('https://analytics.google.com', '_blank') },
    { id: 'gbp', label: 'Open Google Business', shortcut: '', icon: ExternalLink, action: () => window.open('https://business.google.com', '_blank') },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      <div className="relative w-full max-w-lg mx-4 glass-card rounded-xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search commands..." className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && filtered.length > 0) {
                const cmd = filtered[0];
                if (cmd.section) onNavigate(cmd.section);
                if ((cmd as any).action) (cmd as any).action();
                onClose();
              }
            }}
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono">esc</kbd>
        </div>
        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.map(cmd => (
            <button key={cmd.id}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-card-hover transition-colors text-left"
              onClick={() => {
                if (cmd.section) onNavigate(cmd.section);
                if ((cmd as any).action) (cmd as any).action();
                onClose();
              }}>
              <cmd.icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1">{cmd.label}</span>
              {cmd.shortcut && (
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono">{cmd.shortcut}</kbd>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No commands found</p>
          )}
        </div>
        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-muted font-mono">↵</kbd> select</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-muted font-mono">esc</kbd> close</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-muted font-mono">1-7</kbd> quick nav</span>
        </div>
      </div>
    </div>
  );
}

function Card({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-xl p-5 sm:p-6',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, prefix, suffix }: {
  title: string; value: string | number; change?: number; icon: React.ElementType;
  prefix?: string; suffix?: string;
}) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">
            {prefix}{typeof value === 'number' ? formatNumber(value) : value}{suffix}
          </p>
        </div>
        <div className="rounded-lg p-2.5" style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }}>
          <Icon className="h-5 w-5 text-accent" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-sm">
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 text-success" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-danger" />
          )}
          <span className={isPositive ? 'text-success' : 'text-danger'}>
            {formatPercent(change)}
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}
    </Card>
  );
}

function CustomTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg border border-border px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

function InsightBox({ icon: Icon, text, emoji }: { icon?: React.ElementType; text: string; emoji?: string }) {
  return (
    <div className="rounded-xl p-4 bg-accent-tint border border-border">
      <div className="flex items-start gap-3">
        {emoji && <span className="text-lg">{emoji}</span>}
        {Icon && <Icon className="h-4 w-4 text-accent shrink-0 mt-0.5" />}
        <p className="text-sm text-foreground">{text}</p>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme('system');
      applyTheme('system');
    }
  }, []);

  const applyTheme = (t: 'light' | 'dark' | 'system') => {
    const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) return null;

  const isDark = document.documentElement.dataset.theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sidebar-foreground"
      title={`Current: ${theme}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

// ==================== OVERVIEW ====================

function OverviewSection() {
  const { invoices, incomeEntries, analytics, instagramAccounts, bookings, weather, stocks } = useDashboardStore();
  const { time, date } = useLiveClock();

  const currentMonth = incomeEntries[incomeEntries.length - 1];
  const totalThisMonth = currentMonth ? currentMonth.photography + currentMonth.retainer + currentMonth.other : 0;
  const unpaidTotal = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.amount, 0);
  const paidThisYear = invoices.filter(i => i.status === 'paid' && i.createdDate.startsWith('2026')).reduce((sum, i) => sum + i.amount, 0);
  const photographyIG = instagramAccounts.find(a => a.account === 'photography');
  const nextBooking = bookings[0];
  const daysToNext = nextBooking ? daysUntil(nextBooking.date) : null;

  // Monthly goal tracking
  const monthlyGoal = 4000;
  const monthProgress = Math.min((totalThisMonth / monthlyGoal) * 100, 100);
  const goalColor = monthProgress < 50 ? 'var(--danger)' : monthProgress < 80 ? 'var(--warning)' : 'var(--success)';

  return (
    <div className="space-y-6 animate-section-in">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold">{getGreeting()}, Ryan</h2>
          <p className="text-muted-foreground mt-1">Here's your business at a glance</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-2xl font-mono font-semibold tracking-tight">{time}</p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Revenue this month" value={formatCurrency(totalThisMonth)} change={12.4} icon={DollarSign} />
        <StatCard title="Outstanding" value={formatCurrency(unpaidTotal)} icon={Receipt} />
        <StatCard title="Website visitors" value={analytics?.users ?? 0} change={analytics?.usersChange} icon={Globe} />
        <StatCard title="IG followers" value={formatNumber(photographyIG?.followers ?? 0)} change={photographyIG && photographyIG.followers > 0 ? (photographyIG.followersChange / photographyIG.followers) * 100 : undefined} icon={Instagram} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Monthly Income</h3>
            <span className="text-sm text-muted-foreground">Last 11 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeEntries.map(e => ({ month: getMonthName(e.month), Photography: e.photography, Retainer: e.retainer }))}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={(v) => `£${v}`} />
                <Tooltip content={<CustomTooltip formatter={(v: any) => formatCurrency(Number(v))} />} />
                <Bar dataKey="Photography" stackId="a" fill="var(--accent)" />
                <Bar dataKey="Retainer" stackId="a" fill="var(--accent-warm)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          {weather && (
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Southampton</p>
                  <p className="text-3xl font-semibold mt-1">{weather.temp}°C</p>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">{weather.description}</p>
                </div>
                <span className="text-4xl">{weather.icon === 'clear' ? '☀️' : weather.icon === 'clouds' ? '☁️' : weather.icon === 'rain' ? '🌧️' : '⛅'}</span>
              </div>
            </Card>
          )}

          {nextBooking && (
            <Card>
              <p className="text-sm text-muted-foreground">Next booking</p>
              <p className="font-semibold mt-1">{nextBooking.title}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(nextBooking.date)}{nextBooking.time && ` at ${nextBooking.time}`}</span>
              </div>
              {nextBooking.location && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{nextBooking.location}</span>
                </div>
              )}
              <span className={cn('inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full',
                daysToNext !== null && daysToNext <= 3 ? 'bg-warning-tint text-warning' : 'bg-accent-tint text-accent'
              )}>
                {daysToNext === 0 ? 'Today' : daysToNext === 1 ? 'Tomorrow' : `In ${daysToNext} days`}
              </span>
            </Card>
          )}

          {stocks.length > 0 && stocks.map(stock => (
            <Card key={stock.symbol}>
              <p className="text-sm text-muted-foreground">Stock watch</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-semibold">{stock.symbol}</span>
                <span className="font-mono font-semibold">${stock.currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {stock.changePercent >= 0 ? <ArrowUpRight className="h-3.5 w-3.5 text-success" /> : <ArrowDownRight className="h-3.5 w-3.5 text-danger" />}
                <span className={cn('text-sm', stock.changePercent >= 0 ? 'text-success' : 'text-danger')}>
                  {formatPercent(stock.changePercent)}
                </span>
              </div>
            </Card>
          ))}

          <Card>
            <p className="text-sm text-muted-foreground">Year to date (2026)</p>
            <p className="text-2xl font-semibold mt-1">{formatCurrency(paidThisYear)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tax set aside (25%): <span className="font-medium text-foreground">{formatCurrency(paidThisYear * 0.25)}</span>
            </p>
          </Card>

          <Card>
            <p className="text-sm text-muted-foreground mb-3">Monthly goal</p>
            <div className="flex items-center gap-4">
              <ProgressRing progress={monthProgress} size={80} strokeWidth={6} color={goalColor}>
                <span className="text-sm font-semibold">{Math.round(monthProgress)}%</span>
              </ProgressRing>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold">{formatCurrency(totalThisMonth)}</p>
                <p className="text-xs text-muted-foreground">of {formatCurrency(monthlyGoal)} target</p>
                {totalThisMonth < monthlyGoal && (
                  <p className="text-xs mt-1" style={{ color: goalColor }}>
                    {formatCurrency(monthlyGoal - totalThisMonth)} remaining
                  </p>
                )}
                {totalThisMonth >= monthlyGoal && (
                  <p className="text-xs text-success mt-1 flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Goal reached!
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-lg mb-4">Website Traffic (30 days)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.dailyTraffic ?? []}>
                <defs>
                  <linearGradient id="websiteGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={formatShortDate} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="users" stroke="var(--accent)" fill="url(#websiteGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-lg mb-4">Outstanding Invoices</h3>
          <div className="space-y-3">
            {invoices.filter(i => i.status === 'unpaid').map(inv => (
              <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">#{inv.number} - {inv.client}</p>
                  <p className="text-sm text-muted-foreground">Due {inv.dueDate ? formatDate(inv.dueDate) : 'TBD'}</p>
                </div>
                <p className="font-semibold text-warning">{formatCurrency(inv.amount)}</p>
              </div>
            ))}
            {invoices.filter(i => i.status === 'unpaid').length === 0 && (
              <p className="text-muted-foreground text-sm py-4 text-center">All invoices paid!</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ==================== ANALYTICS ====================

function AnalyticsSection() {
  const { analytics } = useDashboardStore();
  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | '90d'>('30d');

  if (!analytics) return <p className="text-muted-foreground">Loading analytics...</p>;

  const filterAnalyticsData = (data: any[]) => {
    const days = analyticsRange === '7d' ? 7 : analyticsRange === '30d' ? 30 : 90;
    return data.slice(-days);
  };

  const getPreviousPeriodData = () => {
    const days = analyticsRange === '7d' ? 7 : analyticsRange === '30d' ? 30 : 90;
    const allData = analytics.dailyTraffic;
    const startIdx = Math.max(0, allData.length - (days * 2));
    const endIdx = allData.length - days;
    return allData.slice(startIdx, endIdx);
  };

  const currentData = filterAnalyticsData(analytics.dailyTraffic);
  const previousData = getPreviousPeriodData();
  const currentUsers = currentData.reduce((sum: number, d: any) => sum + d.users, 0);
  const previousUsers = previousData.reduce((sum: number, d: any) => sum + d.users, 0);
  const usersChange = previousUsers > 0 ? ((currentUsers - previousUsers) / previousUsers) * 100 : 0;

  // Merge current and previous period data for overlay chart
  const mergedChartData = currentData.map((d: any, i: number) => ({
    ...d,
    prevUsers: previousData[i]?.users ?? null,
    prevSessions: previousData[i]?.sessions ?? null,
  }));

  const topPage = analytics.topPages[0];
  const directTraffic = analytics.trafficSources.find(s => s.source === 'Direct');
  const directPercent = directTraffic ? ((directTraffic.sessions / analytics.sessions) * 100).toFixed(1) : '0';

  const insightText = `Users up ${usersChange.toFixed(1)}% vs last period. Direct traffic dominates at ${directPercent}%. ${topPage?.page} remains your top page.`;

  return (
    <div className="space-y-6 animate-section-in">
      <div>
        <h2 className="text-3xl font-bold">Website Analytics</h2>
        <p className="text-muted-foreground mt-1">ryanstanikk.co.uk</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Users" value={analytics.users} change={analytics.usersChange} icon={Users} />
        <StatCard title="Sessions" value={analytics.sessions} change={analytics.sessionsChange} icon={MousePointerClick} />
        <StatCard title="Page Views" value={analytics.pageViews} change={analytics.pageViewsChange} icon={Eye} />
        <StatCard title="Bounce Rate" value={`${analytics.bounceRate}%`} change={analytics.bounceRateChange} icon={ArrowDownRight} />
      </div>

      <Card>
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-lg">Daily Traffic</h3>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map(range => (
              <button key={range} onClick={() => setAnalyticsRange(range)}
                className={cn('px-3 py-1.5 text-sm rounded-lg transition-colors',
                  analyticsRange === range ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                )}>{range}</button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mergedChartData}>
              <defs>
                <linearGradient id="dailyGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dailyGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-warm)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--accent-warm)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={formatShortDate} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" name="Users" stroke="var(--accent)" fill="url(#dailyGradient1)" strokeWidth={2} />
              <Area type="monotone" dataKey="sessions" name="Sessions" stroke="var(--accent-warm)" fill="url(#dailyGradient2)" strokeWidth={1.5} />
              <Line type="monotone" dataKey="prevUsers" name="Prev. Users" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="5 5" strokeOpacity={0.35} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-lg mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analytics.topPages.map((page, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <span className="text-sm truncate mr-4">{page.page}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-sm font-medium">{page.views}</span>
                  <span className={cn('text-xs w-14 text-right', page.change >= 0 ? 'text-success' : 'text-danger')}>
                    {formatPercent(page.change)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-lg mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {analytics.trafficSources.map((source, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <span className="text-sm">{source.source}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium">{source.sessions}</span>
                  <span className={cn('text-xs w-14 text-right', source.change >= 0 ? 'text-success' : 'text-danger')}>
                    {formatPercent(source.change)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <a href="https://analytics.google.com/analytics/web/#/a174154846p399569416/reports/intelligenthome"
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-accent hover:underline flex items-center gap-1">
              Open Google Analytics <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </Card>
      </div>

      <InsightBox emoji="💡" text={insightText} />
    </div>
  );
}

// ==================== FINANCES ====================

function FinancesSection() {
  const { invoices, incomeEntries, taxPercentage } = useDashboardStore();
  const [financesRange, setFinancesRange] = useState<'3M' | '6M' | 'All'>('6M');

  const paidInvoices = invoices.filter(i => i.status === 'paid');
  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalUnpaid = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.amount, 0);
  const paidThisYear = paidInvoices.filter(i => i.createdDate.startsWith('2026')).reduce((sum, i) => sum + i.amount, 0);
  const taxSetAside = paidThisYear * (taxPercentage / 100);

  const filterIncomeData = (data: IncomeEntry[]) => {
    if (financesRange === '3M') return data.slice(-3);
    if (financesRange === '6M') return data.slice(-6);
    return data;
  };

  const filteredIncomeEntries = filterIncomeData(incomeEntries);
  const currentPeriodIncome = filteredIncomeEntries.reduce((sum, e) => sum + (e.photography + e.retainer + e.other), 0);
  const previousPeriodMonths = financesRange === '3M' ? 3 : financesRange === '6M' ? 6 : 3;
  const allDataSize = incomeEntries.length;
  const previousPeriodStart = Math.max(0, allDataSize - (previousPeriodMonths * 2));
  const previousPeriodEnd = Math.max(0, allDataSize - previousPeriodMonths);
  const previousPeriodIncome = incomeEntries.slice(previousPeriodStart, previousPeriodEnd).reduce((sum, e) => sum + (e.photography + e.retainer + e.other), 0);
  const incomeChange = previousPeriodIncome > 0 ? ((currentPeriodIncome - previousPeriodIncome) / previousPeriodIncome) * 100 : 0;

  const currentMonthData = incomeEntries[incomeEntries.length - 1];
  const previousMonthData = incomeEntries.length > 1 ? incomeEntries[incomeEntries.length - 2] : null;
  const photographyRecovered = previousMonthData && previousMonthData.photography < currentMonthData.photography;

  const clientTotals: Record<string, number> = {};
  paidInvoices.forEach(inv => { const k = inv.project || inv.client; clientTotals[k] = (clientTotals[k] || 0) + inv.amount; });
  const pieData = Object.entries(clientTotals).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));

  const insightText = `${getMonthName(currentMonthData.month)} is tracking as a strong month. Photography income has ${photographyRecovered ? 'recovered from' : 'dipped from'} ${previousMonthData ? getMonthName(previousMonthData.month) : 'the previous month'}'s level.`;

  return (
    <div className="space-y-6 animate-section-in">
      <div>
        <h2 className="text-3xl font-bold">Finances</h2>
        <p className="text-muted-foreground mt-1">Income tracking and tax overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="All time earned" value={formatCurrency(totalPaid)} icon={DollarSign} />
        <StatCard title="Outstanding" value={formatCurrency(totalUnpaid)} icon={Receipt} />
        <StatCard title="This year" value={formatCurrency(paidThisYear)} icon={CreditCard} />
        <Card>
          <p className="text-sm text-muted-foreground">Tax set aside ({taxPercentage}%)</p>
          <p className="text-2xl font-semibold mt-1">{formatCurrency(taxSetAside)}</p>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div className="h-2 rounded-full transition-all" style={{ width: `${taxPercentage}%`, background: 'var(--accent-warm)' }} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-lg">Monthly Income Breakdown</h3>
            <div className="flex gap-2">
              {(['3M', '6M', 'All'] as const).map(range => (
                <button key={range} onClick={() => setFinancesRange(range)}
                  className={cn('px-3 py-1.5 text-sm rounded-lg transition-colors',
                    financesRange === range ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}>{range}</button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredIncomeEntries.map(e => ({ month: getMonthName(e.month), Photography: e.photography, Retainer: e.retainer }))}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={(v) => `£${v}`} />
                <Tooltip content={<CustomTooltip formatter={(v: any) => formatCurrency(Number(v))} />} />
                <Bar dataKey="Photography" fill="var(--accent)" />
                <Bar dataKey="Retainer" fill="var(--accent-warm)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-lg mb-4">Revenue by Client</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              </RPieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="truncate">{entry.name}</span>
                </div>
                <span className="font-mono shrink-0">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Invoices</h3>
          <a href="https://studio.pixieset.com/invoices" target="_blank" rel="noopener noreferrer"
            className="text-sm text-accent hover:underline flex items-center gap-1">
            Pixieset <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 font-medium">#</th>
                <th className="text-left py-2 font-medium">Client</th>
                <th className="text-left py-2 font-medium hidden sm:table-cell">Project</th>
                <th className="text-right py-2 font-medium">Amount</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-right py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 15).map(inv => (
                <tr key={inv.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 font-mono text-muted-foreground">{inv.number}</td>
                  <td className="py-2.5">{inv.client}</td>
                  <td className="py-2.5 text-muted-foreground hidden sm:table-cell">{inv.project || '-'}</td>
                  <td className="py-2.5 text-right font-mono font-medium">{formatCurrency(inv.amount)}</td>
                  <td className="py-2.5">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                      inv.status === 'paid' ? 'bg-success-tint text-success' : 'bg-warning-tint text-warning'
                    )}>{inv.status}</span>
                  </td>
                  <td className="py-2.5 text-right text-muted-foreground">{formatShortDate(inv.createdDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <InsightBox emoji="📊" text={insightText} />
    </div>
  );
}

// ==================== INSTAGRAM ====================

function InstagramSection() {
  const { instagramAccounts } = useDashboardStore();

  return (
    <div className="space-y-6 animate-section-in">
      <div>
        <h2 className="text-3xl font-bold">Instagram Insights</h2>
        <p className="text-muted-foreground mt-1">Performance across your accounts</p>
      </div>

      {instagramAccounts.map(account => {
        const reachChange = account.reachChange;
        const engagementTrend = reachChange > 100 ? 'spiking' : reachChange > 0 ? 'growing' : 'declining';
        const postFrequencyAdvice = reachChange > 500 ? 'Consider posting more frequently to capitalise.' : 'Keep posting consistently.';
        const insightText = account.account === 'padharo'
          ? `Padharo's reach is up ${reachChange.toFixed(1)}% — a major spike. ${postFrequencyAdvice}`
          : `${account.displayName} is ${engagementTrend} with reach up ${reachChange.toFixed(1)}%. Engagement at ${account.engagement}%.`;

        return (
          <div key={account.account} className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Instagram className="h-5 w-5" />
              {account.displayName}
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard title="Followers" value={account.followers > 0 ? formatNumber(account.followers) : `+${account.followersChange} new`} change={account.followers > 0 ? (account.followersChange / account.followers) * 100 : undefined} icon={Users} />
              <StatCard title="Engagement" value={`${account.engagement}%`} change={account.engagementChange} icon={TrendingUp} />
              <StatCard title="Impressions" value={formatNumber(account.impressions)} change={account.impressionsChange} icon={Eye} />
              <StatCard title="Reach" value={formatNumber(account.reach)} change={account.reachChange} icon={Globe} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <h4 className="font-semibold text-lg mb-4">Follower Growth</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={account.weeklyFollowers}>
                      <defs>
                        <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={formatShortDate} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} domain={['dataMin - 20', 'dataMax + 20']} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="count" name="Followers" stroke="var(--accent)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h4 className="font-semibold text-lg mb-4">Top Recent Posts</h4>
                <div className="space-y-3">
                  {account.topPosts.map((post, i) => (
                    <div key={i} className="flex items-start justify-between py-2 border-b border-border last:border-0">
                      <div className="flex-1 mr-4">
                        <p className="text-sm line-clamp-2">{post.caption}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(post.date)}</p>
                      </div>
                      <div className="text-right text-sm shrink-0">
                        <p className="text-danger">♥ {post.likes}</p>
                        <p className="text-muted-foreground">💬 {post.comments}</p>
                      </div>
                    </div>
                  ))}
                  {account.topPosts.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No posts yet</p>
                  )}
                </div>
              </Card>
            </div>

            <InsightBox emoji="✨" text={insightText} />
          </div>
        );
      })}
    </div>
  );
}

// ==================== BOOKINGS ====================

function BookingsSection() {
  const { bookings, weather } = useDashboardStore();
  const [bookingsFilter, setBookingsFilter] = useState<'all' | 'photography' | 'travel' | 'meeting'>('all');

  const typeColors: Record<string, string> = {
    photography: 'bg-accent-tint text-accent',
    retainer: 'bg-accent-warm-tint text-accent-warm',
    personal: 'bg-muted text-muted-foreground',
    meeting: 'bg-warning-tint text-warning',
    travel: 'bg-success-tint text-success',
  };

  const typeIcons: Record<string, React.ElementType> = {
    photography: Camera,
    retainer: ChefHat,
    personal: CalendarDays,
    meeting: Users,
    travel: Plane,
  };

  const getWeatherEmoji = (icon: string) => {
    if (icon === 'clear') return '☀️';
    if (icon === 'clouds') return '☁️';
    if (icon === 'rain') return '🌧️';
    return '⛅';
  };

  // Smart map URL: use Google Calendar location first, then infer from title + Southampton
  const getMapUrl = (booking: { title: string; location?: string; type: string; calendarSource?: string }) => {
    if (booking.location) {
      // Has explicit location from Google Calendar
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.location)}`;
    }
    // Photography shoots without location: try title + Southampton (most are local)
    if (booking.type === 'photography' && booking.calendarSource === 'photography') {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.title + ' Southampton')}`;
    }
    return null;
  };

  // Smart display location: show clean version of Google Calendar location, or infer
  const getDisplayLocation = (booking: { title: string; location?: string; type: string; calendarSource?: string }) => {
    if (booking.location) {
      // Shorten long addresses for display
      const loc = booking.location;
      if (loc.length > 40) {
        // Extract city/area from end of address
        const parts = loc.split(',').map(s => s.trim());
        return parts.length > 2 ? `${parts[0]}, ${parts[parts.length - 2]}` : parts[0];
      }
      return loc;
    }
    // Photography shoots without location: infer Southampton
    if (booking.type === 'photography' && booking.calendarSource === 'photography') {
      return 'Southampton (inferred)';
    }
    return null;
  };

  // Determine if weather should show
  const shouldShowWeather = (booking: { type: string; location?: string; calendarSource?: string; date: string }) => {
    if (!weather) return false;
    // Show weather for photography shoots that are local (Southampton area) and within 7 days
    const days = daysUntil(booking.date);
    if (days > 7 || days < 0) return false;
    if (booking.type !== 'photography') return false;
    if (booking.location && !booking.location.toLowerCase().includes('southampton') && booking.calendarSource !== 'photography') return false;
    return true;
  };

  const filteredBookings = bookingsFilter === 'all'
    ? bookings
    : bookings.filter(b => b.type === bookingsFilter);

  const photographyBookings = bookings.filter(b => b.type === 'photography');
  const travelBookings = bookings.filter(b => b.type === 'travel');
  const meetingBookings = bookings.filter(b => b.type === 'meeting');

  const nextShoot = photographyBookings[0];
  const nextShootDays = nextShoot ? daysUntil(nextShoot.date) : null;
  const travelCount = travelBookings.length;

  const insightParts: string[] = [];
  if (photographyBookings.length > 0) {
    insightParts.push(`${photographyBookings.length} photography ${photographyBookings.length === 1 ? 'shoot' : 'shoots'} booked${nextShootDays !== null ? ` (next in ${nextShootDays}d)` : ''}`);
  }
  if (travelCount > 0) {
    insightParts.push(`${travelCount} travel ${travelCount === 1 ? 'event' : 'events'} coming up`);
  }
  if (meetingBookings.length > 0) {
    insightParts.push(`${meetingBookings.length} ${meetingBookings.length === 1 ? 'meeting' : 'meetings'} scheduled`);
  }
  const bookingInsight = insightParts.join('. ') + '.';

  return (
    <div className="space-y-6 animate-section-in">
      <div>
        <h2 className="text-3xl font-bold">Bookings</h2>
        <p className="text-muted-foreground mt-1">Upcoming shoots, travel, and meetings</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Photography" value={photographyBookings.length} icon={Camera} />
        <StatCard title="Travel" value={travelBookings.length} icon={Plane} />
        <StatCard title="Meetings" value={meetingBookings.length} icon={Users} />
        <StatCard title="Total" value={bookings.length} icon={CalendarDays} />
      </div>

      <Card>
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-lg">Schedule</h3>
          <div className="flex gap-2">
            {(['all', 'photography', 'travel', 'meeting'] as const).map(filter => (
              <button key={filter} onClick={() => setBookingsFilter(filter)}
                className={cn('px-3 py-1.5 text-sm rounded-lg transition-colors capitalize',
                  bookingsFilter === filter ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                )}>{filter}</button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          {filteredBookings.map(booking => {
            const days = daysUntil(booking.date);
            const mapUrl = getMapUrl(booking);
            const displayLocation = getDisplayLocation(booking);
            const showWeather = shouldShowWeather(booking);
            const TypeIcon = typeIcons[booking.type] || CalendarDays;

            return (
              <div key={booking.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <div className="w-14 text-center shrink-0">
                  <p className="text-2xl font-semibold leading-none">{new Date(booking.date).getDate()}</p>
                  <p className="text-xs text-muted-foreground uppercase mt-0.5">
                    {new Date(booking.date).toLocaleDateString('en-GB', { month: 'short' })}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="font-medium truncate">{booking.title}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                    {booking.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {booking.time}{booking.endTime ? ` - ${booking.endTime}` : ''}
                      </span>
                    )}
                    {displayLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {mapUrl ? (
                          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                            {displayLocation}
                          </a>
                        ) : (
                          displayLocation
                        )}
                      </span>
                    )}
                    {showWeather && weather && (
                      <span className="flex items-center gap-1">
                        <span className="text-base">{getWeatherEmoji(weather.icon)}</span>
                        <span>{weather.temp}°C</span>
                      </span>
                    )}
                    {booking.description && booking.type === 'travel' && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]" title={booking.description}>
                        {booking.description.split('\n')[0].substring(0, 60)}{booking.description.length > 60 ? '...' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', typeColors[booking.type])}>{booking.type}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : days < 0 ? 'Past' : `${days}d`}
                  </p>
                </div>
              </div>
            );
          })}
          {filteredBookings.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No {bookingsFilter} bookings</p>
          )}
        </div>
      </Card>

      <InsightBox emoji="📅" text={bookingInsight} />
    </div>
  );
}

// ==================== STOCKS ====================

function StocksSection() {
  const { stocks } = useDashboardStore();
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M'>('3M');

  const filterHistory = (history: { date: string; price: number }[]) => {
    const days = timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : 90;
    return history.slice(-days);
  };

  return (
    <div className="space-y-6 animate-section-in">
      <div>
        <h2 className="text-3xl font-bold">Stock Tracker</h2>
        <p className="text-muted-foreground mt-1">Your watched stocks</p>
      </div>

      {stocks.map(stock => (
        <Card key={stock.symbol}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{stock.symbol}</h3>
              <p className="text-sm text-muted-foreground">{stock.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold font-mono">${stock.currentPrice.toFixed(2)}</p>
              <div className="flex items-center gap-1 justify-end">
                {stock.changePercent >= 0 ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownRight className="h-4 w-4 text-danger" />}
                <span className={cn('text-sm font-medium', stock.changePercent >= 0 ? 'text-success' : 'text-danger')}>
                  {formatPercent(stock.changePercent)} (${Math.abs(stock.changeAmount).toFixed(2)})
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {(['1W', '1M', '3M'] as const).map(range => (
              <button key={range} onClick={() => setTimeRange(range)}
                className={cn('px-3 py-1.5 text-sm rounded-lg transition-colors',
                  timeRange === range ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                )}>{range}</button>
            ))}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filterHistory(stock.history)}>
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stock.changePercent >= 0 ? 'var(--success)' : 'var(--danger)'} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={stock.changePercent >= 0 ? 'var(--success)' : 'var(--danger)'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={formatShortDate} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />} />
                <Area type="monotone" dataKey="price" name="Price"
                  stroke={stock.changePercent >= 0 ? 'var(--success)' : 'var(--danger)'}
                  fill="url(#stockGradient)"
                  strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ==================== CLIENTS ====================

function ClientsSection() {
  const { invoices, instagramAccounts } = useDashboardStore();
  const padharoIG = instagramAccounts.find(a => a.account === 'padharo');
  const padharoInvoices = invoices.filter(i => i.project === 'Padharo');
  const padharoTotal = padharoInvoices.reduce((sum, i) => sum + i.amount, 0);

  const padharoInsight = `Padharo remains a key client with ${padharoTotal > 0 ? formatCurrency(padharoTotal) + ' invoiced' : 'active work'}.${padharoIG && padharoIG.reachChange > 500 ? ` Instagram reach is up massively (${padharoIG.reachChange.toFixed(1)}%). Keep the momentum going!` : padharoIG ? ` Engagement at ${padharoIG.engagement}%.` : ''}`;

  return (
    <div className="space-y-6 animate-section-in">
      <div>
        <h2 className="text-3xl font-bold">Client Management</h2>
        <p className="text-muted-foreground mt-1">Padharo and Popado overview</p>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--accent-warm) 12%, transparent)' }}>
            <ChefHat className="h-5 w-5 text-accent-warm" />
          </div>
          <div>
            <h3 className="font-semibold">Padharo</h3>
            <p className="text-sm text-muted-foreground">Indian Restaurant, Southampton</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">Monthly retainer</p>
            <p className="text-lg font-semibold">{formatCurrency(1000)}</p>
            <p className="text-xs text-muted-foreground">(Jan-Mar rate)</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">Total invoiced</p>
            <p className="text-lg font-semibold">{formatCurrency(padharoTotal)}</p>
          </div>
          {padharoIG && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">IG followers</p>
              <p className="text-lg font-semibold">{formatNumber(padharoIG.followers)}</p>
              <p className="text-xs text-success">+{padharoIG.followersChange} this month</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 text-sm mb-4">
          <a href="https://studio.pixieset.com/invoices" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">Pixieset <ExternalLink className="h-3.5 w-3.5" /></a>
          <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">Google Business <ExternalLink className="h-3.5 w-3.5" /></a>
        </div>
        <InsightBox emoji="🍜" text={padharoInsight} />
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-success-tint flex items-center justify-center">
            <Store className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold">Popado</h3>
            <p className="text-sm text-muted-foreground">Street Food Brand</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Pizzas, burgers, wraps, pasta and more. Run from the Padharo kitchen. Managed as part of the Padharo retainer.</p>
      </Card>

      <Card>
        <h3 className="font-semibold text-lg mb-4">Top Photography Clients</h3>
        <div className="space-y-2">
          {Object.entries(
            invoices.filter(i => i.status === 'paid' && !i.project)
              .reduce((acc, inv) => { acc[inv.client] = (acc[inv.client] || 0) + inv.amount; return acc; }, {} as Record<string, number>)
          ).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([client, total], i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
              <span className="text-sm">{client}</span>
              <span className="font-mono text-sm font-medium">{formatCurrency(total)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ==================== MAIN DASHBOARD ====================

export default function Dashboard() {
  const {
    activeSection, setActiveSection, sidebarOpen, setSidebarOpen,
    setInvoices, setIncomeEntries, setAnalytics, setInstagramAccounts,
    setStocks, setBookings, setWeather,
  } = useDashboardStore();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sectionKey, setSectionKey] = useState(0);
  const { time: sidebarTime } = useLiveClock();

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section);
    setSectionKey(k => k + 1);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, [setActiveSection, setSidebarOpen]);

  useEffect(() => {
    setInvoices(demoInvoices);
    setIncomeEntries(demoIncomeEntries);
    setAnalytics(demoAnalytics);
    setInstagramAccounts(demoInstagramAccounts);
    setStocks(demoStocks);
    setBookings(demoBookings);
    // Try to fetch live calendar data
    fetch('/api/bookings').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.live && d.events?.length > 0) setBookings(d.events);
    }).catch(() => {});
    setWeather({
      temp: 8, feelsLike: 5, description: 'partly cloudy', icon: 'clouds',
      humidity: 72, windSpeed: 14, forecast: [],
    });
    fetch('/api/weather').then(r => r.ok ? r.json() : null).then(d => { if (d) setWeather(d); }).catch(() => {});
  }, [setInvoices, setIncomeEntries, setAnalytics, setInstagramAccounts, setStocks, setBookings, setWeather]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Cmd/Ctrl + K: command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
        return;
      }

      // Number keys 1-7: quick navigation
      const sections = ['overview', 'analytics', 'finances', 'instagram', 'bookings', 'stocks', 'clients'];
      const num = parseInt(e.key);
      if (num >= 1 && num <= 7 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        handleNavigate(sections[num - 1]);
        return;
      }

      // Escape: close command palette
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate]);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection />;
      case 'analytics': return <AnalyticsSection />;
      case 'finances': return <FinancesSection />;
      case 'instagram': return <InstagramSection />;
      case 'bookings': return <BookingsSection />;
      case 'stocks': return <StocksSection />;
      case 'clients': return <ClientsSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} onNavigate={handleNavigate} />

      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-muted">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <h1 className="font-semibold text-sm">Command Centre</h1>
        <div className="w-9" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-60 bg-sidebar border-r border-sidebar-border transition-transform duration-200 lg:translate-x-0 overflow-y-auto flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="p-5 pt-6">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold tracking-tight">Command Centre</h1>
              <span className="text-xs font-mono text-muted-foreground tabular-nums">{sidebarTime}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Ryan Stanikk Photography</p>
          </div>
          <nav className="px-3 space-y-0.5 flex-1">
            {NAV_ITEMS.map((item, i) => (
              <button key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group',
                  activeSection === item.id ? 'bg-accent-tint text-accent' : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-hover'
                )}>
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                <kbd className="hidden group-hover:inline text-[10px] font-mono px-1 py-0.5 rounded bg-muted text-muted-foreground">{i + 1}</kbd>
              </button>
            ))}
          </nav>

          {/* Command palette trigger */}
          <div className="px-3 mb-2">
            <button onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-colors border border-border">
              <Search className="h-3.5 w-3.5" />
              <span className="flex-1 text-left text-xs">Search...</span>
              <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-muted">⌘K</kbd>
            </button>
          </div>

          <div className="p-4 border-t border-sidebar-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }}>
                  <Camera className="h-4 w-4 text-accent" />
                </div>
                <div className="text-sm min-w-0">
                  <p className="font-medium leading-none truncate">Ryan Stanikk</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Photographer</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 min-h-screen">
          <div key={sectionKey} className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
