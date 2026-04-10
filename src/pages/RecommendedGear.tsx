import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Star } from 'lucide-react';
import { fetchProducts, Product } from '../services/products';
import { WhereToBuy } from '../components/monetization/WhereToBuy';
import { Sponsored } from '../components/monetization/Sponsored';
import { cn } from '../utils';

export function RecommendedGear() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Recommended Gear | The Disc Mill</title>
        <meta name="description" content="Editor-picked disc golf bags, shoes, and accessories." />
      </Helmet>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ShoppingBag className="mr-2 text-indigo-600" />
          Recommended Gear
        </h1>
        <p className="text-gray-600">Curated equipment for every skill level, powered by our brand partners.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-50 flex items-center justify-center relative">
                {item.sponsored && (
                  <div className="absolute top-4 right-4">
                    <Sponsored />
                  </div>
                )}
                <ShoppingBag className="w-12 h-12 text-gray-200" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{item.brand} • {item.type}</span>
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
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

                <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>
                
                {item.beginnerNotes && (
                  <div className="bg-indigo-50 p-3 rounded-xl mb-6 border border-indigo-100">
                    <p className="text-[11px] text-indigo-700 font-medium">
                      <span className="font-bold">Pro Tip:</span> {item.beginnerNotes}
                    </p>
                  </div>
                )}

                <WhereToBuy asin={item.asin} sku={item.sku} brand={item.brand} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
