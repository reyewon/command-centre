'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useDashboardStore, IncomeEntry, AccountBalance, syncToServer, syncFromServer } from '@/lib/store';
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
  Search, Command, Target, Zap, Keyboard, Sparkles, Navigation, CloudSun, GripVertical, Mail, Bell, BellRing, Volume2, Pencil, Check, Landmark, TrendingUpDown
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
  { id: 'bookings', label: 'Calendar', icon: CalendarDays },
  { id: 'stocks', label: 'Stocks', icon: TrendingUp },
  { id: 'enquiries', label: 'Enquiries', icon: Mail },
  { id: 'clients', label: 'Clients', icon: Store },
];

const PIE_COLORS = ['#d97757', '#c15f3c', '#e5956e', '#c9923e', '#5a9a6e', '#8a857a'];

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

// ==================== NOTIFICATION SOUND ====================

function playEnquiryChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    // Create a warm, distinctive 3-note ascending chime (C5 - E5 - G5 major triad)
    const notes = [
      { freq: 523.25, time: 0, duration: 0.8 },      // C5
      { freq: 659.25, time: 0.12, duration: 0.7 },    // E5
      { freq: 783.99, time: 0.24, duration: 0.9 },    // G5
    ];

    // Subtle reverb via delay
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.08;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.15;
    delay.connect(delayGain);
    delayGain.connect(ctx.destination);

    notes.forEach(({ freq, time: t, duration }) => {
      // Main tone (sine - warm and pure)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = freq;

      // Subtle harmonic layer (triangle - adds warmth)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = freq * 2; // octave above

      // Main gain envelope
      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0, now + t);
      gain1.gain.linearRampToValueAtTime(0.22, now + t + 0.03);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + t + duration);

      // Harmonic gain (quieter)
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0, now + t);
      gain2.gain.linearRampToValueAtTime(0.06, now + t + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + t + duration * 0.7);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      gain1.connect(delay);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now + t);
      osc1.stop(now + t + duration);
      osc2.start(now + t);
      osc2.stop(now + t + duration * 0.7);
    });

    // Add a subtle low bell tone for body
    const bell = ctx.createOscillator();
    bell.type = 'sine';
    bell.frequency.value = 261.63; // C4 (octave below)
    const bellGain = ctx.createGain();
    bellGain.gain.setValueAtTime(0, now);
    bellGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    bell.connect(bellGain);
    bellGain.connect(ctx.destination);
    bell.start(now);
    bell.stop(now + 1.2);

    setTimeout(() => ctx.close(), 3000);
  } catch (e) {
    // Audio not available, skip silently
  }
}

// ==================== ENQUIRY NOTIFICATIONS ====================

function useEnquiryNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Load seen IDs from localStorage
    try {
      const stored = localStorage.getItem('rcc-seen-enquiry-ids');
      if (stored) seenIdsRef.current = new Set(JSON.parse(stored));
      const enabled = localStorage.getItem('rcc-notifications-enabled');
      if (enabled === 'true') setNotificationsEnabled(true);
      const wasDismissed = localStorage.getItem('rcc-notification-banner-dismissed');
      if (wasDismissed === 'true') setDismissed(true);
    } catch {}

    // Check current permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('rcc-notifications-enabled', 'true');
        // Play the chime as a preview
        playEnquiryChime();
      }
    }
  }, []);

  const dismissBanner = useCallback(() => {
    setDismissed(true);
    localStorage.setItem('rcc-notification-banner-dismissed', 'true');
  }, []);

  const checkForNewEmails = useCallback((emails: any[]) => {
    if (!notificationsEnabled && permission !== 'granted') return;

    const unreadEmails = emails.filter((e: any) => e.isUnread);

    // On initial load, just mark everything as seen without notifying
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      unreadEmails.forEach((e: any) => seenIdsRef.current.add(e.id));
      try {
        localStorage.setItem('rcc-seen-enquiry-ids', JSON.stringify([...seenIdsRef.current]));
      } catch {}
      return;
    }

    const newEmails = unreadEmails.filter((e: any) => !seenIdsRef.current.has(e.id));

    if (newEmails.length > 0) {
      // Mark as seen
      newEmails.forEach((e: any) => seenIdsRef.current.add(e.id));
      try {
        localStorage.setItem('rcc-seen-enquiry-ids', JSON.stringify([...seenIdsRef.current]));
      } catch {}

      // Play the chime
      playEnquiryChime();

      // Show desktop notification for each new email
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        newEmails.forEach((email: any) => {
          const n = new Notification(`New Enquiry from ${email.from}`, {
            body: email.subject,
            icon: '/icon-192.png',
            tag: `enquiry-${email.id}`,
            requireInteraction: false,
          });
          // Click notification to open Gmail
          n.onclick = () => {
            window.open(email.gmailUrl, '_blank');
            n.close();
          };
        });
      }
    }
  }, [notificationsEnabled, permission]);

  // Poll for new enquiries (30s for faster notification)
  useEffect(() => {
    if (!notificationsEnabled && permission !== 'granted') return;

    const poll = () => {
      fetch('/api/enquiries')
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.emails) checkForNewEmails(d.emails); })
        .catch(() => {});
    };

    // Initial check
    poll();

    // Poll every 30 seconds
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [notificationsEnabled, permission, checkForNewEmails]);

  return {
    permission,
    notificationsEnabled,
    requestPermission,
    dismissed,
    dismissBanner,
    showBanner: !dismissed && permission !== 'granted',
  };
}

// ==================== NOTIFICATION BANNER ====================

