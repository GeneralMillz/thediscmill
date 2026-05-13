import React from 'react';
import { Link } from 'react-router-dom';
import { Disc } from '../types';
import { DiscImage } from './DiscImage';

// ─────────────────────────────────────────────────────────────────────────────
//  STABILITY LOGIC
// ─────────────────────────────────────────────────────────────────────────────

export function deriveStability(turn: number, fade: number, stability?: string): string {
  if (stability) return stability;
  if (turn <= -4) return 'Very Understable';
  if (turn <= -2) return 'Understable';
  if (fade >= 4)  return 'Very Overstable';
  if (fade >= 3 && turn >= 0) return 'Overstable';
  if (fade >= 2 && turn >= 0) return 'Stable';
  if (turn <= -1) return 'Stable';
  return 'Neutral';
}

export const STABILITY_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; border: string }
> = {
  'Very Understable': { bg: 'bg-blue-50 dark:bg-blue-900/30',   text: 'text-blue-700 dark:text-blue-300',   dot: 'bg-blue-400',  border: 'border-blue-200 dark:border-blue-700' },
  'Understable':      { bg: 'bg-sky-50 dark:bg-sky-900/30',     text: 'text-sky-700 dark:text-sky-300',     dot: 'bg-sky-400',   border: 'border-sky-200 dark:border-sky-700' },
  'Neutral':          { bg: 'bg-gray-100 dark:bg-gray-700/50',  text: 'text-gray-600 dark:text-gray-300',   dot: 'bg-gray-400',  border: 'border-gray-200 dark:border-gray-600' },
  'Stable':           { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500', border: 'border-green-200 dark:border-green-700' },
  'Overstable':       { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500', border: 'border-amber-200 dark:border-amber-700' },
  'Very Overstable':  { bg: 'bg-red-50 dark:bg-red-900/30',     text: 'text-red-700 dark:text-red-300',     dot: 'bg-red-500',   border: 'border-red-200 dark:border-red-700' },
};

// ─────────────────────────────────────────────────────────────────────────────
//  CATEGORY BADGES
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<string, { color: string; bg: string }> = {
  'Putter':          { color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-900/30' },
  'Midrange':        { color: 'text-blue-700 dark:text-blue-300',     bg: 'bg-blue-50 dark:bg-blue-900/30' },
  'Fairway Driver':  { color: 'text-teal-700 dark:text-teal-300',     bg: 'bg-teal-50 dark:bg-teal-900/30' },
  'Distance Driver': { color: 'text-rose-700 dark:text-rose-300',     bg: 'bg-rose-50 dark:bg-rose-900/30' },
};

// ─────────────────────────────────────────────────────────────────────────────
//  BRAND COLOR HASH
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_PALETTES = [
  'text-indigo-600', 'text-violet-600', 'text-blue-600',
  'text-teal-600',   'text-emerald-600','text-amber-600',
  'text-rose-600',   'text-pink-600',   'text-cyan-600', 'text-orange-600',
];

const BRAND_BG_PALETTES = [
  'bg-indigo-500', 'bg-violet-500', 'bg-blue-500',
  'bg-teal-500',   'bg-emerald-500','bg-amber-500',
  'bg-rose-500',   'bg-pink-500',   'bg-cyan-500', 'bg-orange-500',
];

function brandHash(brand: string): number {
  let h = 0;
  for (let i = 0; i < brand.length; i++) h = (h * 31 + brand.charCodeAt(i)) & 0xffff;
  return h;
}

export function brandColor(brand: string): string {
  return BRAND_PALETTES[brandHash(brand) % BRAND_PALETTES.length];
}

export function brandBgColor(brand: string): string {
  return BRAND_BG_PALETTES[brandHash(brand) % BRAND_BG_PALETTES.length];
}

// ─────────────────────────────────────────────────────────────────────────────
//  FLIGHT BAR HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function speedPct(v: number) { return Math.min(100, (v / 14) * 100); }
function glidePct(v: number) { return Math.min(100, (v / 7)  * 100); }
function turnPct(v: number)  { return Math.min(100, (Math.abs(v) / 5) * 100); }
function fadePct(v: number)  { return Math.min(100, (v / 5)  * 100); }

// ─────────────────────────────────────────────────────────────────────────────
//  FLIGHT BARS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface FlightBarsProps {
  speed: number;
  glide: number;
  turn: number;
  fade: number;
}

export function FlightBars({ speed, glide, turn, fade }: FlightBarsProps) {
  const bars = [
    { label: 'Spd', value: speed, pct: speedPct(speed), color: 'bg-indigo-500' },
    { label: 'Gld', value: glide, pct: glidePct(glide), color: 'bg-teal-500' },
    { label: 'Trn', value: turn,  pct: turnPct(turn),   color: turn < 0 ? 'bg-amber-400' : 'bg-gray-300 dark:bg-gray-500' },
    { label: 'Fde', value: fade,  pct: fadePct(fade),   color: 'bg-rose-500' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700 rounded-2xl p-3 grid grid-cols-4 gap-3">
      {bars.map(({ label, value, pct, color }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
          <span className="text-sm font-black text-gray-900 dark:text-white tabular-nums">{value}</span>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  DISC CARD (THE MAIN COMPONENT)
// ─────────────────────────────────────────────────────────────────────────────

interface DiscCardProps {
  disc: Disc;
  className?: string;
}

export function DiscCard({ disc, className = '' }: DiscCardProps) {
  const stability = deriveStability(disc.turn, disc.fade, disc.stability);
  const stabCfg   = STABILITY_CONFIG[stability] ?? STABILITY_CONFIG['Neutral'];
  const catCfg    = CATEGORY_CONFIG[disc.category] ?? { color: 'text-gray-600 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-700/50' };
  const bColor    = brandColor(disc.brand);
  const bBgColor  = brandBgColor(disc.brand);

  const brandSlug = disc.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const discSlug = disc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <Link
      to={`/disc/${brandSlug}/${discSlug}`}
      className={`
        group relative bg-white dark:bg-gray-800
        rounded-3xl p-6 overflow-hidden
        border border-gray-300 dark:border-gray-700
        shadow-sm hover:shadow-xl
        hover:-translate-y-[2px]
        transition-all duration-300 flex flex-col gap-5
        ${className}
      `}
    >
      {/* Brand accent line */}
      <div className={`absolute top-0 left-0 w-full h-[3px] ${bBgColor}`} />

      {/* Header layout */}
      <div className="flex items-start justify-between gap-4 mt-1">
        {/* Text Side */}
        <div className="min-w-0 flex-1">
          <p className={`text-[11px] font-black uppercase tracking-widest truncate ${bColor}`}>
            {disc.brand}
          </p>
          <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mt-1 truncate">{disc.name}</h3>
          
          <div className="flex items-center gap-2 mt-2">
            <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md ${catCfg.bg} ${catCfg.color}`}>
              {disc.category || '—'}
            </span>
          </div>
        </div>

        {/* Image Side - Placed beautifully on the right */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 ease-out z-10">
          <DiscImage 
            src={disc.image} 
            name={disc.name} 
            brand={disc.brand} 
            className="w-full h-full" 
          />
        </div>
      </div>

      {/* Stability badge */}
      <div className="flex items-center gap-2">
        <span className={`
          inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full
          ${stabCfg.bg} ${stabCfg.text} border ${stabCfg.border}
        `}>
          <span className={`w-1.5 h-1.5 rounded-full ${stabCfg.dot}`} />
          {stability}
        </span>
      </div>

      {/* Flight bars */}
      {(disc.speed || disc.glide || disc.turn || disc.fade) ? (
        <FlightBars speed={disc.speed} glide={disc.glide} turn={disc.turn} fade={disc.fade} />
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">Flight data pending</p>
      )}

      {/* Description */}
      {disc.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
          {disc.description}
        </p>
      )}
    </Link>
  );
}
