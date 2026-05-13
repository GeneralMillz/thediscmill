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
  if (fade >= 4) return 'Very Overstable';
  if (fade >= 3 && turn >= 0) return 'Overstable';
  if (fade >= 2 && turn >= 0) return 'Stable';
  if (turn <= -1) return 'Stable';
  return 'Neutral';
}

// ─────────────────────────────────────────────────────────────────────────────
//  STABILITY CONFIG  — refined dark-mode-first tokens
// ─────────────────────────────────────────────────────────────────────────────

export const STABILITY_CONFIG: Record<
  string,
  { pill: string; glow: string; label: string }
> = {
  'Very Understable': {
    pill: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.25)]',
    label: '← Very Understable',
  },
  'Understable': {
    pill: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    glow: 'shadow-[0_0_12px_rgba(14,165,233,0.2)]',
    label: '← Understable',
  },
  'Neutral': {
    pill: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
    glow: '',
    label: '◆ Neutral',
  },
  'Stable': {
    pill: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    label: '◆ Stable',
  },
  'Overstable': {
    pill: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    label: '→ Overstable',
  },
  'Very Overstable': {
    pill: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.25)]',
    label: '→ Very Overstable',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  CATEGORY CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<string, { chip: string; abbr: string }> = {
  'Putter': { chip: 'text-violet-300 bg-violet-500/10 border border-violet-500/25', abbr: 'PUT' },
  'Midrange': { chip: 'text-blue-300   bg-blue-500/10   border border-blue-500/25', abbr: 'MID' },
  'Fairway Driver': { chip: 'text-teal-300   bg-teal-500/10   border border-teal-500/25', abbr: 'FWY' },
  'Distance Driver': { chip: 'text-rose-300   bg-rose-500/10   border border-rose-500/25', abbr: 'DST' },
};

// ─────────────────────────────────────────────────────────────────────────────
//  BRAND COLOR HASH
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT_COLORS = [
  { text: 'text-indigo-400', line: 'from-indigo-500', hex: '#6366f1' },
  { text: 'text-violet-400', line: 'from-violet-500', hex: '#8b5cf6' },
  { text: 'text-blue-400', line: 'from-blue-500', hex: '#3b82f6' },
  { text: 'text-teal-400', line: 'from-teal-500', hex: '#14b8a6' },
  { text: 'text-emerald-400', line: 'from-emerald-500', hex: '#10b981' },
  { text: 'text-amber-400', line: 'from-amber-500', hex: '#f59e0b' },
  { text: 'text-rose-400', line: 'from-rose-500', hex: '#f43f5e' },
  { text: 'text-pink-400', line: 'from-pink-500', hex: '#ec4899' },
  { text: 'text-cyan-400', line: 'from-cyan-500', hex: '#06b6d4' },
  { text: 'text-orange-400', line: 'from-orange-500', hex: '#f97316' },
];

function brandHash(brand: string): number {
  let h = 0;
  for (let i = 0; i < brand.length; i++) h = (h * 31 + brand.charCodeAt(i)) & 0xffff;
  return h;
}

export function brandAccent(brand: string) {
  return ACCENT_COLORS[brandHash(brand) % ACCENT_COLORS.length];
}

// ─────────────────────────────────────────────────────────────────────────────
//  FLIGHT NUMBER RING — single stat with arc progress
// ─────────────────────────────────────────────────────────────────────────────

interface StatRingProps {
  label: string;
  value: number;
  max: number;
  color: string;   // tailwind text color
  trackColor: string;
}

