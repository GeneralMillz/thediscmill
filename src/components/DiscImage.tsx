import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils';

interface DiscImageProps {
  src?: string;
  name: string;
  brand: string;
  className?: string;
  alt?: string;
  /** When true, disc pulses on hover instead of constant spin */
  interactive?: boolean;
}

const PALETTES = [
  { a: '#7c3aed', b: '#ec4899', c: '#f97316' },
  { a: '#0ea5e9', b: '#6366f1', c: '#8b5cf6' },
  { a: '#10b981', b: '#06b6d4', c: '#3b82f6' },
  { a: '#f43f5e', b: '#f97316', c: '#eab308' },
  { a: '#d946ef', b: '#8b5cf6', c: '#06b6d4' },
  { a: '#f59e0b', b: '#ef4444', c: '#ec4899' },
  { a: '#14b8a6', b: '#6366f1', c: '#a855f7' },
  { a: '#22d3ee', b: '#3b82f6', c: '#8b5cf6' },
  { a: '#84cc16', b: '#10b981', c: '#0ea5e9' },
  { a: '#fb923c', b: '#f43f5e', c: '#d946ef' },
];

function getPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

export function DiscImage({ src, name, brand, className, alt, interactive = false }: DiscImageProps) {
  const [imgError, setImgError] = useState(false);
  const isPlaceholder = !src || src.includes('placeholder-disc.png') || imgError;
  const svgRef = useRef<SVGSVGElement>(null);

  const palette = getPalette(name + brand);
  const uid = `disc-${(name + brand).replace(/[^a-zA-Z0-9]/g, '')}`;
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (isPlaceholder) {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 120 120"
        className={cn('select-none', className)}
        style={{
          animation: 'discSpin 18s linear infinite',
          filter: 'drop-shadow(0 0 12px color-mix(in srgb, var(--disc-a) 60%, transparent))',
        }}
        role="img"
        aria-label={`${brand} ${name} disc`}
      >
        <defs>
          {/* Primary gradient */}
          <radialGradient id={`${uid}-rg`} cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor={palette.a} stopOpacity="1" />
            <stop offset="55%" stopColor={palette.b} stopOpacity="0.95" />
            <stop offset="100%" stopColor={palette.c} stopOpacity="0.9" />
          </radialGradient>

          {/* Holographic shimmer */}
          <radialGradient id={`${uid}-shine`} cx="30%" cy="28%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.45" />
            <stop offset="40%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="black" stopOpacity="0.25" />
          </radialGradient>

          {/* Edge shadow */}
          <radialGradient id={`${uid}-edge`} cx="50%" cy="50%" r="50%">
            <stop offset="75%" stopColor="transparent" />
            <stop offset="100%" stopColor="black" stopOpacity="0.35" />
          </radialGradient>

          {/* Iridescent ring */}
          <linearGradient id={`${uid}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="25%" stopColor={palette.a} stopOpacity="0.4" />
            <stop offset="50%" stopColor="white" stopOpacity="0.5" />
            <stop offset="75%" stopColor={palette.c} stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0.6" />
          </linearGradient>

          <filter id={`${uid}-glow`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer disc body */}
        <circle cx="60" cy="60" r="57" fill={`url(#${uid}-rg)`} />

        {/* Groove rings — subtle depth */}
        {[44, 51, 56].map((r, i) => (
          <circle
            key={r}
            cx="60" cy="60" r={r}
            fill="none"
            stroke="black"
            strokeWidth={i === 0 ? 2.5 : 1}
            strokeOpacity={i === 0 ? 0.18 : 0.1}
          />
        ))}
        {[43, 50, 55].map((r) => (
          <circle
            key={`w-${r}`}
            cx="60" cy="60" r={r}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
        ))}

        {/* Flight plate */}
        <circle cx="60" cy="60" r="38" fill={`url(#${uid}-rg)`} fillOpacity="0.7" />
        <circle cx="60" cy="60" r="38" fill="black" fillOpacity="0.08" />

        {/* Hub */}
        <circle cx="60" cy="60" r="10" fill="black" fillOpacity="0.2" />
        <circle cx="60" cy="60" r="8" fill={`url(#${uid}-rg)`} />
        <circle cx="60" cy="60" r="8" fill="white" fillOpacity="0.15" />

        {/* Shine overlay */}
        <circle cx="60" cy="60" r="57" fill={`url(#${uid}-shine)`} />

        {/* Edge depth */}
        <circle cx="60" cy="60" r="57" fill={`url(#${uid}-edge)`} />

        {/* Iridescent rim */}
        <circle cx="60" cy="60" r="56" fill="none" stroke={`url(#${uid}-ring)`} strokeWidth="2" />

        {/* Center initial */}
        <text
          x="60" y="64"
          textAnchor="middle"
          fill="white"
          fontSize="36"
          fontWeight="900"
          fontFamily="Outfit, system-ui, sans-serif"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
        >
          {initial}
        </text>

        {/* Brand micro-text */}
        <text
          x="60" y="75"
          textAnchor="middle"
          fill="white"
          fontSize="5.5"
          fontWeight="700"
          letterSpacing="2.5"
          fontFamily="Inter, system-ui, sans-serif"
          fillOpacity="0.8"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
        >
          {brand.slice(0, 14).toUpperCase()}
        </text>

        <style>{`
          @keyframes discSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </svg>
    );
  }

  return (
    <img
      src={src}
      alt={alt || `${brand} ${name}`}
      className={cn('object-contain', className)}
      style={{
        animation: 'discSpin 18s linear infinite',
        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
      }}
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
}
