import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Disc as DiscIcon, ArrowRight, Zap, Target } from 'lucide-react';
import { Disc } from '../types';
import { DiscCard, FlightPathArc, brandAccent } from './DiscCard';
import { buildAmazonLink } from '../utils/amazon';
import { trackOutboundClick } from '../utils/outboundAnalytics';

export default function DiscOfTheDay() {
  const [allDiscs, setAllDiscs] = useState<Disc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/discs.json')
      .then(res => res.json())
      .then(data => {
        setAllDiscs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading discs:', err);
        setLoading(false);
      });
  }, []);

  const disc = useMemo(() => {
    if (allDiscs.length === 0) return null;
    // Seeded random by date
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % allDiscs.length;
    return allDiscs[index];
  }, [allDiscs]);

  if (loading || !disc) return null;

  const amazonUrl = buildAmazonLink({
    amazonShort: disc.amazonShort,
    asin: disc.asin,
    amazonQuery: disc.amazonQuery ?? `${disc.brand} ${disc.name} disc golf`
  });

  const accent = brandAccent(disc.brand);

  return (
    <section className="py-24 bg-gray-950 text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px]" 
          style={{ background: accent.hex }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">
                <Zap size={14} className="fill-current" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Intelligence Pick
                </span>
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Disc of <br /><span style={{ color: accent.hex }}>the Day.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
              Our algorithm selected the <span className="text-white font-bold">{disc.brand} {disc.name}</span> based on current market trends and community stability ratings.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Stability</div>
                <div className="text-xl font-black">{disc.stability || 'Neutral'}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Category</div>
                <div className="text-xl font-black">{disc.category}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={amazonUrl}
                onClick={() => trackOutboundClick({ url: amazonUrl, label: 'Amazon', pageSource: 'home_dotd', category: 'amazon' })}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-2xl bg-white text-black px-8 py-4 text-lg font-black transition-all hover:bg-gray-200 active:scale-95 shadow-xl shadow-white/5"
              >
                View on Amazon
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative lg:pl-10"
          >
            <div className="bg-gray-900/50 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black">{disc.name}</h3>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{disc.brand}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono font-black" style={{ color: accent.hex }}>
                      {disc.speed} / {disc.glide} / {disc.turn} / {disc.fade}
                    </div>
                  </div>
               </div>

               <div className="mb-10">
                 <FlightPathArc 
                    speed={disc.speed} 
                    glide={disc.glide} 
                    turn={disc.turn} 
                    fade={disc.fade} 
                    accentHex={accent.hex}
                  />
               </div>

               <DiscCard disc={disc} />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-indigo-600 p-6 rounded-3xl shadow-2xl text-white hidden sm:block">
              <div className="flex items-center gap-3">
                <Target size={24} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Trend Ranking</div>
                  <div className="font-black text-xl">Top 5 {disc.category}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
