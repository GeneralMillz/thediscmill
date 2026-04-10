import React from 'react';
import { Product } from '../../services/products';
import { ShoppingBag, Star, Info } from 'lucide-react';
import { Featured } from '../monetization/Featured';
import { Sponsored } from '../monetization/Sponsored';
import { WhereToBuy } from '../monetization/WhereToBuy';
import { amazonLink } from '../../utils/amazon';

interface ResultsGridProps {
  products: Product[];
  loading: boolean;
}

export function ResultsGrid({ products, loading }: ResultsGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
        <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No exact matches found</h3>
        <p className="text-gray-500">Try adjusting your arm speed or stability requirements.</p>
      </div>
    );
  }

  const featured = products.find(p => p.sponsored);
  const others = products.filter(p => p.id !== featured?.id);

  return (
    <div className="space-y-8">
      {featured && (
        <div className="bg-indigo-50 p-1 rounded-3xl border border-indigo-100">
          <div className="bg-white p-6 rounded-[22px] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Top Recommendation</span>
              <Sponsored />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{featured.name}</h3>
                <p className="text-gray-600 mb-4">{featured.description}</p>
                {featured.flight && (
                  <div className="flex gap-2 mb-6">
                    {[featured.flight.speed, featured.flight.glide, featured.flight.turn, featured.flight.fade].map((val, i) => (
                      <div key={i} className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700">
                        {val}
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                  <p className="text-xs text-indigo-700 font-medium">
                    <span className="font-bold">Why it works:</span> {featured.beginnerNotes}
                  </p>
                </div>
              </div>
              <WhereToBuy asin={featured.asin} sku={featured.sku} brand={featured.brand} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {others.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{item.brand}</span>
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
              </div>
              <div className="text-lg font-bold text-gray-900">{item.price}</div>
            </div>

            {item.flight && (
              <div className="flex gap-2 mb-4">
                {[item.flight.speed, item.flight.glide, item.flight.turn, item.flight.fade].map((val, i) => (
                  <div key={i} className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-gray-600">
                    {val}
                  </div>
                ))}
              </div>
            )}

            <p className="text-gray-600 text-sm mb-6 flex-grow">{item.description}</p>
            
            <a 
              href={item.asin ? amazonLink(item.asin) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-center flex items-center justify-center hover:bg-indigo-700 transition-colors"
            >
              View on Amazon
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
