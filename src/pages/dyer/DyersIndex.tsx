import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Palette, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';
import { buildCanonical } from '../../utils/seo';

interface Dyer {
  slug: string;
  name: string;
  location: string;
  state: string;
  avatar: string;
  specialty: string;
  styles: string[];
  brandAccent: string;
}

export default function DyersIndex() {
  const [dyers, setDyers] = useState<Dyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All Styles');

  useEffect(() => {
    fetch('/data/dyers.json')
      .then(res => res.json())
      .then(data => {
        setDyers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setDyers([]);
        setLoading(false);
      });
  }, []);

  const allStyles = useMemo(() => {
    const styles = new Set<string>(['All Styles']);
    dyers.forEach(d => d.styles.forEach(s => styles.add(s)));
    return Array.from(styles);
  }, [dyers]);

  const filtered = useMemo(() => {
    return dyers
      .filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                             d.location.toLowerCase().includes(search.toLowerCase());
        const matchesStyle = selectedStyle === 'All Styles' || d.styles.includes(selectedStyle);
        return matchesSearch && matchesStyle;
      })
      .sort((a, b) => {
        if (a.state === 'MI' && b.state !== 'MI') return -1;
        if (a.state !== 'MI' && b.state === 'MI') return 1;
        return a.name.localeCompare(b.name);
      });
  }, [dyers, search, selectedStyle]);

  // ── EMPTY STATE HERO ────────────────────────────────────────────────────────
  if (!loading && dyers.length === 0) {
    return (
      <div className="pt-24 pb-0 flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <SEO 
          title="Disc Dyer Spotlight | The Disc Mill" 
          description="Join the professional directory for disc dyers. Showcase your custom work to the national community."
          canonicalUrl={buildCanonical('/dyers')}
        />

        <section className="flex-1 flex flex-col items-center justify-center py-24 md:py-32 px-4 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />
          
          <div className="max-w-5xl w-full text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-10"
            >
              <Palette size={12} /> Spotlight Program
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
              The Dyer <br /><span className="text-indigo-600">Spotlight.</span>
            </h1>
            
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-20 max-w-2xl mx-auto leading-relaxed font-medium">
              Supporting the artists who turn plastic into performance art. 
              Be among the first featured studios in our professional directory.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[4rem] overflow-hidden shadow-[0_48px_80px_-16px_rgba(0,0,0,0.12)] p-8 md:p-16 text-left relative"
            >
              {/* Sample Badge */}
              <div className="absolute top-10 right-10 px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                Sample Only
              </div>

              <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] border-8 border-gray-50 dark:border-gray-800 shadow-2xl shrink-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <span className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.3em]">Artwork</span>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Example Creator Spotlight</h2>
                  <p className="text-lg font-bold text-indigo-600 mb-10">See what your spotlight could look like.</p>
                  
                  <div className="space-y-8 mb-12">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Artist Studio</div>
                          <div className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white leading-none">
                             <Star size={16} className="text-amber-400 fill-current" /> Example Artist
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Style</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                             Cell / Stencil / Spin
                          </div>
                        </div>
                     </div>
                  </div>

                  <Link 
                    to="/partners"
                    className="inline-flex items-center gap-3 px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/30 text-lg"
                  >
                    Apply for Spotlight <ArrowRight size={24} />
                  </Link>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4 opacity-50 transition-all">
                <div className="aspect-square rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <span className="text-[8px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">Sample</span>
                </div>
                <div className="aspect-square rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <span className="text-[8px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">Sample</span>
                </div>
                <div className="aspect-square rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <span className="text-[8px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">Sample</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // ── REAL DATA STATE ────────────────────────────────────────────────────────
  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <SEO 
        title="Disc Dyer Spotlight | The Disc Mill" 
        description="Meet the artists transforming plastic into performance art. Browse the directory of professional disc dyers and custom studios."
        canonicalUrl={buildCanonical('/dyers')}
      />

      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-[0.9]">
          Creator <span className="text-indigo-600">Spotlight.</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
          Supporting the artists and dyers who push the boundaries of disc golf aesthetics.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {allStyles.map(style => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all border ${
                selectedStyle === style 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-indigo-500'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-[3rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dyer, i) => (
            <motion.div
              key={dyer.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white dark:bg-gray-800 rounded-[3rem] overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-all shadow-sm"
            >
              <Link to={`/dyer/${dyer.slug}`} className="block">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={dyer.avatar} 
                    alt={dyer.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-6 left-6">
                    <div className="flex items-center gap-2 text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">
                      <MapPin size={12} /> {dyer.location}
                    </div>
                    <h3 className="text-2xl font-black text-white">{dyer.name}</h3>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Primary Style</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mb-6">{dyer.specialty}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {dyer.styles.slice(0, 2).map(s => (
                        <span key={s} className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 dark:border-gray-600">
                          {s}
                        </span>
                      ))}
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      View <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
