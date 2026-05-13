import React from 'react';
import { ShoppingBag, ExternalLink, ShieldCheck, Check } from 'lucide-react';
import { buildAmazonLink } from '../../utils/amazon';
import { motion } from 'motion/react';

interface WhereToBuyProps {
  asin?: string;
  amazonShort?: string;
  amazonQuery?: string;
  sku?: string;
  brand?: string;
}

export function WhereToBuy({ asin, amazonShort, amazonQuery, sku, brand }: WhereToBuyProps) {
  const amazonHref = buildAmazonLink({ amazonShort, asin, amazonQuery });
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center">
        <ShoppingBag className="mr-2 w-5 h-5 text-indigo-500" />
        Find It Online
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">
        Support the site and pick up your plastic today.
      </p>

      <div className="space-y-3">
        {amazonHref ? (
          <motion.a
            whileTap={{ scale: 0.98 }}
            href={amazonHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-gray-100 p-1.5 rounded-lg shadow-sm">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-4 w-auto" loading="lazy" referrerPolicy="no-referrer" />
              </div>
              <span className="font-bold text-indigo-900 dark:text-indigo-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-100 transition-colors">Shop on Amazon</span>
            </div>
            <ExternalLink className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 dark:text-indigo-500 transition-colors" />
          </motion.a>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center text-sm text-gray-500 dark:text-gray-400">
            Currently unavailable
          </div>
        )}
      </div>
      
      <div className="mt-5 flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Purchases made through these affiliate links directly support The Disc Mill's open-data project at no extra cost to you.
        </p>
      </div>
    </motion.div>
  );
}
