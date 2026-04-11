import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Globe, Factory } from 'lucide-react';
import { buildCanonical } from '../utils/seo';
import { brandSlug as makeBrandSlug } from '../utils/brandSlug';
import { fetchManufacturers } from '../services/manufacturers';
import { fetchDiscs } from '../services/discs';
import { Disc } from '../types';
import { DiscCard, CATEGORY_CONFIG } from '../components/DiscCard';

interface Manufacturer {
  id: string;
  name: string;
  shortName: string;
  country: string;
  website: string;
  founded?: number | null;
  description: string;
  trilogy?: boolean;
  mvpFamily?: boolean;
}

const FLAG: Record<string, string> = {
  US: '🇺🇸', SE: '🇸🇪', FI: '🇫🇮', DE: '🇩🇪', CA: '🇨🇦', AU: '🇦🇺', GB: '🇬🇧',
};


// Re-export the shared utility under the local name used throughout this file.
const slug = makeBrandSlug;

export function ManufacturerDetail() {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [allDiscs, setAllDiscs] = useState<Disc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    Promise.all([fetchManufacturers(), fetchDiscs()])
      .then(([mfgs, discs]) => {
        const mfg = (mfgs as Manufacturer[]).find(
          m => m.id === id || slug(m.shortName) === id || slug(m.name) === id
        ) ?? null;
        setManufacturer(mfg);
        setAllDiscs(discs);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const discs = useMemo(() => {
    if (!manufacturer) return [];
    const mSlug = slug(manufacturer.shortName || manufacturer.name);
    const nSlug = slug(manufacturer.name);
    return allDiscs.filter(d => {
      const bSlug = slug(d.brand);
      return bSlug === id || bSlug === mSlug || bSlug === nSlug ||
             d.brand.toLowerCase() === (manufacturer.shortName || '').toLowerCase() ||
             d.brand.toLowerCase() === manufacturer.name.toLowerCase();
    });
  }, [allDiscs, manufacturer, id]);

  if (loading) {
    return (
      <div className="pt-40 text-center text-gray-500 dark:text-gray-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading manufacturer data...
      </div>
    );
  }

  if (!manufacturer) {
    return (
      <div className="pt-40 text-center">
        <p className="text-gray-500 mb-4">Manufacturer not found.</p>
        <Link to="/manufacturers" className="text-indigo-600 font-bold hover:underline">← All Brands</Link>
      </div>
    );
  }

  const byCategory = discs.reduce<Record<string, Disc[]>>((acc, d) => {
    const cat = d.category || 'Other';
    (acc[cat] = acc[cat] ?? []).push(d);
    return acc;
  }, {});

  const categoryOrder = ['Distance Driver', 'Fairway Driver', 'Midrange', 'Putter', 'Other'];

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>{manufacturer!.name} Discs | The Disc Mill</title>
        <meta name="description" content={`Browse all ${manufacturer!.name} disc golf discs — ${discs.length} discs including putters, midranges, fairway and distance drivers.`} />
        <link rel="canonical" href={buildCanonical(pathname)} />
      </Helmet>
      <Link to="/manufacturers" className="inline-flex items-center text-indigo-600 font-bold mb-8 hover:underline text-sm">
        <ArrowLeft className="mr-1.5 w-4 h-4" />
        All Brands
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-3xl">{FLAG[manufacturer.country] ?? '🌐'}</span>
                {manufacturer.founded && (
                  <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">Est. {manufacturer.founded}</span>
                )}
                {manufacturer.trilogy && (
                  <span className="text-xs font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full">Trilogy</span>
                )}
                {manufacturer.mvpFamily && (
                  <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">MVP Family</span>
                )}
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-1">{manufacturer.shortName || manufacturer.name}</h1>
              {manufacturer.shortName && manufacturer.shortName !== manufacturer.name && (
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-3">{manufacturer.name}</p>
              )}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">{manufacturer.description}</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <div className="text-center bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl px-6 py-4">
                <div className="text-3xl font-black text-indigo-600">{discs.length}</div>
                <div className="text-xs text-indigo-400 dark:text-indigo-500 font-semibold mt-0.5">discs in catalog</div>
              </div>
              {manufacturer.website && (
                <a
                  href={manufacturer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  <Globe className="w-4 h-4" />
                  Official site
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Disc grid by category */}
        {discs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Factory className="w-10 h-10 text-gray-200 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No discs found for this manufacturer in the current catalog.</p>
          </div>
        ) : (
          categoryOrder
            .filter(cat => byCategory[cat]?.length > 0)
            .map(cat => {
              const catCfg = CATEGORY_CONFIG[cat] ?? { color: 'text-gray-600', bg: 'bg-gray-100' };
              return (
                <div key={cat} className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg ${catCfg.bg} ${catCfg.color}`}>{cat}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{byCategory[cat].length} discs</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {byCategory[cat].map((disc, i) => (
                      <motion.div
                        key={disc.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.4) }}
                      >
                        <DiscCard disc={disc} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
        )}
      </motion.div>
    </div>
  );
}
