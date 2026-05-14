import React from 'react';
import { SEO } from '../components/SEO';
import { useDiscFinder } from '../hooks/useDiscFinder';
import { FinderForm } from '../components/DiscFinder/FinderForm';
import { ResultsGrid } from '../components/DiscFinder/ResultsGrid';
import { Disc, Info } from 'lucide-react';

export function DiscFinder() {
  const { criteria, setCriteria, recommendations, loading } = useDiscFinder();

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <SEO
        title="Disc Finder & Recommendation Engine"
        description="Find the perfect disc based on flight numbers, brand, and stability."
        canonicalUrl="https://thediscmill.com/disc-finder"
      />
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Disc className="text-white w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Disc Finder</h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
          Our intelligent engine matches your physical stats and desired shot shapes to the perfect disc in our catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <FinderForm criteria={criteria} onChange={setCriteria} />
            
            <div className="mt-8 bg-indigo-900 text-white p-6 rounded-2xl shadow-xl">
              <h3 className="font-bold mb-4 flex items-center">
                <Info className="w-4 h-4 mr-2 text-indigo-400" />
                How it works
              </h3>
              <p className="text-sm text-indigo-100 leading-relaxed">
                We analyze the flight numbers (Speed, Glide, Turn, Fade) against your arm speed and experience level to ensure you get a disc that actually flies as intended.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ResultsGrid products={recommendations} loading={loading} />
        </div>
      </div>
    </div>
  );
}
