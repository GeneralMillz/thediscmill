import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Tag, Flame, Clock } from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildCanonical, buildItemListSchema, SITE_URL } from '../utils/seo';
import { buildAmazonSearchUrl } from '../utils/amazon';

interface Release {
  date: string;
  brand: string;
  disc: string;
  plastic: string;
  type: 'new' | 'restock' | 'limited' | 'tour';
  notes?: string;
  searchQuery: string;
}

const RELEASES: Release[] = [
  { date: '2025-06-01', brand: 'Innova', disc: 'Boss',        plastic: 'Champion',   type: 'restock', notes: 'Popular distance driver returns to stock', searchQuery: 'Innova Boss Champion disc golf' },
  { date: '2025-06-05', brand: 'Discraft', disc: 'Zone',      plastic: 'Esp Swirl',  type: 'limited', notes: 'Limited swirl run', searchQuery: 'Discraft Zone ESP Swirl disc golf' },
  { date: '2025-06-10', brand: 'MVP',      disc: 'Neutron',   plastic: 'Cosmic',     type: 'limited', notes: 'Cosmic Neutron run', searchQuery: 'MVP Disc Sports Neutron disc golf' },
  { date: '2025-06-15', brand: 'Kastaplast', disc: 'Berg',    plastic: 'K1 Soft',    type: 'restock', notes: 'K1 Soft Berg restocked', searchQuery: 'Kastaplast Berg K1 Soft disc golf' },
  { date: '2025-06-20', brand: 'Dynamic Discs', disc: 'Judge', plastic: 'Lucid Ice', type: 'limited', notes: 'Lucid Ice run, LE stamp', searchQuery: 'Dynamic Discs Judge Lucid Ice disc golf' },
  { date: '2025-07-01', brand: 'Discmania', disc: 'PD',        plastic: 'C-Line',    type: 'restock', notes: 'C-Line PD back in stock', searchQuery: 'Discmania PD C-Line disc golf' },
  { date: '2025-07-04', brand: 'Innova',   disc: 'Destroyer', plastic: 'Star',       type: 'restock', notes: 'Star Destroyer summer restock', searchQuery: 'Innova Destroyer Star disc golf' },
  { date: '2025-07-10', brand: 'Axiom',    disc: 'Envy',      plastic: 'Fission',    type: 'limited', notes: 'Fission Envy — limited run', searchQuery: 'Axiom Envy Fission disc golf' },
  { date: '2025-07-15', brand: 'Discraft', disc: 'Buzzz',     plastic: 'Big Z',      type: 'tour',   notes: 'Pro Tour series stamp', searchQuery: 'Discraft Buzzz Big Z disc golf' },
  { date: '2025-08-01', brand: 'Latitude 64', disc: 'Pure',   plastic: 'Gold Line', type: 'restock', notes: 'Gold Line Pure — consistent favorite', searchQuery: 'Latitude 64 Pure Gold Line disc golf' },
];

const TYPE_CONFIG = {
  new:     { label: 'New Release', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', icon: Flame },
  restock: { label: 'Restock',     color: 'bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300',  icon: Tag },
  limited: { label: 'Limited Run', color: 'bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-300',  icon: Clock },
  tour:    { label: 'Tour Series', color: 'bg-rose-100   text-rose-700   dark:bg-rose-900/40   dark:text-rose-300',   icon: Flame },
};

export function Releases() {
  const { pathname } = useLocation();
  const canonicalUrl = buildCanonical(pathname);
  const jsonLd = buildItemListSchema('Disc Golf Release Calendar 2025',
    RELEASES.map(r => ({ name: `${r.brand} ${r.disc} (${r.plastic})`, url: buildAmazonSearchUrl(r.searchQuery) }))
  );

  return (
    <div className="pt-20 pb-16 px-4 max-w-4xl mx-auto">
      <SEO
        title="Disc Golf Release Calendar 2025 | New Discs, Restocks & Limited Runs"
        description="Upcoming disc golf disc releases, restocks, limited runs, and tour series drops in 2025. Stay ahead of the drops."
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">Release Calendar</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 ml-[52px] mb-10">New discs, restocks, limited runs, and tour series drops — curated from manufacturer announcements.</p>

      {/* Type legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
          <span key={key} className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
        ))}
      </div>

      <div className="space-y-4">
        {RELEASES.map((r, i) => {
          const cfg = TYPE_CONFIG[r.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-5"
            >
              <div className="text-center shrink-0 w-14">
                <p className="text-xs font-bold text-gray-400">{new Date(r.date).toLocaleString('en-US', { month: 'short' })}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{new Date(r.date).getDate()}</p>
              </div>
              <div className="w-px h-10 bg-gray-100 dark:bg-gray-700 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                </div>
                <p className="font-black text-gray-900 dark:text-white">{r.brand} {r.disc}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{r.plastic} · {r.notes}</p>
              </div>
              <a
                href={buildAmazonSearchUrl(r.searchQuery)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-xs font-black rounded-xl transition-colors"
              >
                Find it
              </a>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-sm">
        <Link to="/deals" className="text-indigo-600 font-semibold hover:underline">Current Deals →</Link>
        <Link to="/discs" className="text-indigo-600 font-semibold hover:underline">Full Disc Catalog →</Link>
        <Link to="/best/distance-drivers" className="text-indigo-600 font-semibold hover:underline">Best Distance Drivers →</Link>
      </div>
    </div>
  );
}
