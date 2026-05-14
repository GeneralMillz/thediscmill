import React, { useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeftRight, TrendingUp, Scale } from 'lucide-react';
import { SEO } from '../components/SEO';
import { DiscCard, FlightPathArc, brandAccent, deriveStability, STABILITY_CONFIG, CATEGORY_CONFIG } from '../components/DiscCard';
import { DiscImage } from '../components/DiscImage';
import { useDiscs } from '../hooks/useDiscs';
import { Disc } from '../types';
import { buildCanonical, buildProductSchema, buildBreadcrumbs, SITE_URL } from '../utils/seo';
import { buildAmazonLink } from '../utils/amazon';

// Parse slug "brandslug-discslug-vs-brandslug2-discslug2"
function parseSlugs(raw: string): [string, string] | null {
  const idx = raw.indexOf('-vs-');
  if (idx === -1) return null;
  return [raw.slice(0, idx), raw.slice(idx + 4)];
}

function matchDisc(discs: Disc[], combinedSlug: string): Disc | undefined {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return discs.find(d => {
    const full = `${slug(d.brand)}-${slug(d.name)}`;
    return full === combinedSlug || slug(d.name) === combinedSlug;
  });
}

// ── Stat row comparison ──────────────────────────────────────────────────────

function CompareRow({ label, a, b, max, colorA, colorB }: {
  label: string; a: number; b: number; max: number;
  colorA: string; colorB: string;
}) {
  const pctA = Math.min(1, Math.abs(a) / max);
  const pctB = Math.min(1, Math.abs(b) / max);
  const winner = a > b ? 'a' : b > a ? 'b' : 'tie';
  return (
    <div className="grid grid-cols-[1fr_80px_1fr] gap-3 items-center py-3 border-b border-gray-100 dark:border-gray-800">
      <div className="text-right">
        <div className="flex items-center justify-end gap-2">
          <span className={`text-xl font-black ${winner === 'a' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>{a}</span>
          <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pctA * 100}%`, background: colorA }} />
          </div>
        </div>
      </div>
      <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</div>
      <div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pctB * 100}%`, background: colorB }} />
          </div>
          <span className={`text-xl font-black ${winner === 'b' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>{b}</span>
        </div>
      </div>
    </div>
  );
}

