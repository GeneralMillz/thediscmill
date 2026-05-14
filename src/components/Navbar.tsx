import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Disc, Map as MapIcon, Users, Calendar,
  BookOpen, ShoppingBag, Home, Shield,
  Newspaper, ChevronRight, X, Sun, Moon,
} from 'lucide-react';
import { cn } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

// ─── Route definitions ────────────────────────────────────────────────────────

// Order: Home > Discs > Courses > Gear > Events > Players > Return > Blog
const NAV_ITEMS = [
  { name: 'Home', path: '/', icon: Home, desc: 'Start here' },
  { name: 'Discs', path: '/discs', icon: Disc, desc: '10k+ PDGA discs' },
  { name: 'Courses', path: '/courses', icon: MapIcon, desc: 'National directory' },
  { name: 'Gear Hub', path: '/gear', icon: ShoppingBag, desc: 'Build your perfect bag' },
  { name: 'Events', path: '/events', icon: Calendar, desc: 'Live tournaments' },
  { name: 'Players', path: '/players', icon: Users, desc: 'PDGA player search' },
  { name: 'Return', path: '/disc-return', icon: Shield, desc: 'Lost disc network' },
  { name: 'Blog', path: '/blog', icon: Newspaper, desc: 'Daily intel' },
] as const;

// Mobile bottom bar: first 4 primary + overflow drawer for the rest
const MOBILE_PRIMARY = NAV_ITEMS.slice(0, 4);
const MOBILE_OVERFLOW = NAV_ITEMS.slice(4);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActive(path: string, current: string) {
  return path === '/' ? current === '/' : current.startsWith(path);
}

// ─── Desktop nav link ─────────────────────────────────────────────────────────

function DesktopLink({ item, current }: { item: typeof NAV_ITEMS[number]; current: string }) {
  const Icon = item.icon;
  const active = isActive(item.path, current);

  return (
    <Link
      to={item.path}
      className={cn(
        'relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-150 whitespace-nowrap',
        active
          ? 'text-white'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
      )}
    >
      {active && (
        <motion.span
          layoutId="desktop-pill"
          className="absolute inset-0 rounded-xl bg-indigo-600/90"
          style={{ zIndex: -1 }}
          transition={{ type: 'spring', damping: 26, stiffness: 380 }}
        />
      )}
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {item.name}
    </Link>
  );
}

// ─── Mobile nav item ──────────────────────────────────────────────────────────

function MobileNavItem({ item, current }: { item: typeof NAV_ITEMS[number]; current: string }) {
  const Icon = item.icon;
  const active = isActive(item.path, current);

  return (
    <Link
      to={item.path}
      className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-[56px] group"
    >
      {active && (
        <motion.span
          layoutId="mobile-indicator"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-indigo-500"
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
        />
      )}
      <div className={cn(
        'w-9 h-6 flex items-center justify-center rounded-lg transition-all duration-200',
        active ? 'bg-indigo-500/20' : 'group-hover:bg-slate-800/60'
      )}>
        <Icon className={cn(
          'w-[18px] h-[18px] transition-all duration-200',
          active ? 'text-indigo-400 scale-110' : 'text-slate-500 group-hover:text-slate-300'
        )} />
      </div>
      <span className={cn(
        'text-[10px] font-bold leading-none tracking-wide transition-colors duration-200',
        active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
      )}>
        {item.name}
      </span>
    </Link>
  );
}

// ─── Overflow drawer (mobile) ─────────────────────────────────────────────────

