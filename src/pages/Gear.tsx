import React from 'react';
import { SEO } from '../components/SEO';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Star, Zap, Crosshair, Award, Map as MapIcon, ArrowRight, Sun } from 'lucide-react';
import { buildCanonical } from '../utils/seo';

const GEAR_CATEGORIES = [
  {
    title: 'Beginner Starter Kits',
    slug: 'best-disc-golf-starter-sets',
    icon: Star,
    desc: 'The best 3-disc sets under $50 to build perfect form.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20'
  },
  {
    title: 'Bag Upgrades',
    slug: 'disc-golf-bag-upgrade-guide',
    icon: ShoppingBag,
    desc: 'From shoulder slings to 20+ disc tournament backpacks.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10 border-indigo-400/20'
  },
  {
    title: 'Rangefinders & Tech',
    slug: 'best-disc-golf-rangefinders',
    icon: Crosshair,
    desc: 'Measure distance accurately and lower your score.',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10 border-rose-400/20'
  },
  {
    title: 'Glow Golf Setup',
    slug: 'glow-disc-golf-setup',
    icon: Sun,
    desc: 'Keep playing after dark with UV lights and glow plastic.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20'
  },
  {
    title: 'Tournament Checklist',
    slug: 'disc-golf-tournament-checklist',
    icon: Award,
    desc: 'Everything you need to pack for a PDGA tournament.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20'
  },
  {
    title: 'Waterproof Shoes',
    slug: 'waterproof-disc-golf-shoes',
    icon: Zap,
    desc: 'Keep your feet dry during morning dew and wet rounds.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10 border-cyan-400/20'
  }
];

export function Gear() {
  const { pathname } = useLocation();

  return (
    <div className="pt-24 pb-12 px-5 max-w-7xl mx-auto min-h-screen">
      <SEO
        title="Gear Hub"
        description="Discover the best disc golf gear for 2026. From beginner starter sets to premium tournament backpacks and rangefinders."
        canonicalUrl={buildCanonical(pathname)}
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: "'Outfit', system-ui" }}>
          The Gear <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Hub</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Curated guides and recommendations to help you build the perfect bag. We research, test, and find the best equipment so you can focus on hitting your lines.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GEAR_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={cat.slug} 
              to={`/blog/${cat.slug}`}
              onClick={() => {
                if (window.gtag) {
                  window.gtag('event', 'gearhub_click', {
                    event_category: 'navigation',
                    event_label: cat.slug
                  });
                }
              }}
              className="group relative flex flex-col p-6 rounded-2xl bg-slate-900 border border-slate-700/50 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${cat.bg}`}>
                <Icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', system-ui" }}>{cat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{cat.desc}</p>
              
              <div className="flex items-center text-indigo-400 text-sm font-bold group-hover:text-indigo-300 transition-colors">
                Read Guide <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
