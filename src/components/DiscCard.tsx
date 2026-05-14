import React from 'react';
import { Link } from 'react-router-dom';
import { Disc } from '../types';
import { DiscImage } from './DiscImage';
import { Globe } from 'lucide-react';
import { buildManufacturerLink } from '../utils/manufacturerLinks';
import { trackManufacturerClick } from '../utils/outboundAnalytics';
import { fetchManufacturers } from '../services/manufacturers';

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
  'Putter':          { chip: 'text-violet-300 bg-violet-500/10 border border-violet-500/25', abbr: 'PUT' },
  'Midrange':        { chip: 'text-blue-300   bg-blue-500/10   border border-blue-500/25',   abbr: 'MID' },
  'Fairway Driver':  { chip: 'text-teal-300   bg-teal-500/10   border border-teal-500/25',   abbr: 'FWY' },
  'Distance Driver': { chip: 'text-rose-300   bg-rose-500/10   border border-rose-500/25',   abbr: 'DST' },
};

// ─────────────────────────────────────────────────────────────────────────────
//  BRAND ACCENT — consistent per-manufacturer color identity
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Named manufacturer accents — these are stable and intentional, not random.
 * Matches the palette system in DiscImage.tsx.
 */
const BRAND_ACCENTS: Record<string, { text: string; line: string; hex: string }> = {
  innova:           { text: 'text-sky-400',     line: 'from-sky-500',     hex: '#0ea5e9' },
  discraft:         { text: 'text-red-400',      line: 'from-red-500',     hex: '#ef4444' },
  'dynamic discs':  { text: 'text-emerald-400',  line: 'from-emerald-500', hex: '#10b981' },
  'latitude 64':    { text: 'text-green-400',    line: 'from-green-500',   hex: '#22c55e' },
  'westside discs': { text: 'text-lime-400',     line: 'from-lime-500',    hex: '#84cc16' },
  mvp:              { text: 'text-cyan-400',     line: 'from-cyan-500',    hex: '#06b6d4' },
  axiom:            { text: 'text-purple-400',   line: 'from-purple-500',  hex: '#a855f7' },
  streamline:       { text: 'text-blue-300',     line: 'from-blue-400',    hex: '#38bdf8' },
  kastaplast:       { text: 'text-amber-400',    line: 'from-amber-500',   hex: '#f59e0b' },
  discmania:        { text: 'text-indigo-400',   line: 'from-indigo-500',  hex: '#6366f1' },
  prodigy:          { text: 'text-rose-400',     line: 'from-rose-500',    hex: '#f43f5e' },
  clash:            { text: 'text-orange-400',   line: 'from-orange-500',  hex: '#f97316' },
};

const FALLBACK_ACCENTS = [
  { text: 'text-indigo-400', line: 'from-indigo-500', hex: '#6366f1' },
  { text: 'text-violet-400', line: 'from-violet-500', hex: '#8b5cf6' },
  { text: 'text-blue-400',   line: 'from-blue-500',   hex: '#3b82f6' },
  { text: 'text-teal-400',   line: 'from-teal-500',   hex: '#14b8a6' },
  { text: 'text-emerald-400',line: 'from-emerald-500',hex: '#10b981' },
  { text: 'text-amber-400',  line: 'from-amber-500',  hex: '#f59e0b' },
  { text: 'text-rose-400',   line: 'from-rose-500',   hex: '#f43f5e' },
  { text: 'text-pink-400',   line: 'from-pink-500',   hex: '#ec4899' },
  { text: 'text-cyan-400',   line: 'from-cyan-500',   hex: '#06b6d4' },
  { text: 'text-orange-400', line: 'from-orange-500', hex: '#f97316' },
];

function brandHash(brand: string): number {
  let h = 0;
  for (let i = 0; i < brand.length; i++) h = (h * 31 + brand.charCodeAt(i)) & 0xffff;
  return h;
}

export function brandAccent(brand: string) {
  const key = brand.toLowerCase().trim();
  if (BRAND_ACCENTS[key]) return BRAND_ACCENTS[key];
  // Partial match
  for (const [k, v] of Object.entries(BRAND_ACCENTS)) {
    if (key.includes(k) || k.includes(key.split(' ')[0])) return v;
  }
  // Deterministic fallback
  return FALLBACK_ACCENTS[brandHash(brand) % FALLBACK_ACCENTS.length];
}

// ─────────────────────────────────────────────────────────────────────────────
//  FLIGHT NUMBER RING — single stat with arc progress
// ─────────────────────────────────────────────────────────────────────────────