function OverflowDrawer({
  open, onClose, current, toggleTheme, theme,
}: {
  open: boolean;
  onClose: () => void;
  current: string;
  toggleTheme: () => void;
  theme: 'dark' | 'light';
}) {
  // Close on route change
  useEffect(() => { if (open) onClose(); }, [current]);

  // Trap scroll behind drawer
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px] lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="More navigation"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 360 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-safe rounded-t-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #0f172a 0%, #0c1222 100%)',
              borderTop: '1px solid rgba(148,163,184,0.12)',
            }}
          >
            {/* Handle + header */}
            <div className="flex justify-center pt-3">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <span className="font-black text-base text-slate-100"
                style={{ fontFamily: "'Outfit', system-ui" }}>
                More
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Accent bar */}
            <div className="h-px mx-5 mb-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.15), transparent)' }} />

            {/* Items */}
            <div className="px-4 pb-4 space-y-1">
              {MOBILE_OVERFLOW.map(item => {
                const Icon = item.icon;
                const active = isActive(item.path, current);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-150',
                      active
                        ? 'bg-indigo-600/20 border border-indigo-500/30'
                        : 'hover:bg-slate-800/60 border border-transparent'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn('font-bold text-sm', active ? 'text-indigo-300' : 'text-slate-200')}>
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{item.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                  </Link>
                );
              })}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl border border-transparent hover:bg-slate-800/60 transition-all duration-150"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  {theme === 'dark'
                    ? <Sun className="w-5 h-5 text-amber-400" />
                    : <Moon className="w-5 h-5 text-indigo-400" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-sm text-slate-200">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </div>
                  <div className="text-[11px] text-slate-500">Switch appearance</div>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

interface NavbarProps {
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export function Navbar({ theme = 'dark', toggleTheme = () => { } }: NavbarProps) {
  const location = useLocation();
  const current = location.pathname;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Elevate desktop nav on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const overflowActive = MOBILE_OVERFLOW.some(item => isActive(item.path, current));

  return (
    <>
      {/* ── Desktop top nav ──────────────────────────────────────────────────── */}
      <nav
        className={cn(
          'hidden lg:flex fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-300',
        )}
        style={{
          background: scrolled
            ? 'rgba(5,8,16,0.92)'
            : 'rgba(5,8,16,0.75)',
          borderBottom: '1px solid rgba(148,163,184,0.09)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between w-full gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 0 14px rgba(99,102,241,0.45)',
              }}
            >
              <Disc className="text-white w-4 h-4" />
            </div>
            <span
              className="font-black text-[17px] tracking-tight text-white"
              style={{ fontFamily: "'Outfit', system-ui" }}
            >
              The Disc Mill
            </span>
          </Link>

          {/* Nav links — scrollable strip on medium desktops */}
          <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar flex-1 justify-center">
            {NAV_ITEMS.map(item => (
              <DesktopLink key={item.path} item={item} current={current} />
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all duration-150"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Subtle accent line under nav */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.35) 50%, transparent 100%)' }}
        />
      </nav>

      {/* ── Mobile bottom nav ────────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-safe"
        style={{
          background: 'rgba(5,8,16,0.97)',
          borderTop: '1px solid rgba(148,163,184,0.1)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Subtle top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.3) 50%, transparent 100%)' }}
        />

        <div className="flex items-stretch">
          {MOBILE_PRIMARY.map(item => (
            <MobileNavItem key={item.path} item={item} current={current} />
          ))}

          {/* More button */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="More navigation options"
            className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-[56px] group"
          >
            {overflowActive && (
              <motion.span
                layoutId="mobile-indicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-indigo-500"
                transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              />
            )}
            <div className={cn(
              'w-9 h-6 flex items-center justify-center rounded-lg transition-all duration-200',
              overflowActive ? 'bg-indigo-500/20' : 'group-hover:bg-slate-800/60'
            )}>
              {/* Animated 3-dot grid → X when open */}
              <span className={cn(
                'transition-colors duration-200',
                overflowActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
              )}>
                {drawerOpen
                  ? <X className="w-[18px] h-[18px]" />
                  : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="5" cy="9" r="1.5" fill="currentColor" />
                      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                      <circle cx="13" cy="9" r="1.5" fill="currentColor" />
                    </svg>
                  )
                }
              </span>
            </div>
            <span className={cn(
              'text-[10px] font-bold leading-none tracking-wide transition-colors duration-200',
              overflowActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
            )}>
              More
            </span>
          </button>
        </div>
      </nav>

      {/* ── Overflow drawer ───────────────────────────────────────────────────── */}
      <OverflowDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        current={current}
        toggleTheme={toggleTheme}
        theme={theme}
      />
    </>
  );
}