export function CompareDiscs() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const { data: allDiscs, loading } = useDiscs();

  const [discA, discB] = useMemo(() => {
    if (!slug || !allDiscs.length) return [undefined, undefined];
    const parsed = parseSlugs(slug);
    if (!parsed) return [undefined, undefined];
    return [matchDisc(allDiscs, parsed[0]), matchDisc(allDiscs, parsed[1])];
  }, [slug, allDiscs]);

  if (loading) return (
    <div className="pt-32 text-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );

  if (!discA || !discB) return (
    <div className="pt-32 text-center px-4">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Discs not found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Try: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">/compare/discraft-anax-vs-innova-ape</code></p>
      <Link to="/discs" className="text-indigo-600 font-bold hover:underline">Browse all discs →</Link>
    </div>
  );

  const bSlug = (d: Disc) => d.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const dSlug = (d: Disc) => d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const accentA = brandAccent(discA.brand);
  const accentB = brandAccent(discB.brand);
  const canonicalUrl = buildCanonical(pathname);
  const stabA = deriveStability(discA.turn, discA.fade, discA.stability);
  const stabB = deriveStability(discB.turn, discB.fade, discB.stability);

  const jsonLd = [
    buildProductSchema({ name: discA.name, brand: discA.brand, url: `${SITE_URL}/disc/${bSlug(discA)}/${dSlug(discA)}`, image: discA.image }),
    buildProductSchema({ name: discB.name, brand: discB.brand, url: `${SITE_URL}/disc/${bSlug(discB)}/${dSlug(discB)}`, image: discB.image }),
  ];

  return (
    <div className="pt-20 pb-16 px-4 max-w-5xl mx-auto">
      <SEO
        title={`${discA.brand} ${discA.name} vs ${discB.brand} ${discB.name} | Disc Comparison`}
        description={`${discA.name} (${discA.speed}/${discA.glide}/${discA.turn}/${discA.fade}) vs ${discB.name} (${discB.speed}/${discB.glide}/${discB.turn}/${discB.fade}). Full flight number comparison on The Disc Mill.`}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <ArrowLeftRight className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          <span style={{ color: accentA.hex }}>{discA.name}</span>
          <span className="text-gray-400 dark:text-gray-600 mx-3">vs</span>
          <span style={{ color: accentB.hex }}>{discB.name}</span>
        </h1>
      </div>

      {/* Side-by-side disc cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <DiscCard disc={discA} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <DiscCard disc={discB} />
        </motion.div>
      </div>

      {/* Overlaid flight path comparison */}
      <div className="bg-gray-900 rounded-3xl p-6 mb-10">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Flight Path Overlay</h2>
        <div className="relative">
          <FlightPathArc speed={discA.speed} glide={discA.glide} turn={discA.turn} fade={discA.fade} accentHex={accentA.hex} />
          <div className="absolute inset-0 pointer-events-none">
            <FlightPathArc speed={discB.speed} glide={discB.glide} turn={discB.turn} fade={discB.fade} accentHex={accentB.hex} />
          </div>
        </div>
        <div className="flex gap-6 mt-3">
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: accentA.hex }}>
            <div className="w-6 h-0.5 rounded" style={{ background: accentA.hex }} /> {discA.name}
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: accentB.hex }}>
            <div className="w-6 h-0.5 rounded" style={{ background: accentB.hex }} /> {discB.name}
          </div>
        </div>
      </div>

      {/* Stat comparison */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 mb-10">
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-500" /> Flight Numbers
        </h2>
        <div className="grid grid-cols-[1fr_80px_1fr] gap-3 mb-2">
          <p className="text-right text-sm font-black truncate" style={{ color: accentA.hex }}>{discA.brand} {discA.name}</p>
          <span />
          <p className="text-sm font-black truncate" style={{ color: accentB.hex }}>{discB.brand} {discB.name}</p>
        </div>
        <CompareRow label="Speed" a={discA.speed} b={discB.speed} max={14} colorA={accentA.hex} colorB={accentB.hex} />
        <CompareRow label="Glide" a={discA.glide} b={discB.glide} max={7}  colorA={accentA.hex} colorB={accentB.hex} />
        <CompareRow label="Turn"  a={Math.abs(discA.turn)} b={Math.abs(discB.turn)} max={5} colorA={accentA.hex} colorB={accentB.hex} />
        <CompareRow label="Fade"  a={discA.fade} b={discB.fade} max={5}  colorA={accentA.hex} colorB={accentB.hex} />
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Stability</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${STABILITY_CONFIG[stabA]?.pill ?? ''}`}>{stabA}</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Stability</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${STABILITY_CONFIG[stabB]?.pill ?? ''}`}>{stabB}</span>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex flex-wrap gap-4 text-sm">
        <Link to={`/disc/${bSlug(discA)}/${dSlug(discA)}`} className="text-indigo-600 font-semibold hover:underline">{discA.name} details →</Link>
        <Link to={`/disc/${bSlug(discB)}/${dSlug(discB)}`} className="text-indigo-600 font-semibold hover:underline">{discB.name} details →</Link>
        <Link to={`/similar/${bSlug(discA)}-${dSlug(discA)}`} className="text-indigo-600 font-semibold hover:underline">Similar to {discA.name} →</Link>
        <Link to={`/similar/${bSlug(discB)}-${dSlug(discB)}`} className="text-indigo-600 font-semibold hover:underline">Similar to {discB.name} →</Link>
        <Link to="/discs" className="text-indigo-600 font-semibold hover:underline">Browse all discs →</Link>
      </div>
    </div>
  );
}
