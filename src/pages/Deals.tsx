import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Tag, ExternalLink, Star } from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildCanonical, buildItemListSchema } from '../utils/seo';
import { buildAmazonLink, buildAmazonSearchUrl } from '../utils/amazon';

interface Deal {
  title: string;
  desc: string;
  badge?: string;
  href: string;
  store: string;
  category: 'disc' | 'bag' | 'accessories' | 'bundle';
}

const DEALS: Deal[] = [
  { title: 'Innova Disc Starter Set',    desc: '3-disc beginner set — putter, mid, fairway. Best value entry point.', badge: 'Top Pick', store: 'Amazon', category: 'bundle',     href: buildAmazonLink({ amazonQuery: 'Innova disc golf starter set' }) ?? '#' },
  { title: 'Discraft Buzzz (Z Line)',    desc: 'The most popular midrange in disc golf. Z plastic is durable and consistent.', store: 'Amazon', category: 'disc',      href: buildAmazonLink({ amazonQuery: 'Discraft Buzzz Z Line disc golf midrange' }) ?? '#' },
  { title: 'Kastaplast Berg',            desc: 'The most overstable approach disc made. Essential for forehand players.', store: 'Amazon', category: 'disc',      href: buildAmazonLink({ amazonQuery: 'Kastaplast Berg disc golf approach' }) ?? '#' },
  { title: 'Dynamic Discs Trooper Bag', desc: '18+ disc capacity, backpack straps, rain cover. Best bag under $80.', badge: 'Best Value', store: 'Amazon', category: 'bag',       href: buildAmazonLink({ amazonQuery: 'Dynamic Discs Trooper disc golf bag' }) ?? '#' },
  { title: 'Innova Destroyer (Star)',    desc: 'The world\'s best-selling distance driver. Consistent, wind-resistant.', store: 'Amazon', category: 'disc',      href: buildAmazonLink({ amazonQuery: 'Innova Destroyer Star disc golf driver' }) ?? '#' },
  { title: 'Latitude 64 Pure',           desc: 'Perfectly neutral putter. Works for putting, approaches, and disc golf catch.', store: 'Amazon', category: 'disc',      href: buildAmazonLink({ amazonQuery: 'Latitude 64 Pure Gold putter disc golf' }) ?? '#' },
  { title: 'Prodigy Disc Bag 4-Series', desc: 'Tournament-grade bag, 25+ disc capacity, waterproof bottom.', store: 'Amazon', category: 'bag',       href: buildAmazonLink({ amazonQuery: 'Prodigy disc golf bag 4 series' }) ?? '#' },
  { title: 'MVP Axiom Envy (Neutron)',   desc: 'Premium putter in durable Neutron plastic — excellent for putting and approach.', store: 'Amazon', category: 'disc',      href: buildAmazonLink({ amazonQuery: 'Axiom Envy Neutron disc golf putter' }) ?? '#' },
  { title: 'Disc Golf Retriever Pole',   desc: 'Telescoping retriever for water hazards. Extends to 18 feet.', store: 'Amazon', category: 'accessories', href: buildAmazonLink({ amazonQuery: 'disc golf retriever pole water hazard' }) ?? '#' },
  { title: '6-Pack Disc Golf Mini Bag',  desc: 'Lightweight hip bag for casual rounds. Holds 5–6 discs.', store: 'Amazon', category: 'bag',       href: buildAmazonLink({ amazonQuery: 'disc golf mini bag hip pack' }) ?? '#' },
  { title: 'UV Disc Golf Marking Pen',   desc: 'Mark your discs in 5 seconds. Waterproof, UV-reactive.', store: 'Amazon', category: 'accessories', href: buildAmazonLink({ amazonQuery: 'disc golf permanent marker disc marking' }) ?? '#' },
  { title: 'Innova DX 3-Pack',           desc: 'Budget-friendly intro set. Great for gifting or backup discs.', badge: 'Gift Pick', store: 'Amazon', category: 'bundle',     href: buildAmazonLink({ amazonQuery: 'Innova DX 3 disc golf set gift' }) ?? '#' },
];

const CAT_LABELS: Record<string, string> = {
  disc: 'Disc', bag: 'Bag', accessories: 'Accessories', bundle: 'Bundle Set',
};

export function Deals() {
  const { pathname } = useLocation();
  const canonicalUrl = buildCanonical(pathname);
  const jsonLd = buildItemListSchema('Disc Golf Deals & Top Picks',
    DEALS.map(d => ({ name: d.title, url: d.href, description: d.desc }))
  );

  return (
    <div className="pt-20 pb-16 px-4 max-w-5xl mx-auto">
      <SEO
        title="Disc Golf Deals & Best Picks 2025 | The Disc Mill"
        description="The best disc golf deals in 2025 — top-rated discs, bags, and accessories curated by The Disc Mill. Amazon affiliate links with honest recommendations."
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
          <Tag className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">Deals & Top Picks</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 ml-[52px] mb-2">Handpicked discs, bags, and accessories. Affiliate links help support The Disc Mill at no cost to you.</p>
      <p className="text-xs text-gray-400 ml-[52px] mb-10 italic">As an Amazon Associate we earn from qualifying purchases.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEALS.map((deal, i) => (
          <motion.a
            key={i}
            href={deal.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                {deal.badge && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wide rounded-full mb-1.5">
                    <Star className="w-2.5 h-2.5 fill-current" /> {deal.badge}
                  </span>
                )}
                <p className="font-black text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">{deal.title}</p>
              </div>
              <span className="shrink-0 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-bold rounded-md">
                {CAT_LABELS[deal.category]}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{deal.desc}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-400">{deal.store}</span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                Shop now <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-sm">
        <Link to="/releases" className="text-indigo-600 font-semibold hover:underline">Release Calendar →</Link>
        <Link to="/best/beginners" className="text-indigo-600 font-semibold hover:underline">Best Beginner Discs →</Link>
        <Link to="/gear" className="text-indigo-600 font-semibold hover:underline">Full Gear Hub →</Link>
        <Link to="/bag-builder" className="text-indigo-600 font-semibold hover:underline">Build Your Bag →</Link>
      </div>
    </div>
  );
}
