import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Disc, Map as MapIcon, Users, Calendar, Activity,
  BookOpen, ShoppingBag, Home, Sun, Moon, Shield,
  MoreHorizontal, X, ChevronRight
} from 'lucide-react';
import { cn } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

// ─── Route definitions ────────────────────────────────────────────────────────

const PRIMARY_NAV = [
  { name: 'Home',    path: '/',            icon: Home,        desc: 'Start here' },
  { name: 'Discs',   path: '/discs',       icon: Disc,        desc: '10k+ PDGA discs' },
  { name: 'Courses', path: '/courses',     icon: MapIcon,     desc: 'National directory' },
  { name: 'Return',  path: '/disc-return', icon: Shield,      desc: 'Lost disc network' },
];

const MORE_NAV = [
  { name: 'Bag Builder',  path: '/bag-builder', icon: ShoppingBag, desc: 'Build your perfect bag' },
  { name: 'Players',      path: '/players',     icon: Users,       desc: 'PDGA player search' },
  { name: 'Events',       path: '/events',      icon: Calendar,    desc: 'Live tournaments' },
  { name: 'Guides',       path: '/guides',      icon: BookOpen,    desc: 'Gear reviews & tips' },
  { name: 'Live Audit',   path: '/audit',       icon: Activity,    desc: 'Data health dashboard' },
];

const ALL_NAV = [...PRIMARY_NAV, ...MORE_NAV];

// ─── Desktop nav link ─────────────────────────────────────────────────────────

function DesktopNavLink({ item, isActive, theme }: {
  item: typeof ALL_NAV[number];
  isActive: boolean;
  theme: string;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
          : theme === 'dark'
            ? 'text-gray-300 hover:bg-gray-800 hover:text-white active:bg-gray-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {item.name}
    </Link>
  );
}

// ─── Mobile bottom nav item ───────────────────────────────────────────────────

function MobileNavItem({ item, isActive, theme }: {
  item: typeof PRIMARY_NAV[number];
  isActive: boolean;
  theme: string;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      className="flex flex-col items-center justify-center gap-1 min-w-0 flex-1 py-2 px-1 relative"
      style={{ minHeight: 56 }} // 44pt touch target
    >
      <div className={cn(
        'flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200',
        isActive
          ? 'bg-indigo-100'
          : 'bg-transparent'
      )}>
        <Icon className={cn(
          'w-5 h-5 transition-all duration-200',
          isActive
            ? 'text-indigo-600 scale-110'
            : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        )} />
      </div>
      <span className={cn(
        'text-[10px] font-semibold leading-none truncate transition-colors duration-200',
        isActive
          ? 'text-indigo-600'
          : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      )}>
        {item.name}
      </span>
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full"
        />
      )}
    </Link>
  );
}

// ─── More drawer ──────────────────────────────────────────────────────────────

function MoreDrawer({ open, onClose, theme, toggleTheme, location }: {
  open: boolean;
  onClose: () => void;
  theme: string;
  toggleTheme: () => void;
  location: string;
}) {
  // Close on route change
  useEffect(() => { if (open) onClose(); }, [location]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl lg:hidden',
              'pb-safe',
              theme === 'dark' ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-100'
            )}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className={cn('w-10 h-1 rounded-full', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200')} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-3">
              <span className={cn('font-bold text-base', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                More
              </span>
              <button
                onClick={onClose}
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
                  theme === 'dark' ? 'bg-gray-800 text-gray-200 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'
                )}
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="px-4 pb-4 space-y-1">
              {MORE_NAV.map(item => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all',
                      isActive
                        ? theme === 'dark' ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                        : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 active:bg-gray-700' : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-500'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className={cn('text-xs truncate', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                        {item.desc}
                      </div>
                    </div>
                    <ChevronRight className={cn('w-4 h-4 shrink-0', theme === 'dark' ? 'text-gray-600' : 'text-gray-300')} />
                  </Link>
                );
              })}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all',
                  theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 active:bg-gray-700' : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  theme === 'dark' ? 'bg-gray-800 text-amber-400' : 'bg-gray-100 text-indigo-500'
                )}>
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
                  <div className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                    Switch appearance
                  </div>
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
  theme: string;
  toggleTheme: () => void;
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = MORE_NAV.some(item => item.path === location.pathname);

  return (
    <>
      {/* ── Desktop top nav ──────────────────────────────────────────────────── */}
      <nav className={cn(
        'hidden lg:flex fixed top-0 left-0 right-0 z-50 h-16 border-b transition-colors duration-300',
        theme === 'dark'
          ? 'bg-gray-900/95 backdrop-blur border-gray-800'
          : 'bg-white/95 backdrop-blur border-gray-200 shadow-sm'
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <Disc className="text-white w-4.5 h-4.5" />
            </div>
            <span className={cn(
              'font-black text-lg tracking-tight',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              The Disc Mill
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {ALL_NAV.map(item => (
              <React.Fragment key={item.path}>
                <DesktopNavLink
                  item={item}
                  isActive={location.pathname === item.path}
                  theme={theme}
                />
              </React.Fragment>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150',
              theme === 'dark'
                ? 'bg-gray-800 text-amber-400 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile bottom nav (5 items max) ─────────────────────────────────── */}
      <nav className={cn(
        'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
        'border-t pb-safe',
        theme === 'dark'
          ? 'bg-gray-900/98 backdrop-blur border-gray-800'
          : 'bg-white/98 backdrop-blur border-gray-200 shadow-[0_-1px_12px_rgba(0,0,0,0.06)]'
      )}>
        <div className="flex items-stretch">
          {PRIMARY_NAV.map(item => (
            <React.Fragment key={item.path}>
              <MobileNavItem
                item={item}
                isActive={location.pathname === item.path}
                theme={theme}
              />
            </React.Fragment>
          ))}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center gap-1 min-w-0 flex-1 py-2 px-1"
            style={{ minHeight: 56 }}
            aria-label="More navigation options"
          >
            <div className={cn(
              'flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200',
              isMoreActive ? 'bg-indigo-100' : 'bg-transparent'
            )}>
              <MoreHorizontal className={cn(
                'w-5 h-5 transition-colors duration-200',
                isMoreActive
                  ? 'text-indigo-600'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )} />
            </div>
            <span className={cn(
              'text-[10px] font-semibold leading-none',
              isMoreActive
                ? 'text-indigo-600'
                : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              More
            </span>
          </button>
        </div>
      </nav>

      {/* ── More drawer ──────────────────────────────────────────────────────── */}
      <MoreDrawer
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        location={location.pathname}
      />
    </>
  );
}
