import React, { useState } from 'react';
import { cn } from '../utils';

interface DiscImageProps {
  src?: string;
  name: string;
  brand: string;
  className?: string;
  alt?: string;
}

const COLORS = [
  { start: '#6366f1', end: '#a855f7' },
  { start: '#3b82f6', end: '#22d3ee' },
  { start: '#10b981', end: '#2dd4bf' },
  { start: '#f43f5e', end: '#fb923c' },
  { start: '#d946ef', end: '#ec4899' },
  { start: '#f59e0b', end: '#ef4444' },
  { start: '#8b5cf6', end: '#6366f1' },
  { start: '#06b6d4', end: '#3b82f6' },
  { start: '#14b8a6', end: '#10b981' },
  { start: '#84cc16', end: '#22c55e' },
];

function getColorPair(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}

export function DiscImage({ src, name, brand, className, alt }: DiscImageProps) {
  const [imgError, setImgError] = useState(false);
  const isPlaceholder = !src || src.includes('placeholder-disc.png') || imgError;

  if (isPlaceholder) {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const colors = getColorPair(name + brand);
    const gradId = `grad-${name.replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
      <svg 
        viewBox="0 0 100 100" 
        className={cn("drop-shadow-xl animate-spin", className)}
        style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
          <linearGradient id={`${gradId}-highlight`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill={`url(#${gradId})`} />
        <circle cx="50" cy="50" r="38" fill="transparent" stroke="black" strokeWidth="3" strokeOpacity="0.1" />
        <circle cx="50" cy="50" r="37" fill="transparent" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
        <circle cx="50" cy="50" r="36" fill={`url(#${gradId})`} />
        <circle cx="50" cy="50" r="36" fill="black" fillOpacity="0.05" />
        <circle cx="50" cy="50" r="48" fill={`url(#${gradId}-highlight)`} />
        <g opacity="0.85">
          <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" strokeDasharray="2 2" />
          <text x="50" y="54" textAnchor="middle" fill="white" fontSize="32" fontWeight="900" fontFamily="Outfit, system-ui, sans-serif" className="select-none" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))' }}>{initial}</text>
          <text x="50" y="66" textAnchor="middle" fill="white" fontSize="5" fontWeight="800" letterSpacing="2" fontFamily="Inter, system-ui, sans-serif" className="select-none uppercase" style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.3))' }}>{brand.slice(0, 15)}</text>
        </g>
      </svg>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt || `${brand} ${name}`} 
      className={cn("object-contain drop-shadow-xl animate-spin", className)} 
      style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
}