interface StatRingProps {
  label: string;
  value: number;
  max: number;
  color: string;
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
        <StatRing label="Glide" value={glide}  max={7}  color="text-teal-400"   trackColor="text-teal-400"   />
        <StatRing label="Turn"  value={Math.abs(turn)} max={5} color={turn < 0 ? 'text-amber-400' : 'text-slate-500'} trackColor={turn < 0 ? 'text-amber-400' : 'text-slate-500'} />
        <StatRing label="Fade"  value={fade}   max={5}  color="text-rose-400"   trackColor="text-rose-400"   />
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
//  FLIGHT PATH ARC — overhead trajectory preview
//  Purely data-driven: turn pulls the apex left/right, fade determines the
//  end hook. Speed controls reach. Glide controls arc height.
// ─────────────────────────────────────────────────────────────────────────────

interface FlightPathProps {
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  accentHex: string;
}

export function FlightPathArc({ speed, glide, turn, fade, accentHex }: FlightPathProps) {
  // Normalize to a 200×48 canvas
  const W = 200;
  const H = 48;

  // Start: left-center
  const sx = 8;
  const sy = H / 2;

  // End: right side, displaced vertically by overstability
  const reach  = 20 + (speed / 14) * 140;   // how far right the disc travels
  const fadeY  = fade * 3.5;                 // downward finish (RHBH)
  const ex     = Math.min(sx + reach, W - 8);
  const ey     = sy + fadeY;

  // Apex: pulled by turn (negative = right, positive = left for RHBH)
  const apexX  = sx + (ex - sx) * 0.45;
  const turnLift = glide * 2.5;               // glide = air time = upward arc
  const turnDrift= turn * -3.5;               // turn < 0 → drifts right (understable)
  const apexY  = sy - turnLift;
  const apexDX = turnDrift;

  // SVG cubic bezier: start → CP1 (apex) → CP2 (fade setup) → end
  const cp1x = apexX + apexDX;
  const cp1y = apexY;
  const cp2x = ex - (ex - sx) * 0.18;
  const cp2y = ey - fadeY * 0.4;

  const d = `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: 36, overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`fp-${speed}-${turn}-${fade}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={accentHex} stopOpacity="0.6" />
          <stop offset="60%"  stopColor={accentHex} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f43f5e"   stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Path ghost (track) */}
      <path d={d} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="4" strokeLinecap="round" />

      {/* Main flight path */}
      <path
        d={d}
        fill="none"
        stroke={`url(#fp-${speed}-${turn}-${fade})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 2"
      />

      {/* Launch dot */}
      <circle cx={sx} cy={sy} r="3" fill={accentHex} fillOpacity="0.9" />

      {/* Landing dot */}
      <circle cx={ex} cy={ey} r="2.5" fill="#f43f5e" fillOpacity="0.85" />
    </svg>
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
  const [mfgWebsite, setMfgWebsite] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchManufacturers().then(mfgs => {
      const mfg = mfgs.find(m => m.name === disc.brand || m.shortName === disc.brand);
      if (mfg?.website) setMfgWebsite(mfg.website);
    });
  }, [disc.brand]);

  const stability = deriveStability(disc.turn, disc.fade, disc.stability);
  const stabCfg   = STABILITY_CONFIG[stability] ?? STABILITY_CONFIG['Neutral'];
  const catCfg    = CATEGORY_CONFIG[disc.category] ?? { chip: 'text-slate-400 bg-slate-500/10 border border-slate-500/25', abbr: '—' };
  const accent    = brandAccent(disc.brand);

  const bSlug = disc.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const dSlug = disc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const hasFlightData = disc.speed || disc.glide || disc.turn !== undefined || disc.fade;

  return (
    <Link
      to={`/disc/${bSlug}/${dSlug}`}
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
      {/* ── Manufacturer accent bar ── */}
      <div className={`h-[2px] w-full bg-gradient-to-r ${accent.line} via-transparent to-transparent opacity-80`} />

      {/* ── Card body ── */}
      <div className="flex flex-col gap-4 p-5">

        {/* ── Header: text + disc silhouette ── */}
        <div className="flex items-start justify-between gap-3">

          {/* Left: brand / name / badges */}
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${accent.text} truncate`}>
                {disc.brand}
              </p>
              <h3
                className="text-[1.35rem] font-black leading-none text-white truncate mt-1"
                style={{ fontFamily: "'Outfit', ui-sans-serif, system-ui" }}
              >
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

          {/* Right: disc silhouette — brand + category colored, never a photo */}
          <div className="relative w-[72px] h-[72px] shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-500 ease-out">
            <DiscImage
              name={disc.name}
              brand={disc.brand}
              category={disc.category}
              className="w-full h-full"
            />
          </div>
          
          {/* Outbound Manufacturer Link — separate from parent Link */}
          {mfgWebsite && (
            <a
              href={buildManufacturerLink({
                url: mfgWebsite,
                brandName: disc.brand,
                pageType: 'disc_detail', // Using disc_detail as default but contextually it's a card
                discSlug: disc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              })}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                trackManufacturerClick(disc.brand, mfgWebsite, 'listing_card');
                window.open(e.currentTarget.href, '_blank', 'noopener,noreferrer');
              }}
              className="absolute top-12 right-5 z-20 p-1.5 bg-slate-800/80 text-slate-400 hover:text-indigo-400 border border-slate-700/50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title={`Visit ${disc.brand} official site`}
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}
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

        {/* ── Flight path arc — data-driven trajectory preview ── */}
        {hasFlightData && (
          <div className="px-1">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-1">Flight Path</p>
            <FlightPathArc
              speed={disc.speed}
              glide={disc.glide}
              turn={disc.turn}
              fade={disc.fade}
              accentHex={accent.hex}
            />
          </div>
        )}

        {/* ── Description ── */}
        {disc.description && (
          <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-2">
            {disc.description}
          </p>
        )}

      </div>

      {/* ── Hover glow overlay (brand-colored) ── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 70% 10%, ${accent.hex}0d 0%, transparent 60%)`,
        }}
      />
    </Link>
  );
}