function StatRing({ label, value, max, color, trackColor }: StatRingProps) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, value < 0 ? Math.abs(value) / max : value / max));
  const dash = pct * circ;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="3.5" className={trackColor} strokeOpacity="0.15" />
          {/* Progress */}
          <circle
            cx="22" cy="22" r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            className={color}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-black tabular-nums ${color}`}>
          {value}
        </span>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  FLIGHT STATS GRID
// ─────────────────────────────────────────────────────────────────────────────

interface FlightStatsProps {
  speed: number;
  glide: number;
  turn: number;
  fade: number;
}

export function FlightStats({ speed, glide, turn, fade }: FlightStatsProps) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-4">
      {/* Ring row */}
      <div className="flex justify-around items-end mb-4">
        <StatRing label="Speed" value={speed} max={14} color="text-indigo-400" trackColor="text-indigo-400" />
        <StatRing label="Glide" value={glide} max={7} color="text-teal-400" trackColor="text-teal-400" />
        <StatRing label="Turn" value={Math.abs(turn)} max={5} color={turn < 0 ? 'text-amber-400' : 'text-slate-500'} trackColor={turn < 0 ? 'text-amber-400' : 'text-slate-500'} />
        <StatRing label="Fade" value={fade} max={5} color="text-rose-400" trackColor="text-rose-400" />
      </div>

      {/* Raw number strip */}
      <div className="flex items-center justify-center gap-1 text-[11px] font-black tabular-nums tracking-tight">
        <span className="text-indigo-400">{speed}</span>
        <span className="text-slate-600 font-normal px-0.5">│</span>
        <span className="text-teal-400">{glide}</span>
        <span className="text-slate-600 font-normal px-0.5">│</span>
        <span className={turn < 0 ? 'text-amber-400' : 'text-slate-500'}>{turn}</span>
        <span className="text-slate-600 font-normal px-0.5">│</span>
        <span className="text-rose-400">{fade}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  DISC CARD
// ─────────────────────────────────────────────────────────────────────────────

interface DiscCardProps {
  disc: Disc;
  className?: string;
}

export function DiscCard({ disc, className = '' }: DiscCardProps) {
  const stability = deriveStability(disc.turn, disc.fade, disc.stability);
  const stabCfg = STABILITY_CONFIG[stability] ?? STABILITY_CONFIG['Neutral'];
  const catCfg = CATEGORY_CONFIG[disc.category] ?? { chip: 'text-slate-400 bg-slate-500/10 border border-slate-500/25', abbr: '—' };
  const accent = brandAccent(disc.brand);

  const brandSlug = disc.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const discSlug = disc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const hasFlightData = disc.speed || disc.glide || disc.turn || disc.fade;

  return (
    <Link
      to={`/disc/${brandSlug}/${discSlug}`}
      className={`
        group relative flex flex-col gap-0 overflow-hidden
        rounded-2xl
        bg-slate-900
        border border-slate-700/60
        shadow-lg
        hover:shadow-2xl hover:border-slate-600/80
        hover:-translate-y-1
        transition-all duration-300
        ${className}
      `}
      style={{
        background: 'linear-gradient(160deg, rgb(15,23,42) 0%, rgb(17,24,39) 60%, rgb(15,23,42) 100%)',
      }}
    >
      {/* ── Accent top bar ── */}
      <div className={`h-[2px] w-full bg-gradient-to-r ${accent.line} via-transparent to-transparent opacity-80`} />

      {/* ── Card body ── */}
      <div className="flex flex-col gap-4 p-5">

        {/* ── Header: text + disc ── */}
        <div className="flex items-start justify-between gap-3">

          {/* Left: brand / name / badges */}
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${accent.text} truncate`}>
                {disc.brand}
              </p>
              <h3 className="text-[1.35rem] font-black leading-none text-white truncate mt-1"
                style={{ fontFamily: "'Outfit', ui-sans-serif, system-ui" }}>
                {disc.name}
              </h3>
            </div>

            {/* Badge row */}
            <div className="flex items-center gap-2 flex-wrap">
              {disc.category && (
                <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md ${catCfg.chip}`}>
                  {disc.category}
                </span>
              )}
              <span className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-full ${stabCfg.pill} ${stabCfg.glow}`}>
                {stabCfg.label}
              </span>
            </div>
          </div>

          {/* Right: spinning disc */}
          <div className="relative w-[72px] h-[72px] shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-500 ease-out">
            <DiscImage
              src={disc.image}
              name={disc.name}
              brand={disc.brand}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {/* ── Flight stats ── */}
        {hasFlightData ? (
          <FlightStats speed={disc.speed} glide={disc.glide} turn={disc.turn} fade={disc.fade} />
        ) : (
          <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-slate-800/50 border border-slate-700/40">
            <span className="text-slate-600 text-xs">●</span>
            <p className="text-xs text-slate-500 italic">Flight data pending</p>
          </div>
        )}

        {/* ── Description ── */}
        {disc.description && (
          <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-2">
            {disc.description}
          </p>
        )}

      </div>

      {/* ── Hover glow overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 70% 10%, ${accent.hex}0d 0%, transparent 60%)`,
        }}
      />
    </Link>
  );
}
