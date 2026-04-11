import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, ChevronRight, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { buildCanonical } from '../utils/seo';

const ALL_GUIDES = [
  {
    id: 'best-beginner-discs',
    title: 'Best Discs for Beginners',
    excerpt: 'Starting your disc golf journey? These 5 discs will help you learn proper form without fighting your equipment.',
    category: 'Equipment',
    readTime: '5 min',
  },
  {
    id: 'best-putters-straight',
    title: 'Best Putters for Straight Throws',
    excerpt: 'The straightest-flying putters on the market — perfect for approach shots and building a reliable putting stroke.',
    category: 'Equipment',
    readTime: '4 min',
  },
  {
    id: 'best-bags-new-players',
    title: 'Best Bags for New Players',
    excerpt: 'Carry your discs comfortably on any course. Our top picks for every budget and bag size preference.',
    category: 'Gear',
    readTime: '5 min',
  },
  {
    id: 'best-shoes-disc-golf',
    title: 'Best Shoes for Disc Golf',
    excerpt: 'Disc golf courses are rough on footwear. Trail-ready picks that handle wet grass, roots, and long walks.',
    category: 'Apparel',
    readTime: '4 min',
  },
  {
    id: 'best-rangefinders',
    title: 'Best Rangefinders for Disc Golf',
    excerpt: 'Know your exact distance to the basket. These laser rangefinders give you confidence on every drive.',
    category: 'Gear',
    readTime: '4 min',
  },
  {
    id: 'best-starter-sets',
    title: 'Best Starter Sets',
    excerpt: "Complete disc golf starter sets that give beginners everything they need without paying for discs they can't throw yet.",
    category: 'Equipment',
    readTime: '4 min',
  },
  {
    id: 'best-midranges-control',
    title: 'Best Midranges for Control',
    excerpt: "Midranges win disc golf matches. These are the most accurate, most consistent midranges for every skill level.",
    category: 'Equipment',
    readTime: '5 min',
  },
  {
    id: 'best-fairways-low-power',
    title: 'Best Fairway Drivers for Low Power',
    excerpt: 'Fairway drivers that fly correctly at lower arm speeds — more distance and accuracy without needing elite power.',
    category: 'Equipment',
    readTime: '5 min',
  },
];

const CATEGORIES = ['All', 'Equipment', 'Gear', 'Apparel'];

const CATEGORY_COLORS: Record<string, string> = {
  Equipment: 'bg-indigo-50 text-indigo-700',
  Gear:      'bg-green-50 text-green-700',
  Apparel:   'bg-orange-50 text-orange-700',
};

export function Guides() {
  const { pathname } = useLocation();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? ALL_GUIDES
    : ALL_GUIDES.filter(g => g.category === activeCategory);

  return (
    <div className="pt-20 pb-8 px-4 max-w-4xl mx-auto">
      <Helmet>
        <title>Buying Guides | The Disc Mill</title>
        <meta name="description" content="Expert disc golf gear guides for beginners and advanced players." />
        <link rel="canonical" href={buildCanonical(pathname)} />
      </Helmet>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Guides & Gear Reviews</h1>
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-400 ml-0 sm:ml-[52px]">
          Honest, beginner-first gear recommendations. No hype. Just what actually works.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <Tag className="w-4 h-4 text-gray-400" />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Guide cards */}
      <div className="space-y-4">
        {filtered.map((guide, i) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/guides/${guide.id}`}
              className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${CATEGORY_COLORS[guide.category] || 'bg-gray-100 text-gray-600'}`}>
                      {guide.category}
                    </span>
                    <span className="text-xs text-gray-400">{guide.readTime} read</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5">
                    {guide.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{guide.excerpt}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center text-sm text-gray-400">
        All recommendations are honest and beginner-first. The Disc Mill may earn a small commission from qualifying purchases.
      </div>
    </div>
  );
}
