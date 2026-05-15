import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Palette, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Dyer {
  slug: string;
  name: string;
  location: string;
  specialty: string;
  bio: string;
  avatar: string;
  shop_url: string;
  brandAccent: string;
}

export default function DyerSpotlight() {
  const [dyer, setDyer] = useState<Dyer | null>(null);

  useEffect(() => {
    fetch('/data/dyers.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const random = data[Math.floor(Math.random() * data.length)];
          setDyer(random);
        } else {
          setDyer(null);
        }
      })
      .catch(() => setDyer(null));
  }, []);

  // ── RECRUITMENT HERO ──────────────────────────────────────────────────────
  if (!dyer) {
    return (
      <section className="py-24 md:py-32 bg-gray-50 dark:bg-gray-950 transition-colors overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-12 md:p-24 rounded-[4rem] shadow-2xl flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="w-full md:w-3/5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                <Palette className="w-3.5 h-3.5" /> Spotlight Program
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
                Your Spotlight <br /><span className="text-indigo-600">Starts Here.</span>
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 leading-relaxed max-w-xl">
                Showcase your custom dyes to thousands of players. We're building the first professional directory 
                dedicated to independent studios.
              </p>
              <Link 
                to="/partners"
                className="inline-flex items-center gap-3 px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/30 text-lg"
              >
                Apply for Spotlight <ArrowRight size={24} />
              </Link>
            </div>
            
            <div className="w-full md:w-2/5 flex justify-center">
               <motion.div 
                 animate={{ rotate: [0, 5, 0, -5, 0] }}
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                 className="w-64 h-64 md:w-80 md:h-80 rounded-[4rem] border-8 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900/50"
               >
                  <Palette size={160} strokeWidth={1} className="relative z-10 text-gray-200 dark:text-gray-800" />
               </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── REAL DATA VIEW ────────────────────────────────────────────────────────
  return (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 relative"
          >
            <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full blur-[100px] opacity-20" style={{ background: dyer.brandAccent }} />
            <div className="relative z-10 aspect-square rounded-[4rem] overflow-hidden border-8 border-white dark:border-gray-900 shadow-2xl">
              <img src={dyer.avatar} alt={dyer.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
          </motion.div>
          <div className="w-full md:w-1/2">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <Palette className="w-3.5 h-3.5" /> Featured Artist
             </div>
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-[0.9] tracking-tighter">
              Meet <br /><span className="text-indigo-600">{dyer.name}.</span>
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">{dyer.bio}</p>
            <Link to={`/dyer/${dyer.slug}`} className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center w-fit gap-2 shadow-xl shadow-indigo-500/20">
              View Spotlight <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
