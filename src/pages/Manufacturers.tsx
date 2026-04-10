import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Factory, ExternalLink } from 'lucide-react';
import { fetchManufacturers } from '../services/manufacturers';

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

export function Manufacturers() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManufacturers()
      .then(data => setManufacturers(data as Manufacturer[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Disc Golf Brands | The Disc Mill</title>
        <meta name="description" content="Browse disc golf manufacturers — Innova, Discraft, MVP, Dynamic Discs, and more." />
      </Helmet>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Factory className="text-white w-5 h-5" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Disc Manufacturers</h1>
        </div>
        <p className="text-gray-500 text-lg ml-[52px]">
          {manufacturers.length > 0 ? `${manufacturers.length} brands` : 'Loading...'} — click any to browse their disc lineup.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="h-4 w-16 bg-gray-100 rounded mb-3" />
              <div className="h-6 w-40 bg-gray-100 rounded mb-2" />
              <div className="h-12 bg-gray-50 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {manufacturers.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.5) }}
            >
              <Link
                to={`/manufacturer/${m.id}`}
                className="block bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-md transition-all group h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg">{FLAG[m.country] ?? '🌐'}</span>
                      {m.founded && (
                        <span className="text-xs text-gray-400 font-medium">Est. {m.founded}</span>
                      )}
                      {m.trilogy && (
                        <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">Trilogy</span>
                      )}
                      {m.mvpFamily && (
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">MVP</span>
                      )}
                    </div>
                    <h2 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {m.shortName || m.name}
                    </h2>
                    {m.shortName !== m.name && (
                      <p className="text-xs text-gray-400">{m.name}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0 mt-1" />
                </div>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{m.description}</p>
                <div className="mt-4 text-xs font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors">
                  View discs →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
