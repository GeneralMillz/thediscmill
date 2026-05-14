import React, { useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { SEO } from '../components/SEO';
import { DiscCard, deriveStability } from '../components/DiscCard';
import { useDiscs } from '../hooks/useDiscs';
import { Disc } from '../types';
import { buildCanonical, buildItemListSchema, SITE_URL } from '../utils/seo';

function computeSimilarity(a: Disc, b: Disc): number {
  if (a.id === b.id) return -Infinity;
  let score = 0;
  if (a.category === b.category) score += 40;
  score -= Math.abs((a.speed ?? 0) - (b.speed ?? 0)) * 6;
  score -= Math.abs((a.glide ?? 0) - (b.glide ?? 0)) * 4;
  score -= Math.abs((a.turn ?? 0)  - (b.turn ?? 0))  * 5;
  score -= Math.abs((a.fade ?? 0)  - (b.fade ?? 0))  * 5;
  const stabA = deriveStability(a.turn, a.fade, a.stability);
  const stabB = deriveStability(b.turn, b.fade, b.stability);
  if (stabA === stabB) score += 15;
  if (a.brand !== b.brand) score += 5; // variety bonus
  return score;
}

export function SimilarDiscsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const { data: allDiscs, loading } = useDiscs();

  const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const target = useMemo(() =>
    allDiscs.find(d => `${toSlug(d.brand)}-${toSlug(d.name)}` === slug || toSlug(d.name) === slug),
    [allDiscs, slug]
  );

  const similar = useMemo(() => {
    if (!target || !allDiscs.length) return [];
    return [...allDiscs]
      .map(d => ({ disc: d, score: computeSimilarity(target, d) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(x => x.disc);
  }, [target, allDiscs]);

  if (loading) return (
    <div className="pt-32 text-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );

  if (!target) return (
    <div className="pt-32 text-center px-4">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Disc not found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">Try: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">/similar/discraft-anax</code></p>
      <Link to="/discs" className="text-indigo-600 font-bold hover:underline">Browse all discs →</Link>
    </div>
  );

  const canonicalUrl = buildCanonical(pathname);
  const jsonLd = buildItemListSchema(
    `Discs Similar to ${target.brand} ${target.name}`,
    similar.map(d => ({
      name: `${d.brand} ${d.name}`,
      url: `${SITE_URL}/disc/${toSlug(d.brand)}/${toSlug(d.name)}`,
    }))
  );

  return (
    <div className="pt-20 pb-16 px-4 max-w-6xl mx-auto">
      <SEO
        title={`Discs Similar to ${target.brand} ${target.name} | The Disc Mill`}
        description={`8 disc golf discs similar to the ${target.brand} ${target.name} (${target.speed}/${target.glide}/${target.turn}/${target.fade}). Same category, stability, and flight characteristics.`}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Discs Similar to <span className="text-indigo-500">{target.name}</span>
        </h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 ml-[52px] mb-10">
        {target.brand} {target.name} · {target.category} · {target.speed}/{target.glide}/{target.turn}/{target.fade}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {similar.map((disc, i) => (
          <motion.div key={disc.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <DiscCard disc={disc} />
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-sm border-t border-gray-100 dark:border-gray-800 pt-8">
        <Link to={`/disc/${toSlug(target.brand)}/${toSlug(target.name)}`} className="text-indigo-600 font-semibold hover:underline">{target.name} full details →</Link>
        <Link to={`/compare/${toSlug(target.brand)}-${toSlug(target.name)}-vs-${toSlug(similar[0]?.brand)}-${toSlug(similar[0]?.name)}`} className="text-indigo-600 font-semibold hover:underline">Compare with top match →</Link>
        <Link to="/disc-finder" className="text-indigo-600 font-semibold hover:underline">Use Disc Finder →</Link>
      </div>
    </div>
  );
}