function NotificationBanner({ onEnable, onDismiss }: { onEnable: () => void; onDismiss: () => void }) {
  return (
    <div className="mb-4 glass-card rounded-xl px-4 py-3 flex items-center gap-3 border border-accent/20 bg-accent-tint animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
        <BellRing className="h-4 w-4 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">Enable enquiry notifications?</p>
        <p className="text-xs text-muted-foreground mt-0.5">Get notified with a chime when new photography enquiries arrive.</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={onEnable}
          className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors">
          Enable
        </button>
        <button onClick={onDismiss}
          className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-card-hover transition-colors">
          Later
        </button>
      </div>
    </div>
  );
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
    { id: 'bookings', label: 'Go to Calendar', shortcut: '5', icon: CalendarDays, section: 'bookings' },
    { id: 'stocks', label: 'Go to Stocks', shortcut: '6', icon: TrendingUp, section: 'stocks' },
    { id: 'enquiries', label: 'Go to Enquiries', shortcut: '7', icon: Mail, section: 'enquiries' },
    { id: 'clients', label: 'Go to Clients', shortcut: '8', icon: Store, section: 'clients' },
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

function Card({ children, className, onClick, ...rest }: { children: React.ReactNode; className?: string; onClick?: () => void } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-2xl p-5 sm:p-6',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      {...rest}
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
        <div className="rounded-xl p-2.5" style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}>
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
    <div className="glass-card rounded-xl border border-border px-3 py-2 shadow-lg">
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
      className="p-2 rounded-xl hover:bg-sidebar-hover transition-colors text-sidebar-foreground"
      title={`Current: ${theme}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

// ==================== MOBILE DRAG REORDER ====================

const DEFAULT_OVERVIEW_ORDER = ['stats', 'income', 'enquiries', 'stocks', 'traffic-invoices'];

function useOverviewOrder() {
  const [order, setOrder] = useState<string[]>(DEFAULT_OVERVIEW_ORDER);

  useEffect(() => {
    // Try localStorage first for instant load
    try {
      const stored = localStorage.getItem('rcc-overview-order');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && DEFAULT_OVERVIEW_ORDER.every(id => parsed.includes(id)) && parsed.length === DEFAULT_OVERVIEW_ORDER.length) {
          setOrder(parsed);
        }
      }
    } catch {}
    // Then sync from server (takes priority if available)
    syncFromServer('overview-order').then((remote) => {
      if (Array.isArray(remote) && DEFAULT_OVERVIEW_ORDER.every(id => (remote as string[]).includes(id)) && remote.length === DEFAULT_OVERVIEW_ORDER.length) {
        setOrder(remote as string[]);
        localStorage.setItem('rcc-overview-order', JSON.stringify(remote));
      }
    });
  }, []);

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setOrder(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      localStorage.setItem('rcc-overview-order', JSON.stringify(next));
      syncToServer('overview-order', next);
      return next;
    });
  }, []);

  return { order, reorder };
}

function useTouchReorder(itemCount: number, onReorder: (from: number, to: number) => void) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const itemRectsRef = useRef<DOMRect[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const captureRects = useCallback(() => {
    if (!containerRef.current) return;
    const children = containerRef.current.querySelectorAll('[data-reorder-item]');
    itemRectsRef.current = Array.from(children).map(el => el.getBoundingClientRect());
  }, []);

  const handleTouchStart = useCallback((index: number, e: React.TouchEvent) => {
    e.stopPropagation();
    captureRects();
    setDragging(index);
    setOverIndex(index);
  }, [captureRects]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragging === null) return;
    e.stopPropagation();
    const touch = e.touches[0];
    const y = touch.clientY;

    // Find which item slot we're over
    let targetIndex = dragging;
    for (let i = 0; i < itemRectsRef.current.length; i++) {
      const rect = itemRectsRef.current[i];
      const midY = rect.top + rect.height / 2;
      if (y < midY) {
        targetIndex = i;
        break;
      }
      targetIndex = i;
    }

    setOverIndex(targetIndex);
  }, [dragging]);

  const handleTouchEnd = useCallback(() => {
    if (dragging !== null && overIndex !== null && dragging !== overIndex) {
      onReorder(dragging, overIndex);
    }
    setDragging(null);
    setOverIndex(null);
  }, [dragging, overIndex, onReorder]);

  return {
    containerRef,
    dragging,
    overIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}

function DragHandle({ index, onTouchStart, editMode }: { index: number; onTouchStart: (index: number, e: React.TouchEvent) => void; editMode: boolean }) {
  if (!editMode) return null;
  return (
    <div
      className="lg:hidden flex items-center justify-center py-1.5 -mt-1 mb-1 cursor-grab active:cursor-grabbing touch-none animate-fade-in"
      onTouchStart={(e) => onTouchStart(index, e)}
    >
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">Drag to reorder</span>
      </div>
    </div>
  );
}

// ==================== ENQUIRIES GLANCE (OVERVIEW WIDGET) ====================

function EnquiriesGlance() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/enquiries')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.emails) setEmails(d.emails);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));

    const interval = setInterval(() => {
      fetch('/api/enquiries')
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.emails) setEmails(d.emails); })
        .catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const unread = emails.filter(e => e.isUnread);
  const display = unread.slice(0, 2);

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  if (!loaded) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-accent" />
          <h3 className="font-semibold text-lg">Latest Enquiries</h3>
        </div>
        {unread.length > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-tint text-accent">
            {unread.length} unread
          </span>
        )}
      </div>
      {display.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">No unread enquiries — all caught up!</p>
      ) : (
        <div className="divide-y divide-border">
          {display.map((email) => (
            <a
              key={email.id}
              href={email.gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 py-2.5 hover:bg-muted -mx-1 px-1 rounded-lg transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                {email.from.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate">{email.from}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0",
                    email.account === 'professional' ? "bg-accent-tint text-accent" : "bg-muted text-muted-foreground"
                  )}>
                    {email.account === 'professional' ? 'PRO' : 'PERSONAL'}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">{formatTimeAgo(email.date)}</span>
                </div>
                <p className="text-sm text-foreground truncate mt-0.5">{email.subject}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0" />
            </a>
          ))}
        </div>
      )}
    </Card>
  );
}

// ==================== OVERVIEW ====================

function OverviewSection({ editMode }: { editMode: boolean }) {
  const { invoices, incomeEntries, analytics, instagramAccounts, bookings, weather, stocks } = useDashboardStore();
  const { time, date } = useLiveClock();

  const currentMonth = incomeEntries[incomeEntries.length - 1];
  const totalThisMonth = currentMonth ? currentMonth.photography + currentMonth.retainer + currentMonth.other : 0;
  const unpaidTotal = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.amount, 0);
  const paidThisYear = invoices.filter(i => i.status === 'paid' && i.createdDate.startsWith('2026')).reduce((sum, i) => sum + i.amount, 0);
  const photographyIG = instagramAccounts.find(a => a.account === 'photography');

  // UK 2025/26 tax estimate (self-employed, England)
  const UK_PERSONAL_ALLOWANCE = 12570;
  const UK_BASIC_RATE_LIMIT = 50270;
  const UK_BASIC_RATE = 0.20;
  const UK_CLASS4_NI_RATE = 0.06;
  // Annualise YTD income to estimate full-year liability, then pro-rata back
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const annualisedIncome = dayOfYear > 0 ? (paidThisYear / dayOfYear) * 365 : 0;
  const taxableIncome = Math.max(0, annualisedIncome - UK_PERSONAL_ALLOWANCE);
  const basicRateTax = Math.min(taxableIncome, UK_BASIC_RATE_LIMIT - UK_PERSONAL_ALLOWANCE) * UK_BASIC_RATE;
  const class4NI = Math.min(taxableIncome, UK_BASIC_RATE_LIMIT - UK_PERSONAL_ALLOWANCE) * UK_CLASS4_NI_RATE;
  const annualTaxEstimate = basicRateTax + class4NI;
  // Pro-rata the annual estimate to YTD
  const ytdTaxEstimate = dayOfYear > 0 ? annualTaxEstimate * (dayOfYear / 365) : 0;

  // Income breakdown for current year
  const ytdPhotography = incomeEntries.filter(e => e.month.startsWith('2026')).reduce((sum, e) => sum + e.photography, 0);
  const ytdRetainer = incomeEntries.filter(e => e.month.startsWith('2026')).reduce((sum, e) => sum + e.retainer, 0);
  const ytdOther = incomeEntries.filter(e => e.month.startsWith('2026')).reduce((sum, e) => sum + e.other, 0);
  const nextBooking = bookings[0];
  const daysToNext = nextBooking ? daysUntil(nextBooking.date) : null;

  // Monthly goal tracking
  const monthlyGoal = 4000;
  const monthProgress = Math.min((totalThisMonth / monthlyGoal) * 100, 100);
  const goalColor = monthProgress < 50 ? 'var(--danger)' : monthProgress < 80 ? 'var(--warning)' : 'var(--success)';

  const { order, reorder } = useOverviewOrder();
  const { containerRef, dragging, overIndex, handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchReorder(order.length, reorder);

  // Widget renderers keyed by ID
  const widgets: Record<string, React.ReactNode> = {
    stats: (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Revenue this month" value={formatCurrency(totalThisMonth)} change={12.4} icon={DollarSign} />
        <StatCard title="Outstanding" value={formatCurrency(unpaidTotal)} icon={Receipt} />
        <StatCard title="Website visitors" value={analytics?.users ?? 0} change={analytics?.usersChange} icon={Globe} />
        <StatCard title="IG followers" value={formatNumber(photographyIG?.followers ?? 0)} change={photographyIG && photographyIG.followers > 0 ? (photographyIG.followersChange / photographyIG.followers) * 100 : undefined} icon={Instagram} />
      </div>
    ),

    income: (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Monthly Income</h3>
            <span className="text-sm text-muted-foreground">Last 11 months</span>
          </div>
          <div className="flex-1 min-h-[11rem]">
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
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Photography (YTD)</p>
              <p className="text-lg font-semibold mt-0.5">{formatCurrency(ytdPhotography)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Retainer (YTD)</p>
              <p className="text-lg font-semibold mt-0.5">{formatCurrency(ytdRetainer)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Other (YTD)</p>
              <p className="text-lg font-semibold mt-0.5">{formatCurrency(ytdOther)}</p>
            </div>
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
              <p className="text-sm text-muted-foreground">Next up</p>
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

          <Card>
            <p className="text-sm text-muted-foreground">Year to date (2025/26)</p>
            <p className="text-2xl font-semibold mt-1">{formatCurrency(paidThisYear)}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-muted-foreground">
                Est. tax to set aside: <span className="font-medium text-foreground">{formatCurrency(ytdTaxEstimate)}</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Based on 20% basic rate + 6% Class 4 NI above £{(UK_PERSONAL_ALLOWANCE).toLocaleString()} threshold
              </p>
            </div>
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
    ),

    enquiries: <EnquiriesGlance />,

    stocks: stocks.length > 0 ? (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Stock Watch</h3>
          <div className="flex items-center gap-4">
            {stocks.map(stock => (
              <div key={stock.symbol} className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">{stock.symbol}</span>
                <span className="font-mono font-semibold">{(stock.currency === 'GBP' ? '£' : stock.currency === 'EUR' ? '€' : '$')}{stock.currentPrice.toFixed(2)}</span>
                <span className={cn('flex items-center gap-0.5 text-sm font-medium', stock.changePercent >= 0 ? 'text-success' : 'text-danger')}>
                  {stock.changePercent >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {formatPercent(stock.changePercent)}
                </span>
                {stock.marketState && (
                  <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded',
                    stock.marketState === 'REGULAR' ? 'bg-success-tint text-success' : 'bg-muted text-muted-foreground'
                  )}>
                    {stock.marketState === 'REGULAR' ? 'LIVE' : stock.marketState === 'PRE' ? 'PRE' : stock.marketState === 'POST' ? 'AFTER' : 'CLOSED'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stocks[0]?.hourly ?? stocks[0]?.history?.slice(-7) ?? []}>
              <defs>
                <linearGradient id="overviewStockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stocks[0]?.changePercent >= 0 ? 'var(--success)' : 'var(--danger)'} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={stocks[0]?.changePercent >= 0 ? 'var(--success)' : 'var(--danger)'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={(v) => `$${v}`} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip content={<CustomTooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />} />
              <Area type="linear" dataKey="price" stroke={stocks[0]?.changePercent >= 0 ? 'var(--success)' : 'var(--danger)'} fill="url(#overviewStockGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    ) : null,

    'traffic-invoices': (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-lg mb-4">Website Traffic (30 days)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.dailyTraffic?.slice(-30) ?? []}>
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
    ),
  };

  return (
    <div className="space-y-6 animate-section-in">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold">{getGreeting()}, Ryan</h2>
          <p className="text-muted-foreground mt-1">
            {editMode ? 'Drag widgets to rearrange your dashboard' : "Here's your business at a glance"}
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-2xl font-mono font-semibold tracking-tight">{time}</p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      </div>

      <div ref={containerRef} className={cn("space-y-6", editMode && "pb-8")}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {order.map((widgetId, index) => {
          const content = widgets[widgetId];
          if (!content) return null;

          const isDragging = dragging === index;
          const isOver = overIndex === index && dragging !== null && dragging !== index;

          return (
            <div
              key={widgetId}
              data-reorder-item
              className={cn(
                'transition-all duration-200',
                isDragging && 'opacity-50 scale-[0.98]',
                isOver && 'ring-2 ring-accent ring-offset-2 ring-offset-background rounded-2xl'
              )}
            >
              <DragHandle index={index} onTouchStart={handleTouchStart} editMode={editMode} />
              {content}
            </div>
          );
        })}
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
                className={cn('px-3 py-1.5 text-sm rounded-xl transition-colors',
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

// ─── Account Balances Widget ────────────────────────────────────────────
function AccountBalancesWidget() {
  const { accountBalances, setAccountBalances } = useDashboardStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchBalances = useCallback(async () => {
    try {
      const res = await fetch('/api/accounts');
      if (!res.ok) return;
      const data = await res.json();
      if (data.accounts) setAccountBalances(data.accounts);
    } catch {} finally {
      setLoading(false);
    }
  }, [setAccountBalances]);

  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 300000); // 5 min
    return () => clearInterval(interval);
  }, [fetchBalances]);

  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus();
  }, [editingId]);

  const handleEditStart = (account: AccountBalance) => {
    if (account.autoSync) return;
    setEditingId(account.id);
    setEditValue(account.balance !== null ? Math.abs(account.balance).toFixed(2) : '0.00');
  };

  const handleEditSave = () => {
    if (!editingId) return;
    const val = parseFloat(editValue) || 0;
    // Build updated manual balances object
    const manualBalances: Record<string, number | string> = {};
    accountBalances.forEach(a => {
      if (!a.autoSync) {
        manualBalances[a.id] = a.id === editingId ? val : (a.balance ?? 0);
        manualBalances[`${a.id}-updated`] = a.id === editingId ? new Date().toISOString() : (a.lastUpdated ?? '');
      }
    });
    syncToServer('credit-card-balances', manualBalances);
    // Update local state
    setAccountBalances(accountBalances.map(a =>
      a.id === editingId ? { ...a, balance: val, lastUpdated: new Date().toISOString() } : a
    ));
    setEditingId(null);
  };

  const getIcon = (type: string) => {
    if (type === 'current') return Landmark;
    if (type === 'investment') return TrendingUpDown;
    return CreditCard;
  };

  const currentAccounts = accountBalances.filter(a => a.type === 'current');
  const creditAccounts = accountBalances.filter(a => a.type === 'credit');
  const investmentAccounts = accountBalances.filter(a => a.type === 'investment');

  const totalCurrent = currentAccounts.reduce((s, a) => s + (a.balance ?? 0), 0);
  const totalCredit = creditAccounts.reduce((s, a) => s + (a.balance ?? 0), 0);
  const totalInvestment = investmentAccounts.reduce((s, a) => s + (a.balance ?? 0), 0);
  const netPosition = totalCurrent + totalInvestment - totalCredit;

  const formatTimeAgo = (iso: string | null) => {
    if (!iso) return 'never';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const renderAccount = (account: AccountBalance) => {
    const Icon = getIcon(account.type);
    const isEditing = editingId === account.id;
    const isCredit = account.type === 'credit';
    const hasBalance = account.balance !== null;

    return (
      <div key={account.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
            account.type === 'current' ? 'bg-success/10 text-success' :
            account.type === 'investment' ? 'bg-accent/10 text-accent' :
            'bg-warning/10 text-warning'
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{account.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {account.autoSync ? (
                <span className="flex items-center gap-1">
                  <span className={cn('w-1.5 h-1.5 rounded-full', account.live ? 'bg-success' : 'bg-muted-foreground')} />
                  {account.live ? `Updated ${formatTimeAgo(account.lastUpdated)}` : 'Not connected'}
                </span>
              ) : (
                hasBalance ? `Updated ${formatTimeAgo(account.lastUpdated)}` : 'Tap to set'
              )}
            </p>
          </div>
        </div>
        <div className="shrink-0 ml-3">
          {isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }} className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">£</span>
              <input ref={inputRef} type="number" step="0.01" min="0" value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleEditSave}
                className="w-20 text-right text-sm font-mono bg-muted rounded-lg px-2 py-1 border border-border focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </form>
          ) : (
            <button
              onClick={() => handleEditStart(account)}
              disabled={account.autoSync}
              className={cn('text-sm font-mono font-medium tabular-nums',
                !account.autoSync && 'hover:text-accent cursor-pointer',
                isCredit && hasBalance ? 'text-warning' : hasBalance ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {hasBalance ? `${isCredit ? '-' : ''}£${Math.abs(account.balance!).toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : '£--.--'}
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading && accountBalances.length === 0) {
    return (
      <Card>
        <h3 className="font-semibold text-lg mb-4">Account Balances</h3>
        <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">Loading...</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Account Balances</h3>
        <button onClick={() => { setLoading(true); fetchBalances(); }}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Net position summary */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-muted/40">
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current</p>
          <p className="text-sm font-mono font-semibold text-success">{totalCurrent > 0 ? `£${totalCurrent.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : '£--.--'}</p>
        </div>
        <div className="text-center border-x border-border">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Credit</p>
          <p className="text-sm font-mono font-semibold text-warning">{totalCredit > 0 ? `-£${totalCredit.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : '£0.00'}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Invested</p>
          <p className="text-sm font-mono font-semibold text-accent">{totalInvestment > 0 ? `£${totalInvestment.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : '£--.--'}</p>
        </div>
      </div>

      {/* Net position bar */}
      <div className="flex items-center justify-between mb-4 p-2.5 rounded-xl bg-card border border-border">
        <span className="text-sm text-muted-foreground">Net position</span>
        <span className={cn('text-base font-mono font-bold', netPosition >= 0 ? 'text-success' : 'text-warning')}>
          {netPosition !== 0 ? `${netPosition >= 0 ? '' : '-'}£${Math.abs(netPosition).toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : '£--.--'}
        </span>
      </div>

      {/* Current accounts */}
      {currentAccounts.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 px-0.5">Current Account</p>
          {currentAccounts.map(renderAccount)}
        </div>
      )}

      {/* Investment accounts */}
      {investmentAccounts.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 px-0.5">Investments</p>
          {investmentAccounts.map(renderAccount)}
        </div>
      )}

      {/* Credit cards */}
      {creditAccounts.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 px-0.5">Credit Cards</p>
          {creditAccounts.map(renderAccount)}
        </div>
      )}
    </Card>
  );
}

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

      <AccountBalancesWidget />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-lg">Monthly Income Breakdown</h3>
            <div className="flex gap-2">
              {(['3M', '6M', 'All'] as const).map(range => (
                <button key={range} onClick={() => setFinancesRange(range)}
                  className={cn('px-3 py-1.5 text-sm rounded-xl transition-colors',
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
        <h2 className="text-3xl font-bold">Calendar</h2>
        <p className="text-muted-foreground mt-1">Upcoming shoots, travel, meetings, and events</p>
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
                className={cn('px-3 py-1.5 text-sm rounded-xl transition-colors capitalize',
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
                      <span className="flex items-center gap-1.5">
                        <span className="text-2xl leading-none">{getWeatherEmoji(weather.icon)}</span>
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
            <p className="text-sm text-muted-foreground text-center py-6">No {bookingsFilter} events</p>
          )}
        </div>
      </Card>

      <InsightBox emoji="📅" text={bookingInsight} />
    </div>
  );
}

// ==================== STOCKS ====================

function StocksSection() {
  const { stocks, setStocks, addStock, removeStock, reorderStocks } = useDashboardStore();
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M'>('1M');
  const [addingStock, setAddingStock] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [loadingSymbol, setLoadingSymbol] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Fetch live stock data
  const fetchStockData = useCallback(async (symbols?: string[]) => {
    // Use provided symbols, or current stocks, or persisted watchlist
    const symbolList = symbols || stocks.map(s => s.symbol);
    const finalList = symbolList.length > 0 ? symbolList : useDashboardStore.getState().stockSymbols;
    if (finalList.length === 0) return;

    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/stocks?symbols=${finalList.join(',')}&intraday=${timeRange === '1D'}&hourly=${timeRange === '1W'}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.stocks?.length > 0) {
        setStocks(data.stocks);
        setLastUpdated(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch {
      // Keep existing data on error
    } finally {
      setIsRefreshing(false);
    }
  }, [stocks, timeRange, setStocks]);

  // Load persisted stocks on mount (server sync first, then localStorage fallback) and auto-refresh every 60 seconds
  useEffect(() => {
    (async () => {
      // Try server sync for stock symbols
      const remote = await syncFromServer('stock-symbols');
      if (Array.isArray(remote) && remote.length > 0) {
        const remoteSymbols = remote as string[];
        useDashboardStore.setState({ stockSymbols: remoteSymbols });
        localStorage.setItem('rcc-stock-symbols', JSON.stringify(remoteSymbols));
        fetchStockData(remoteSymbols);
      } else {
        const symbols = useDashboardStore.getState().stockSymbols;
        if (symbols.length > 0) fetchStockData(symbols);
      }
    })();
    const interval = setInterval(() => {
      const currentSymbols = useDashboardStore.getState().stockSymbols;
      if (currentSymbols.length > 0) fetchStockData(currentSymbols);
    }, 60000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const handleAddStock = async () => {
    const symbol = newSymbol.trim().toUpperCase();
    if (!symbol || stocks.some(s => s.symbol === symbol)) return;

    setLoadingSymbol(true);
    try {
      const res = await fetch(`/api/stocks?symbols=${symbol}&intraday=false&hourly=true`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      if (data.stocks?.[0]) {
        addStock(data.stocks[0]);
        setNewSymbol('');
        setAddingStock(false);
      }
    } catch {
      // Could show an error toast here
    } finally {
      setLoadingSymbol(false);
    }
  };

  const handleRemoveStock = (symbol: string) => {
    removeStock(symbol);
  };

  const getChartData = (stock: any) => {
    if (timeRange === '1D' && stock.intraday?.length > 0) {
      return stock.intraday;
    }
    if (timeRange === '1W' && stock.hourly?.length > 0) {
      return stock.hourly;
    }
    const days = timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : 90;
    return (stock.history || []).slice(-days);
  };

  const getCurrencySymbol = (currency?: string) => {
    if (currency === 'GBP' || currency === 'GBp') return '£';
    if (currency === 'EUR') return '€';
    return '$';
  };

  return (
    <div className="space-y-6 animate-section-in">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold">Stock Tracker</h2>
          <p className="text-muted-foreground mt-1">
            Your watched stocks
            {lastUpdated && <span className="ml-2 text-xs">(updated {lastUpdated})</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchStockData()} disabled={isRefreshing}
            className="p-2 rounded-xl bg-muted hover:bg-card-hover transition-colors disabled:opacity-50" title="Refresh">
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          </button>
          <button onClick={() => setAddingStock(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> Add stock
          </button>
        </div>
      </div>

      {/* Add stock modal */}
      {addingStock && (
        <Card>
          <div className="flex items-center gap-3">
            <input
              value={newSymbol}
              onChange={e => setNewSymbol(e.target.value.toUpperCase())}
              placeholder="Enter ticker symbol (e.g. AAPL, TSLA)"
              className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-accent"
              onKeyDown={e => { if (e.key === 'Enter') handleAddStock(); if (e.key === 'Escape') setAddingStock(false); }}
              autoFocus
            />
            <button onClick={handleAddStock} disabled={loadingSymbol || !newSymbol.trim()}
              className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium disabled:opacity-50">
              {loadingSymbol ? 'Loading...' : 'Add'}
            </button>
            <button onClick={() => { setAddingStock(false); setNewSymbol(''); }}
              className="p-2 rounded-xl hover:bg-muted transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </Card>
      )}

      {stocks.length === 0 && !addingStock && (
        <Card>
          <div className="text-center py-8">
            <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No stocks being tracked</p>
            <button onClick={() => setAddingStock(true)}
              className="mt-3 text-sm text-accent hover:underline">Add your first stock</button>
          </div>
        </Card>
      )}

      {stocks.map((stock, index) => {
        const chartData = getChartData(stock);
        const curr = getCurrencySymbol(stock.currency);
        const isPositive = stock.changePercent >= 0;
        const gradientId = `stockGrad-${stock.symbol}`;

        return (
          <Card key={stock.symbol}
            className={cn('group transition-all duration-200', dragOverIndex === index && 'ring-2 ring-accent ring-offset-2 ring-offset-background')}
            draggable
            onDragStart={(e) => { setDragIndex(index); e.dataTransfer.effectAllowed = 'move'; }}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverIndex(index); }}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={(e) => { e.preventDefault(); if (dragIndex !== null && dragIndex !== index) reorderStocks(dragIndex, index); setDragIndex(null); setDragOverIndex(null); }}
            onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-lg font-semibold">{stock.symbol}</h3>
                  {index === 0 && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-accent/10 text-accent">HOME</span>
                  )}
                  {stock.marketState && (
                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                      stock.marketState === 'REGULAR' ? 'bg-success-tint text-success' : 'bg-muted text-muted-foreground'
                    )}>
                      {stock.marketState === 'REGULAR' ? 'LIVE' : stock.marketState === 'PRE' ? 'PRE' : stock.marketState === 'POST' ? 'AFTER' : 'CLOSED'}
                    </span>
                  )}
                  <button onClick={() => handleRemoveStock(stock.symbol)}
                    className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100" title="Remove">
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold font-mono">{curr}{stock.currentPrice.toFixed(2)}</p>
                <div className="flex items-center gap-1 justify-end">
                  {isPositive ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownRight className="h-4 w-4 text-danger" />}
                  <span className={cn('text-sm font-medium', isPositive ? 'text-success' : 'text-danger')}>
                    {formatPercent(stock.changePercent)} ({curr}{Math.abs(stock.changeAmount).toFixed(2)})
                  </span>
                </div>
                {stock.previousClose && (
                  <p className="text-xs text-muted-foreground mt-0.5">Prev close: {curr}{stock.previousClose.toFixed(2)}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              {(['1D', '1W', '1M', '3M'] as const).map(range => (
                <button key={range} onClick={() => setTimeRange(range)}
                  className={cn('px-3 py-1.5 text-sm rounded-xl transition-colors',
                    timeRange === range ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}>{range}</button>
              ))}
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isPositive ? 'var(--success)' : 'var(--danger)'} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={isPositive ? 'var(--success)' : 'var(--danger)'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    tickFormatter={timeRange === '1D' ? (v: string) => v : formatShortDate} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    tickFormatter={(v) => `${curr}${v}`} />
                  <Tooltip content={<CustomTooltip formatter={(v: any) => `${curr}${Number(v).toFixed(2)}`} />} />
                  <Area type="linear" dataKey="price" name="Price"
                    stroke={isPositive ? 'var(--success)' : 'var(--danger)'}
                    fill={`url(#${gradientId})`}
                    strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        );
      })}
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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--accent-warm) 12%, transparent)' }}>
            <ChefHat className="h-5 w-5 text-accent-warm" />
          </div>
          <div>
            <h3 className="font-semibold">Padharo</h3>
            <p className="text-sm text-muted-foreground">Indian Restaurant, Southampton</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl bg-muted p-3">
            <p className="text-sm text-muted-foreground">Monthly retainer</p>
            <p className="text-lg font-semibold">{formatCurrency(1000)}</p>
            <p className="text-xs text-muted-foreground">(Jan-Mar rate)</p>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <p className="text-sm text-muted-foreground">Total invoiced</p>
            <p className="text-lg font-semibold">{formatCurrency(padharoTotal)}</p>
          </div>
          {padharoIG && (
            <div className="rounded-xl bg-muted p-3">
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
          <div className="w-10 h-10 rounded-xl bg-success-tint flex items-center justify-center">
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

// ==================== ENQUIRIES ====================

function EnquiriesSection() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [accounts, setAccounts] = useState<{ personal: boolean; professional: boolean }>({ personal: false, professional: false });

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
        if (data.accounts) setAccounts(data.accounts);
        setLastRefresh(new Date());
      }
    } catch (e) {
      console.error('Failed to fetch enquiries:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
    const interval = setInterval(fetchEnquiries, 60000);
    return () => clearInterval(interval);
  }, [fetchEnquiries]);

  const unreadCount = emails.filter(e => e.isUnread).length;

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6 animate-section-in">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold">Enquiries</h2>
          <p className="text-muted-foreground mt-1">Photography booking enquiries from Gmail</p>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <span className="text-xs text-muted-foreground">
              Updated {formatTimeAgo(lastRefresh.toISOString())}
            </span>
          )}
          <button
            onClick={() => { setLoading(true); fetchEnquiries(); }}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw className={cn("h-4 w-4 text-muted-foreground", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Account status */}
      <div className="flex items-center gap-3">
        <div className={cn("flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full", accounts.personal ? "bg-success-tint text-success" : "bg-muted text-muted-foreground")}>
          <span className={cn("w-1.5 h-1.5 rounded-full", accounts.personal ? "bg-success" : "bg-muted-foreground")} />
          rstanikk@gmail.com
        </div>
        <div className={cn("flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full", accounts.professional ? "bg-success-tint text-success" : "bg-muted text-muted-foreground")}>
          <span className={cn("w-1.5 h-1.5 rounded-full", accounts.professional ? "bg-success" : "bg-muted-foreground")} />
          photography@ryanstanikk.co.uk
        </div>
      </div>

      {/* Summary */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Card>
            <p className="text-sm text-muted-foreground">Total enquiries</p>
            <p className="text-2xl font-bold mt-1">{emails.length}</p>
            <p className="text-xs text-muted-foreground">Last 3 months</p>
          </Card>
          <Card>
            <p className="text-sm text-muted-foreground">Unread</p>
            <p className="text-2xl font-bold mt-1" style={{ color: unreadCount > 0 ? 'var(--accent)' : undefined }}>{unreadCount}</p>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </Card>
          <Card className="hidden sm:block">
            <p className="text-sm text-muted-foreground">Accounts</p>
            <p className="text-2xl font-bold mt-1">{(accounts.personal ? 1 : 0) + (accounts.professional ? 1 : 0)}</p>
            <p className="text-xs text-muted-foreground">Connected</p>
          </Card>
        </div>
      )}

      {/* Email list */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Enquiries</h3>
          {unreadCount > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-tint text-accent">
              {unreadCount} unread
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3 py-3 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No enquiries found</p>
            <p className="text-sm mt-1">Photography enquiries from the last 3 months will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {emails.map((email) => (
              <a
                key={email.id}
                href={email.gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex gap-3 py-3 px-1 -mx-1 rounded-lg transition-colors hover:bg-muted group",
                  email.isUnread && "bg-accent-tint/30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold mt-0.5",
                  email.isUnread
                    ? "bg-accent text-white"
                    : "bg-muted text-muted-foreground"
                )}>
                  {email.from.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm truncate", email.isUnread ? "font-semibold" : "font-medium")}>
                      {email.from}
                    </span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0",
                      email.account === 'professional'
                        ? "bg-accent-tint text-accent"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {email.account === 'professional' ? 'PRO' : 'PERSONAL'}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                      {formatTimeAgo(email.date)}
                    </span>
                  </div>
                  <p className={cn("text-sm truncate mt-0.5", email.isUnread ? "text-foreground" : "text-muted-foreground")}>
                    {email.subject}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {email.snippet}
                  </p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0" />
              </a>
            ))}
          </div>
        )}
      </Card>

      <InsightBox emoji="📧" text={
        emails.length > 0
          ? `${emails.length} photography enquir${emails.length === 1 ? 'y' : 'ies'} in the last 3 months.${unreadCount > 0 ? ` ${unreadCount} still unread — might be worth checking those.` : ' All caught up!'}`
          : 'No photography enquiries detected recently. Make sure your email accounts are connected above.'
      } />
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
  const [editMode, setEditMode] = useState(false);
  const { time: sidebarTime } = useLiveClock();
  const { showBanner, requestPermission, dismissBanner, notificationsEnabled, permission } = useEnquiryNotifications();

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section);
    setSectionKey(k => k + 1);
    setEditMode(false);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, [setActiveSection, setSidebarOpen]);

  // Reusable fetch functions for periodic refresh
  const refreshStocks = useCallback(() => {
    // Use persisted stock symbols (from localStorage) instead of hardcoded list
    const symbols = useDashboardStore.getState().stockSymbols;
    fetch(`/api/stocks?symbols=${symbols.join(',')}&hourly=true`).then(r => r.ok ? r.json() : null).then(d => {
      if (d?.stocks?.length > 0) setStocks(d.stocks);
    }).catch(() => {});
  }, [setStocks]);

  const refreshBookings = useCallback(() => {
    fetch('/api/bookings').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.live && d.events?.length > 0) setBookings(d.events);
    }).catch(() => {});
  }, [setBookings]);

  const refreshWeather = useCallback(() => {
    fetch('/api/weather').then(r => r.ok ? r.json() : null).then(d => { if (d) setWeather(d); }).catch(() => {});
  }, [setWeather]);

  useEffect(() => {
    setInvoices(demoInvoices);
    setIncomeEntries(demoIncomeEntries);
    setAnalytics(demoAnalytics);
    setInstagramAccounts(demoInstagramAccounts);
    setStocks(demoStocks);
    setBookings(demoBookings);
    setWeather({
      temp: 8, feelsLike: 5, description: 'partly cloudy', icon: 'clouds',
      humidity: 72, windSpeed: 14, forecast: [],
    });

    // Initial live data fetch
    refreshStocks();
    refreshBookings();
    refreshWeather();

    // Refresh everything every 60 seconds
    const stockInterval = setInterval(refreshStocks, 60000);
    const bookingInterval = setInterval(refreshBookings, 60000);
    const weatherInterval = setInterval(refreshWeather, 60000);

    return () => {
      clearInterval(stockInterval);
      clearInterval(bookingInterval);
      clearInterval(weatherInterval);
    };
  }, [setInvoices, setIncomeEntries, setAnalytics, setInstagramAccounts, setStocks, setBookings, setWeather, refreshStocks, refreshBookings, refreshWeather]);

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

      // Number keys 1-8: quick navigation
      const sections = ['overview', 'analytics', 'finances', 'instagram', 'bookings', 'stocks', 'enquiries', 'clients'];
      const num = parseInt(e.key);
      if (num >= 1 && num <= 8 && !e.metaKey && !e.ctrlKey && !e.altKey) {
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
      case 'overview': return <OverviewSection editMode={editMode} />;
      case 'analytics': return <AnalyticsSection />;
      case 'finances': return <FinancesSection />;
      case 'instagram': return <InstagramSection />;
      case 'bookings': return <BookingsSection />;
      case 'stocks': return <StocksSection />;
      case 'enquiries': return <EnquiriesSection />;
      case 'clients': return <ClientsSection />;
      default: return <OverviewSection editMode={editMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} onNavigate={handleNavigate} />

      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-muted">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <h1 className="font-semibold text-sm">Command Centre</h1>
        {activeSection === 'overview' ? (
          <button
            onClick={() => setEditMode(prev => !prev)}
            className={cn(
              'p-2 rounded-xl transition-colors',
              editMode ? 'bg-accent text-white' : 'hover:bg-muted text-muted-foreground'
            )}
            title={editMode ? 'Done editing' : 'Edit layout'}
          >
            {editMode ? <Check className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
          </button>
        ) : (
          <div className="w-9" />
        )}
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-60 bg-sidebar border-r border-sidebar-border transition-transform duration-200 lg:translate-x-0 overflow-y-auto flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="p-5 pt-4">
            <div className="hidden lg:flex justify-center mb-1 -mt-1">
              <img src="/funk.png" alt="Ryan Stanikk" className="w-40 h-auto object-contain drop-shadow-lg" />
            </div>
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
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors group',
                  activeSection === item.id ? 'bg-accent-tint text-accent' : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-hover'
                )}>
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'enquiries' && notificationsEnabled && (
                  <Bell className="h-3 w-3 text-accent opacity-60" />
                )}
                <kbd className="hidden group-hover:inline text-[10px] font-mono px-1 py-0.5 rounded bg-muted text-muted-foreground">{i + 1}</kbd>
              </button>
            ))}
          </nav>

          {/* Command palette trigger */}
          <div className="px-3 mb-2">
            <button onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-colors border border-border">
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
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            {showBanner && (
              <NotificationBanner onEnable={requestPermission} onDismiss={dismissBanner} />
            )}
            <div key={sectionKey}>
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
