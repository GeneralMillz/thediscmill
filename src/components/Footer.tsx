import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-24 lg:pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-4 inline-block">
              THE <span className="text-indigo-600">DISC MILL</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
              The national disc golf intelligence platform. Data-driven disc comparisons, course directories, and pro-level gear analysis.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                to="/partners" 
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-500 transition-colors bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full"
              >
                <Zap className="w-3.5 h-3.5" /> Powered by The Disc Mill
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-black text-gray-900 dark:text-white uppercase text-[10px] tracking-[0.2em] mb-6">Resources</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500 dark:text-gray-400">
              <li><Link to="/best/beginners" className="hover:text-indigo-600 transition-colors">Best Beginner Discs</Link></li>
              <li><Link to="/best/distance-drivers" className="hover:text-indigo-600 transition-colors">Distance Drivers</Link></li>
              <li><Link to="/glossary" className="hover:text-indigo-600 transition-colors">Disc Golf Glossary</Link></li>
              <li><Link to="/releases" className="hover:text-indigo-600 transition-colors">Release Calendar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-gray-900 dark:text-white uppercase text-[10px] tracking-[0.2em] mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500 dark:text-gray-400">
              <li><Link to="/partners" className="hover:text-indigo-600 transition-colors">Partner with Us</Link></li>
              <li><Link to="/manufacturers" className="hover:text-indigo-600 transition-colors">Manufacturers</Link></li>
              <li><Link to="/deals" className="hover:text-indigo-600 transition-colors">Curated Deals</Link></li>

            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            © {currentYear} The Disc Mill. As an Amazon Associate we earn from qualifying purchases.
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600">
            <Link to="/privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
