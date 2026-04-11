import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { decodePayload } from '../utils/encode';
import { ScanResult } from '../components/discReturn/ScanResult';
import { HeroBadge } from '../components/discReturn/HeroBadge';
import { AlertCircle, Disc } from 'lucide-react';
import { fetchProducts, Product } from '../services/products';
import { buildAmazonLink } from '../utils/amazon';
import { Featured } from '../components/monetization/Featured';

export function ReturnScan() {
  const [searchParams] = useSearchParams();
  const data = searchParams.get('data');
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [error, setError] = useState(false);
  const [essentials, setEssentials] = useState<Product[]>([]);

  useEffect(() => {
    if (data) {
      try {
        const decoded = decodePayload(data);
        setOwnerInfo(decoded);
        
        // Analytics
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'disc_return_scan');
        }

        // Increment session stats
        const current = parseInt(sessionStorage.getItem('hero_returns') || '0');
        sessionStorage.setItem('hero_returns', (current + 1).toString());
        sessionStorage.setItem('hero_last_return', Date.now().toString());
      } catch (e) {
        console.error('Failed to decode payload', e);
        setError(true);
      }
    } else {
      setError(true);
    }

    fetchProducts().then(prods => {
      setEssentials(prods.filter(p => p.type === 'accessory' || p.type === 'training'));
    });
  }, [data]);

  if (error) {
    return (
      <div className="pt-32 pb-8 px-4 max-w-md mx-auto text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invalid Tag</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">This return tag appears to be broken or corrupted.</p>
        <a href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold inline-block">
          Return Home
        </a>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-8 px-4 max-w-4xl mx-auto">
      <Helmet>
        <title>Disc Found | The Disc Mill Return Network</title>
        <meta name="description" content="This disc is registered with The Disc Mill Return Network. Contact the owner to return it." />
      </Helmet>
      <div className="text-center mb-12">
        <HeroBadge />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-6 mb-4">You Found a Disc!</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">You are officially a Disc Hero. Here is how to reach the owner.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          {ownerInfo && <ScanResult info={ownerInfo} />}
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Disc className="w-5 h-5 mr-2 text-indigo-600" />
              Lost & Found Essentials
            </h3>
            <div className="space-y-4">
              {essentials.slice(0, 3).map(item => (
                <Featured 
                  key={item.id}
                  title={item.name}
                  description={item.description || ''}
                  link={
                    buildAmazonLink({
                      asin: item.asin,
                      amazonQuery: `${item.brand} ${item.name} disc golf`,
                    }) ?? '#'
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
