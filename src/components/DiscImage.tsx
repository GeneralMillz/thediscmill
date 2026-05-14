import React from 'react';
import { cn } from '../utils';

interface DiscImageProps {
  src?: string;
  name: string;
  brand: string;
  category?: string;
  className?: string;
  alt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  MANUFACTURER ACCENT PALETTES
//  Deterministic per-brand colors. No random. No photos.
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_PALETTES: Record<string, { a: string; b: string; c: string }> = {
  // Innova — teal / blue
  innova:          { a: '#0ea5e9', b: '#0284c7', c: '#06b6d4' },
  // Discraft — red / orange
  discraft:        { a: '#ef4444', b: '#f97316', c: '#dc2626' },
  // Dynamic Discs / Latitude 64 / Westside (Trilogy family) — green / emerald
  'dynamic discs': { a: '#10b981', b: '#059669', c: '#34d399' },
  'latitude 64':   { a: '#22c55e', b: '#16a34a', c: '#4ade80' },
  'westside discs':{ a: '#84cc16', b: '#65a30d', c: '#a3e635' },
  // MVP / Axiom / Streamline (MVP family) — cyan / violet
  mvp:             { a: '#06b6d4', b: '#8b5cf6', c: '#22d3ee' },
  axiom:           { a: '#a855f7', b: '#06b6d4', c: '#d946ef' },
  streamline:      { a: '#38bdf8', b: '#818cf8', c: '#67e8f9' },
  // Kastaplast — amber / gold
  kastaplast:      { a: '#f59e0b', b: '#d97706', c: '#fbbf24' },
  // Discmania — indigo / blue
  discmania:       { a: '#6366f1', b: '#4f46e5', c: '#818cf8' },
  // Prodigy — rose / pink
  prodigy:         { a: '#f43f5e', b: '#ec4899', c: '#fb7185' },
  // Vibram — olive / lime
  vibram:          { a: '#84cc16', b: '#4d7c0f', c: '#a3e635' },
  // Birdie / Clash / Dino
  clash:           { a: '#f97316', b: '#ea580c', c: '#fb923c' },
  birdie:          { a: '#22c55e', b: '#15803d', c: '#86efac' },
  // Default fallback
  _default:        { a: '#6366f1', b: '#8b5cf6', c: '#818cf8' },
};

function getBrandPalette(brand: string) {
  const key = brand.toLowerCase().trim();
  // Exact match first
  if (BRAND_PALETTES[key]) return BRAND_PALETTES[key];
  // Partial match
  for (const [k, v] of Object.entries(BRAND_PALETTES)) {
    if (k !== '_default' && (key.includes(k) || k.includes(key.split(' ')[0]))) return v;
  }
  // Hash fallback into default-ish hues so it's still deterministic
  let h = 0;
  for (let i = 0; i < brand.length; i++) h = (h * 31 + brand.charCodeAt(i)) & 0xffff;
  const hue = (h * 137) % 360;
  const a = `hsl(${hue}, 70%, 55%)`;
  const b = `hsl(${(hue + 30) % 360}, 65%, 50%)`;
  const c = `hsl(${(hue + 60) % 360}, 75%, 60%)`;
  return { a, b, c };
}

// ─────────────────────────────────────────────────────────────────────────────
//  DISC SILHOUETTE — category-based cross-section profile
// ─────────────────────────────────────────────────────────────────────────────
//  All rendered as top-down view: outer disc body (ovoid) + rim + flight plate.
//  Category changes the dome height and rim width — data-driven, not decorative.

type DiscProfile = {
  /** Outer radius of the full disc */
  outerR: number;
  /** Rim width as fraction of outerR */
  rimFrac: number;
  /** Flight plate radius as fraction of outerR */
  plateR: number;
  /** Dome height exaggeration for the groove rings */
  grooveCount: number;
};

const DISC_PROFILES: Record<string, DiscProfile> = {
  'Putter':          { outerR: 54, rimFrac: 0.12, plateR: 0.60, grooveCount: 2 },
  'Midrange':        { outerR: 55, rimFrac: 0.14, plateR: 0.58, grooveCount: 3 },
  'Fairway Driver':  { outerR: 56, rimFrac: 0.20, plateR: 0.52, grooveCount: 3 },
  'Distance Driver': { outerR: 57, rimFrac: 0.26, plateR: 0.46, grooveCount: 4 },
  _default:          { outerR: 55, rimFrac: 0.16, plateR: 0.55, grooveCount: 3 },
};

function getProfile(category?: string): DiscProfile {
  if (category && DISC_PROFILES[category]) return DISC_PROFILES[category];
  return DISC_PROFILES._default;
}

// ─────────────────────────────────────────────────────────────────────────────
//  DISC IMAGE  — deterministic SVG, never a real photo
// ─────────────────────────────────────────────────────────────────────────────

export function DiscImage({ src: _src, name, brand, category, className, alt }: DiscImageProps) {
  const palette  = getBrandPalette(brand);
  const profile  = getProfile(category);
  const uid      = `disc-${(name + brand + (category ?? '')).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24)}`;
  const initial  = name ? name.charAt(0).toUpperCase() : '?';

  const cx = 60;
  const cy = 60;
  const { outerR, rimFrac, plateR: plateFrac, grooveCount } = profile;
  const plateR   = outerR * plateFrac;
  const rimWidth = outerR * rimFrac;
  const hubR     = 7;

  // Groove ring radii — spaced between plate edge and rim inner edge
  const rimInnerR  = outerR - rimWidth;
  const grooveStep = (rimInnerR - plateR) / (grooveCount + 1);
  const grooveRs   = Array.from({ length: grooveCount }, (_, i) => plateR + grooveStep * (i + 1));

  return (
    <svg
      viewBox="0 0 120 120"
      className={cn('select-none animate-spin', className)}
      style={{
        animationDuration: '18s',
        animationTimingFunction: 'linear',
        transformOrigin: 'center',
        filter: `drop-shadow(0 0 10px color-mix(in srgb, ${palette.a} 55%, transparent))`,
      }}
      role="img"
      aria-label={alt ?? `${brand} ${name}${category ? ` ${category}` : ''}`}
    >
      <defs>
        {/* Main body gradient */}
        <radialGradient id={`${uid}-rg`} cx="38%" cy="33%" r="65%">
          <stop offset="0%"   stopColor={palette.a} stopOpacity="1" />
          <stop offset="55%"  stopColor={palette.b} stopOpacity="0.95" />
          <stop offset="100%" stopColor={palette.c} stopOpacity="0.90" />
        </radialGradient>

        {/* Rim gradient — slightly darker */}
        <radialGradient id={`${uid}-rim`} cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={palette.b} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.c} stopOpacity="0.75" />
        </radialGradient>

        {/* Shine overlay */}
        <radialGradient id={`${uid}-shine`} cx="30%" cy="28%" r="55%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.40" />
          <stop offset="45%"  stopColor="white" stopOpacity="0.06" />
          <stop offset="100%" stopColor="black" stopOpacity="0.20" />
        </radialGradient>

        {/* Edge vignette */}
        <radialGradient id={`${uid}-edge`} cx="50%" cy="50%" r="50%">
          <stop offset="72%"  stopColor="transparent" />
          <stop offset="100%" stopColor="black"       stopOpacity="0.40" />
        </radialGradient>

        {/* Iridescent rim ring */}
        <linearGradient id={`${uid}-iring`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="white"   stopOpacity="0.55" />
          <stop offset="25%"  stopColor={palette.a} stopOpacity="0.35" />
          <stop offset="50%"  stopColor="white"   stopOpacity="0.50" />
          <stop offset="75%"  stopColor={palette.c} stopOpacity="0.35" />
          <stop offset="100%" stopColor="white"   stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* ── Disc body (full disc with rim) ── */}
      <circle cx={cx} cy={cy} r={outerR} fill={`url(#${uid}-rim)`} />

      {/* ── Flight plate (inner, slightly lighter) ── */}
      <circle cx={cx} cy={cy} r={plateR} fill={`url(#${uid}-rg)`} />
      <circle cx={cx} cy={cy} r={plateR} fill="white" fillOpacity="0.04" />

      {/* ── Groove rings (between plate and rim) ── */}
      {grooveRs.map((r, i) => (
        <g key={r}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="black"  strokeWidth={i === 0 ? 2 : 1.2} strokeOpacity="0.15" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="white"  strokeWidth="0.5" strokeOpacity="0.18" />
        </g>
      ))}

      {/* ── Outer rim ring ── */}
      <circle cx={cx} cy={cy} r={rimInnerR} fill="none" stroke="black" strokeWidth="1.5" strokeOpacity="0.12" />

      {/* ── Hub ── */}
      <circle cx={cx} cy={cy} r={hubR + 2} fill="black"             fillOpacity="0.18" />
      <circle cx={cx} cy={cy} r={hubR}     fill={`url(#${uid}-rg)`} />
      <circle cx={cx} cy={cy} r={hubR}     fill="white"             fillOpacity="0.12" />

      {/* ── Shine ── */}
      <circle cx={cx} cy={cy} r={outerR} fill={`url(#${uid}-shine)`} />

      {/* ── Edge vignette ── */}
      <circle cx={cx} cy={cy} r={outerR} fill={`url(#${uid}-edge)`} />

      {/* ── Iridescent rim stroke ── */}
      <circle cx={cx} cy={cy} r={outerR - 1} fill="none" stroke={`url(#${uid}-iring)`} strokeWidth="1.5" />

      {/* ── Center initial ── */}
      <text
        x={cx} y={cy + 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={category === 'Distance Driver' ? '28' : '30'}
        fontWeight="900"
        fontFamily="Outfit, system-ui, sans-serif"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.45))' }}
      >
        {initial}
      </text>

      {/* ── Brand micro-text ── */}
      <text
        x={cx} y={cy + 16}
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontWeight="700"
        letterSpacing="2"
        fontFamily="Inter, system-ui, sans-serif"
        fillOpacity="0.75"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
      >
        {brand.slice(0, 12).toUpperCase()}
      </text>
    </svg>
  );
}
