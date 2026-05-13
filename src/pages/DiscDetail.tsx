import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useDiscById } from '../hooks/useDiscById';
import { buildAmazonLink } from '../utils/amazon';
import { deriveStability, STABILITY_CONFIG, CATEGORY_CONFIG } from '../components/DiscCard';
import { buildCanonical, SITE_URL } from '../utils/seo';
import { brandSlug } from '../utils/brandSlug';
import { DiscImage } from '../components/DiscImage';

function FlightTile({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-5 rounded-2xl border ${color} text-center`}>
      <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{label}</span>
      <span className="text-4xl font-black text-gray-900 dark:text-white">{value}</span>
      <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{sub}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DiscDetail() {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const { data: disc, loading } = useDiscById(id);

  if (loading) {
    return (
      <div className="pt-40 text-center text-gray-500 dark:text-gray-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading disc data...
      </div>
    );
  }

  if (!disc) {
    return (
      <div className="pt-40 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Disc not found.</p>
        <Link to="/discs" className="text-indigo-600 font-bold hover:underline">← Back to Discs</Link>
      </div>
    );
  }

  const stability  = deriveStability(disc.turn, disc.fade, disc.stability);
  const stabCfg    = STABILITY_CONFIG[stability] ?? STABILITY_CONFIG['Neutral'];
  const catCfg     = CATEGORY_CONFIG[disc.category] ?? { color: 'text-gray-600', bg: 'bg-gray-100' };
  const mfgSlug    = brandSlug(disc.brand);
  const canonicalUrl = buildCanonical(pathname);
  const amazonHref = buildAmazonLink({
    amazonShort: disc.amazonShort,
    asin:        disc.asin,
    amazonQuery: disc.amazonQuery ?? `${disc.brand} ${disc.name} disc golf`,
  });

  // ── JSON-LD ──────────────────────────────────────────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: disc.name,
        brand: { '@type': 'Brand', name: disc.brand },
        ...(disc.description ? { description: disc.description } : {}),
        url: canonicalUrl,
        ...(disc.image ? { image: disc.image } : {}),
        ...(amazonHref ? {
          offers: {
            '@type': 'Offer',
            url: amazonHref,
            priceCurrency: 'USD',
            availability: 'https://schema.org/OnlineOnly',
            seller: { '@type': 'Organization', name: 'Amazon' },
          },
        } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',  item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Discs', item: `${SITE_URL}/discs` },
          { '@type': 'ListItem', position: 3, name: disc.name, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <div className="pt-20 pb-8 px-4 max-w-5xl mx-auto">
      <Helmet>
        <title>{disc.name} by {disc.brand} | The Disc Mill</title>
        <meta name="description" content={`${disc.name} by ${disc.brand} — ${disc.category}. Flight numbers: Speed ${disc.speed}, Glide ${disc.glide}, Turn ${disc.turn}, Fade ${disc.fade}.`} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Link to="/discs" className="inline-flex items-center text-indigo-600 font-bold mb-8 hover:underline text-sm">
        <ArrowLeft className="mr-1.5 w-4 h-4" />
        Back to Discs
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <Link
              to={`/manufacturer/${mfgSlug}`}
              className="text-xs font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              {disc.brand}
            </Link>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mt-0.5">{disc.name}</h1>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${catCfg.bg} ${catCfg.color}`}>
                {disc.category || 'Disc'}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${stabCfg.bg} ${stabCfg.text} ${stabCfg.border}`}>
                {stability}
              </span>
            </div>
          </div>
          {disc.image && (
            <DiscImage
              src={disc.image}
              name={disc.name}
              brand={disc.brand}
              className="w-32 h-32 md:w-40 md:h-40 shrink-0"
            />
          )}
        </div>

        {/* Flight number tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <FlightTile label="Speed"  value={disc.speed} sub="Distance potential" color="bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900" />
          <FlightTile label="Glide"  value={disc.glide} sub="Air time"           color="bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900" />
          <FlightTile label="Turn"   value={disc.turn}  sub="High-speed turn"    color="bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900" />
          <FlightTile label="Fade"   value={disc.fade}  sub="Low-speed finish"   color="bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {disc.description && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                <h2 className="font-bold text-gray-900 dark:text-white mb-3">About this disc</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{disc.description}</p>
              </div>
            )}

            {/* Flight guide */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">Flight guide</h2>
              <div className="space-y-3">
                {[
                  { label: 'Speed',  value: disc.speed, max: 14, color: 'bg-indigo-500', note: 'How fast this disc needs to be thrown' },
                  { label: 'Glide',  value: disc.glide, max: 7,  color: 'bg-teal-500',   note: 'How long it stays in the air' },
                  { label: 'Turn',   value: Math.abs(disc.turn), max: 5, color: 'bg-amber-400', note: disc.turn < 0 ? 'Turns right for RHBH throwers' : 'Neutral high-speed' },
                  { label: 'Fade',   value: disc.fade,  max: 5,  color: 'bg-rose-500',   note: 'Finish hook at end of flight' },
                ].map(({ label, value, max, color, note }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      <span>{label}</span>
                      <span>{label === 'Turn' && disc.turn < 0 ? disc.turn : value} / {max}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${(value / max) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Manufacturer card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Manufacturer</p>
              <Link
                to={`/manufacturer/${mfgSlug}`}
                className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 transition-colors text-lg block mb-3"
              >
                {disc.brand}
              </Link>
              <Link
                to={`/manufacturer/${mfgSlug}`}
                className="w-full block text-center bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-sm py-2.5 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
              >
                View all {disc.brand} discs →
              </Link>
            </div>

            {/* Quick specs */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Quick specs</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Category</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{disc.category || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Stability</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{stability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Flight #s</span>
                  <span className="font-semibold text-gray-900 dark:text-white font-mono">
                    {disc.speed} / {disc.glide} / {disc.turn} / {disc.fade}
                  </span>
                </div>
              </div>
            </div>

            {/* Find it online */}
            {amazonHref && (
              <div className="bg-indigo-900 text-white rounded-2xl p-5">
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">Find it online</p>
                <a
                  href={amazonHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm font-semibold pt-1 hover:text-indigo-300 transition-colors"
                >
                  Amazon
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                </a>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
