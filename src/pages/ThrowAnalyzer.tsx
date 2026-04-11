import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Activity, Wind, Zap, Shield, Info, ShoppingBag, Mountain, HelpCircle } from 'lucide-react';
import { Featured } from '../components/monetization/Featured';
import { buildAmazonLink } from '../utils/amazon';
import { useFlightSimulator } from '../hooks/useFlightSimulator';
import { fetchProducts, Product } from '../services/products';
import { cn } from '../utils';

export function ThrowAnalyzer() {
  const { params, setParams, path, stats } = useFlightSimulator({
    armSpeed: 50,
    stability: 0,
    wind: 0,
    terrain: 0
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const recommendedDisc = products.find(p => {
    if (p.type !== 'disc') return false;
    const speed = p.flight?.speed || 0;
    const turn = p.flight?.turn || 0;
    const fade = p.flight?.fade || 0;
    
    // Match speed
    if (params.armSpeed < 45 && speed > 7) return false;
    if (params.armSpeed > 60 && speed < 9) return false;
    
    // Match stability
    const net = turn + fade;
    if (params.stability > 2 && net < 2) return false;
    if (params.stability < -2 && net > 0) return false;
    
    return true;
  }) || products[0];

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Throw Analyzer | The Disc Mill</title>
        <meta name="description" content="Simulate disc flight paths with wind, terrain, and AI throw coaching." />
      </Helmet>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center mb-4">
          <Activity className="mr-3 text-indigo-600 w-10 h-10" />
          Flight Simulator & Analyzer
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
          Our physics-based engine simulates disc flight paths based on your arm speed, wind conditions, and terrain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-indigo-600" />
                  Arm Speed
                </span>
                <span className="text-indigo-600 font-mono">{params.armSpeed} MPH</span>
              </label>
              <input
                type="range"
                min="20"
                max="80"
                value={params.armSpeed}
                onChange={(e) => setParams({ ...params, armSpeed: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-indigo-600" />
                  Disc Stability
                </span>
                <span className="text-indigo-600 font-mono">{params.stability}</span>
              </label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={params.stability}
                onChange={(e) => setParams({ ...params, stability: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <Wind className="w-4 h-4 mr-2 text-indigo-600" />
                  Wind Conditions
                </span>
                <span className={cn("font-mono", params.wind > 0 ? "text-red-600" : "text-green-600")}>
                  {params.wind > 0 ? `Headwind ${params.wind}` : params.wind < 0 ? `Tailwind ${Math.abs(params.wind)}` : "Calm"}
                </span>
              </label>
              <input
                type="range"
                min="-30"
                max="30"
                value={params.wind}
                onChange={(e) => setParams({ ...params, wind: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <Mountain className="w-4 h-4 mr-2 text-indigo-600" />
                  Terrain Slope
                </span>
                <span className="text-indigo-600 font-mono">{params.terrain}°</span>
              </label>
              <input
                type="range"
                min="-15"
                max="15"
                value={params.terrain}
                onChange={(e) => setParams({ ...params, terrain: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="font-bold mb-4 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-indigo-400" />
              Beginner Insight
            </h3>
            <p className="text-sm text-indigo-100 leading-relaxed">
              {params.wind > 10 ? "Headwinds make your disc act more 'understable' (it will turn more to the right for a RHBH throw)." : 
               params.wind < -10 ? "Tailwinds make your disc act more 'overstable' (it will fade earlier and harder)." :
               "Focus on a smooth release and consistent follow-through for the most predictable flight."}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Flight Path Visualization</h3>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Distance</div>
                  <div className="text-2xl font-bold text-indigo-600">{stats.distance} ft</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Deviation</div>
                  <div className="text-2xl font-bold text-indigo-600">{stats.deviation} ft</div>
                </div>
              </div>
            </div>

            <div className="h-64 w-full bg-gray-50 dark:bg-gray-700/50 rounded-2xl relative border border-gray-100 dark:border-gray-700 flex items-center">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                  key={JSON.stringify(params)}
                  d={`M 0 50 ${path.map(p => `L ${p.x} ${50 + p.y}`).join(' ')}`}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2" />
              </svg>
              <div className="absolute bottom-4 left-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top-Down View</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
              <h3 className="font-bold text-xl mb-6 flex items-center text-indigo-900">
                <ShoppingBag className="mr-2 text-indigo-600" />
                Recommended Gear
              </h3>
              {recommendedDisc && (
                <Featured 
                  title={recommendedDisc.name}
                  description={recommendedDisc.description || `Perfect for ${params.armSpeed} MPH arm speed.`}
                  link={
                    buildAmazonLink({
                      asin: recommendedDisc.asin,
                      amazonQuery: `${recommendedDisc.brand} ${recommendedDisc.name} disc golf`,
                    }) ?? '#'
                  }
                />
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-xl dark:text-white mb-6 flex items-center">
                <Info className="mr-2 text-indigo-600" />
                Physics Breakdown
              </h3>
              <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex justify-between border-b border-gray-50 dark:border-gray-700 pb-2">
                  <span>Effective Speed</span>
                  <span className="font-mono font-bold text-indigo-600">{params.armSpeed + params.wind} MPH</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 dark:border-gray-700 pb-2">
                  <span>Stability Adjustment</span>
                  <span className="font-mono font-bold text-indigo-600">{(params.stability - (params.wind * 0.1)).toFixed(1)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Ground Action</span>
                  <span className="font-mono font-bold text-indigo-600">{params.stability > 2 ? 'High Skip' : 'Soft Landing'}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
