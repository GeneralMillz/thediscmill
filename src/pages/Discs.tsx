import React, { useMemo, useState } from 'react';
import { SEO } from '../components/SEO';
import { Link, useLocation } from 'react-router-dom';
import { buildCanonical } from '../utils/seo';
import { Disc as DiscIcon, Search, Filter, ChevronDown, X, Factory } from 'lucide-react';
import { useDiscs } from '../hooks/useDiscs';
import { Disc } from '../types';
import { DiscCard, CATEGORY_CONFIG, STABILITY_CONFIG, deriveStability } from '../components/DiscCard';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 animate-pulse flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-2.5 w-20 bg-gray-100 dark:bg-gray-700 rounded" />
          <div className="h-5 w-32 bg-gray-100 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-6 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg" />
      </div>
      <div className="h-6 w-24 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-2 w-6 bg-gray-100 dark:bg-gray-700 rounded" />
            <div className="h-4 w-6 bg-gray-100 dark:bg-gray-700 rounded" />
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Putter', 'Midrange', 'Fairway Driver', 'Distance Driver'];
const STABILITIES = ['All', 'Very Understable', 'Understable', 'Neutral', 'Stable', 'Overstable', 'Very Overstable'];

export function Discs() {
  const { pathname } = useLocation();
  const { data: discs, loading } = useDiscs();

  const [search,    setSearch]    = useState('');
  const [category,  setCategory]  = useState('All');
  const [stability, setStability] = useState('All');
  const [brand,     setBrand]     = useState('All');
  const [sortBy,    setSortBy]    = useState<'name' | 'speed' | 'brand'>('name');
  const [showFilters, setShowFilters] = useState(false);

  // Unique sorted brands from data
  const brands = useMemo(() => {
    const set = new Set(discs.map(d => d.brand));
    return ['All', ...Array.from(set).sort()];
  }, [discs]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: discs.length };
    discs.forEach(d => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, [discs]);

  const filtered = useMemo((): Disc[] => {
    let result = discs.filter(d => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !d.name.toLowerCase().includes(q) &&
          !d.brand.toLowerCase().includes(q) &&
          !d.category.toLowerCase().includes(q)
        ) return false;
      }
      if (category  !== 'All' && d.category !== category) return false;
      if (stability !== 'All' && deriveStability(d.turn, d.fade, d.stability) !== stability) return false;
      if (brand     !== 'All' && d.brand !== brand) return false;
      return true;
    });

    return result.slice().sort((a, b) => {
      if (sortBy === 'speed') return b.speed - a.speed;
      if (sortBy === 'brand') return a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [discs, search, category, stability, brand, sortBy]);

  const hasFilters = search || category !== 'All' || stability !== 'All' || brand !== 'All';

  function clearFilters() {
    setSearch(''); setCategory('All'); setStability('All'); setBrand('All');
  }

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <SEO
        title="Disc Directory | 10,000+ Discs"
        description="Search, filter, and compare flight numbers for over 10,000 disc golf discs from top manufacturers."
        canonicalUrl={buildCanonical(pathname)}
      />

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <DiscIcon className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Disc Catalog</h1>
          </div>
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
          Every major disc, every manufacturer — flight numbers, stability ratings, and find the right plastic for your game.
        </p>
        {!loading && (
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full">
              {discs.length} discs
            </span>
            <Link
              to="/manufacturers"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors"
            >
              <Factory className="w-3.5 h-3.5" />
              {brands.length - 1} manufacturers
            </Link>
          </div>
        )}
      </div>

      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search discs, brands, categories…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Clear search">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Category Tabs ────────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              category === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 active:bg-indigo-100'
            }`}
          >
            {cat}
            {cat !== 'All' && categoryCounts[cat] ? (
              <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                category === cat ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {categoryCounts[cat]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ── Secondary Filters (collapsible on mobile) ────────────────────── */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 lg:hidden"
        >
          <Filter className="w-4 h-4" />
          Filters {hasFilters && <span className="w-2 h-2 bg-indigo-500 rounded-full" />}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {/* Brand pills */}
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Brand</p>
            <div className="flex gap-2 flex-wrap">
              {brands.map(b => (
                <button
                  key={b}
                  onClick={() => setBrand(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    brand === b
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Stability pills */}
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Stability</p>
            <div className="flex gap-2 flex-wrap">
              {STABILITIES.map(s => {
                const cfg = s !== 'All' ? STABILITY_CONFIG[s] : null;
                return (
                  <button
                    key={s}
                    onClick={() => setStability(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      stability === s
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/50'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {loading ? 'Loading…' : (
              <><span className="text-gray-900 dark:text-white font-black">{filtered.length}</span> discs</>
            )}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'name' | 'speed' | 'brand')}
          className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="name">Sort: Name A–Z</option>
          <option value="brand">Sort: Brand</option>
          <option value="speed">Sort: Speed ↓</option>
        </select>
      </div>

      {/* ── Disc Grid ───────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(16)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <DiscIcon className="w-12 h-12 text-gray-200 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No discs found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Try adjusting your search or filters.</p>
          <button onClick={clearFilters} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((disc: Disc) => (
            <React.Fragment key={disc.id}>
              <DiscCard disc={disc} />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
